"use client";

import { useCallback, useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import type { Comment } from "./CommentItem";

const API_URL = "/api/comments";

export default function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return (
    <section className="mt-8 bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      <h2 className="font-heading text-xl text-navy font-normal mb-4">Comments</h2>
      <CommentForm slug={slug} onSuccess={loadComments} />
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[100, 80, 90].map((w, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
      ) : (
        <CommentList comments={comments} onReload={loadComments} />
      )}
    </section>
  );
}
