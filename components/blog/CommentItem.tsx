"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import CommentForm from "./CommentForm";
import { hasLiked, markLiked } from "./commentLikes";

const API_URL = "/api/comments";

export interface Comment {
  commentId: string;
  postSlug: string;
  parentId?: string;
  name: string;
  comment: string;
  likes?: number;
  createdAt: string;
}

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  onReload: () => void;
}

export default function CommentItem({ comment, replies, onReload }: CommentItemProps) {
  const [likes, setLikes] = useState(comment.likes ?? 0);
  const [liked, setLiked] = useState(() => hasLiked(comment.commentId));
  const [replying, setReplying] = useState(false);

  async function handleLike() {
    if (liked) return;
    markLiked(comment.commentId);
    setLiked(true);
    setLikes((prev) => prev + 1);

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ type: "LIKE", commentId: comment.commentId }),
    });
    onReload();
  }

  return (
    <div className="border-l-2 border-gray-100 pl-4">
      <p className="font-medium text-navy text-sm">{comment.name}</p>
      <p className="text-xs text-gray-400 mt-0.5">
        {new Date(comment.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </p>
      <p className="mt-2 text-sm text-gray-600">{comment.comment}</p>

      <div className="flex items-center gap-4 mt-2">
        <button
          type="button"
          onClick={handleLike}
          disabled={liked}
          className="flex items-center gap-1.5 text-xs text-gray-400 disabled:opacity-70 hover:text-red-500 transition-colors"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          {likes}
        </button>
        <button
          type="button"
          onClick={() => setReplying((r) => !r)}
          className="text-xs text-gray-400 hover:text-gold transition-colors"
        >
          {replying ? "Cancel" : "Reply"}
        </button>
      </div>

      {replying && (
        <div className="mt-3">
          <CommentForm
            slug={comment.postSlug}
            parentId={comment.commentId}
            onSuccess={() => {
              setReplying(false);
              onReload();
            }}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="ml-6 mt-4 space-y-4">
          {replies.map((r) => (
            <CommentItem key={r.commentId} comment={r} replies={[]} onReload={onReload} />
          ))}
        </div>
      )}
    </div>
  );
}
