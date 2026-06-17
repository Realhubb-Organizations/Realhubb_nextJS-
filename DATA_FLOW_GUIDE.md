# Client-Side Data Fetching Guide

## Understanding the Data Flow

### How Updated Data Gets to Client Pages

```
Admin Panel (Upload)
    ↓
Firestore Database
    ↓
Server-Side (Next.js)
    ↓
firestoreServerService.ts (Firebase Admin SDK)
    ↓
Client Pages (Fetch & Display)
```

## Step-by-Step Flow

### 1. Admin Panel Saves Data
```
PropertyManager Component
  → saveProperty() function
    → Firestore SDK (Client-side)
      → Properties Collection
```

### 2. Server Fetches Data
```
Server Component (/app/property/[slug]/page.tsx)
  → getPropertyBySlug(slug)
    → Firebase Admin SDK (Server-side)
      → Firestore Database
        → Returns Property Object
```

### 3. Client Displays Data
```
Client Page (Browser)
  → Renders Property Details
    → Shows Images, Description, etc.
```

## Requirements for Data to Flow

### For Admin Panel to Save:
- ✅ Firebase client config (NEXT_PUBLIC_FIREBASE_*)
- ✅ Authenticated user (Email/Password in Firebase Auth)
- ✅ Firestore collections created

### For Server to Fetch:
- ✅ Firebase Admin SDK configured
- ✅ **FIREBASE_ADMIN_PROJECT_ID** env variable
- ✅ **FIREBASE_ADMIN_CLIENT_EMAIL** env variable
- ✅ **FIREBASE_ADMIN_PRIVATE_KEY** env variable
- ✅ Firestore security rules allow server access

### For Client to Display:
- ✅ Data must exist in Firestore
- ✅ Server query must succeed
- ✅ Browser must be able to render

## Troubleshooting Checklist

### Issue: Data saves in admin but doesn't appear on website

#### Step 1: Verify Data Was Saved
```bash
1. Go to Firebase Console
2. Click "Firestore Database"
3. Check the "properties" collection
4. You should see documents with IDs like "abc123xyz"
5. If NO documents appear → data isn't being saved to Firestore
```

**If no documents:** Check admin panel error messages or browser console (F12)

#### Step 2: Verify Server Can Access Data
```bash
1. Go to /admin/diagnostics page
2. Check if collections show document count > 0
3. If it shows "0 documents" but admin console has data → Firebase Admin not configured
4. If it shows error → Firebase Admin credentials are wrong
```

#### Step 3: Check Environment Variables
```bash
1. Open .env.local in project root
2. Verify these are present:
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - FIREBASE_ADMIN_PROJECT_ID
   - FIREBASE_ADMIN_CLIENT_EMAIL
   - FIREBASE_ADMIN_PRIVATE_KEY
3. If any missing → Admin data can't be fetched by server
```

#### Step 4: Restart Dev Server
```bash
1. Stop the dev server (Ctrl+C)
2. Run: npm run dev
3. Environment changes require restart!
```

#### Step 5: Test Data Fetching
```bash
1. Go to /admin/client-properties page
2. If it shows loading spinner forever → server query is failing
3. If it shows "0 properties" → data isn't in Firestore or server can't read it
4. If it shows properties → everything is working! ✓
```

## Common Issues & Solutions

### Issue 1: "Firebase Admin not configured"
**Symptoms:** Admin diagnostics page shows error
```
Error: Firebase Admin not configured
```

**Solution:**
1. Open `.env.local`
2. Add these 3 lines (get values from Firebase Console → Service Accounts):
```env
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-email@...iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```
3. Save and restart dev server
4. Test at /admin/diagnostics

### Issue 2: Private Key Format Error
**Symptoms:**
```
Error: Cannot read property 'seconds' of undefined
```

**Solution:**
The private key needs actual newlines, not the text `\n`:
1. From Firebase JSON file, copy the private_key value
2. Replace the text `\n` with actual newlines
3. Make sure it starts with `-----BEGIN PRIVATE KEY-----` and ends with `-----END PRIVATE KEY-----`

### Issue 3: Firestore Permission Denied
**Symptoms:**
```
Error: Missing or insufficient permissions
```

