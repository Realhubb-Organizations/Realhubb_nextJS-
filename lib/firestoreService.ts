import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AdminProperty } from "@/admin/types/property";
import type { AdminBlogPost } from "@/admin/types/blog";
import type { AdminDeveloper } from "@/admin/types/developer";
import type { AdminTeamMember } from "@/admin/types/team";
import type { AdminGalleryPost } from "@/admin/types/gallery";
import type { AdminFaq } from "@/admin/types/faq";

/* ============================================================================
   PROPERTIES
   ============================================================================ */

export async function getProperties(): Promise<AdminProperty[]> {
  const snapshot = await getDocs(
    query(collection(db, "properties"), orderBy("name", "asc"))
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AdminProperty));
}

export async function getProperty(id: string): Promise<AdminProperty | null> {
  const doc_ref = doc(db, "properties", id);
  const snapshot = await getDoc(doc_ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as AdminProperty;
}

export async function saveProperty(property: Omit<AdminProperty, "id"> | AdminProperty) {
  const id = ("id" in property && property.id) ? property.id : doc(collection(db, "properties")).id;
  const isNew = !("id" in property) || !property.id;
  
  const data = {
    ...property,
    id,
    updatedAt: serverTimestamp(),
  } as any;

  if (isNew) {
    data.createdAt = serverTimestamp();
  }

  await setDoc(doc(db, "properties", id), data, { merge: true });
  return id;
}

export async function updateProperty(id: string, updates: Partial<AdminProperty>) {
  await updateDoc(doc(db, "properties", id), updates);
}

export async function deleteProperty(id: string) {
  await deleteDoc(doc(db, "properties", id));
}

/* ============================================================================
   BLOG POSTS
   ============================================================================ */

export async function getBlogPosts(): Promise<AdminBlogPost[]> {
  const snapshot = await getDocs(
    query(collection(db, "blogPosts"), orderBy("publishedAt", "desc"))
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AdminBlogPost));
}

export async function getBlogPost(id: string): Promise<AdminBlogPost | null> {
  const doc_ref = doc(db, "blogPosts", id);
  const snapshot = await getDoc(doc_ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as AdminBlogPost;
}

export async function saveBlogPost(
  post: Omit<AdminBlogPost, "id"> | AdminBlogPost
): Promise<string> {
  const id = ("id" in post && post.id) ? post.id : doc(collection(db, "blogPosts")).id;
  await setDoc(doc(db, "blogPosts", id), { ...post, id }, { merge: true });
  return id;
}

export async function updateBlogPost(id: string, updates: Partial<AdminBlogPost>) {
  await updateDoc(doc(db, "blogPosts", id), updates);
}

export async function deleteBlogPost(id: string) {
  await deleteDoc(doc(db, "blogPosts", id));
}

export async function getBlogPostBySlug(slug: string): Promise<AdminBlogPost | null> {
  const snapshot = await getDocs(
    query(collection(db, "blogPosts"), where("slug", "==", slug))
  );
  if (snapshot.empty) return null;
  const doc_data = snapshot.docs[0];
  return { id: doc_data.id, ...doc_data.data() } as AdminBlogPost;
}

/* ============================================================================
   DEVELOPERS
   ============================================================================ */

export async function getDevelopers(): Promise<AdminDeveloper[]> {
  const snapshot = await getDocs(
    query(collection(db, "developers"), orderBy("name", "asc"))
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AdminDeveloper));
}

