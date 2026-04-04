import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function DiaryEntryCard({ entry, onPress, onDelete }) {
  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete "${entry.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(entry.id) },
      ]
    );
  };

  const feelingIconName = FEELING_ICONS[entry.feeling] || 'notebook-outline';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.cardTop}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {entry.title}
          </Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} hitSlop={12}>
            <MaterialCommunityIcons name="trash-can-outline" size={19} color="#C9956A" />
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
          <View style={styles.feeling}>
            <MaterialCommunityIcons name={feelingIconName} size={14} color="#8B4513" />
            <Text style={styles.feelingLabel}>{entry.feeling}</Text>
          </View>
        </View>
      </View>

      {entry.content ? (
        <Text style={styles.preview} numberOfLines={2}>
          {entry.content}
        </Text>
      ) : null}

      <View style={styles.readMore}>
        <Text style={styles.readMoreText}>Read more</Text>
        <MaterialCommunityIcons name="chevron-right" size={16} color="#B08060" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFDF5',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDD9BE',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },

  cardTop: {
    marginBottom: 8,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#3D2B1F',
    marginRight: 8,
  },

  deleteBtn: {
    padding: 4,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  date: {
    fontSize: 12,
    color: '#9E7E6A',
    fontWeight: '500',
  },

  feeling: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF0DF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },

  feelingLabel: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '600',
  },

  preview: {
    fontSize: 14,
    color: '#6E5040',
    lineHeight: 20,
    marginBottom: 10,
  },

  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  readMoreText: {
    fontSize: 12,
    color: '#B08060',
    fontWeight: '600',
  },
});
