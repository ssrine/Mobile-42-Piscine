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
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import DiaryEntryCard from '../components/DiaryEntryCard';

export default function AgendaScreen({ navigation, user }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [entries, setEntries] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const q = query(
      collection(db, 'entries'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAllEntries(data);

        const marked = {};
        data.forEach((entry) => {
          const dateStr = entry.date.split('T')[0];
          marked[dateStr] = {
            marked: true,
            dotColor: '#8B4513',
            selectedColor: '#D2A679',
            selectedTextColor: '#fff',
          };
        });
        marked[selectedDate] = {
          selected: true,
          selectedColor: '#8B4513',
          selectedTextColor: '#fff',
          marked: marked[selectedDate]?.marked || false,
          dotColor: marked[selectedDate]?.dotColor || '#8B4513',
        };
        setMarkedDates(marked);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user.uid]);

  useEffect(() => {
    const dateStr = selectedDate.split('T')[0];
    const filtered = allEntries
      .filter((entry) => entry.date.split('T')[0] === dateStr)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    setEntries(filtered);
  }, [selectedDate, allEntries]);

  const handleDelete = async (entryId) => {
    try {
      await deleteDoc(doc(db, 'entries', entryId));
    } catch {
      Alert.alert('Error', 'Could not delete entry. Please try again.');
    }
  };

  const handleDayPress = (day) => {
    const newMarked = { ...markedDates };
    Object.keys(newMarked).forEach((date) => {
      newMarked[date] = { ...newMarked[date], selected: false };
    });
    newMarked[day.dateString] = {
      ...newMarked[day.dateString],
      selected: true,
      selectedColor: '#8B4513',
      selectedTextColor: '#fff',
      marked: newMarked[day.dateString]?.marked || false,
      dotColor: newMarked[day.dateString]?.dotColor || undefined,
    };
    setMarkedDates(newMarked);
    setSelectedDate(day.dateString);
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="calendar-blank-outline" size={60} color="#D4A87A" />
        <Text style={styles.emptyTitle}>No entries for this date</Text>
        <Text style={styles.emptySubtitle}>Select another date or create a new entry.</Text>
      </View>
    );
  };

  const displayDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agenda</Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#FFF8F0',
            calendarBackground: '#FFF8F0',
            textSectionTitleColor: '#8B4513',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: '#8B4513',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#8B4513',
            todayBackgroundColor: '#FFF0DF',
            dayTextColor: '#2d3436',
            textDisabledColor: '#d9e1e8',
            dotColor: '#8B4513',
            selectedDotColor: '#ffffff',
            monthTextColor: '#3D2B1F',
            textDayFontFamily: 'System',
            textMonthFontSize: 18,
            textMonthFontWeight: 'bold',
            textDayHeaderFontSize: 12,
          }}
        />
      </View>

      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{displayDate}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDD9BE',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D2B1F',
  },
  calendarContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDD9BE',
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
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
    paddingBottom: 20,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#3D2B1F',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9E7E6A',
    textAlign: 'center',
    lineHeight: 20,
  },
});
