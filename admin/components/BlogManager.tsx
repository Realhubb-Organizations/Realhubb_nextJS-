'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, FileText, Globe, RefreshCw, AlertTriangle, CheckCircle2, ChevronRight, BookOpen, Clock, Tag, Eye, Activity } from 'lucide-react';
import ImageUpload from './ImageUpload';
import InlineFaqManager from './InlineFaqManager';
import { AdminBlogPost, EMPTY_BLOG_POST } from '@/admin/types/blog';
import {
  getBlogPosts,
  saveBlogPost,
  deleteBlogPost,
} from '@/lib/firestoreService';
import { triggerRevalidate, scoreBlogPostSEO } from '@/admin/utils';

// Helper to revalidate blog-related pages
const revalidateBlogPages = async (slug: string) => {
  const paths = [
    '/blog',
    `/blog/${slug}`,
    '/sitemap.xml',
  ];
  await triggerRevalidate(paths);
};

const CATEGORIES = [
  "Real Estate News",
  "Investment Insights",
  "Home Buying Guide",
  "Legal Advice",
  "Homeowner Education",
  "General"
];

export default function BlogManager() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [editing, setEditing] = useState<AdminBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Input tag state
  const [newTag, setNewTag] = useState('');

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
      setError('Please fill in all required fields (Title, Slug, Content, Cover Image)');
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

  const addTag = () => {
    if (!newTag.trim() || !editing) return;
    const tag = newTag.trim();
    if (!editing.tags.includes(tag)) {
      setEditing({ ...editing, tags: [...editing.tags, tag] });
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    if (!editing) return;
    setEditing({ ...editing, tags: editing.tags.filter(t => t !== tagToRemove) });
  };

  // Date parsing helpers for input[type="date"]
  const getFormattedDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toISOString().substring(0, 10);
    } catch {
      return '';
    }
  };

  const handleDateChange = (dateStr: string) => {
    if (!editing) return;
    try {
      const iso = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString();
      setEditing({ ...editing, publishedAt: iso });
    } catch {
      // fallback
    }
  };

  // Filter posts
  const filtered = posts.filter(p => {
    const term = search.toLowerCase();
    const matchesSearch =
      (p.title || '').toLowerCase().includes(term) ||
      (p.excerpt || '').toLowerCase().includes(term) ||
      (p.authorName || '').toLowerCase().includes(term);

    const matchesCategory = categoryFilter === 'all' || (p.category || '').toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'published' && p.published) ||
      (statusFilter === 'draft' && !p.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalCount = posts.length;
  const publishedCount = posts.filter(p => p.published).length;
  const draftCount = posts.filter(p => !p.published).length;
  const highSeoCount = posts.filter(p => scoreBlogPostSEO(p).score >= 75).length;

  // Calculate SEO checklist inside edit page
  const calculateSEO = (p: AdminBlogPost) => {
    const wordCount = p.content ? p.content.trim().split(/\s+/).filter(Boolean).length : 0;
    const checks = [
      { id: 'title', label: 'Title (30-60 chars)', ok: p.title.length >= 30 && p.title.length <= 60, desc: `${p.title.length} chars` },
      { id: 'excerpt', label: 'Excerpt / meta description (50-160 chars)', ok: p.excerpt.length >= 50 && p.excerpt.length <= 160, desc: `${p.excerpt.length} chars` },
      { id: 'image', label: 'Cover image uploaded', ok: !!p.coverImage, desc: p.coverImage ? 'Uploaded' : 'Missing' },
      { id: 'words', label: 'Content 300+ words', ok: wordCount >= 300, desc: `${wordCount} words` },
      { id: 'headings', label: 'Uses H2/H3 headings', ok: p.content.includes('## ') || p.content.includes('### '), desc: 'Check headings' },
      { id: 'slug', label: 'URL slug set', ok: !!p.slug, desc: p.slug ? 'Set' : 'Missing' },
      { id: 'category', label: 'Category assigned', ok: !!p.category, desc: p.category },
      { id: 'tags', label: 'Tags added (2+)', ok: p.tags && p.tags.length >= 2, desc: `${p.tags?.length || 0} tags` }
    ];
    const passed = checks.filter(c => c.ok).length;
    const score = Math.round((passed / checks.length) * 100);
    return { score, checks, passed, total: checks.length, wordCount };
  };

  const editorInsert = (syntax: string) => {
    if (!editing) return;
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editing.content;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selected = text.substring(start, end);

    let replacement = syntax;
    if (syntax === '**' || syntax === '*') {
      replacement = `${syntax}${selected || 'text'}${syntax}`;
    } else if (syntax === 'link') {
      replacement = `[${selected || 'link text'}](https://example.com)`;
    } else if (syntax === 'image') {
      replacement = `![${selected || 'alt text'}](image_url)`;
    } else {
      replacement = `\n${syntax}${selected || 'heading'}\n`;
    }

    setEditing({ ...editing, content: before + replacement + after });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading blog posts…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {editing ? (
        /* ── Edit/Add Blog Post Form ── */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <button
                onClick={() => setEditing(null)}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1.5 transition"
              >
                &lt; Back to Blog Posts
              </button>
              <h3 className="font-semibold text-slate-800 text-lg leading-tight mt-1">
                {editing.id ? 'Edit Post' : 'New Post'}
              </h3>
              <p className="text-slate-400 text-xs truncate max-w-xl">
                {editing.title ? `Editing: ${editing.title}` : 'Creating a new blog article'}
              </p>
            </div>
            
            {/* Score pill */}
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              <span className="text-xs font-semibold text-slate-600">
                SEO Score {calculateSEO(editing).passed}/{calculateSEO(editing).total} checks
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (Main details & Content) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cover Image card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  <Eye className="h-4 w-4 text-indigo-500" /> Cover Image
                </div>
                
                <div className="relative aspect-[21/9] bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                  {editing.coverImage ? (
                    <img src={editing.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <FileText className="h-10 w-10 text-slate-300" />
                      <span className="text-xs">No cover image uploaded</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">OR PASTE IMAGE URL</label>
                    <input
                      type="url"
                      placeholder="https://res.cloudinary.com/..."
                      value={editing.coverImage}
                      onChange={(e) => setEditing({ ...editing, coverImage: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition text-slate-800"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <ImageUpload
                      folder="blogs"
                      currentUrl={editing.coverImage}
                      onUploadComplete={(result) => setEditing({ ...editing, coverImage: result.url })}
                      onRemove={() => setEditing({ ...editing, coverImage: '' })}
                    />
                  </div>
                </div>
              </div>

              {/* Post Details card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Post Details</p>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 Underrated Luxury Projects in Bangalore"
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition text-slate-800"
                    />
                    {editing.title.length > 0 && (
                      <span className={`text-[10px] block mt-1 font-medium ${editing.title.length > 60 ? 'text-rose-500' : editing.title.length < 30 ? 'text-amber-500' : 'text-emerald-600'}`}>
                        {editing.title.length} chars {editing.title.length > 60 ? '— too long (may truncate in Google)' : editing.title.length < 30 ? '— target 30-60 chars' : '— good length'}
                      </span>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">URL Slug *</label>
                    <input
                      type="text"
                      placeholder="e.g. 5-underrated-luxury-projects-bangalore"
                      value={editing.slug}
                      onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition text-slate-800"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">Use lowercase words separated by hyphens. Include main keyword.</span>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Excerpt / Meta Description *</label>
                    <textarea
                      placeholder="Short summary of the blog post to be shown in lists and Google search results."
                      value={editing.excerpt}
                      onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                      rows={2.5}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition text-slate-800 resize-none"
                    />
                    {editing.excerpt.length > 0 && (
                      <span className={`text-[10px] block mt-1 font-medium ${editing.excerpt.length > 160 ? 'text-rose-500' : editing.excerpt.length < 50 ? 'text-amber-500' : 'text-emerald-600'}`}>
                        {editing.excerpt.length} chars {editing.excerpt.length > 160 ? '— may truncate in Google results' : editing.excerpt.length < 50 ? '— target 50-160 chars' : '— good length'}
                      </span>
                    )}
                  </div>

                  {/* Category, Author, Read time grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Category *</label>
                      <select
                        value={editing.category}
                        onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition text-slate-800"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Author</label>
                      <input
                        type="text"
                        value={editing.authorName}
                        onChange={(e) => setEditing({ ...editing, authorName: e.target.value })}
                        placeholder="RealHubb Team"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Read time</label>
                      <input
                        type="text"
                        value={editing.readTime}
                        onChange={(e) => setEditing({ ...editing, readTime: e.target.value })}
                        placeholder="5 min read"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Publish Date + Toggle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">Publish date</label>
                      <input
                        type="date"
                        value={getFormattedDate(editing.publishedAt)}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-4 select-none">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editing.published}
                          onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                          className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 h-4.5 w-4.5"
                        />
                        <span className="text-sm font-semibold text-slate-700">Published — Visible on site</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Content</p>
                  <span className="text-[10px] text-slate-400">
                    {calculateSEO(editing).wordCount} words / {editing.content?.length || 0} chars
                  </span>
                </div>

                {/* Markdown Toolbar */}
                <div className="flex flex-wrap gap-1 border-b border-slate-100 pb-3">
                  {[
                    { label: "B", code: "**", tooltip: "Bold" },
                    { label: "I", code: "*", tooltip: "Italic" },
                    { label: "H2", code: "## ", tooltip: "Heading 2" },
                    { label: "H3", code: "### ", tooltip: "Heading 3" },
                    { label: "Link", code: "link", tooltip: "Hyperlink" },
                    { label: "Bullet", code: "- ", tooltip: "Bullet list" },
                    { label: "Quote", code: "> ", tooltip: "Blockquote" },
                    { label: "Image", code: "image", tooltip: "Image syntax" },
                  ].map(btn => (
                    <button
                      key={btn.label}
                      type="button"
                      onClick={() => editorInsert(btn.code)}
                      className="px-2 py-1 rounded bg-slate-50 hover:bg-slate-150 border border-slate-200 text-xs font-semibold text-slate-500 transition shadow-sm"
                      title={btn.tooltip}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <textarea
                  id="markdown-editor"
                  placeholder="Write the full post content here. Markdown is supported."
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={14}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition text-slate-800 font-mono resize-none leading-relaxed"
                />
              </div>

              {/* Tags card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Tags & Keywords</p>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Bangalore, RERA, home buying tips"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {editing.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-xs bg-slate-50 text-slate-600 border border-slate-250/70 px-2.5 py-1 rounded-full">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-slate-600 font-bold ml-0.5">&times;</button>
                    </span>
                  ))}
                  {editing.tags.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No tags added yet. Add at least 2 tags.</span>
                  )}
                </div>
              </div>

              {/* FAQs inline */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">FAQ Accordions</p>
                {editing.id ? (
                  <InlineFaqManager page="blog" referenceId={editing.id} />
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xs text-slate-400">
                    Save this post first to add FAQs.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow"
                >
                  <Check className="h-4 w-4" />
                  {saving ? "Saving Changes…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Right Column (SEO Widgets) */}
            <div className="space-y-6">
              {/* SEO Score Checklist */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Activity className="h-4 w-4 text-indigo-500 animate-pulse" />
                  <p className="text-sm font-semibold text-slate-700">SEO Health</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-2 text-slate-500 font-semibold">
                    <span>Overall score</span>
                    <span>{calculateSEO(editing).score}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${calculateSEO(editing).score}%`, backgroundColor: calculateSEO(editing).score >= 80 ? '#10b981' : calculateSEO(editing).score >= 50 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {calculateSEO(editing).checks.map(check => (
                    <div key={check.id} className="flex items-start gap-2.5 text-xs">
                      {check.ok ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium ${check.ok ? "text-slate-700" : "text-slate-450"}`}>{check.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{check.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Tips */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-slate-500" /> Blog SEO Tips
                </p>
                <div className="space-y-2 text-xs text-slate-500 leading-relaxed font-light">
                  <p>• Include city name in title (e.g. Bangalore)</p>
                  <p>• Write 500 - 1500 word articles</p>
                  <p>• Use H2 for main sections, H3 for subheaders</p>
                  <p>• Add internal links to property pages</p>
                  <p>• Write meta description as a call-to-action</p>
                  <p>• Include RERA, BHK, property type as tags</p>
                  <p>• Post regularly — Google rewards fresh content</p>
                </div>
              </div>

              {/* Content Length Targets */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-500" /> Content Length Target
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Minimum (300)", ok: calculateSEO(editing).wordCount >= 300 },
                    { label: "Good (500)", ok: calculateSEO(editing).wordCount >= 500 },
                  ].map(target => (
                    <div key={target.label} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">{target.label}</span>
                      <span className={`font-semibold ${target.ok ? "text-emerald-600" : "text-slate-400"}`}>
                        {target.ok ? "✓ Done" : "— Pending"}
                      </span>
                    </div>
                  ))}
                  
                  {/* Best (1000+) progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 text-slate-500 font-medium">
                      <span>Best (1000+)</span>
                      <span>{calculateSEO(editing).wordCount >= 1000 ? "✓ Done" : `${Math.round(Math.min(100, (calculateSEO(editing).wordCount / 1000) * 100))}%`}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, (calculateSEO(editing).wordCount / 1000) * 100)}%` }} />
                    </div>
                  </div>

                  <p className="text-xs text-slate-450 text-center italic pt-1 border-t border-slate-100">
                    {calculateSEO(editing).wordCount} words written
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Blog Posts List View ── */
        <div className="space-y-6">
          {/* Counters panels */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Posts", value: totalCount, bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100" },
              { label: "Published", value: publishedCount, bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
              { label: "Drafts", value: draftCount, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
              { label: "High SEO", value: highSeoCount, bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" }
            ].map(card => (
              <div key={card.label} className={`p-4 rounded-xl border ${card.border} ${card.bg} flex flex-col justify-center`}>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1">{card.label}</span>
                <span className={`text-2xl font-black ${card.text}`}>{card.value}</span>
              </div>
            ))}
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              {/* Search bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search title, excerpt, author..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              >
                <option value="all">All Status</option>
                <option value="published">Published Only</option>
                <option value="draft">Drafts Only</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live - Firestore
              </span>
              <button
                onClick={() => setEditing({ ...EMPTY_BLOG_POST, id: '' } as AdminBlogPost)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow transition shrink-0"
              >
                <Plus className="h-4 w-4" /> Add Post
              </button>
            </div>
          </div>

          {/* Blog Cards list */}
          {filtered.length > 0 ? (
            <div className="space-y-3.5">
              {filtered.map(post => {
                const seo = scoreBlogPostSEO(post);
                const seoColor =
                  seo.score >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                  seo.score >= 50 ? "text-amber-600 bg-amber-50 border-amber-100" :
                  "text-rose-600 bg-rose-50 border-rose-100";

                const wordCount = post.content ? post.content.trim().split(/\s+/).filter(Boolean).length : 0;

                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Cover Thumbnail */}
                    <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 shadow-inner flex items-center justify-center border border-slate-100">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="h-6 w-6 text-slate-350" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-slate-800 text-sm leading-snug truncate max-w-lg" title={post.title}>
                          {post.title}
                        </h4>
                        
                        {/* Category */}
                        <span className="text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {post.category || "General"}
                        </span>

                        {/* Status */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          post.published ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 truncate max-w-xl font-light">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 pt-0.5 font-light">
                        {post.authorName && (
                          <span>By <span className="font-medium text-slate-500">{post.authorName}</span></span>
                        )}
                        {post.publishedAt && (
                          <span>· {new Date(post.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        )}
                        <span>· {wordCount} words</span>
                        {post.readTime && (
                          <span>· {post.readTime}</span>
                        )}
                      </div>
                    </div>

                    {/* SEO rating and Actions */}
                    <div className="flex items-center gap-4.5 justify-between w-full md:w-auto shrink-0 border-t border-slate-100 md:border-t-0 pt-3 md:pt-0">
                      <div className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${seoColor}`}>
                        <div className="w-1.5 h-1.5 bg-current rounded-full" />
                        SEO: {seo.score}%
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditing(post)}
                          className="p-2 hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl transition"
                          title="Edit Post"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 hover:bg-red-50 border border-slate-200 hover:border-red-100 text-slate-400 hover:text-red-600 rounded-xl transition"
                          title="Delete Post"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
              No blog posts found matching filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
