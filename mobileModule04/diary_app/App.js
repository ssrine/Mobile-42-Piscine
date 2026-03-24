import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Google from 'expo-auth-session/providers/google';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

const Stack = createNativeStackNavigator();

// Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDv_test_api_key_example',
  authDomain: 'diary-app-test.firebaseapp.com',
  projectId: 'diary-app-test',
  storageBucket: 'diary-app-test.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdefg123456',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Sign-In Configuration
const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
});

// Login Screen Component
const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          setLoading(false);
          navigation.replace('Profile');
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert('Login Error', error.message);
        });
    }
  }, [response]);

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.loginOverlay}>
        <View style={styles.loginContainer}>
          <MaterialCommunityIcons name="book-heart" size={80} color="#FF6B6B" />
          <Text style={styles.appTitle}>My Diary</Text>
          <Text style={styles.appSubtitle}>Your personal diary app</Text>

          <View style={styles.loginButtonsContainer}>
            <TouchableOpacity
              style={[styles.loginButton, styles.googleButton]}
              onPress={() => {
                setLoading(true);
                promptAsync();
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="google" size={24} color="#fff" />
                  <Text style={styles.loginButtonText}>Sign in with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.loginButton, styles.githubButton]}>
              <MaterialCommunityIcons name="github" size={24} color="#fff" />
              <Text style={styles.loginButtonText}>Sign in with GitHub</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.loginFooter}>Secure. Private. Yours.</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

