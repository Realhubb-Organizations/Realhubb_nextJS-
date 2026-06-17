"use client";

import CommentItem, { type Comment } from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  onReload: () => void;
}

export default function CommentList({ comments, onReload }: CommentListProps) {
  const roots = comments.filter((c) => !c.parentId);

  if (roots.length === 0) {
    return <p className="text-sm text-gray-400">Be the first to share your thoughts.</p>;
  }

  return (
    <div className="space-y-6">
      {roots.map((c) => (
        <CommentItem
          key={c.commentId}
          comment={c}
          replies={comments.filter((r) => r.parentId === c.commentId)}
          onReload={onReload}
        />
      ))}
    </div>
  );
}
