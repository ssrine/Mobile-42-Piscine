import React, { useLayoutEffect } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

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

const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function EntryDetailScreen({ route, navigation }) {
  const { entry } = route.params;
  const feelingIconName = FEELING_ICONS[entry.feeling] || 'notebook-outline';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={styles.headerDeleteBtn} hitSlop={8}>
          <MaterialCommunityIcons name="trash-can-outline" size={22} color="#8B4513" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete "${entry.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'entries', entry.id));
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Could not delete entry. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{entry.title}</Text>

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="calendar-outline" size={16} color="#9E7E6A" />
            <Text style={styles.metaText}>{formatDate(entry.date)}</Text>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaRow}>
            <MaterialCommunityIcons name={feelingIconName} size={16} color="#9E7E6A" />
            <Text style={styles.metaText}>Feeling {entry.feeling}</Text>
          </View>

          {entry.email ? (
            <>
              <View style={styles.metaDivider} />
              <View style={styles.metaRow}>
                <MaterialCommunityIcons name="account-outline" size={16} color="#9E7E6A" />
                <Text style={styles.metaText}>{entry.email}</Text>
              </View>
            </>
          ) : null}
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.contentText}>{entry.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  headerDeleteBtn: {
    marginRight: 4,
    padding: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D2B1F',
    lineHeight: 36,
    marginBottom: 16,
  },

  metaCard: {
    backgroundColor: '#FFFDF5',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EDD9BE',
    gap: 10,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  metaDivider: {
    height: 1,
    backgroundColor: '#EDD9BE',
  },

  metaText: {
    fontSize: 14,
    color: '#6E5040',
    fontWeight: '500',
    flex: 1,
  },

  contentCard: {
    backgroundColor: '#FFFDF5',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EDD9BE',
  },

  contentText: {
    fontSize: 16,
    color: '#3D2B1F',
    lineHeight: 28,
  },
});
