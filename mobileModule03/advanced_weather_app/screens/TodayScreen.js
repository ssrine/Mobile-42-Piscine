import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ForecastChart from '../components/ForecastChart';

const formatHour = (dateTime) => dateTime.split('T')[1]?.slice(0, 5) || dateTime;
const formatHourShort = (dateTime) => dateTime.split('T')[1]?.slice(0, 2) + 'h' || '';

export default function TodayScreen({ hourly, location, loading }) {
  const chartData = useMemo(() => {
    if (hourly.length < 2) return null;

    const step = Math.max(1, Math.ceil(hourly.length / 8));
    const sampled = hourly.filter((_, i) => i % step === 0);

    return {
      labels: sampled.map((h) => formatHourShort(h.time)),
      datasets: [
        {
          data: sampled.map((h) => h.temperature),
          color: (opacity = 1) => `rgba(100, 200, 255, ${opacity})`,
          strokeWidth: 2.5,
        },
      ],
    };
  }, [hourly]);

  if (loading && hourly.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="rgba(220, 235, 255, 0.9)" />
        <Text style={styles.loadingText}>Fetching today's forecast...</Text>
      </View>
    );
  }

  if (hourly.length === 0) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons
          name="calendar-today"
          size={72}
          color="rgba(220, 235, 255, 0.4)"
        />
        <Text style={styles.message}>
          {"Search for a city to display today's hourly weather."}
        </Text>
      </View>
    );
  }

  const locationParts = location ? location.split(', ') : [];
  const cityName = locationParts[0] || 'Unknown';
  const regionCountry = locationParts.slice(1).join(', ');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.locationCard}>
        <MaterialCommunityIcons name="map-marker" size={16} color="rgba(100, 180, 255, 0.9)" />
        <View>
          <Text style={styles.cityName}>{cityName}</Text>
          {regionCountry ? (
            <Text style={styles.regionCountry}>{regionCountry}</Text>
          ) : null}
        </View>
      </View>

      {chartData ? (
        <ForecastChart
          labels={chartData.labels}
          datasets={chartData.datasets}
          title="Temperature curve for today"
        />
      ) : null}

      <View style={styles.listCard}>
        {hourly.map((hour, index) => (
          <View
            key={hour.time}
            style={[
              styles.hourRow,
              index === hourly.length - 1 && styles.hourRowLast,
            ]}
          >
            <Text style={styles.time}>{formatHour(hour.time)}</Text>

            <MaterialCommunityIcons
              name={hour.weatherIcon || 'weather-cloudy'}
              size={26}
              color="rgba(220, 235, 255, 0.9)"
              style={styles.rowIcon}
            />

            <Text style={styles.temperature}>
              {Math.round(hour.temperature)}°C
            </Text>

            <View style={styles.windCell}>
              <MaterialCommunityIcons
                name="weather-windy"
                size={14}
                color="rgba(190, 215, 240, 0.7)"
              />
              <Text style={styles.wind}>{hour.windSpeed} km/h</Text>
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
  },

  content: {
    paddingTop: 14,
    paddingBottom: 24,
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
    marginHorizontal: 16,
    marginBottom: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },

  cityName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  regionCountry: {
    color: 'rgba(190, 215, 240, 0.75)',
    fontSize: 13,
    marginTop: 1,
  },

  listCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },

  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    gap: 10,
  },

  hourRowLast: {
    borderBottomWidth: 0,
  },

  time: {
    width: 52,
    fontWeight: '600',
    color: 'rgba(190, 215, 240, 0.9)',
    fontSize: 14,
  },

  rowIcon: {
    width: 32,
  },

  temperature: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  windCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 80,
    justifyContent: 'flex-end',
  },

  wind: {
    color: 'rgba(190, 215, 240, 0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
});
