# Piscine Mobile - Module 04: Auth and Database

## Summary
This module introduces authentication and database functionality to a diary app. Users can log in with Google or GitHub and manage their personal diary entries.

**Version:** 1.2

---

## Table of Contents
1. [Instructions](#instructions)
2. [Specific Instructions](#specific-instructions)
3. [Exercise 00: Login Page](#exercise-00-login-page)
4. [Exercise 01: Profile Page](#exercise-01-profile-page)
5. [Firebase Setup Guide](#firebase-setup-guide)
6. [Database Structure](#database-structure)
7. [Submission and peer-evaluation](#submission-and-peer-evaluation)

---

## Instructions

- If you have problems installing the tools needed for your project on the 42 computers, use a virtual machine
- Only this page will serve as reference. Do not trust rumors
- Read attentively the whole document before beginning
- Your exercises will be corrected by your piscine colleagues
- The document can be relied upon, do not blindly trust the demos or pictures
- Got a question? Ask your peer on the right. Otherwise, try your peer on the left
- By Odin, by Thor! Use your brain!

**Note:** Intra indicates the date and the hour of closing for your repositories. This date and hour also corresponds to the beginning of the peer-evaluation period. This peer-evaluation period lasts exactly 24h. After 24h passed, your missing peer grades will be completed with a 0.

---

## Specific Instructions

For this module:
- Create a new project app named **"diary_app"** in a new repository called **"mobileModule04"**
- This project will continue into the next module
- Your new application is a **diary app**
- Users will be able to **create, read, and delete diary entries**
- The diary is protected by an **authentication system**
- All entries are stored in a **database**

In this module, your task is to set up:
1. **Authentication system** (Google or GitHub login)
2. **Database structure** to store diary entries
3. **CRUD operations** (Create, Read, Delete)

---

## Exercise 00: Login Page

**Turn-in directory:** `mobileModule04`  
**Files to turn in:** `diary_app` and all necessary files  
**Forbidden functions:** None

### Objective
Create a professional login page with third-party authentication.

### Requirements
- **Login button** that either redirects to authentication page or directly to the diary if user is already logged in
- **Google sign-in** option
- **GitHub sign-in** option (placeholder ready)
- **Authentication system:** Firebase, AWS, or similar service
- Users must be stored and managed in the authentication system

### Implementation Details
- Branded and professional UI
- Clear call-to-action buttons
- Social authentication integration
- Automatic redirect to diary if already logged in
- Loading state during authentication
- Error handling for failed login attempts

### Features
✓ Google OAuth 2.0 integration via Expo Auth Session  
✓ Firebase Authentication backend  
✓ Persistent authentication state  
✓ Automatic session restoration  
✓ Professional login UI with branding

---

## Exercise 01: Profile Page

**Turn-in directory:** `mobileModule04`  
**Files to turn in:** `diary_app` and all necessary files  
**Forbidden functions:** None

### Objective
Create a profile page that displays and manages diary entries.

### Requirements
- **Only accessible** if user is logged in
- **Automatic redirect** to this page after login
- **Database setup** for storing diary entries
- **List of all diary entries** with preview
- **Create new entry** button
- **View entry** functionality (tap to read)
- **Delete entry** functionality
- **List updates** when entries are created/deleted

### Database Fields
Each diary entry must store:
- **User email** - to associate entries with users
- **Date** - entry creation date/timestamp
- **Title** - entry title
- **Feeling** - user's feeling (happy, sad, angry, excited, calm, tired)
- **Content** - full entry text

### Database Structure (Firestore)
```
firestore/
└── diaryEntries/ (collection)
    └── {entryId} (document)
        ├── email: string
        ├── date: Timestamp
        ├── title: string
        ├── feeling: string
        └── content: string
```

### Implementation Details

#### Create Entry
- Modal form with:
  - Title input field
  - Feeling selector (6 emoji options)
  - Content text area
  - Save button
- Form validation
- Database write

#### Read Entry
- List displays:
  - Entry title
  - Entry date
  - Feeling emoji
  - Content preview (first 2 lines)
- Tap to open detail view
- Detail view shows:
  - Full title
  - Full content
  - Date and time
  - Selected feeling
  - Close button

#### Delete Entry
- Delete button on each card
- Confirmation dialog
- Database deletion
- List refresh

#### Key Features
✓ Real-time entry list from Firestore  
✓ User-specific entries (filtered by email)  
✓ Emotion selector with emojis  
✓ Modal-based create form  
✓ Detail view for reading  
✓ Confirmation before delete  
✓ Empty state messaging  
✓ Loading indicators  
✓ Error handling

---

## Firebase Setup Guide

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name (e.g., "diary-app")
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Set Up Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Google** provider:
   - Click Google
   - Enable it
   - Add support email
   - Save
4. Enable **GitHub** provider (optional):
   - Click GitHub
   - Register GitHub OAuth app
   - Add credentials
   - Save

### Step 3: Set Up Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **Production mode** (or test mode for development)
4. Choose location
5. Create database

### Step 4: Configure Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own entries
    match /diaryEntries/{document=**} {
      allow read, write: if request.auth != null && 
        request.resource.data.email == request.auth.token.email;
    }
  }
}
```

### Step 5: Get Firebase Config
1. Go to **Project Settings**
2. Click **Add App** → **Web**
3. Register app
4. Copy Firebase config
5. Replace in App.js:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### Step 6: Set Up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable **Google+ API**
4. Create **OAuth 2.0 Client ID** (Android)
5. Get **Client ID**
6. Replace in App.js:
```javascript
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
});
```

---

## Database Structure

### Collection: `diaryEntries`

#### Document Schema
```typescript
interface DiaryEntry {
  email: string;           // User's email from auth
  date: Timestamp;         // Entry creation timestamp
  title: string;           // Entry title
  feeling: string;         // 'happy' | 'sad' | 'angry' | 'excited' | 'calm' | 'tired'
  content: string;         // Full entry text (can be long)
}
```

#### Example Entry
```json
{
  "email": "user@example.com",
  "date": "2024-03-18T14:30:00Z",
  "title": "First Day",
  "feeling": "happy",
  "content": "Today was amazing! I completed my first diary entry..."
}
```

#### Queries
- Get user's entries: `where('email', '==', userEmail)`
- Order by date: `orderby('date', 'desc')`
- Limit results: `.limit(50)`

---

## Environment Setup

### Install Dependencies
```bash
npm install
```

### Required Packages
- `firebase`: ^10.5.0 - Firebase SDK
- `expo-auth-session`: ^5.4.0 - Google authentication
- `@react-navigation/native`: Navigation
- `react-native-vector-icons`: Icons

### Development
```bash
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## Features Implemented

### Authentication
✓ Google OAuth sign-in  
✓ GitHub OAuth sign-in (structure ready)  
✓ Session persistence  
✓ Logout functionality  
✓ Auto-redirect on login  

### Diary Management
✓ Create entries with title, feeling, and content  
✓ Read/view full entries  
✓ Delete entries with confirmation  
✓ List all user entries  
✓ Sort entries by date (newest first)  
✓ Feeling emoji indicators  

### User Experience
✓ Loading states  
✓ Error handling and alerts  
✓ Empty state messaging  
✓ Smooth transitions  
✓ Professional UI design  
✓ Responsive layouts  

### Data Persistence
✓ All entries stored in Firestore  
✓ User-specific filtering  
✓ Real-time updates  
✓ Automatic sync  

---

## Testing Checklist

- [ ] Sign in with Google account
- [ ] Verify user is logged in
- [ ] Create new diary entry
- [ ] Entry appears in list
- [ ] Tap entry to view full content
- [ ] Close entry detail view
- [ ] Delete entry with confirmation
- [ ] Entry is removed from list
- [ ] Sign out
- [ ] Verify app redirects to login
- [ ] Sign in with same account
- [ ] Verify previous entries are still there

---

## For Evaluators

To test this app, you'll need to:

1. **Create a Google Account** for testing
2. **Add test entries** to the diary:
   - At least 3 entries with different feelings
   - Include varied content lengths
   - Use different dates
3. **Verify CRUD Operations**:
   - Can create entries
   - Can read/view entries
   - Can delete entries
4. **Test Authentication**:
   - Sign out and sign back in
   - Verify entries persist

---

## Submission and Peer-Evaluation

Turn in your assignment in your Git repository as usual. Only the work inside your repository will be evaluated during the defense.

**Important:** Double-check the names of your folders and files:
- Repository name: `mobileModule04`
- Project folder: `diary_app`
- Main file: `App.js`

The evaluation process will happen on the computer of the evaluated group.

**Before submission, ensure:**
- Firebase credentials are properly configured
- Firestore database is set up
- Google OAuth is enabled
- Test data exists in Firestore
- All CRUD operations work
- Authentication flows properly
- No hardcoded passwords or secrets

---

## Troubleshooting

### Authentication Issues
- Ensure Google OAuth credentials are correct
- Check that Google+ API is enabled in Google Cloud Console
- Verify redirect URLs are configured

### Database Issues
- Check Firestore security rules
- Ensure database is in the correct region
- Verify entries collection exists

### Connection Issues
- Check internet connectivity
- Ensure Firebase project is active
- Verify API keys are correct

---

## Notes

- This module is the foundation for the next module
- Focus on functionality over design (design will be enhanced later)
- Always validate user input before saving
- Handle errors gracefully with user-friendly messages
- Test with real data before submission
