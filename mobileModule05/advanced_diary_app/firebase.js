import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// Firebase project config
const firebaseConfig = {
  apiKey: 'AIzaSyBK-Jh8I6dV9Oid6Fesmu9WQsRpbncnBsY',
  authDomain: 'test04-fc668.firebaseapp.com',
  projectId: 'test04-fc668',
  storageBucket: 'test04-fc668.firebasestorage.app',
  messagingSenderId: '509050455059',
  appId: '1:509050455059:web:75e2f476654ca80cf4abe6',
};

const app = initializeApp(firebaseConfig);

// Dynamic require prevents the web bundler from trying to resolve native-only modules
let auth;
if (Platform.OS === 'web') {
  const { getAuth } = require('firebase/auth');
  auth = getAuth(app);
} else {
  const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // more reliable than autoDetect on React Native
});
