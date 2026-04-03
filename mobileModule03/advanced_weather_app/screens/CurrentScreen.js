import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getWeatherIconName } from '../services/api';

export default function CurrentScreen({ current, location, loading }) {
  if (loading && !current) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f7f9ff" />
      </View>
    );
  }

  if (!current) {
    return (
      <View style={styles.centered}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyGlyph}>☁</Text>
          <Text style={styles.emptyTitle}>Waiting for weather data</Text>
          <Text style={styles.emptyText}>
            Search for a location or use GPS to display the current forecast.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>Current Weather</Text>
        <Text style={styles.location}>{location || 'Unknown location'}</Text>

        <View style={styles.heroCenter}>
          <View style={styles.iconBadge}>
            <Text style={styles.weatherGlyph}>
              {getWeatherIconName(current.weatherCode)}
            </Text>
          </View>

          <View style={styles.tempWrap}>
            <Text style={styles.temperature}>
              {Math.round(current.temperature)}
              {'\u00B0'}
            </Text>
            <Text style={styles.description}>{current.weatherDescription}</Text>
          </View>
        </View>

        <View style={styles.windPill}>
          <Text style={styles.windGlyph}>➜</Text>
          <Text style={styles.windText}>
            Wind speed: {Math.round(current.windSpeed)} km/h
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingBottom: 104,
    backgroundColor: 'transparent',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 104,
    backgroundColor: 'transparent',
  },

  heroCard: {
    borderRadius: 34,
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: 'rgba(7, 18, 34, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  eyebrow: {
    color: '#b7d8f6',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  location: {
    marginTop: 8,
    color: '#f8fbff',
    fontSize: 24,
    fontFamily: 'serif',
    textAlign: 'center',
  },

  heroCenter: {
    alignItems: 'center',
    marginTop: 26,
  },

  iconBadge: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 209, 102, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 209, 102, 0.28)',
  },

  weatherGlyph: {
    fontSize: 66,
    textAlign: 'center',
  },

  tempWrap: {
    alignItems: 'center',
    marginTop: 20,
  },

  temperature: {
    color: '#f8fbff',
    fontSize: 74,
    lineHeight: 82,
    fontWeight: '700',
  },

  description: {
    marginTop: 8,
    color: '#d8ebff',
    fontSize: 20,
    textAlign: 'center',
  },

  windPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 28,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(157, 201, 255, 0.12)',
  },

  windGlyph: {
    color: '#9fd6ff',
    fontSize: 22,
    fontWeight: '700',
  },

  windText: {
    color: '#f2f8ff',
    fontSize: 15,
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

  emptyGlyph: {
    fontSize: 42,
    color: '#cfe5ff',
  },

  emptyTitle: {
    marginTop: 14,
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
