import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import ForecastChart from '../components/ForecastChart';
import { getWeatherIconName } from '../services/api';

const formatDay = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
  });

const formatLongDay = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

export default function WeeklyScreen({ daily, location, loading }) {
  if (loading && daily.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f7f9ff" />
      </View>
    );
  }

  if (daily.length === 0) {
    return (
      <View style={styles.centered}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Weekly weather is empty</Text>
          <Text style={styles.emptyText}>
            Search for a location to display the 7-day min and max curves.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.eyebrow}>Weekly</Text>
        <Text style={styles.location}>{location || 'Unknown location'}</Text>
        <Text style={styles.subtitle}>
          Minimum and maximum temperatures for the next seven days
        </Text>
      </View>

      <ForecastChart
        title="Weekly Curves"
        subtitle="Min and max temperatures across the week"
        data={daily}
        labelExtractor={(item) => formatDay(item.date)}
        maxLabels={7}
        pointSpacing={74}
        series={[
          {
            key: 'minTemperature',
            label: 'Min',
            color: '#8ce6c4',
            thickness: 3,
          },
          {
            key: 'maxTemperature',
            label: 'Max',
            color: '#ffd166',
            thickness: 3,
          },
        ]}
      />

      <View style={styles.listCard}>
        <Text style={styles.listTitle}>7-Day Breakdown</Text>

        {daily.map((day) => (
          <View key={day.date} style={styles.row}>
            <View style={styles.dayBlock}>
              <Text style={styles.dayName}>{formatLongDay(day.date)}</Text>
              <Text style={styles.dayDescription}>{day.weatherDescription}</Text>
            </View>

            <View style={styles.iconShell}>
              <Text style={styles.weatherGlyph}>
                {getWeatherIconName(day.weatherCode)}
              </Text>
            </View>

            <View style={styles.tempBlock}>
              <Text style={styles.maxTemp}>
                {Math.round(day.maxTemperature)}
                {'\u00B0C'}
              </Text>
              <Text style={styles.minTemp}>
                {Math.round(day.minTemperature)}
                {'\u00B0C'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 112,
    gap: 16,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 104,
    backgroundColor: 'transparent',
  },

  headerCard: {
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(7, 18, 34, 0.68)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  eyebrow: {
    color: '#b7d8f6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  location: {
    marginTop: 8,
    color: '#f8fbff',
    fontSize: 24,
    fontFamily: 'serif',
  },

  subtitle: {
    marginTop: 6,
    color: '#c5dbee',
    fontSize: 14,
    lineHeight: 20,
  },

  listCard: {
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: 'rgba(7, 18, 34, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  listTitle: {
    color: '#f8fbff',
    fontSize: 18,
    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },

  dayBlock: {
    flex: 1,
    paddingRight: 12,
  },

  dayName: {
    color: '#f7fbff',
    fontSize: 15,
    fontWeight: '700',
  },

  dayDescription: {
    marginTop: 3,
    color: '#bfd5ea',
    fontSize: 13,
  },

  iconShell: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 209, 102, 0.12)',
  },

  weatherGlyph: {
    fontSize: 22,
    textAlign: 'center',
  },

  tempBlock: {
    width: 72,
    marginLeft: 12,
    alignItems: 'flex-end',
  },

  maxTemp: {
    color: '#ffe08a',
    fontSize: 15,
    fontWeight: '700',
  },

  minTemp: {
    marginTop: 4,
    color: '#9de4ca',
    fontSize: 14,
    fontWeight: '700',
  },

  emptyCard: {
    width: '100%',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    backgroundColor: 'rgba(7, 18, 34, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  emptyTitle: {
    color: '#f7fbff',
    fontSize: 22,
    fontFamily: 'serif',
  },

  emptyText: {
    marginTop: 10,
    color: '#c5dbee',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
