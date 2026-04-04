import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import DiaryEntryCard from '../components/DiaryEntryCard';

export default function ProfileScreen({ navigation, user }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'entries'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setEntries(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user.uid]);

  const handleDelete = async (entryId) => {
    try {
      await deleteDoc(doc(db, 'entries', entryId));
    } catch {
      Alert.alert('Error', 'Could not delete entry. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(auth),
      },
    ]);
  };

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="book-open-outline" size={72} color="#D4A87A" />
        <Text style={styles.emptyTitle}>No entries yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap the{' '}
          <Text style={styles.emptyHighlight}>+</Text>
          {' '}button to write your first diary entry.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View>
            <Text style={styles.greet}>Welcome back,</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} hitSlop={8}>
          <MaterialCommunityIcons name="logout" size={22} color="#8B4513" />
        </TouchableOpacity>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>My Entries</Text>
        <Text style={styles.entryCount}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DiaryEntryCard
              entry={item}
              onPress={() => navigation.navigate('EntryDetail', { entry: item })}
              onDelete={handleDelete}
            />
          )}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            entries.length === 0 ? styles.listContentEmpty : styles.listContent
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewEntry')}
        activeOpacity={0.88}
      >
        <MaterialCommunityIcons name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDD9BE',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  greet: {
    fontSize: 12,
    color: '#9E7E6A',
    fontWeight: '500',
  },

  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3D2B1F',
    maxWidth: 220,
  },

  logoutBtn: {
    padding: 8,
    backgroundColor: '#FFF0DF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDD9BE',
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },

  listTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3D2B1F',
  },

  entryCount: {
    fontSize: 13,
    color: '#9E7E6A',
    fontWeight: '500',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listContent: {
    paddingTop: 4,
    paddingBottom: 100,
  },

  listContentEmpty: {
    flex: 1,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3D2B1F',
    marginTop: 8,
  },

  emptySubtitle: {
    fontSize: 15,
    color: '#9E7E6A',
    textAlign: 'center',
    lineHeight: 22,
  },

  emptyHighlight: {
    fontWeight: '800',
    color: '#8B4513',
    fontSize: 18,
  },

  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