// Profile/Diary Entries Screen Component
const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({ title: '', feeling: 'happy', content: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadEntries(currentUser.email);
      } else {
        navigation.replace('Login');
      }
    });

    return () => unsubscribe();
  }, []);

  const loadEntries = async (userEmail) => {
    try {
      const q = query(
        collection(db, 'diaryEntries'),
        where('email', '==', userEmail)
      );
      const querySnapshot = await getDocs(q);
      const entriesData = [];
      querySnapshot.forEach((doc) => {
        entriesData.push({ id: doc.id, ...doc.data() });
      });
      setEntries(entriesData.sort((a, b) => b.date - a.date));
    } catch (error) {
      console.error('Error loading entries:', error);
      Alert.alert('Error', 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'diaryEntries'), {
        email: user.email,
        title: newEntry.title,
        feeling: newEntry.feeling,
        content: newEntry.content,
        date: Timestamp.now(),
      });

      setNewEntry({ title: '', feeling: 'happy', content: '' });
      setShowCreateModal(false);
      await loadEntries(user.email);
    } catch (error) {
      Alert.alert('Error', 'Failed to create entry');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            setLoading(true);
            await deleteDoc(doc(db, 'diaryEntries', entryId));
            await loadEntries(user.email);
          } catch (error) {
            Alert.alert('Error', 'Failed to delete entry');
            console.error(error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (loading && entries.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  const feelingEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    excited: '🤩',
    calm: '😌',
    tired: '😴',
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.profileOverlay}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Entries List */}
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.entriesListContainer}
          scrollEnabled={true}
          renderItem={({ item }) => {
            const entryDate = item.date?.toDate?.() || new Date(item.date);
            const dateString = entryDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <TouchableOpacity
                style={styles.entryCard}
                onPress={() => {
                  setSelectedEntry(item);
                  setShowViewModal(true);
                }}
              >
                <View style={styles.entryHeader}>
                  <View style={styles.entryTitleSection}>
                    <Text style={styles.entryTitle}>{item.title}</Text>
                    <Text style={styles.entryDate}>{dateString}</Text>
                  </View>
                  <Text style={styles.feelingEmoji}>{feelingEmojis[item.feeling] || '📔'}</Text>
                </View>
                <Text style={styles.entryPreview} numberOfLines={2}>
                  {item.content}
                </Text>
                <View style={styles.entryFooter}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteEntry(item.id)}
                  >
                    <MaterialCommunityIcons name="delete" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="book-open-variant" size={60} color="rgba(255, 255, 255, 0.5)" />
              <Text style={styles.emptyText}>No entries yet</Text>
              <Text style={styles.emptySubtext}>Tap the + button to create your first entry</Text>
            </View>
          }
        />

        {/* Create Entry Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <MaterialCommunityIcons name="plus" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Create Entry Modal */}
        <Modal visible={showCreateModal} animationType="slide" transparent={true}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.modalOverlay}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.createModalContent}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>New Entry</Text>
                  <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                    <MaterialCommunityIcons name="close" size={28} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                  <Text style={styles.formLabel}>Title</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Entry title..."
                    placeholderTextColor="#999"
                    value={newEntry.title}
                    onChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
                  />

                  <Text style={styles.formLabel}>How are you feeling?</Text>
                  <View style={styles.feelingSelector}>
                    {Object.entries(feelingEmojis).map(([key, emoji]) => (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.feelingOption,
                          newEntry.feeling === key && styles.feelingOptionActive,
                        ]}
                        onPress={() => setNewEntry({ ...newEntry, feeling: key })}
                      >
                        <Text style={styles.feelingOptionEmoji}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.formLabel}>Content</Text>
                  <TextInput
                    style={[styles.textInput, styles.contentInput]}
                    placeholder="Write your entry here..."
                    placeholderTextColor="#999"
                    multiline={true}
                    numberOfLines={8}
                    value={newEntry.content}
                    onChangeText={(text) => setNewEntry({ ...newEntry, content: text })}
                    textAlignVertical="top"
                  />

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleCreateEntry}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Save Entry</Text>
                    )}
                  </TouchableOpacity>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </ImageBackground>
        </Modal>

        {/* View Entry Modal */}
        <Modal visible={showViewModal} animationType="slide" transparent={true}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.viewModalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedEntry?.title}</Text>
                  <TouchableOpacity onPress={() => setShowViewModal(false)}>
                    <MaterialCommunityIcons name="close" size={28} color="#fff" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.viewModalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.entryMetaInfo}>
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons name="calendar" size={18} color="#4ECDC4" />
                      <Text style={styles.metaText}>
                        {selectedEntry?.date?.toDate?.()?.toLocaleDateString?.() ||
                          new Date(selectedEntry?.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.feelingEmojiLarge}>
                        {feelingEmojis[selectedEntry?.feeling] || '📔'}
                      </Text>
                      <Text style={styles.metaText}>{selectedEntry?.feeling}</Text>
                    </View>
                  </View>

                  <Text style={styles.viewEntryContent}>{selectedEntry?.content}</Text>
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowViewModal(false)}
                >
                  <Text style={styles.closeModalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </Modal>
      </View>
    </ImageBackground>
  );
};

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loginOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 8,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 32,
  },
  loginButtonsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  githubButton: {
    backgroundColor: '#333',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginFooter: {
    fontSize: 12,
    color: '#999',
    marginTop: 16,
  },
  profileOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  entriesListContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  entryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryTitleSection: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  entryDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  feelingEmoji: {
    fontSize: 28,
    marginLeft: 8,
  },
  entryPreview: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    lineHeight: 18,
  },
  entryFooter: {
    alignItems: 'flex-end',
  },
  deleteButton: {
    padding: 8,
  },
  createButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  createModalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '95%',
    paddingTop: 16,
  },
  viewModalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '95%',
    paddingTop: 16,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  modalForm: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
  },
  contentInput: {
    minHeight: 120,
    paddingTop: 12,
  },
  feelingSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  feelingOption: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feelingOptionActive: {
    backgroundColor: 'rgba(78, 205, 196, 0.3)',
    borderColor: '#4ECDC4',
  },
  feelingOptionEmoji: {
    fontSize: 32,
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewModalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    flex: 1,
  },
  entryMetaInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
  },
  feelingEmojiLarge: {
    fontSize: 24,
  },
  viewEntryContent: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 20,
  },
  closeModalButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderWidth: 1,
    borderColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
