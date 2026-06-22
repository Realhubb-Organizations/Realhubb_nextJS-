'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import ImageUpload from './ImageUpload';
import InlineFaqManager from './InlineFaqManager';
import { AdminBlogPost, EMPTY_BLOG_POST } from '@/admin/types/blog';
import {
  getBlogPosts,
  saveBlogPost,
  deleteBlogPost,
} from '@/lib/firestoreService';
import { triggerRevalidate } from '@/admin/utils';

// Helper to revalidate blog-related pages
const revalidateBlogPages = async (slug: string) => {
  const paths = [
    '/blog',
    `/blog/${slug}`,
    '/sitemap.xml',
  ];
  await triggerRevalidate(paths);
};

export default function BlogManager() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [editing, setEditing] = useState<AdminBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts();
      setPosts(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.title || !editing.slug || !editing.content || !editing.coverImage) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const id = await saveBlogPost(editing);

      // Trigger background revalidation instantly
      await revalidateBlogPages(editing.slug);

      if ('id' in editing && editing.id) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? editing : p))
        );
      } else {
        setPosts((prev) => [...prev, { ...editing, id }]);
      }

      setEditing(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;

    const postToDelete = posts.find((p) => p.id === id);

    try {
      setError('');
      await deleteBlogPost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));

      if (postToDelete) {
        await revalidateBlogPages(postToDelete.slug);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete blog post');
    }
  };


  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-muted-foreground">Loading blog posts…</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {editing ? (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
          <h3 className="font-normal">
            {editing.id ? 'Edit Blog Post' : 'New Blog Post'}
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Title*"
              value={editing.title || ""}
              onChange={(e) =>
                setEditing((p) => p && { ...p, title: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="Slug (URL-friendly)*"
              value={editing.slug || ""}
              onChange={(e) =>
                setEditing((p) => p && { ...p, slug: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <textarea
              placeholder="Excerpt (short summary)*"
              value={editing.excerpt || ""}
              onChange={(e) =>
                setEditing((p) => p && { ...p, excerpt: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <textarea
              placeholder="Content (Full markdown)*"
              value={editing.content || ""}
              onChange={(e) =>
                setEditing((p) => p && { ...p, content: e.target.value })
              }
              rows={6}
              className="w-full px-3 py-2 text-xs border border-input rounded-lg bg-background font-mono"
            />

            <input
              type="text"
              placeholder="Category"
              value={editing.category || ""}
              onChange={(e) =>
                setEditing((p) => p && { ...p, category: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />

            <input
              type="text"
              placeholder="Author Name"
              value={editing.authorName || ""}
              onChange={(e) =>
                setEditing((p) => p && { ...p, authorName: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background"
            />


            <div>
              <label className="text-xs font-normal text-muted-foreground uppercase tracking-wide mb-2 block">
                Cover Image*
              </label>
              <ImageUpload
                folder="blogs"
                currentUrl={editing.coverImage}
                onUploadComplete={(result) =>
                  setEditing((p) => p && { ...p, coverImage: result.url })
                }
                onRemove={() =>
                  setEditing((p) => p && { ...p, coverImage: '' })
                }
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) =>
                    setEditing((p) =>
                      p && { ...p, published: e.target.checked }
                    )
                  }
                  className="rounded border-input"
                />
                <span className="text-sm">Published</span>
              </label>
            </div>

            {editing && editing.id ? (
              <InlineFaqManager page="blog" referenceId={editing.id} />
            ) : editing ? (
              <div className="mt-4 p-3 bg-muted/40 rounded-lg border border-border text-center text-xs text-muted-foreground">
                Save this blog post first to add post-specific FAQs.
              </div>
            ) : null}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 border border-input rounded-lg hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditing({ ...EMPTY_BLOG_POST, id: '' } as AdminBlogPost)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Blog Post
        </button>
      )}

      <div className="space-y-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-3 border border-border rounded-lg hover:bg-muted/30 transition flex items-center justify-between"
          >
            <div className="flex-1">
              <h4 className="font-medium text-sm">{post.title}</h4>
              <p className="text-xs text-muted-foreground">
                {post.category} • {post.published ? '📌 Published' : '📝 Draft'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(post)}
                className="p-1.5 hover:bg-muted rounded-lg transition"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
