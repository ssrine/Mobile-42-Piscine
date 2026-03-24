import React, { useState, useEffect, useCallback } from 'react';
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
  Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar } from 'react-native-calendars';
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
  onSnapshot,
} from 'firebase/firestore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const screenWidth = Dimensions.get('window').width;

// Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDv_test_api_key_example',
  authDomain: 'diary-app-test.firebaseapp.com',
  projectId: 'diary-app-test',
  storageBucket: 'diary-app-test.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdefg123456',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
});

// Login Screen
const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          setLoading(false);
          navigation.replace('MainApp');
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
          </View>

          <Text style={styles.loginFooter}>Secure. Private. Yours.</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

// Enhanced Profile Screen
const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({ title: '', feeling: 'happy', content: '' });
  const [feelingStats, setFeelingStats] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setupRealtimeListener(currentUser.email);
      } else {
        navigation.replace('Login');
      }
    });

    return () => unsubscribe();
  }, []);

  const setupRealtimeListener = (userEmail) => {
    const q = query(collection(db, 'diaryEntries'), where('email', '==', userEmail));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entriesData = [];
      querySnapshot.forEach((doc) => {
        entriesData.push({ id: doc.id, ...doc.data() });
      });
      setEntries(entriesData.sort((a, b) => b.date - a.date));
      calculateFeelingStats(entriesData);
      setLoading(false);
    });

    return unsubscribe;
  };

  const calculateFeelingStats = (entriesList) => {
    const stats = {};
    const total = entriesList.length;

    entriesList.forEach((entry) => {
      stats[entry.feeling] = (stats[entry.feeling] || 0) + 1;
    });

    Object.keys(stats).forEach((feeling) => {
      stats[feeling] = Math.round((stats[feeling] / total) * 100);
    });

    setFeelingStats(stats);
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
            setShowViewModal(false);
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

  const feelingEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    excited: '🤩',
    calm: '😌',
    tired: '😴',
  };

  const lastTwoEntries = entries.slice(0, 2);

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.profileOverlay}>
        <View style={styles.profileHeader}>
          <View>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.userName}>{user?.displayName || user?.email?.split('@')[0]}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.profileContent} showsVerticalScrollIndicator={false}>
          {/* Statistics Section */}
          <View style={styles.statsCard}>
            <View style={styles.totalEntriesBox}>
              <Text style={styles.totalEntriesNumber}>{entries.length}</Text>
              <Text style={styles.totalEntriesLabel}>Total Entries</Text>
            </View>
          </View>

          {/* Feeling Statistics */}
          <View style={styles.feelingStatsCard}>
            <Text style={styles.sectionTitle}>Your Feelings</Text>
            <View style={styles.feelingStatsGrid}>
              {Object.entries(feelingStats).map(([feeling, percentage]) => (
                <View key={feeling} style={styles.feelingStatItem}>
                  <Text style={styles.feelingStatEmoji}>{feelingEmojis[feeling]}</Text>
                  <Text style={styles.feelingStatLabel}>{feeling}</Text>
                  <Text style={styles.feelingStatPercentage}>{percentage}%</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Last 2 Entries */}
          {lastTwoEntries.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Recent Entries</Text>
              {lastTwoEntries.map((entry) => {
                const entryDate = entry.date?.toDate?.() || new Date(entry.date);
                const dateString = entryDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <TouchableOpacity
                    key={entry.id}
                    style={styles.recentEntryCard}
                    onPress={() => {
                      setSelectedEntry(entry);
                      setShowViewModal(true);
                    }}
                  >
                    <View style={styles.recentEntryHeader}>
                      <View style={styles.recentEntryTitleSection}>
                        <Text style={styles.recentEntryTitle}>{entry.title}</Text>
                        <Text style={styles.recentEntryDate}>{dateString}</Text>
                      </View>
                      <Text style={styles.recentEntryEmoji}>{feelingEmojis[entry.feeling]}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Create Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <MaterialCommunityIcons name="plus" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Create Modal */}
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
                        {feelingEmojis[selectedEntry?.feeling]}
                      </Text>
                      <Text style={styles.metaText}>{selectedEntry?.feeling}</Text>
                    </View>
                  </View>

                  <Text style={styles.viewEntryContent}>{selectedEntry?.content}</Text>
                </ScrollView>

                <View style={styles.viewModalFooter}>
                  <TouchableOpacity
                    style={styles.deleteButtonLarge}
                    onPress={() => handleDeleteEntry(selectedEntry?.id)}
                  >
                    <MaterialCommunityIcons name="delete" size={20} color="#FF6B6B" />
                    <Text style={styles.deleteButtonText}>Delete Entry</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => setShowViewModal(false)}
                  >
                    <Text style={styles.closeModalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </Modal>
      </View>
    </ImageBackground>
  );
};

// Agenda Screen with Calendar
const AgendaScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState([]);
  const [selectedDayEntries, setSelectedDayEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setupRealtimeListener(currentUser.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const setupRealtimeListener = (userEmail) => {
    const q = query(collection(db, 'diaryEntries'), where('email', '==', userEmail));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entriesData = [];
      const marked = {};

      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        entriesData.push(data);

        const entryDate = data.date?.toDate?.() || new Date(data.date);
        const dateString = entryDate.toISOString().split('T')[0];

        if (!marked[dateString]) {
          marked[dateString] = { marked: true, dotColor: '#FF6B6B' };
        }
      });

      setEntries(entriesData);
      setMarkedDates(marked);
      updateSelectedDateEntries(entriesData, selectedDate);
      setLoading(false);
    });

    return unsubscribe;
  };

  const updateSelectedDateEntries = (allEntries, date) => {
    const filtered = allEntries.filter((entry) => {
      const entryDate = entry.date?.toDate?.() || new Date(entry.date);
      return entryDate.toISOString().split('T')[0] === date;
    });

    setSelectedDayEntries(filtered.sort((a, b) => b.date - a.date));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    updateSelectedDateEntries(entries, date.dateString);
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
            setShowViewModal(false);
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

  const feelingEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    excited: '🤩',
    calm: '😌',
    tired: '😴',
  };

  const currentDateMarked = {
    ...markedDates,
    [selectedDate]: {
      ...(markedDates[selectedDate] || {}),
      selected: true,
      selectedColor: '#4ECDC4',
    },
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.agendaOverlay}>
        <Calendar
          current={selectedDate}
          onDayPress={handleDateSelect}
          markedDates={currentDateMarked}
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'rgba(255, 255, 255, 0.1)',
            textSectionTitleColor: '#fff',
            selectedDayBackgroundColor: '#4ECDC4',
            selectedDayTextColor: '#fff',
            todayTextColor: '#FF6B6B',
            dayTextColor: '#fff',
            textDisabledColor: 'rgba(255, 255, 255, 0.3)',
            dotColor: '#FF6B6B',
            selectedDotColor: '#fff',
            monthTextColor: '#fff',
            textMonthFontSize: 18,
            monthTextFontSize: 18,
            textDayFontSize: 16,
            textMonthFontWeight: '600',
            textDayHeaderFontSize: 14,
          }}
          style={styles.calendar}
        />

        {/* Entries for Selected Date */}
        <View style={styles.agendaEntriesContainer}>
          <Text style={styles.selectedDateLabel}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>

          <FlatList
            data={selectedDayEntries}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.agendaEntryCard}
                onPress={() => {
                  setSelectedEntry(item);
                  setShowViewModal(true);
                }}
              >
                <View style={styles.agendaEntryHeader}>
                  <View style={styles.agendaEntryTitleSection}>
                    <Text style={styles.agendaEntryTitle}>{item.title}</Text>
                    <Text style={styles.agendaEntryTime}>
                      {(item.date?.toDate?.() || new Date(item.date)).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.agendaEntryEmoji}>{feelingEmojis[item.feeling]}</Text>
                </View>
                <Text style={styles.agendaEntryPreview} numberOfLines={2}>
                  {item.content}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyAgendaContainer}>
                <MaterialCommunityIcons name="calendar-blank" size={50} color="rgba(255, 255, 255, 0.5)" />
                <Text style={styles.emptyAgendaText}>No entries for this date</Text>
              </View>
            }
          />
        </View>

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
                        {feelingEmojis[selectedEntry?.feeling]}
                      </Text>
                      <Text style={styles.metaText}>{selectedEntry?.feeling}</Text>
                    </View>
                  </View>

                  <Text style={styles.viewEntryContent}>{selectedEntry?.content}</Text>
                </ScrollView>

                <View style={styles.viewModalFooter}>
                  <TouchableOpacity
                    style={styles.deleteButtonLarge}
                    onPress={() => handleDeleteEntry(selectedEntry?.id)}
                  >
                    <MaterialCommunityIcons name="delete" size={20} color="#FF6B6B" />
                    <Text style={styles.deleteButtonText}>Delete Entry</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => setShowViewModal(false)}
                  >
                    <Text style={styles.closeModalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </Modal>
      </View>
    </ImageBackground>
  );
};

