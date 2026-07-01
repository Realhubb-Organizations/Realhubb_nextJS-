"use client";

import { useState } from "react";

const API_URL = "/api/comments";

interface CommentFormProps {
  slug: string;
  parentId?: string;
  onSuccess: () => void;
}

export default function CommentForm({ slug, parentId, onSuccess }: CommentFormProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!name.trim() || !comment.trim() || submitting) return;

    setSubmitting(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          postSlug: slug,
          name,
          comment,
          parentId: parentId || "",
        }),
      });
      setName("");
      setComment("");
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mb-4">
      <input
        className="w-full p-2.5 mb-2 border border-gray-200 rounded-lg text-sm text-navy placeholder-gray-400 focus:outline-none focus:border-gold"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="w-full p-2.5 mb-2 border border-gray-200 rounded-lg text-sm text-navy placeholder-gray-400 focus:outline-none focus:border-gold resize-none"
        placeholder="Write a comment…"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="px-5 py-2 bg-navy text-white text-sm rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-60"
      >
        {submitting ? "Posting…" : "Submit"}
      </button>
    </div>
  );
}
