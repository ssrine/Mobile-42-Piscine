import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppBar from './components/AppBar';
import CurrentScreen from './screens/CurrentScreen';
import TodayScreen from './screens/TodayScreen';
import WeeklyScreen from './screens/WeeklyScreen';
import {
  fetchWeatherAPI,
  formatPlaceLabel,
  getCityFromCoordsAPI,
  searchCitiesAPI,
} from './services/api';

const Tab = createMaterialTopTabNavigator();

const EMPTY_FORECAST = {
  current: null,
  today: [],
  weekly: [],
};

const ERROR_MESSAGES = {
  permission:
    "Location access denied. Search for a city manually or use the GPS button after allowing permission.",
  invalid: 'Invalid city name. Please enter a valid location.',
  connection: 'Connection issue. Please try again when the weather API is reachable.',
  location: 'Unable to get your GPS location right now.',
};

const buildLocationLabel = ({ name, region, country }) =>
  [name, region, country].filter(Boolean).join(', ');

const buildDeviceLocationFromReverse = (reverseResult, coordinates) => {
  if (!reverseResult) {
    return null;
  }

  const name =
    reverseResult.city ||
    reverseResult.district ||
    reverseResult.subregion ||
    reverseResult.street ||
    '';
  const region = reverseResult.region || reverseResult.subregion || '';
  const country = reverseResult.country || '';
  const label = buildLocationLabel({ name, region, country });

  if (!label) {
    return null;
  }

  return {
    name,
    region,
    country,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    label,
  };
};

const normalizeText = (value) => value?.trim().toLowerCase() || '';

const buildQueryVariants = (query) => {
  const trimmedQuery = query?.trim() || '';

  if (!trimmedQuery) {
    return [];
  }

  const parts = trimmedQuery
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  const variants = [trimmedQuery];

  if (parts.length > 0) {
    variants.push(parts[0]);
  }

  if (parts.length > 1) {
    variants.push(parts.slice(0, 2).join(', '));
    variants.push([parts[0], parts[parts.length - 1]].join(', '));
  }

  return [...new Set(variants.map((variant) => variant.trim()).filter(Boolean))];
};

const buildPlaceCandidates = (place) => [
  place?.name,
  place?.label,
  buildLocationLabel({
    name: place?.name,
    region: place?.region,
    country: place?.country,
  }),
  buildLocationLabel({
    name: place?.name,
    region: '',
    country: place?.country,
  }),
];

const queryMatchesValidPlace = (query, places) => {
  const variants = buildQueryVariants(query);

  return variants.some((variant) =>
    places.some((place) =>
      buildPlaceCandidates(place).some(
        (candidate) => normalizeText(candidate) === normalizeText(variant)
      )
    )
  );
};

const getBestMatchingPlace = (query, places) => {
  const variants = buildQueryVariants(query);

  for (const variant of variants) {
    const exactMatch = places.find((place) =>
      buildPlaceCandidates(place).some(
        (candidate) => normalizeText(candidate) === normalizeText(variant)
      )
    );

    if (exactMatch) {
      return exactMatch;
    }
  }

  const firstVariant = variants[0];
  const firstNameVariant = firstVariant?.split(',')[0]?.trim() || '';
  const nameMatch = places.find(
    (place) => normalizeText(place.name) === normalizeText(firstNameVariant)
  );

  return nameMatch || places[0] || null;
};

const searchCitiesWithFallback = async (query, count = 6) => {
  const variants = buildQueryVariants(query);

  for (const variant of variants) {
    const matches = await searchCitiesAPI(variant, count);

    if (matches.length > 0) {
      return matches;
    }
  }

  return [];
};