// Main App Tabs Navigation
const MainAppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === 'Agenda') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
        },
      })}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
      <Tab.Screen
        name="Agenda"
        component={AgendaScreen}
        options={{ tabBarLabel: 'Agenda' }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainApp" component={MainAppTabs} />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
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
  profileContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  totalEntriesBox: {
    alignItems: 'center',
  },
  totalEntriesNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FF6B6B',
  },
  totalEntriesLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    fontWeight: '600',
  },
  feelingStatsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  feelingStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  feelingStatItem: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  feelingStatEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  feelingStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'capitalize',
  },
  feelingStatPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B',
    marginTop: 4,
  },
  recentEntryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  recentEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recentEntryTitleSection: {
    flex: 1,
  },
  recentEntryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  recentEntryDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  recentEntryEmoji: {
    fontSize: 24,
    marginLeft: 8,
  },
  createButton: {
    position: 'absolute',
    bottom: 90,
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
  viewModalFooter: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 10,
  },
  deleteButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  closeModalButton: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderWidth: 1,
    borderColor: '#4ECDC4',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  agendaOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  calendar: {
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  agendaEntriesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  selectedDateLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  agendaEntryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  agendaEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  agendaEntryTitleSection: {
    flex: 1,
  },
  agendaEntryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  agendaEntryTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  agendaEntryEmoji: {
    fontSize: 20,
    marginLeft: 8,
  },
  agendaEntryPreview: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
  },
  emptyAgendaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyAgendaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 12,
  },
});
