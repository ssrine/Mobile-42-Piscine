import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const formatHour = (dateTime) => dateTime.split('T')[1]?.slice(0, 5) || dateTime;

export default function TodayScreen({ hourly, location, loading }) {
  if (loading && hourly.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (hourly.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>
          {"Search for a city to display today's hourly weather."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.location}>{location || 'Unknown location'}</Text>

      {hourly.map((hour) => (
        <View key={hour.time} style={styles.hourRow}>
          <Text style={styles.time}>{formatHour(hour.time)}</Text>
          <View style={styles.details}>
            <Text style={styles.temperature}>
              {hour.temperature}
              {'\u00B0C'}
            </Text>
            <Text style={styles.description}>{hour.weatherDescription}</Text>
          </View>
          <Text style={styles.wind}>{hour.windSpeed} km/h</Text>
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

  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  time: {
    width: 56,
    fontWeight: '600',
    color: '#2c3e50',
  },

  details: {
    flex: 1,
    marginHorizontal: 12,
  },

  temperature: {
    fontSize: 16,
    fontWeight: '600',
  },

  description: {
    marginTop: 2,
    color: '#555',
  },

  wind: {
    width: 74,
    textAlign: 'right',
    color: '#2c3e50',
  },

  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
  },
});
