import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppBar({
  searchText,
  setSearchText,
  suggestions,
  onSearch,
  onSelectSuggestion,
  onGeolocation,
  isLoading,
  isSuggestionsLoading,
}) {
  const visibleSuggestions = suggestions.slice(0, 5);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.shell}>
        <Text style={styles.eyebrow}>Module 03</Text>
        <Text style={styles.title}>Weather Canvas</Text>
        <Text style={styles.helper}>
          Search for a city, region, or country to refresh every forecast view.
        </Text>

        <View style={styles.searchRow}>
          <View style={styles.inputWrap}>
            <Text style={styles.inputGlyph}>⌕</Text>
            <TextInput
              style={styles.input}
              placeholder="Search a location"
              placeholderTextColor="#8cb3d8"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={onSearch}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity
            onPress={onSearch}
            disabled={isLoading || !searchText.trim()}
            style={[
              styles.actionButton,
              styles.searchButton,
              (isLoading || !searchText.trim()) && styles.disabledButton,
            ]}
          >
            <Text style={styles.actionGlyphDark}>⌕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onGeolocation}
            disabled={isLoading}
            style={[styles.actionButton, styles.gpsButton]}
          >
            {isLoading ? (
              <ActivityIndicator color="#04111f" />
            ) : (
              <Text style={styles.actionGlyphDark}>◎</Text>
            )}
          </TouchableOpacity>
        </View>

        {isSuggestionsLoading ? (
          <ActivityIndicator style={styles.loader} color="#eaf6ff" />
        ) : null}

        {visibleSuggestions.length > 0 ? (
          <View style={styles.suggestionBox}>
            {visibleSuggestions.map((place, index) => (
              <TouchableOpacity
                key={place.id}
                style={[
                  styles.suggestionItem,
                  index === visibleSuggestions.length - 1 &&
                    styles.lastSuggestionItem,
                ]}
                onPress={() => onSelectSuggestion(place)}
              >
                <View style={styles.suggestionTextWrap}>
                  <Text style={styles.suggestionTitle}>{place.name}</Text>
                  <Text style={styles.suggestionSubtitle}>
                    {[place.region, place.country].filter(Boolean).join(', ')}
                  </Text>
                </View>
                <Text style={styles.arrowGlyph}>↗</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },

  shell: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    borderRadius: 28,
    backgroundColor: 'rgba(7, 20, 39, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },

  eyebrow: {
    color: '#b6d8ff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  title: {
    marginTop: 6,
    color: '#f5fbff',
    fontSize: 30,
    fontFamily: 'serif',
  },

  helper: {
    marginTop: 6,
    color: '#c6dff5',
    fontSize: 14,
    lineHeight: 20,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },

  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(157, 201, 255, 0.12)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(157, 201, 255, 0.22)',
    paddingHorizontal: 14,
    paddingVertical: 2,
  },

  inputGlyph: {
    color: '#9bc9ff',
    fontSize: 22,
    fontWeight: '700',
  },

  input: {
    flex: 1,
    minHeight: 48,
    color: '#f6fbff',
    fontSize: 16,
  },

  actionButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchButton: {
    backgroundColor: '#ffd166',
  },

  gpsButton: {
    backgroundColor: '#8ce6c4',
  },

  disabledButton: {
    opacity: 0.45,
  },

  actionGlyphDark: {
    color: '#04111f',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
  },

  loader: {
    marginTop: 12,
  },

  suggestionBox: {
    marginTop: 14,
    borderRadius: 22,
    backgroundColor: 'rgba(9, 26, 48, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },

  lastSuggestionItem: {
    borderBottomWidth: 0,
  },

  suggestionTextWrap: {
    flex: 1,
    paddingRight: 12,
  },

  suggestionTitle: {
    color: '#f5fbff',
    fontSize: 16,
    fontWeight: '700',
  },

  suggestionSubtitle: {
    marginTop: 3,
    color: '#bfdaf3',
    fontSize: 13,
  },

  arrowGlyph: {
    color: '#cbe6ff',
    fontSize: 20,
    fontWeight: '700',
  },
});
