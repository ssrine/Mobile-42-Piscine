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

const formatDay = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

const formatDayShort = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' });

export default function WeeklyScreen({ daily, location, loading }) {
  const chartData = useMemo(() => {
    if (daily.length < 2) return null;

    return {
      labels: daily.map((d) => formatDayShort(d.date)),
      datasets: [
        {
          data: daily.map((d) => d.minTemperature),
          color: (opacity = 1) => `rgba(74, 195, 247, ${opacity})`,
          strokeWidth: 2.5,
        },
        {
          data: daily.map((d) => d.maxTemperature),
          color: (opacity = 1) => `rgba(255, 112, 67, ${opacity})`,
          strokeWidth: 2.5,
        },
      ],
      legend: ['Min', 'Max'],
    };
  }, [daily]);

  if (loading && daily.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="rgba(220, 235, 255, 0.9)" />
        <Text style={styles.loadingText}>Fetching weekly forecast...</Text>
      </View>
    );
  }

  if (daily.length === 0) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons
          name="calendar-week"
          size={72}
          color="rgba(220, 235, 255, 0.4)"
        />
        <Text style={styles.message}>
          Search for a city to display the weekly forecast.
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
          title="Min / Max temperature for the week"
          withLegend={chartData.legend}
        />
      ) : null}

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(74, 195, 247, 0.9)' }]} />
          <Text style={styles.legendLabel}>Min temp</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(255, 112, 67, 0.9)' }]} />
          <Text style={styles.legendLabel}>Max temp</Text>
        </View>
      </View>

      <View style={styles.listCard}>
        {daily.map((day, index) => (
          <View
            key={day.date}
            style={[
              styles.dayRow,
              index === daily.length - 1 && styles.dayRowLast,
            ]}
          >
            <Text style={styles.dayName}>{formatDay(day.date)}</Text>

            <MaterialCommunityIcons
              name={day.weatherIcon || 'weather-cloudy'}
              size={26}
              color="rgba(220, 235, 255, 0.9)"
              style={styles.rowIcon}
            />

            <View style={styles.tempsCell}>
              <Text style={styles.minTemp}>
                {Math.round(day.minTemperature)}°
              </Text>
              <Text style={styles.tempSep}>/</Text>
              <Text style={styles.maxTemp}>
                {Math.round(day.maxTemperature)}°
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

  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 4,
    marginBottom: 4,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendLabel: {
    color: 'rgba(190, 215, 240, 0.8)',
    fontSize: 13,
    fontWeight: '500',
  },

  listCard: {
    marginHorizontal: 16,
    marginTop: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },

  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    gap: 10,
  },

  dayRowLast: {
    borderBottomWidth: 0,
  },

  dayName: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  rowIcon: {
    width: 32,
  },

  tempsCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 90,
    justifyContent: 'flex-end',
  },

  minTemp: {
    color: 'rgba(74, 195, 247, 0.95)',
    fontSize: 15,
    fontWeight: '600',
  },

  tempSep: {
    color: 'rgba(220, 235, 255, 0.4)',
    fontSize: 14,
  },

  maxTemp: {
    color: 'rgba(255, 112, 67, 0.95)',
    fontSize: 15,
    fontWeight: '600',
  },
});
