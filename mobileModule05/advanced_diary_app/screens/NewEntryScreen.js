import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const FEELINGS = [
  { label: 'Happy', icon: 'emoticon-happy-outline' },
  { label: 'Sad', icon: 'emoticon-sad-outline' },
  { label: 'Excited', icon: 'emoticon-excited-outline' },
  { label: 'Anxious', icon: 'emoticon-confused-outline' },
  { label: 'Calm', icon: 'emoticon-cool-outline' },
  { label: 'Grateful', icon: 'hand-heart-outline' },
  { label: 'Frustrated', icon: 'emoticon-angry-outline' },
  { label: 'Tired', icon: 'sleep' },
];

const formatDateDisplay = (date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export default function NewEntryScreen({ navigation, user }) {
  const [title, setTitle] = useState('');
  const [feeling, setFeeling] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const today = new Date();

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please give your entry a title.');
      return;
    }
    if (!feeling) {
      Alert.alert('Missing feeling', 'Please select how you feel today.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Missing content', 'Please write something in your entry.');
      return;
    }

    setSaving(true);
    // Navigate back immediately — Firestore will sync in background
    navigation.goBack();
    try {
      await addDoc(collection(db, 'entries'), {
        userId: user.uid,
        email: user.email,
        date: today.toISOString(),
        title: title.trim(),
        feeling,
        content: content.trim(),
      });
    } catch {
      Alert.alert('Error', 'Could not save entry. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <MaterialCommunityIcons name="close" size={22} color="#8B4513" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>New Entry</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.dateRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#9E7E6A" />
            <Text style={styles.dateText}>{formatDateDisplay(today)}</Text>
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder="Entry title..."
            placeholderTextColor="#C4A080"
            value={title}
            onChangeText={setTitle}
            maxLength={80}
            returnKeyType="next"
          />

          <Text style={styles.sectionLabel}>How are you feeling?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.feelingsScroll}
            contentContainerStyle={styles.feelingsContent}
          >
            {FEELINGS.map((f) => (
              <TouchableOpacity
                key={f.label}
                style={[
                  styles.feelingChip,
                  feeling === f.label && styles.feelingChipSelected,
                ]}
                onPress={() => setFeeling(f.label)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={f.icon}
                  size={18}
                  color={feeling === f.label ? '#fff' : '#8B4513'}
                />
                <Text
                  style={[
                    styles.feelingChipLabel,
                    feeling === f.label && styles.feelingChipLabelSelected,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionLabel}>What's on your mind?</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Write your thoughts, feelings, and memories here..."
            placeholderTextColor="#C4A080"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },

  flex: {
    flex: 1,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDD9BE',
  },

  cancelBtn: {
    padding: 6,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3D2B1F',
  },

  saveBtn: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },

  saveBtnDisabled: {
    opacity: 0.5,
  },

  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },

  dateText: {
    color: '#9E7E6A',
    fontSize: 14,
    fontWeight: '500',
  },

  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3D2B1F',
    borderBottomWidth: 1.5,
    borderBottomColor: '#EDD9BE',
    paddingBottom: 12,
    marginBottom: 24,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9E7E6A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  feelingsScroll: {
    marginBottom: 24,
    marginHorizontal: -20,
  },

  feelingsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },

  feelingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: '#FFF0DF',
    borderWidth: 1.5,
    borderColor: '#EDD9BE',
  },

  feelingChipSelected: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },

  feelingChipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
  },

  feelingChipLabelSelected: {
    color: '#fff',
  },

  contentInput: {
    fontSize: 16,
    color: '#3D2B1F',
    lineHeight: 26,
    minHeight: 200,
    backgroundColor: '#FFFDF5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDD9BE',
    padding: 16,
  },
});
