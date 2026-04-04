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
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MAX_SUGGESTIONS = 5;

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
  const visibleSuggestions = suggestions.slice(0, MAX_SUGGESTIONS);

  return (
    <SafeAreaView edges={['top']} style={styles.appBarSafe}>
      <View style={styles.label}>
        <MaterialCommunityIcons name="weather-partly-cloudy" size={16} color="rgba(220, 235, 255, 0.7)" />
        <Text style={styles.labelText}>Search for a city to get weather</Text>
      </View>

      <View style={styles.appBar}>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="rgba(220, 235, 255, 0.6)"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="City, region or country..."
            placeholderTextColor="rgba(220, 235, 255, 0.45)"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={onSearch}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchText.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearBtn}>
              <MaterialCommunityIcons name="close-circle" size={18} color="rgba(220, 235, 255, 0.5)" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={onSearch}
          disabled={isLoading || !searchText.trim()}
          style={[
            styles.actionBtn,
            (isLoading || !searchText.trim()) && styles.actionBtnDisabled,
          ]}
        >
          <MaterialCommunityIcons name="arrow-right" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onGeolocation}
          disabled={isLoading}
          style={[styles.actionBtn, styles.gpsBtn]}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <MaterialCommunityIcons name="crosshairs-gps" size={22} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {isSuggestionsLoading ? (
        <ActivityIndicator style={styles.suggestionsLoader} color="rgba(220, 235, 255, 0.8)" size="small" />
      ) : null}

      {visibleSuggestions.length > 0 ? (
        <View style={styles.suggestionsBox}>
          {visibleSuggestions.map((place, index) => (
            <TouchableOpacity
              key={place.id}
              style={[
                styles.suggestionItem,
                index === visibleSuggestions.length - 1 && styles.suggestionItemLast,
              ]}
              onPress={() => onSelectSuggestion(place)}
            >
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color="rgba(100, 180, 255, 0.8)"
                style={styles.suggestionIcon}
              />
              <View style={styles.suggestionText}>
                <Text style={styles.suggestionTitle}>{place.name}</Text>
                {(place.region || place.country) ? (
                  <Text style={styles.suggestionSubtitle}>
                    {[place.region, place.country].filter(Boolean).join(', ')}
                  </Text>
                ) : null}
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={16}
                color="rgba(220, 235, 255, 0.3)"
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appBarSafe: {
    backgroundColor: 'rgba(15, 32, 39, 0.92)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },

  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 2,
  },

  labelText: {
    color: 'rgba(220, 235, 255, 0.6)',
    fontSize: 11,
    letterSpacing: 0.3,
  },

  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    gap: 8,
  },

  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
  },

  inputIcon: {
    marginRight: 6,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 15,
  },

  clearBtn: {
    padding: 4,
  },

  actionBtn: {
    backgroundColor: 'rgba(52, 152, 219, 0.85)',
    padding: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 180, 255, 0.3)',
  },

  gpsBtn: {
    backgroundColor: 'rgba(39, 174, 96, 0.85)',
    borderColor: 'rgba(100, 220, 140, 0.3)',
  },

  actionBtnDisabled: {
    opacity: 0.4,
  },

  suggestionsLoader: {
    paddingBottom: 10,
  },

  suggestionsBox: {
    marginHorizontal: 12,
    marginBottom: 10,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 40, 60, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    gap: 10,
  },

  suggestionItemLast: {
    borderBottomWidth: 0,
  },

  suggestionIcon: {
    width: 20,
  },

  suggestionText: {
    flex: 1,
  },

  suggestionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  suggestionSubtitle: {
    color: 'rgba(190, 215, 240, 0.75)',
    fontSize: 12,
    marginTop: 2,
  },
});
