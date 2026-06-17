# Admin System Quick Reference

## 🚀 Quick Start

### Import Components
```tsx
import { PropertyManager, BlogManager, AdminDashboard } from '@/admin/components';
```

### Import Hooks
```tsx
import { useProperties, useBlogPosts, useDevelopers } from '@/admin/hooks';
```

### Import Types
```tsx
import { AdminProperty, AdminBlogPost, AdminDeveloper } from '@/admin/types';
```

### Import Utils
```tsx
import { scorePropertySEO, generateSlug, isValidEmail } from '@/admin/utils';
```

## 📋 Common Tasks

### Add a Property
```tsx
import { PropertyManager } from '@/admin/components';

export default function ManageProperties() {
  return <PropertyManager />;
}
```

### Fetch All Properties (Client Component)
```tsx
'use client';
import { useProperties } from '@/admin/hooks';

export default function PropertyList() {
  const { properties, loading } = useProperties();
  
  return (
    <div>
      {properties.map(prop => (
        <div key={prop.id}>{prop.name}</div>
      ))}
    </div>
  );
}
```

### Upload Single Image
```tsx
import { ImageUpload } from '@/admin/components';

export default function UploadPhoto() {
  return (
    <ImageUpload
      folder="properties"
      label="Property Photo"
      onUploadComplete={(result) => {
        console.log('URL:', result.url);
        console.log('Size:', result.sizeBytes);
      }}
    />
  );
}
```

### Upload Multiple Images
```tsx
import { MultiImageUpload } from '@/admin/components';

export default function UploadPhotos() {
  const [images, setImages] = useState<string[]>([]);
  
  return (
    <MultiImageUpload
      folder="properties"
      images={images}
      onImagesChange={setImages}
      max={10}
    />
  );
}
```

### Check SEO Score
```tsx
import { scorePropertySEO } from '@/admin/utils';

const property = { name: "Luxury Villa", description: "Beautiful villa..." };
const score = scorePropertySEO(property);

if (score.grade === 'A') {
  console.log('Great SEO!');
}
```

### Generate URL Slug
```tsx
import { generateSlug } from '@/admin/utils';

const slug = generateSlug('Beautiful Luxury Villa'); 
// Output: 'beautiful-luxury-villa'
```

### Validate Email
```tsx
import { isValidEmail } from '@/admin/utils';

if (isValidEmail('admin@realhubb.com')) {
  console.log('Valid email');
}
```

## 🔗 API Reference

### Firestore Service

#### Properties
```ts
import {
  getProperties,           // Get all properties
  getProperty,            // Get single property
  saveProperty,           // Create or update
  updateProperty,         // Update specific fields
  deleteProperty          // Delete property
} from '@/lib/firestoreService';

// Usage
const props = await getProperties();
const prop = await getProperty(id);
const id = await saveProperty(newProperty);
await updateProperty(id, { name: 'New Name' });
await deleteProperty(id);
```

#### Blog Posts
```ts
import {
  getBlogPosts,           // Get all posts
  getBlogPost,           // Get single post
  saveBlogPost,          // Create or update
  updateBlogPost,        // Update fields
  deleteBlogPost,        // Delete post
  getBlogPostBySlug      // Get by URL slug
} from '@/lib/firestoreService';
```

#### Developers
```ts
import {
  getDevelopers,         // Get all
  getDeveloper,         // Get single
  saveDeveloper,        // Create or update
  updateDeveloper,      // Update fields
  deleteDeveloper,      // Delete
  getDeveloperBySlug    // Get by slug
} from '@/lib/firestoreService';
```

#### Team Members
```ts
import {
  getTeamMembers,       // Get all
  getTeamMember,       // Get single
  saveTeamMember,      // Create or update
  updateTeamMember,    // Update fields
  deleteTeamMember     // Delete
} from '@/lib/firestoreService';
```

#### Gallery
```ts
import {
  getGalleryPosts,      // Get all
  getGalleryPost,      // Get single
  saveGalleryPost,     // Create or update
  updateGalleryPost,   // Update fields
  deleteGalleryPost    // Delete
} from '@/lib/firestoreService';
```

## 🎨 Image Optimization

### Optimize URLs
```ts
import { optimizeUrl, imagePresets } from '@/lib/cloudinary';

// Manual optimization
const optimized = optimizeUrl(url, {
  width: 600,
  height: 400,
  quality: 'auto',
  format: 'webp'
});

// Use presets
const cardImage = imagePresets.propertyCard(url);
const heroImage = imagePresets.propertyHero(url);
const thumbnail = imagePresets.thumbnail(url);
```

## 🔔 Notifications

```ts
import { useNotifications } from '@/admin/hooks';

export default function NotifyUsers() {
  const { sendNotification, requestPermission } = useNotifications();
  
  const notify = async () => {
    await requestPermission();
    await sendNotification({
      title: 'New Property',
      body: 'Check out this amazing villa',
      icon: '/logo.png',
      requireInteraction: true
    });
  };
  
  return <button onClick={notify}>Notify</button>;
}
```

## 🔐 Authentication

### Login
```tsx
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const handleLogin = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('Logged in:', result.user.email);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Logout
```ts
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const handleLogout = async () => {
  await signOut(auth);
};
```

### Check Authentication Status
```tsx
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function MyComponent() {
  const [user, loading, error] = useAuthState(auth);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{user?.email}</div>;
}
```

## 📂 File Organization

```
├── Admin Dashboard    → /admin/dashboard
├── Admin Login        → /admin/login
├── Components         → src/admin/components/
├── Types             → src/admin/types/
├── Hooks             → src/admin/hooks/
├── Utilities         → src/admin/utils/
├── Firestore Service → src/lib/firestoreService.ts
├── Cloudinary Config → src/lib/cloudinary.ts
└── Image Upload      → src/lib/uploadToCloudinary.ts
```

## ⚡ Performance Tips

1. **Use hooks for data fetching** - Automatic updates and caching
2. **Optimize images** - Use imagePresets for consistent sizing
3. **Debounce searches** - Use debounce util for form inputs
4. **Lazy load components** - Use React.lazy for large features
5. **Minimize re-renders** - Use React.memo for heavy components

## 🐛 Debugging

### Check Firestore Data
```ts
import { getProperties } from '@/lib/firestoreService';

const data = await getProperties();
console.log(JSON.stringify(data, null, 2));
```

### Verify Cloudinary Upload
```ts
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';

try {
  const result = await uploadToCloudinary(file, { 
    folder: 'properties',
    onProgress: (percent) => console.log(percent + '%')
  });
  console.log('Uploaded:', result.url);
} catch (error) {
  console.error('Upload error:', error);
}
```

### Test SEO Scoring
```ts
import { scorePropertySEO } from '@/admin/utils';

const property = {
  name: 'Test Property',
  slug: 'test-property',
  description: 'A beautiful test property',
  images: ['url1', 'url2'],
  location: 'Bangalore'
};

const result = scorePropertySEO(property);
console.log(`Grade: ${result.grade}, Score: ${result.score}`);
console.log('Issues:', result.issues);
```

## 📚 Documentation Files

- **ADMIN_SETUP.md** - Complete system guide
- **ENV_SETUP.md** - Configuration instructions
- **IMPLEMENTATION_SUMMARY.md** - Project summary

## 🔗 Useful Links

- Firebase Docs: https://firebase.google.com/docs
- Cloudinary Docs: https://cloudinary.com/documentation
- Firestore Query Docs: https://firebase.google.com/docs/firestore/query-data/queries
- Tailwind CSS: https://tailwindcss.com/docs
- React Firebase Hooks: https://github.com/CSFrequency/react-firebase-hooks

