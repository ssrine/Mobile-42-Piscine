import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const CHART_CONFIG = {
  backgroundColor: 'transparent',
  backgroundGradientFrom: 'rgba(15, 32, 39, 0.6)',
  backgroundGradientTo: 'rgba(44, 83, 100, 0.6)',
  backgroundGradientFromOpacity: 1,
  backgroundGradientToOpacity: 1,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(220, 235, 255, ${opacity})`,
  strokeWidth: 2.5,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: 'rgba(255, 255, 255, 0.9)',
  },
  propsForBackgroundLines: {
    strokeDasharray: '4, 6',
    stroke: 'rgba(255, 255, 255, 0.15)',
  },
};

export default function ForecastChart({ labels, datasets, title, withLegend }) {
  if (!labels || labels.length < 2) {
    return null;
  }

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <LineChart
        data={{ labels, datasets, legend: withLegend }}
        width={screenWidth - 32}
        height={190}
        yAxisSuffix="°"
        chartConfig={CHART_CONFIG}
        bezier
        withInnerLines
        withOuterLines={false}
        withLegend={!!withLegend}
        style={styles.chart}
        fromZero={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  title: {
    color: 'rgba(220, 235, 255, 0.9)',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: 10,
    letterSpacing: 0.5,
  },

  chart: {
    borderRadius: 18,
  },
});
