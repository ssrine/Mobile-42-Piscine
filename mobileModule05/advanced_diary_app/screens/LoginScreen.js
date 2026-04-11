import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
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
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';

import {
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_ANDROID_CLIENT_ID,
  ANDROID_GOOGLE_REDIRECT,
  IOS_GOOGLE_REDIRECT,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET
} from '@env';

WebBrowser.maybeCompleteAuthSession();

// Native redirect URI (exp:// in Expo Go, test04-diary:// in standalone build)
const GITHUB_REDIRECT = AuthSession.makeRedirectUri({ scheme: 'test04-diary' });

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const [googleRequest, googleResponse, googlePromptAsync] =
  Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
    redirectUri: Platform.select({
      android: ANDROID_GOOGLE_REDIRECT,
      ios: IOS_GOOGLE_REDIRECT,
      default: undefined,
    }),
  });

  const [githubRequest, githubResponse, githubPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['read:user', 'user:email'],
      redirectUri: GITHUB_REDIRECT,
      usePKCE: false, 
    },
    { authorizationEndpoint: 'https://github.com/login/oauth/authorize' }
  );

  useEffect(() => {
    if (googleRequest) console.log('🔵 Google redirectUri:', googleRequest.redirectUri);
  }, [googleRequest]);

  useEffect(() => {
    if (githubRequest) console.log('⚫ GitHub redirectUri:', githubRequest.redirectUri);
  }, [githubRequest]);

  // ── Handle native Google response ─────────────────────────────────────────
  useEffect(() => {
    console.log('🔵 Google Response:', googleResponse);
    if (googleResponse?.type === 'success') handleGoogleNativeResponse(googleResponse);
    else if (googleResponse?.type === 'error')
      Alert.alert('Google sign-in failed', 'Please try again.');
  }, [googleResponse]);

  // ── Handle native GitHub response ─────────────────────────────────────────
  useEffect(() => {
    console.log('⚫ GitHub Response:', githubResponse);
    if (githubResponse?.type === 'success') handleGithubNativeResponse(githubResponse);
    else if (githubResponse?.type === 'error')
      Alert.alert('GitHub sign-in failed', 'Please try again.');
  }, [githubResponse]);

  // ── Web: Google popup ──────────────────────────────────────────────────────
  const signInGoogleWeb = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      Alert.alert('Google sign-in failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Web: GitHub popup ──────────────────────────────────────────────────────
  const signInGithubWeb = async () => {
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('read:user');
      provider.addScope('user:email');
      await signInWithPopup(auth, provider);
    } catch (err) {
      Alert.alert('GitHub sign-in failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Native: Google ────────────────────────────────────────────────────────
  const handleGoogleNativeResponse = async (response) => {
    setLoading(true);
    try {
      const idToken = response.authentication?.idToken;
      const accessToken = response.authentication?.accessToken;
      if (!idToken && !accessToken) throw new Error('No token from Google.');
      await signInWithCredential(auth, GoogleAuthProvider.credential(idToken, accessToken));
    } catch (err) {
      Alert.alert('Google sign-in failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Native: GitHub ───────────────────────────────────────────────────────
  const handleGithubNativeResponse = async (response) => {
    setLoading(true);
    try {
      const { code } = response.params;
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: GITHUB_REDIRECT,
        }),
      });
      const data = await res.json();
      if (!data.access_token) throw new Error(data.error_description || 'No token from GitHub.');
      await signInWithCredential(auth, GithubAuthProvider.credential(data.access_token));
    } catch (err) {
      if (err.code === 'auth/account-exists-with-different-credential') {
        Alert.alert('Account exists', 'Try login with Google instead');
      } else {
        Alert.alert('GitHub sign-in failed', err.message);
      }
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
            onPress={
              Platform.OS === 'web'
                ? signInGoogleWeb
                : () => googlePromptAsync()
            }
            disabled={loading || (Platform.OS !== 'web' && !googleRequest)}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="google" size={22} color="#4285F4" />
            <Text style={[styles.authBtnText, styles.googleText]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.authBtn, styles.githubBtn]}
            onPress={Platform.OS === 'web' ? signInGithubWeb : () => githubPromptAsync()}
            disabled={loading || (Platform.OS !== 'web' && !githubRequest)}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="github" size={22} color="#fff" />
            <Text style={[styles.authBtnText, styles.githubText]}>
              Continue with GitHub
            </Text>
          </TouchableOpacity>

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#8B4513" />
              <Text style={styles.loadingText}>Signing in…</Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          Your diary is private and protected.{'\n'}Only you can see your entries.
        </Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF8F0' },
  container: {
    flex: 1, paddingHorizontal: 28,
    justifyContent: 'space-between', paddingVertical: 32,
  },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 20 },
  iconWrapper: {
    width: 120, height: 120, borderRadius: 30,
    backgroundColor: '#FFF0DF', justifyContent: 'center', alignItems: 'center',
    marginBottom: 24, borderWidth: 1.5, borderColor: '#E8C9A0',
  },
  title: { fontSize: 38, fontWeight: '800', color: '#3D2B1F', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#8C6D5A', textAlign: 'center', lineHeight: 24 },
  buttonsSection: { gap: 14, marginBottom: 24 },
  signInLabel: {
    fontSize: 13, color: '#9E7E6A', textAlign: 'center',
    textTransform: 'uppercase', fontWeight: '600',
  },
  authBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 12, paddingVertical: 15, borderRadius: 14,
  },
  authBtnText: { fontSize: 16, fontWeight: '600' },
  googleBtn: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E0D0C0' },
  googleText: { color: '#3D2B1F' },
  githubBtn: { backgroundColor: '#24292E' },
  githubText: { color: '#fff' },
  loadingRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
  },
  loadingText: { color: '#8B4513', fontSize: 14 },
  footer: { textAlign: 'center', color: '#B09080', fontSize: 12 },
});