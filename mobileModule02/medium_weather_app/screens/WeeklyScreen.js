import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const formatDay = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

export default function WeeklyScreen({ daily, location, loading }) {
  if (loading && daily.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (daily.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>
          Search for a city to display the weekly forecast.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.location}>{location || 'Unknown location'}</Text>

      {daily.map((day) => (
        <View key={day.date} style={styles.dayRow}>
          <View style={styles.dayInfo}>
            <Text style={styles.date}>{formatDay(day.date)}</Text>
            <Text style={styles.description}>{day.weatherDescription}</Text>
          </View>

          <Text style={styles.temps}>
            {day.minTemperature}
            {'\u00B0C'} / {day.maxTemperature}
            {'\u00B0C'}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    padding: 16,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },

  location: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },

  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 12,
  },

  dayInfo: {
    flex: 1,
  },

  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },

  description: {
    marginTop: 2,
    color: '#555',
  },

  temps: {
    color: '#2c3e50',
    fontWeight: '600',
  },

  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
  },
});
