import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
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

const FEELING_ICONS = {
  Happy: 'emoticon-happy-outline',
  Sad: 'emoticon-sad-outline',
  Excited: 'emoticon-excited-outline',
  Anxious: 'emoticon-confused-outline',
  Calm: 'emoticon-cool-outline',
  Grateful: 'hand-heart-outline',
  Frustrated: 'emoticon-angry-outline',
  Tired: 'sleep',
};

const FEELING_COLORS = {
  Happy: '#F4A261',
  Sad: '#74B3CE',
  Excited: '#E76F51',
  Anxious: '#A8DADC',
  Calm: '#81B29A',
  Grateful: '#F1FAEE',
  Frustrated: '#E63946',
  Tired: '#B5B5B5',
};

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
      () => setLoading(false)
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
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out?')) signOut(auth);
      return;
    }
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut(auth) },
    ]);
  };

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const lastTwoEntries = entries.slice(0, 2);
  const totalEntries = entries.length;

  const feelingStats = () => {
    if (entries.length === 0) return [];
    const counts = {};
    entries.forEach((e) => {
      counts[e.feeling] = (counts[e.feeling] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([feeling, count]) => ({
        feeling,
        count,
        percentage: Math.round((count / entries.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  };

  const feelingPercentages = feelingStats();
  const topFeeling = feelingPercentages[0];

  // Get streak (consecutive days with entries from today going back)
  const getStreak = () => {
    if (entries.length === 0) return 0;
    const dates = [...new Set(entries.map((e) => e.date.split('T')[0]))].sort(
      (a, b) => new Date(b) - new Date(a)
    );
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let check = today;
    for (const date of dates) {
      if (date === check) {
        streak++;
        const d = new Date(check);
        d.setDate(d.getDate() - 1);
        check = d.toISOString().split('T')[0];
      } else break;
    }
    return streak;
  };

  const streak = getStreak();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.greet}>Welcome back</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {user.email}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} hitSlop={8}>
          <MaterialCommunityIcons name="logout-variant" size={20} color="#8B4513" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B4513" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Stats Row ── */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.statCardPrimary]}>
              <MaterialCommunityIcons name="notebook-multiple" size={22} color="#fff" />
              <Text style={styles.statNumberWhite}>{totalEntries}</Text>
              <Text style={styles.statLabelWhite}>Entries</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons name="fire" size={22} color="#E76F51" />
              <Text style={styles.statNumber}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name={topFeeling ? FEELING_ICONS[topFeeling.feeling] || 'emoticon-outline' : 'emoticon-outline'}
                size={22}
                color="#8B4513"
              />
              <Text style={styles.statNumber} numberOfLines={1}>
                {topFeeling ? topFeeling.feeling : '—'}
              </Text>
              <Text style={styles.statLabel}>Top Mood</Text>
            </View>
          </View>

          {/* ── Recent Entries ── */}
          {lastTwoEntries.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Entries</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('NewEntry')}
                  hitSlop={8}
                >
                  <Text style={styles.sectionAction}>+ New</Text>
                </TouchableOpacity>
              </View>
              {lastTwoEntries.map((entry) => (
                <DiaryEntryCard
                  key={entry.id}
                  entry={entry}
                  onPress={() => navigation.navigate('EntryDetail', { entry })}
                  onDelete={handleDelete}
                />
              ))}
            </View>
          )}

          {/* ── Mood Breakdown ── */}
          {feelingPercentages.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Mood Breakdown</Text>
                <Text style={styles.sectionMeta}>{totalEntries} total</Text>
              </View>
              <View style={styles.moodCard}>
                {feelingPercentages.map((item) => (
                  <View key={item.feeling} style={styles.moodRow}>
                    <View style={styles.moodLeft}>
                      <View
                        style={[
                          styles.moodIconBg,
                          { backgroundColor: (FEELING_COLORS[item.feeling] || '#E8C9A0') + '33' },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={FEELING_ICONS[item.feeling] || 'notebook-outline'}
                          size={16}
                          color={FEELING_COLORS[item.feeling] || '#8B4513'}
                        />
                      </View>
                      <Text style={styles.moodName}>{item.feeling}</Text>
                    </View>
                    <View style={styles.moodRight}>
                      <View style={styles.progressBg}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${item.percentage}%`,
                              backgroundColor: FEELING_COLORS[item.feeling] || '#8B4513',
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.moodPct}>{item.percentage}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Empty State ── */}
          {entries.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBg}>
                <MaterialCommunityIcons name="book-open-outline" size={52} color="#C4996A" />
              </View>
              <Text style={styles.emptyTitle}>Start your journey</Text>
              <Text style={styles.emptySubtitle}>
                Tap the <Text style={styles.emptyHighlight}>+</Text> button below to write your first diary entry.
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* ── FAB ── */}
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

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EDD9BE',
    backgroundColor: '#FFF8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D2A679',
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  headerInfo: {
    flex: 1,
  },
  greet: {
    fontSize: 11,
    color: '#B09080',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3D2B1F',
    maxWidth: 200,
    marginTop: 1,
  },
  email: {
    fontSize: 12,
    color: '#9E7E6A',
    marginTop: 1,
  },
  logoutBtn: {
    padding: 10,
    backgroundColor: '#FFF0DF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EDD9BE',
  },

  /* Content */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 130,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFDF5',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDD9BE',
    gap: 4,
  },
  statCardPrimary: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  statNumberWhite: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  statLabelWhite: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3D2B1F',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#9E7E6A',
    fontWeight: '600',
    textAlign: 'center',
  },

  /* Sections */
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#3D2B1F',
    letterSpacing: -0.2,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B4513',
  },
  sectionMeta: {
    fontSize: 12,
    color: '#B09080',
    fontWeight: '500',
  },

  /* Mood card */
  moodCard: {
    backgroundColor: '#FFFDF5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EDD9BE',
    gap: 14,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  moodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 110,
  },
  moodIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3D2B1F',
  },
  moodRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBg: {
    flex: 1,
    height: 7,
    backgroundColor: '#EDD9BE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  moodPct: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B4513',
    minWidth: 34,
    textAlign: 'right',
  },

  /* Empty */
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
    gap: 12,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#FFF0DF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EDD9BE',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3D2B1F',
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

  /* FAB */
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
