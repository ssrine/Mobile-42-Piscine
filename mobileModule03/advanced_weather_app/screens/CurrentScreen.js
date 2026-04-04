import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CurrentScreen({ current, location, loading }) {
  if (loading && !current) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="rgba(220, 235, 255, 0.9)" />
        <Text style={styles.loadingText}>Fetching weather...</Text>
      </View>
    );
  }

  if (!current) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons
          name="weather-partly-cloudy"
          size={72}
          color="rgba(220, 235, 255, 0.4)"
        />
        <Text style={styles.message}>
          Allow GPS access or search for a city to display the current weather.
        </Text>
      </View>
    );
  }

  const locationParts = location ? location.split(', ') : [];
  const cityName = locationParts[0] || 'Unknown';
  const regionCountry = locationParts.slice(1).join(', ');

  return (
    <View style={styles.screen}>
      <View style={styles.locationCard}>
        <MaterialCommunityIcons name="map-marker" size={18} color="rgba(100, 180, 255, 0.9)" />
        <View style={styles.locationText}>
          <Text style={styles.cityName}>{cityName}</Text>
          {regionCountry ? (
            <Text style={styles.regionCountry}>{regionCountry}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.weatherCard}>
        <MaterialCommunityIcons
          name={current.weatherIcon || 'weather-cloudy'}
          size={90}
          color="rgba(255, 255, 255, 0.95)"
          style={styles.weatherIcon}
        />

        <Text style={styles.temperature}>
          {Math.round(current.temperature)}
          <Text style={styles.tempUnit}>°C</Text>
        </Text>

        <Text style={styles.description}>{current.weatherDescription}</Text>

        <View style={styles.divider} />

        <View style={styles.windRow}>
          <MaterialCommunityIcons name="weather-windy" size={22} color="rgba(220, 235, 255, 0.8)" />
          <Text style={styles.windText}>{current.windSpeed} km/h</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },

  loadingText: {
    color: 'rgba(220, 235, 255, 0.7)',
    fontSize: 15,
    marginTop: 8,
  },

  message: {
    textAlign: 'center',
    fontSize: 16,
    color: 'rgba(220, 235, 255, 0.7)',
    lineHeight: 24,
    marginTop: 12,
  },

  locationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 20,
    alignSelf: 'stretch',
  },

  locationText: {
    flex: 1,
  },

  cityName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  regionCountry: {
    color: 'rgba(190, 215, 240, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },

  weatherCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignSelf: 'stretch',
  },

  weatherIcon: {
    marginBottom: 12,
  },

  temperature: {
    fontSize: 76,
    fontWeight: '200',
    color: '#fff',
    lineHeight: 80,
  },

  tempUnit: {
    fontSize: 36,
    fontWeight: '300',
    color: 'rgba(220, 235, 255, 0.85)',
  },

  description: {
    fontSize: 20,
    color: 'rgba(220, 235, 255, 0.9)',
    marginTop: 8,
    fontWeight: '400',
    textAlign: 'center',
  },

  divider: {
    width: '60%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 20,
  },

  windRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  windText: {
    fontSize: 18,
    color: 'rgba(220, 235, 255, 0.85)',
    fontWeight: '500',
  },
});
