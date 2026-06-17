# Environment Setup for Admin System

## Prerequisites

Before setting up the admin system, ensure you have:
1. Firebase project created (https://console.firebase.google.com)
2. Cloudinary account (https://cloudinary.com)
3. Basic Node.js/npm knowledge

## Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to Firebase Console
2. Click "Create a new project"
3. Name it "RealHubb" (or your preference)
4. Enable Google Analytics (optional)

### 1.2 Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** as a sign-in provider
4. Add your admin email address to test users

### 1.3 Create Firestore Database
1. Go to **Firestore Database** in Firebase Console
2. Click "Create database"
3. Select **Start in test mode** (update rules later)
4. Choose your region closest to users

### 1.4 Get Firebase Config
1. Go to **Project Settings** (gear icon)
2. Under "General" tab, find "Your apps" section
3. Click "Config" for the web app
4. Copy the config object

### 1.5 Set up Firestore Security Rules
Go to **Firestore** → **Rules** and replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /properties/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /blogPosts/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /developers/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /team/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /gallery/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /faqs/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /pushSubscriptions/{id} {
      allow read:   if request.auth != null;
      allow write:  if true;
      allow delete: if true;
    }

    match /leads/{id} {
      allow read: if request.auth != null;
      allow write: if true;
    }
  }
}
```

> **Note**: For production, implement more restrictive rules based on user roles.

## Step 2: Firebase Admin Setup (Server-Side Data Fetching)

### 2.1 Generate Private Key
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Click **Service Accounts** tab
3. Click **Generate New Private Key** (Node.js)
4. A JSON file will download - save it safely
5. Open the JSON file and copy these values:
   - `project_id`
   - `client_email`
   - `private_key`

### 2.2 Add Firebase Admin to .env.local
Add these to your `.env.local` (we'll add them in Step 4 with all other variables):

```env
# Firebase Admin (Server-side only - PRIVATE)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> **⚠️ SECURITY NOTE**: 
> - Keep the private key file somewhere safe but separate from your codebase
> - The `\n` must be actual newlines in the env file, not the literal text "\n"
> - Never commit .env.local to git
> - Use a `.env.local.example` file in git to document which keys are needed

## Step 3: Cloudinary Setup

### 3.1 Get Cloudinary Credentials
1. Go to https://cloudinary.com
2. Sign up or log in
3. On the Dashboard, find your **Cloud Name**
4. Go to **Settings** → **Upload**
5. Create an upload preset (name it `realhubb-admin`)
6. Set it as **Unsigned**
7. Note the **Upload Preset name**

### 3.2 Configure Upload Folder
In your Cloudinary upload preset settings:
1. Go to **Folder** section
2. Add `realhubb` as the base folder
3. Save changes

## Step 4: Complete Environment Variables

Create or update `.env.local` in your project root:

```env
# Firebase Configuration (Client-side - PUBLIC)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side - PRIVATE)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=realhubb-admin
```

> **Pro Tip**: Restart your dev server after adding these variables for changes to take effect.

## Step 5: Create Admin User

### 5.1 In Firebase Console
1. Go to **Authentication** → **Users** tab
2. Click "Add user"
3. Enter your admin email
4. Set a strong password
5. Save the credentials

### 5.2 Test Login
1. Start your dev server: `npm run dev`
2. Navigate to `http://localhost:3000/admin/dashboard`
3. You should be redirected to login page
4. Enter your credentials from Step 5.1

## Step 6: Set Up Firestore Collections

The admin panel will automatically create documents when you start using it. However, you can manually create the collections:

### Collections to Create:
1. **properties**
2. **blogPosts**
3. **developers**
4. **team**
5. **gallery**
6. **leads**

In each collection, click "Add document" and let Firestore auto-generate the ID.

## Step 7: Install Required Packages

If not already installed:

```bash
npm install firebase react-firebase-hooks lucide-react
```

## Step 8: Verify Setup & Test Data Flow

### Verification Checklist:
- [ ] Firebase project created
- [ ] Authentication enabled with Email/Password
- [ ] Firestore Database created in test mode
- [ ] Cloudinary account set up with upload preset
- [ ] `.env.local` configured with ALL keys (including FIREBASE_ADMIN_*)
- [ ] Admin user created in Firebase
- [ ] Collections created in Firestore
- [ ] Dev server running (`npm run dev`)
- [ ] Can access admin panel and login

### Test Data Flow (Important!):
1. **Save data in admin panel**:
   - Go to `http://localhost:3000/admin/dashboard`
   - Click "Properties" tab → "New Property"
   - Fill in all fields and upload an image
   - Click "Save"

2. **Verify data in Firestore**:
   - Go to Firebase Console → Firestore Database
   - Check the "properties" collection
   - You should see a new document with your property

3. **Verify client-side fetching**:
   - Navigate to `http://localhost:3000/projects/ongoing`
   - Your new property should appear in the list
   - Click on it to view details

4. **If data doesn't appear on client**:
   - Check if `FIREBASE_ADMIN_*` variables are set in `.env.local`
   - Restart dev server: `npm run dev`
   - Check browser console (F12) for errors
   - Check terminal for server errors

## Troubleshooting

### Issue: "Firebase Admin not configured"
**This is the most common issue for data not fetching on client-side!**

**Solution**:
1. Verify `.env.local` has these three lines:
   ```env
   FIREBASE_ADMIN_PROJECT_ID=...
   FIREBASE_ADMIN_CLIENT_EMAIL=...
   FIREBASE_ADMIN_PRIVATE_KEY=...
   ```
2. Check the private key format - it should start with `-----BEGIN PRIVATE KEY-----`
3. Ensure the private key has actual newlines (not the text `\n`)
4. Check Firebase Console → Service Accounts tab for correct values
5. Restart dev server after updating .env.local

### Issue: "Cannot connect to Firebase"
**Solution**: 
- Check `.env.local` for typos in Firebase config
- Verify Firebase project is active in console
- Check that you're using `NEXT_PUBLIC_` prefix

### Issue: "Upload failed / CORS error"
**Solution**:
- Verify Cloudinary upload preset name matches env variable
- Ensure upload preset is set to "Unsigned"
- Check Cloudinary folder settings

### Issue: "Permission denied" in Firestore
**Solution**:
- Switch Firestore to test mode (for development)
- Update Firestore security rules to allow authenticated users
- Verify user is logged in

### Issue: "Images not optimizing"
**Solution**:
- Check Cloudinary Cloud Name is correct
- Verify image URLs are being stored (check Firestore)
- Test with Cloudinary URL directly

## Next: Using the Admin Panel

Once setup is complete:

1. **Log in** to `http://localhost:3000/admin/dashboard`
2. **Start with Properties** tab to add your first property
3. **Upload images** using the drag-and-drop interface
4. **Fill in details** and save
5. **Monitor Firestore** to see documents being created

## Production Deployment

Before going to production:

1. **Update Firestore Rules**: Implement proper authentication and role-based access
2. **Enable HTTPS**: Required for image uploads
3. **Set up Environment Variables**: Use production Firebase and Cloudinary credentials
4. **Configure CORS**: If using separate domain for Cloudinary
5. **Backup Strategy**: Set up Firestore backups
6. **Monitor**: Set up Firebase monitoring and alerts

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

