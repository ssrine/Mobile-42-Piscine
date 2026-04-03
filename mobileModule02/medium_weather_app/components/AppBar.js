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
  return (
    <SafeAreaView edges={['top']} style={styles.appBarSafe}>
      <View style={styles.appBar}>
        <TextInput
          style={styles.input}
          placeholder="Search city, region, country..."
          placeholderTextColor="#ccc"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={onSearch}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="search"
        />

        <TouchableOpacity
          onPress={onSearch}
          disabled={isLoading || !searchText.trim()}
          style={[
            styles.actionBtn,
            (isLoading || !searchText.trim()) && styles.actionBtnDisabled,
          ]}
        >
          <MaterialCommunityIcons name="magnify" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onGeolocation}
          disabled={isLoading}
          style={styles.actionBtn}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={24}
              color="#fff"
            />
          )}
        </TouchableOpacity>
      </View>

      {isSuggestionsLoading ? (
        <ActivityIndicator style={styles.suggestionsLoader} color="#fff" />
      ) : null}

      {suggestions.length > 0 ? (
        <View style={styles.suggestionsBox}>
          {suggestions.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.suggestionItem}
              onPress={() => onSelectSuggestion(place)}
            >
              <Text style={styles.suggestionTitle}>{place.name}</Text>
              <Text style={styles.suggestionSubtitle}>
                {[place.region, place.country].filter(Boolean).join(', ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appBarSafe: {
    backgroundColor: '#2c3e50',
  },

  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: '#34495e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
  },

  actionBtn: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
  },

  actionBtnDisabled: {
    opacity: 0.5,
  },

  suggestionsLoader: {
    paddingBottom: 8,
  },

  suggestionsBox: {
    backgroundColor: '#34495e',
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },

  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#45607b',
  },

  suggestionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  suggestionSubtitle: {
    color: '#d6e2f0',
    fontSize: 13,
    marginTop: 2,
  },
});
