// =============================================================
// GOOGLE / GITHUB CREDENTIALS — fill these in before running
// =============================================================
// GOOGLE:
//   1. Firebase Console > Authentication > Sign-in method > Google > Enable
//   2. Copy Web Client ID from the Google provider panel (NOT from Google Cloud)
//   3. Paste it as GOOGLE_WEB_CLIENT_ID below
//   Note: for Android/iOS you also need the respective Client IDs from
//         Google Cloud Console > APIs & Services > Credentials
//
// GITHUB:
//   1. GitHub Settings > Developer settings > OAuth Apps > New OAuth App
//   2. Homepage URL: http://localhost
//   3. Callback URL: https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler
//   4. Enable GitHub in Firebase > Authentication > Sign-in method > GitHub
//      and paste the Client ID & Secret there too
//   5. Copy Client ID and Secret below
// =============================================================

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from '../firebase';

WebBrowser.maybeCompleteAuthSession();

// TODO: Fill in your credentials
const GOOGLE_WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';

const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID';
// ⚠️ WARNING: client secrets should NOT be in client-side code in production.
// For this school project, this works because React Native bypasses CORS.
const GITHUB_CLIENT_SECRET = 'YOUR_GITHUB_CLIENT_SECRET';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  // --- Google Auth ---
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
  });

  // --- GitHub Auth ---
  const githubRedirectUri = AuthSession.makeRedirectUri({ scheme: 'diaryapp' });
  const [githubRequest, githubResponse, githubPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['read:user', 'user:email'],
      redirectUri: githubRedirectUri,
    },
    { authorizationEndpoint: 'https://github.com/login/oauth/authorize' }
  );

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      handleGoogleResponse(googleResponse);
    } else if (googleResponse?.type === 'error') {
      Alert.alert('Error', 'Google sign-in was cancelled or failed.');
    }
  }, [googleResponse]);

  useEffect(() => {
    if (githubResponse?.type === 'success') {
      handleGithubResponse(githubResponse);
    } else if (githubResponse?.type === 'error') {
      Alert.alert('Error', 'GitHub sign-in was cancelled or failed.');
    }
  }, [githubResponse]);

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    try {
      const idToken = response.params?.id_token;
      const accessToken = response.params?.access_token;

      if (!idToken && !accessToken) {
        throw new Error('No token received from Google.');
      }

      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      await signInWithCredential(auth, credential);
    } catch (err) {
      Alert.alert('Sign-in failed', err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubResponse = async (response) => {
    setLoading(true);
    try {
      const { code } = response.params;

      // Exchange authorization code for access token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: githubRedirectUri,
        }),
      });
      const tokenData = await tokenRes.json();

      if (!tokenData.access_token) {
        throw new Error(tokenData.error_description || 'No access token received from GitHub.');
      }

      const credential = GithubAuthProvider.credential(tokenData.access_token);
      await signInWithCredential(auth, credential);
    } catch (err) {
      Alert.alert('Sign-in failed', err.message || 'GitHub sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="book-open-page-variant" size={72} color="#8B4513" />
          </View>
          <Text style={styles.title}>My Diary</Text>
          <Text style={styles.subtitle}>
            Your private space to reflect, write, and remember.
          </Text>
        </View>

        <View style={styles.buttonsSection}>
          <Text style={styles.signInLabel}>Sign in to continue</Text>

          <TouchableOpacity
            style={[styles.authBtn, styles.googleBtn]}
            onPress={() => googlePromptAsync()}
            disabled={!googleRequest || loading}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="google" size={22} color="#4285F4" />
            <Text style={[styles.authBtnText, styles.googleText]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authBtn, styles.githubBtn]}
            onPress={() => githubPromptAsync()}
            disabled={!githubRequest || loading}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="github" size={22} color="#fff" />
            <Text style={[styles.authBtnText, styles.githubText]}>
              Continue with GitHub
            </Text>
          </TouchableOpacity>

          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#8B4513" />
              <Text style={styles.loadingText}>Signing in...</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.footer}>
          Your diary is private and protected.{'\n'}
          Only you can see your entries.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },

  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingVertical: 32,
  },

  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },

  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#FFF0DF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#E8C9A0',
  },

  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#3D2B1F',
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: '#8C6D5A',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 260,
  },

  buttonsSection: {
    gap: 14,
    marginBottom: 24,
  },

  signInLabel: {
    fontSize: 13,
    color: '#9E7E6A',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  authBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 15,
    borderRadius: 14,
  },

  authBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },

  googleBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E0D0C0',
  },

  googleText: {
    color: '#3D2B1F',
  },

  githubBtn: {
    backgroundColor: '#24292E',
  },

  githubText: {
    color: '#fff',
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
  },

  loadingText: {
    color: '#8B4513',
    fontSize: 14,
  },

  footer: {
    textAlign: 'center',
    color: '#B09080',
    fontSize: 12,
    lineHeight: 18,
  },
});