function WeatherApp() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [locationText, setLocationText] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [forecast, setForecast] = useState(EMPTY_FORECAST);
  const [loading, setLoading] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [errorState, setErrorState] = useState({ type: '', message: '' });
  const suppressSuggestionsRef = useRef(false);
  const weatherRequestIdRef = useRef(0);
  const suggestionRequestIdRef = useRef(0);

  const clearDisplayedWeather = () => {
    setForecast(EMPTY_FORECAST);
    setLocationText('');
    setCoordinates(null);
    setSuggestions([]);
  };

  const setAppError = (type, message) => {
    clearDisplayedWeather();
    setErrorState({ type, message });
  };

  const applyWeatherResult = ({
    nextLocation,
    nextCoordinates,
    nextForecast,
    nextSearchText,
  }) => {
    if (typeof nextSearchText === 'string') {
      suppressSuggestionsRef.current = nextSearchText !== searchText;

      if (nextSearchText !== searchText) {
        setSearchText(nextSearchText);
      }
    }

    setForecast(nextForecast);
    setLocationText(nextLocation);
    setCoordinates(nextCoordinates);
    setSuggestions([]);
    setErrorState({ type: '', message: '' });
    Keyboard.dismiss();
  };

  const loadWeatherForPlace = async ({ place, query, nextSearchText }) => {
    const trimmedQuery = query?.trim() || '';

    if (!place && !trimmedQuery) {
      setSuggestions([]);
      return;
    }

    const requestId = weatherRequestIdRef.current + 1;
    weatherRequestIdRef.current = requestId;
    suggestionRequestIdRef.current += 1;
    setLoading(true);
    setIsSuggestionsLoading(false);
    setSuggestions([]);

    try {
      let resolvedPlace = place;

      if (!resolvedPlace) {
        let matches = [];

        try {
          matches = await searchCitiesWithFallback(trimmedQuery, 6);
        } catch {
          if (requestId === weatherRequestIdRef.current) {
            setAppError('geocodingConnection', ERROR_MESSAGES.connection);
          }

          return;
        }

        if (requestId !== weatherRequestIdRef.current) {
          return;
        }

        if (matches.length === 0) {
          setAppError('invalid', ERROR_MESSAGES.invalid);
          return;
        }

        resolvedPlace = getBestMatchingPlace(trimmedQuery, matches);
      }

      let nextForecast;

      try {
        nextForecast = await fetchWeatherAPI(
          resolvedPlace.latitude,
          resolvedPlace.longitude
        );
      } catch {
        if (requestId === weatherRequestIdRef.current) {
          setAppError('weatherConnection', ERROR_MESSAGES.connection);
        }

        return;
      }

      if (requestId !== weatherRequestIdRef.current) {
        return;
      }

      applyWeatherResult({
        nextLocation: resolvedPlace.label || formatPlaceLabel(resolvedPlace),
        nextCoordinates: {
          latitude: resolvedPlace.latitude,
          longitude: resolvedPlace.longitude,
        },
        nextForecast,
        nextSearchText: nextSearchText ?? resolvedPlace.label,
      });
    } finally {
      if (requestId === weatherRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const getLocation = async () => {
    const requestId = weatherRequestIdRef.current + 1;
    weatherRequestIdRef.current = requestId;
    suggestionRequestIdRef.current += 1;
    setLoading(true);
    setIsSuggestionsLoading(false);
    setSuggestions([]);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (requestId !== weatherRequestIdRef.current) {
        return;
      }

      if (status !== 'granted') {
        setAppError('permission', ERROR_MESSAGES.permission);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      if (requestId !== weatherRequestIdRef.current) {
        return;
      }

      const nextCoordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      let resolvedPlace = {
        name: 'Current location',
        label: 'Current location',
        latitude: nextCoordinates.latitude,
        longitude: nextCoordinates.longitude,
      };

      try {
        const reverseMatch = await getCityFromCoordsAPI(
          nextCoordinates.latitude,
          nextCoordinates.longitude
        );

        if (requestId !== weatherRequestIdRef.current) {
          return;
        }

        if (reverseMatch) {
          resolvedPlace = reverseMatch;
        }
      } catch {
        resolvedPlace = {
          ...resolvedPlace,
          label: 'Current location',
        };
      }

      if (resolvedPlace.label === 'Current location') {
        try {
          const localReverseMatches = await Location.reverseGeocodeAsync(
            nextCoordinates
          );

          if (requestId !== weatherRequestIdRef.current) {
            return;
          }

          const localPlace = buildDeviceLocationFromReverse(
            localReverseMatches?.[0],
            nextCoordinates
          );

          if (localPlace) {
            resolvedPlace = localPlace;
          }
        } catch {
          resolvedPlace = {
            ...resolvedPlace,
            label: 'Current location',
          };
        }
      }

      try {
        const nextForecast = await fetchWeatherAPI(
          nextCoordinates.latitude,
          nextCoordinates.longitude
        );

        if (requestId !== weatherRequestIdRef.current) {
          return;
        }

        applyWeatherResult({
          nextLocation: resolvedPlace.label || formatPlaceLabel(resolvedPlace),
          nextCoordinates,
          nextForecast,
          nextSearchText:
            resolvedPlace.label === 'Current location' ? '' : resolvedPlace.label,
        });
      } catch {
        if (requestId === weatherRequestIdRef.current) {
          setAppError('weatherConnection', ERROR_MESSAGES.connection);
        }
      }
    } catch {
      if (requestId === weatherRequestIdRef.current) {
        setAppError('location', ERROR_MESSAGES.location);
      }
    } finally {
      if (requestId === weatherRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (suppressSuggestionsRef.current) {
      suppressSuggestionsRef.current = false;
      return;
    }

    const query = searchText.trim();

    if (!query) {
      setIsSuggestionsLoading(false);
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const requestId = suggestionRequestIdRef.current + 1;
    suggestionRequestIdRef.current = requestId;
    const timeoutId = setTimeout(async () => {
      setIsSuggestionsLoading(true);

      try {
        const matches = await searchCitiesWithFallback(query, 6);

        if (cancelled || requestId !== suggestionRequestIdRef.current) {
          return;
        }

        setSuggestions(matches);
        setErrorState((currentError) =>
          currentError.type === 'geocodingConnection'
            ? { type: '', message: '' }
            : currentError.type === 'invalid' &&
                queryMatchesValidPlace(query, matches)
              ? { type: '', message: '' }
              : currentError
        );
      } catch {
        if (!cancelled && requestId === suggestionRequestIdRef.current) {
          setSuggestions([]);
          setAppError('geocodingConnection', ERROR_MESSAGES.connection);
        }
      } finally {
        if (!cancelled && requestId === suggestionRequestIdRef.current) {
          setIsSuggestionsLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      setIsSuggestionsLoading(false);
    };
  }, [searchText]);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <AppBar
          searchText={searchText}
          setSearchText={setSearchText}
          suggestions={suggestions}
          onSearch={() =>
            loadWeatherForPlace({
              query: searchText,
              nextSearchText: searchText.trim(),
            })
          }
          onSelectSuggestion={(place) =>
            loadWeatherForPlace({
              place,
              nextSearchText: place.label,
            })
          }
          onGeolocation={getLocation}
          isLoading={loading}
          isSuggestionsLoading={isSuggestionsLoading}
        />

        {errorState.message ? (
          <Text style={styles.error}>{errorState.message}</Text>
        ) : null}

        <Tab.Navigator
          initialRouteName="Current"
          tabBarPosition="bottom"
          screenOptions={({ route }) => ({
            swipeEnabled: true,
            tabBarIcon: ({ color }) => {
              let icon = 'cloud';

              if (route.name === 'Current') {
                icon = 'weather-sunny';
              }
              if (route.name === 'Today') {
                icon = 'calendar-today';
              }
              if (route.name === 'Weekly') {
                icon = 'calendar-week';
              }

              return (
                <MaterialCommunityIcons
                  name={icon}
                  size={22}
                  color={color}
                />
              );
            },
            tabBarActiveTintColor: '#3498db',
            tabBarInactiveTintColor: '#aaa',
            tabBarStyle: {
              backgroundColor: '#2c3e50',
              height: 60 + insets.bottom,
              paddingBottom: insets.bottom,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
            tabBarShowIcon: true,
          })}
        >
          <Tab.Screen name="Current">
            {() => (
              <CurrentScreen
                current={forecast.current}
                location={locationText}
                coordinates={coordinates}
                loading={loading}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Today">
            {() => (
              <TodayScreen
                hourly={forecast.today}
                location={locationText}
                loading={loading}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Weekly">
            {() => (
              <WeeklyScreen
                daily={forecast.weekly}
                location={locationText}
                loading={loading}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <WeatherApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  error: {
    color: '#c0392b',
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 12,
  },
});
