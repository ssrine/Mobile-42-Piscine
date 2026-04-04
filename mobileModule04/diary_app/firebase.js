// =============================================================
// FIREBASE SETUP INSTRUCTIONS
// =============================================================
// 1. Go to https://console.firebase.google.com and create a project
// 2. In the project, go to Project Settings > Your Apps > Add App (Web)
// 3. Copy the firebaseConfig object below
// 4. Enable Authentication > Sign-in method > Google (and GitHub if needed)
//    - For Google: just enable it, copy the Web Client ID into LoginScreen.js
//    - For GitHub: create OAuth App at https://github.com/settings/developers
//      Set callback URL to: https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler
//      Copy Client ID and Secret into LoginScreen.js
// 5. Enable Firestore Database > Create database (start in test mode)
// 6. After testing, apply these security rules in Firestore > Rules:
//
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /entries/{entryId} {
//         allow read, delete: if request.auth != null
//           && request.auth.uid == resource.data.userId;
//         allow create: if request.auth != null
//           && request.auth.uid == request.resource.data.userId;
//       }
//     }
//   }
// =============================================================

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace every value below with your own Firebase project config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);

// Persist auth across app restarts using AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