export async function getDeveloper(id: string): Promise<AdminDeveloper | null> {
  const doc_ref = doc(db, "developers", id);
  const snapshot = await getDoc(doc_ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as AdminDeveloper;
}

export async function saveDeveloper(
  developer: Omit<AdminDeveloper, "id"> | AdminDeveloper
): Promise<string> {
  const id = ("id" in developer && developer.id) ? developer.id : doc(collection(db, "developers")).id;
  await setDoc(doc(db, "developers", id), { ...developer, id }, { merge: true });
  return id;
}

export async function updateDeveloper(id: string, updates: Partial<AdminDeveloper>) {
  await updateDoc(doc(db, "developers", id), updates);
}

export async function deleteDeveloper(id: string) {
  await deleteDoc(doc(db, "developers", id));
}

export async function getDeveloperBySlug(slug: string): Promise<AdminDeveloper | null> {
  const snapshot = await getDocs(
    query(collection(db, "developers"), where("slug", "==", slug))
  );
  if (snapshot.empty) return null;
  const doc_data = snapshot.docs[0];
  return { id: doc_data.id, ...doc_data.data() } as AdminDeveloper;
}

/* ============================================================================
   TEAM MEMBERS
   ============================================================================ */

export async function getTeamMembers(): Promise<AdminTeamMember[]> {
  const snapshot = await getDocs(
    query(collection(db, "team"), orderBy("name", "asc"))
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AdminTeamMember));
}

export async function getTeamMember(id: string): Promise<AdminTeamMember | null> {
  const doc_ref = doc(db, "team", id);
  const snapshot = await getDoc(doc_ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as AdminTeamMember;
}

export async function saveTeamMember(
  member: Omit<AdminTeamMember, "id"> | AdminTeamMember
): Promise<string> {
  const id = ("id" in member && member.id) ? member.id : doc(collection(db, "team")).id;
  await setDoc(doc(db, "team", id), { ...member, id }, { merge: true });
  return id;
}

export async function updateTeamMember(id: string, updates: Partial<AdminTeamMember>) {
  await updateDoc(doc(db, "team", id), updates);
}

export async function deleteTeamMember(id: string) {
  await deleteDoc(doc(db, "team", id));
}

/* ============================================================================
   GALLERY
   ============================================================================ */

export type { AdminGalleryPost } from "@/admin/types/gallery";

export async function getGalleryPosts(): Promise<AdminGalleryPost[]> {
  const snapshot = await getDocs(
    query(collection(db, "gallery"), orderBy("publishedAt", "desc"))
  );
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AdminGalleryPost));
}

export async function getGalleryPost(id: string): Promise<AdminGalleryPost | null> {
  const doc_ref = doc(db, "gallery", id);
  const snapshot = await getDoc(doc_ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as AdminGalleryPost;
}

export async function saveGalleryPost(
  post: Omit<AdminGalleryPost, "id"> | AdminGalleryPost
): Promise<string> {
  const id = ("id" in post && post.id) ? post.id : doc(collection(db, "gallery")).id;
  await setDoc(doc(db, "gallery", id), { ...post, id }, { merge: true });
  return id;
}

export async function addGalleryPost(post: Omit<AdminGalleryPost, "id">): Promise<string> {
  const docRef = doc(collection(db, "gallery"));
  const id = docRef.id;
  await setDoc(docRef, { ...post, id });
  return id;
}

export async function updateGalleryPost(id: string, updates: Partial<AdminGalleryPost>) {
  await updateDoc(doc(db, "gallery", id), updates);
}

export async function deleteGalleryPost(id: string) {
  await deleteDoc(doc(db, "gallery", id));
}

/* ============================================================================
   FAQ
   ============================================================================ */

export type { AdminFaq } from "@/admin/types/faq";

export async function getFaqs(): Promise<AdminFaq[]> {
  const snapshot = await getDocs(collection(db, "faqs"));
  const all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AdminFaq));
  return all.sort((a, b) => {
    const pageCompare = (a.page || "").localeCompare(b.page || "");
    if (pageCompare !== 0) return pageCompare;
    return (a.order ?? 0) - (b.order ?? 0);
  });
}

export async function getFaq(id: string): Promise<AdminFaq | null> {
  const doc_ref = doc(db, "faqs", id);
  const snapshot = await getDoc(doc_ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as AdminFaq;
}

export async function addFaq(faq: Omit<AdminFaq, "id">): Promise<string> {
  const docRef = doc(collection(db, "faqs"));
  const id = docRef.id;
  await setDoc(docRef, { ...faq, id });
  return id;
}

export async function updateFaq(id: string, updates: Partial<AdminFaq>) {
  await updateDoc(doc(db, "faqs", id), updates);
}

export async function deleteFaq(id: string) {
  await deleteDoc(doc(db, "faqs", id));
}
