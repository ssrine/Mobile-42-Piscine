import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import ForecastChart from '../components/ForecastChart';
import { getWeatherIconName } from '../services/api';

const formatHour = (dateTime) => dateTime.split('T')[1]?.slice(0, 5) || dateTime;

export default function TodayScreen({ hourly, location, loading }) {
  if (loading && hourly.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f7f9ff" />
      </View>
    );
  }

  if (hourly.length === 0) {
    return (
      <View style={styles.centered}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>{"Today's weather is empty"}</Text>
          <Text style={styles.emptyText}>
            Search for a location to draw the temperature curve and hourly list.
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
        <Text style={styles.eyebrow}>Today</Text>
        <Text style={styles.location}>{location || 'Unknown location'}</Text>
        <Text style={styles.subtitle}>Hourly temperature curve and wind overview</Text>
      </View>

      <ForecastChart
        title="Temperature Curve"
        subtitle="Hours and temperatures for the current day"
        data={hourly}
        labelExtractor={(item) => formatHour(item.time)}
        maxLabels={8}
        pointSpacing={54}
        series={[
          {
            key: 'temperature',
            label: 'Temperature',
            color: '#ffd166',
            thickness: 3,
          },
        ]}
      />

      <View style={styles.listCard}>
        <Text style={styles.listTitle}>Hourly Breakdown</Text>

        {hourly.map((hour) => (
          <View key={hour.time} style={styles.row}>
            <Text style={styles.time}>{formatHour(hour.time)}</Text>

            <View style={styles.weatherWrap}>
              <View style={styles.iconShell}>
                <Text style={styles.weatherGlyph}>
                  {getWeatherIconName(hour.weatherCode)}
                </Text>
              </View>
              <View style={styles.metaWrap}>
                <Text style={styles.temperature}>
                  {Math.round(hour.temperature)}
                  {'\u00B0C'}
                </Text>
                <Text style={styles.description}>{hour.weatherDescription}</Text>
              </View>
            </View>

            <Text style={styles.wind}>{Math.round(hour.windSpeed)} km/h</Text>
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

  time: {
    width: 52,
    color: '#d8e7f7',
    fontSize: 14,
    fontWeight: '700',
  },

  weatherWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
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

  metaWrap: {
    flex: 1,
    marginLeft: 12,
  },

  temperature: {
    color: '#f8fbff',
    fontSize: 16,
    fontWeight: '700',
  },

  description: {
    marginTop: 2,
    color: '#bfd5ea',
    fontSize: 13,
  },

  wind: {
    width: 72,
    color: '#d8e7f7',
    fontSize: 13,
    textAlign: 'right',
    fontWeight: '600',
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