**Solution:**
1. Go to Firebase Console → Firestore Database → Rules
2. Add this rule for development:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. Click "Publish"

### Issue 4: Admin Saves Data but Collections Show 0 Documents
**Symptoms:**
- Admin panel says "Saved successfully"
- Firestore console shows 0 documents
- But collection folder exists

**Solution:**
1. Check if you're authenticated in admin panel
2. Check browser console (F12) for errors during save
3. Verify Firestore has data write permissions:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Issue 5: Pages Show Static Data Instead of Live Data
**Symptoms:**
- Admin panel adds new property
- Website still shows old/static data

**Solution:**
1. This is expected for server-rendered pages
2. Changes appear after:
   - Page revalidation (up to 1 hour by default)
   - Server restart
   - Clearing cache
3. For real-time updates, use the `/admin/client-properties` page instead

## Testing Workflow

### Complete Test Flow:
```
1. Start dev server:
   npm run dev

2. Go to Admin Dashboard:
   http://localhost:3000/admin/dashboard

3. Login with your Firebase credentials

4. Add a Property:
   - Go to "Properties" tab
   - Click "New Property"
   - Fill in: name, location, price, type, area
   - Upload at least 1 image
   - Click "Save"

5. Verify in Firestore Console:
   - Go to Firebase Console
   - Click Firestore Database
   - Check "properties" collection
   - Should see your new property

6. Test Server Fetching:
   - Go to /admin/diagnostics
   - Should show collection with count > 0

7. Test Client Display:
   - Go to /admin/client-properties
   - Should show your property in the list
   - Click "View" to see detail page

8. Success! ✓
   Everything is working correctly
```

## Debug Commands

### Check Firestore Data in Console:
```bash
# In browser console (F12) on any page:

// Fetch all properties from client-side Firestore
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const snapshot = await getDocs(collection(db, 'properties'));
snapshot.docs.forEach(doc => console.log(doc.data()));
```

### Check Server Admin SDK:
```bash
# In terminal during development:
# Add console.log to firestoreServerService.ts functions
console.log('Query result:', result);
console.log('Document count:', docs.length);
```

## Architecture Overview

### Admin Panel (Client-side):
- Uses Firebase SDK (browser)
- Saves to Firestore
- Real-time updates
- Anyone with credentials can use

### Server Pages (Server-side):
- Uses Firebase Admin SDK (Node.js)
- Reads from Firestore
- Builds static/dynamic pages
- Generated at build time or on request

### Client Pages (Browser):
- Displays HTML from server
- Uses client-side hooks for live data
- Can update without page refresh
- Uses Firebase SDK

## Key Files

- `src/lib/firebase.ts` - Client SDK config
- `src/lib/firebase-admin.ts` - Admin SDK config
- `src/lib/firestoreServerService.ts` - Server queries
- `src/lib/firestoreService.ts` - Client mutations
- `src/admin/hooks/useProperties.ts` - Client data fetching
- `app/admin/diagnostics/page.tsx` - Debug page
- `app/admin/client-properties/page.tsx` - Test page

## Performance Considerations

1. **Revalidation Time**: Pages cache for 1 hour by default
   - Change in `app/property/[slug]/page.tsx`: `export const revalidate = 3600;`

2. **Real-time Updates**: Use client components with hooks for live data

3. **Static vs Dynamic**:
   - Server pages: Fast, cached, good for SEO
   - Client pages: Real-time, live updates, need scroll to refresh

## Next Steps

1. ✅ Follow ENV_SETUP.md to configure Firebase Admin
2. ✅ Verify diagnostics page works
3. ✅ Test adding property in admin
4. ✅ Confirm it appears on client page
5. ✅ Check property detail page shows live data
6. ✅ Test with real users

## Support

If data still doesn't appear:
1. Check `/admin/diagnostics` page for errors
2. Review browser console (F12) for JavaScript errors
3. Check terminal for server errors
4. Verify all environment variables are correct
5. Restart dev server after any changes
6. Clear browser cache (Ctrl+Shift+Del)
7. Clear `.next` build folder: `rm -rf .next` then `npm run dev`

