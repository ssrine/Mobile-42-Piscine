import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const formatCoordinates = (coords) => {
  if (!coords) {
    return '';
  }

  return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
};

export default function CurrentScreen({
  current,
  location,
  coordinates,
  loading,
}) {
  if (loading && !current) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!current) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>
          Allow GPS access or search for a city to display the current weather.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.location}>{location || 'Unknown location'}</Text>

      {coordinates ? (
        <Text style={styles.coordinates}>
          Coordinates: {formatCoordinates(coordinates)}
        </Text>
      ) : null}

      <Text style={styles.temp}>
        {current.temperature}
        {'\u00B0C'}
      </Text>
      <Text style={styles.desc}>{current.weatherDescription}</Text>
      <Text style={styles.wind}>Wind: {current.windSpeed} km/h</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 8,
    textAlign: 'center',
  },

  coordinates: {
    fontSize: 13,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },

  temp: {
    fontSize: 52,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  desc: {
    fontSize: 20,
    marginTop: 8,
    marginBottom: 10,
    textAlign: 'center',
  },

  wind: {
    fontSize: 17,
    textAlign: 'center',
  },

  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
  },
});
