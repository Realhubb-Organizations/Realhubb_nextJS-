# Quick Verification Checklist

Use this checklist to verify the admin system is working end-to-end.

## Pre-Setup
- [ ] Firebase project created (go.firebase.google.com)
- [ ] Firestore Database created (test mode)
- [ ] Authentication enabled (Email/Password)
- [ ] Cloudinary account created with upload preset
- [ ] `.env.local` file created in project root

## Environment Variables
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` in `.env.local`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in `.env.local`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in `.env.local`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` in `.env.local`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` in `.env.local`
- [ ] `FIREBASE_ADMIN_PROJECT_ID` in `.env.local`
- [ ] `FIREBASE_ADMIN_CLIENT_EMAIL` in `.env.local`
- [ ] `FIREBASE_ADMIN_PRIVATE_KEY` in `.env.local`
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` in `.env.local`
- [ ] `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in `.env.local`

## Firebase Console
- [ ] Admin user created in Authentication
- [ ] Collections created: properties, blogPosts, developers, team, gallery, leads
- [ ] Firestore security rules updated (for dev/production)
- [ ] Service account private key generated

## Installation
- [ ] `npm install` completed
- [ ] All dependencies installed

## Development
- [ ] Dev server running: `npm run dev`
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:3000/admin/dashboard

## Admin Panel Login
- [ ] Go to `/admin/dashboard`
- [ ] Login page appears
- [ ] Can login with credentials from Firebase
- [ ] Dashboard loads after login
- [ ] Tabs visible: Properties, Blog, Developers, Team, Gallery, Leads

## Admin Panel - Add Property
- [ ] Go to Properties tab
- [ ] Click "New Property"
- [ ] Fill in: Name, Location, Price, Type, Area, Description
- [ ] Upload image successfully
- [ ] Click "Save"
- [ ] See "Saved successfully" message
- [ ] Property appears in properties list

## Firestore Console
- [ ] Go to Firebase Console → Firestore Database
- [ ] Check "properties" collection
- [ ] Newly added property appears as document
- [ ] Document has all fields filled

## Diagnostics Page
- [ ] Go to `/admin/diagnostics`
- [ ] Authentication shows ✓ Logged in
- [ ] Properties collection shows count > 0
- [ ] Environment variables show ✓ Configured
- [ ] No error messages

## Client-Side Properties Page
- [ ] Go to `/admin/client-properties`
- [ ] Properties load from Firestore
- [ ] Can see your newly added property
- [ ] Property card shows image, name, location, price
- [ ] "View" button works
- [ ] "Debug" button logs data to console

## Property Detail Page
- [ ] Go to `/projects/ongoing` (or click View on property)
- [ ] Your property appears in list
- [ ] Click property name/image
- [ ] Property detail page loads
- [ ] Shows all your property details
- [ ] Image displays correctly

## Blog Posts
- [ ] Repeat above steps for Blog tab
- [ ] Add blog post with markdown content
- [ ] Upload cover image
- [ ] Blog appears on `/blog` page
- [ ] Blog detail page works

## Other Content Types
- [ ] Repeat for Developers tab
- [ ] Repeat for Team tab
- [ ] Repeat for Gallery tab
- [ ] Repeat for Leads panel (view only)

## Real-Time Updates
- [ ] Add new property in admin
- [ ] Refresh `/admin/client-properties`
- [ ] New property appears without restart
- [ ] Edit property description in admin
- [ ] Refresh page
- [ ] Changes are visible

## Images
- [ ] Upload works in property form
- [ ] Image appears in property card
- [ ] Image loads on property detail page
- [ ] Cloudinary URL shows optimization parameters
- [ ] Different image sizes work (small, large, etc.)

## Mobile Responsive
- [ ] Admin dashboard responsive on mobile
- [ ] Property cards stack on mobile
- [ ] Property detail page readable on mobile
- [ ] Images scale properly

## Performance
- [ ] Admin form submits quickly (<2s)
- [ ] Property detail page loads quickly (<2s)
- [ ] No console errors in browser (F12)
- [ ] No server errors in terminal

## Error Handling
- [ ] Try submitting form with missing fields
- [ ] Error messages appear
- [ ] Try uploading wrong file type
- [ ] Error message appears
- [ ] Try accessing `/admin/dashboard` without login
- [ ] Redirected to login page

## Summary
- [ ] All above items checked ✓
- [ ] Data flows end-to-end correctly
- [ ] Admin panel is functional
- [ ] Client pages show live data
- [ ] System ready for use

---

## If Something Fails

1. **First**: Check `/admin/diagnostics` page for errors
2. **Second**: Check browser console (F12) for JavaScript errors
3. **Third**: Check terminal for server errors
4. **Fourth**: Review [ENV_SETUP.md](./ENV_SETUP.md) for Firebase configuration
5. **Fifth**: Review [DATA_FLOW_GUIDE.md](./DATA_FLOW_GUIDE.md) for troubleshooting

## Common Issues

### Admin panel won't load
- Check `.env.local` has Firebase variables
- Check Firebase project is active
- Restart dev server

### Data doesn't save
- Check browser console for errors
- Verify Firestore collection exists
- Check security rules allow writes

### Data doesn't appear on client page
- Check `/admin/diagnostics` shows collection count > 0
- Verify Firebase Admin variables in `.env.local`
- Restart dev server
- Check terminal for server errors

### Images don't upload
- Check Cloudinary credentials in `.env.local`
- Verify upload preset name is correct
- Check file size (<10MB) and format (jpg/png/webp)

