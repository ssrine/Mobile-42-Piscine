import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const CHART_HEIGHT = 230;
const CHART_PADDING = {
  top: 24,
  right: 18,
  bottom: 40,
  left: 34,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getDisplayStep = (length, maxLabels) => {
  if (length <= maxLabels) {
    return 1;
  }

  return Math.ceil(length / maxLabels);
};

const buildYAxisLabels = (minValue, maxValue, count = 4) => {
  if (count < 2) {
    return [maxValue];
  }

  return Array.from({ length: count }, (_, index) => {
    const ratio = index / (count - 1);
    const value = maxValue - (maxValue - minValue) * ratio;
    return Math.round(value);
  });
};

export default function ForecastChart({
  title,
  subtitle,
  data,
  series,
  labelExtractor,
  pointSpacing = 56,
  maxLabels = 8,
}) {
  const [layoutWidth, setLayoutWidth] = useState(0);

  const chartMetrics = useMemo(() => {
    const safeWidth = Math.max(layoutWidth, 280);
    const values = data.flatMap((item) =>
      series
        .map((entry) => item[entry.key])
        .filter((value) => typeof value === 'number')
    );

    const minValue = values.length > 0 ? Math.min(...values) : 0;
    const maxValue = values.length > 0 ? Math.max(...values) : 0;
    const padding = Math.max(2, Math.ceil((maxValue - minValue) * 0.18));
    const paddedMin = minValue - padding;
    const paddedMax = maxValue + padding;
    const valueRange = Math.max(1, paddedMax - paddedMin);
    const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
    const minPlotWidth =
      CHART_PADDING.left +
      CHART_PADDING.right +
      Math.max(0, data.length - 1) * pointSpacing;
    const plotWidth = Math.max(safeWidth - 18, minPlotWidth);
    const xRange = Math.max(1, plotWidth - CHART_PADDING.left - CHART_PADDING.right);

    const pointsBySeries = series.map((entry) => ({
      ...entry,
      points: data.map((item, index) => {
        const x =
          CHART_PADDING.left +
          (data.length === 1 ? xRange / 2 : (index / (data.length - 1)) * xRange);
        const value = item[entry.key];
        const y =
          CHART_PADDING.top +
          ((paddedMax - value) / valueRange) * plotHeight;

        return {
          x,
          y: clamp(y, CHART_PADDING.top, CHART_PADDING.top + plotHeight),
          value,
          label: labelExtractor(item, index),
          key: `${entry.key}-${index}`,
        };
      }),
    }));

    return {
      plotWidth,
      plotHeight,
      paddedMin,
      paddedMax,
      yLabels: buildYAxisLabels(paddedMin, paddedMax),
      pointsBySeries,
      xLabelStep: getDisplayStep(data.length, maxLabels),
    };
  }, [data, labelExtractor, layoutWidth, maxLabels, pointSpacing, series]);

  if (data.length === 0) {
    return null;
  }

  return (
    <View
      style={styles.card}
      onLayout={(event) => setLayoutWidth(event.nativeEvent.layout.width)}
    >
      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {series.length > 1 ? (
          <View style={styles.legendRow}>
            {series.map((entry) => (
              <View key={entry.key} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: entry.color }]}
                />
                <Text style={styles.legendLabel}>{entry.label}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chartScrollContent}
      >
        <View style={[styles.chartCanvas, { width: chartMetrics.plotWidth }]}>
          {chartMetrics.yLabels.map((value, index) => {
            const ratio =
              chartMetrics.yLabels.length === 1
                ? 0
                : index / (chartMetrics.yLabels.length - 1);
            const y = CHART_PADDING.top + ratio * chartMetrics.plotHeight;

            return (
              <View
                key={`grid-${value}-${index}`}
                style={[styles.gridRow, { top: y }]}
              >
                <Text style={styles.yAxisLabel}>
                  {value}
                  {'\u00B0'}
                </Text>
                <View style={styles.gridLine} />
              </View>
            );
          })}

          {chartMetrics.pointsBySeries.map((entry) =>
            entry.points.map((point, index) => {
              if (index === entry.points.length - 1) {
                return null;
              }

              const nextPoint = entry.points[index + 1];
              const dx = nextPoint.x - point.x;
              const dy = nextPoint.y - point.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx);

              return (
                <View
                  key={`segment-${entry.key}-${index}`}
                  style={[
                    styles.segment,
                    {
                      width: length,
                      height: entry.thickness || 3,
                      left: (point.x + nextPoint.x) / 2 - length / 2,
                      top:
                        (point.y + nextPoint.y) / 2 -
                        (entry.thickness || 3) / 2,
                      backgroundColor: entry.color,
                      transform: [{ rotate: `${angle}rad` }],
                    },
                  ]}
                />
              );
            })
          )}

          {chartMetrics.pointsBySeries.map((entry) =>
            entry.points.map((point) => (
              <View
                key={point.key}
                style={[
                  styles.point,
                  {
                    left: point.x - 5,
                    top: point.y - 5,
                    backgroundColor: entry.color,
                    borderColor: 'rgba(5, 13, 25, 0.92)',
                  },
                ]}
              />
            ))
          )}

          {chartMetrics.pointsBySeries[0].points.map((point, index) => {
            const shouldDisplay =
              index % chartMetrics.xLabelStep === 0 ||
              index === chartMetrics.pointsBySeries[0].points.length - 1;

            if (!shouldDisplay) {
              return null;
            }

            return (
              <Text
                key={`xlabel-${index}`}
                style={[styles.xAxisLabel, { left: point.x - 20 }]}
              >
                {point.label}
              </Text>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: 18,
    backgroundColor: 'rgba(6, 18, 34, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  headerTextWrap: {
    flex: 1,
  },

  title: {
    color: '#f8fbff',
    fontSize: 18,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 4,
    color: '#b7cee6',
    fontSize: 13,
  },

  legendRow: {
    alignItems: 'flex-end',
    gap: 8,
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
    color: '#d6e7f6',
    fontSize: 12,
    fontWeight: '600',
  },

  chartScrollContent: {
    paddingTop: 16,
  },

  chartCanvas: {
    height: CHART_HEIGHT,
    position: 'relative',
  },

  gridRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  yAxisLabel: {
    width: 28,
    color: '#88a9ca',
    fontSize: 11,
    textAlign: 'left',
  },

  gridLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
  },

  segment: {
    position: 'absolute',
    borderRadius: 999,
  },

  point: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },

  xAxisLabel: {
    position: 'absolute',
    bottom: 4,
    width: 40,
    textAlign: 'center',
    color: '#d8e7f7',
    fontSize: 11,
    fontWeight: '600',
  },
});
