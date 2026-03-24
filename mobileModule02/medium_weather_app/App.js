import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, PermissionsAndroid, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

// API Endpoints
const OPENMETEO_GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const OPENMETEO_WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

const CurrentScreen = ({ location, weatherData, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!weatherData || !location) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.placeholder}>No weather data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Current Weather</Text>
        <Text style={styles.location}>
          {location.name}{location.region ? `, ${location.region}` : ''}, {location.country}
        </Text>
        {location.latitude !== undefined && location.longitude !== undefined && (
          <Text style={styles.coordinates}>
            Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
        <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
        <Text style={styles.description}>{weatherData.description}</Text>
        <Text style={styles.info}>Wind Speed: {weatherData.windSpeed} km/h</Text>
      </View>
    </ScrollView>
  );
};

const TodayScreen = ({ location, hourlyData, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Today</Text>
        {location && (
          <Text style={styles.location}>
            {location.name}{location.region ? `, ${location.region}` : ''}, {location.country}
          </Text>
        )}
        {hourlyData && hourlyData.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={hourlyData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.hourItem}>
                <Text style={styles.time}>{item.time}</Text>
                <Text style={styles.hourTemp}>{item.temperature}°C</Text>
                <Text style={styles.hourDesc}>{item.description}</Text>
                <Text style={styles.hourWind}>{item.windSpeed} km/h</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.placeholder}>No hourly data available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const WeeklyScreen = ({ location, dailyData, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Weekly Forecast</Text>
        {location && (
          <Text style={styles.location}>
            {location.name}{location.region ? `, ${location.region}` : ''}, {location.country}
          </Text>
        )}
        {dailyData && dailyData.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={dailyData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.dayItem}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.tempRange}>
                  {item.minTemp}°C - {item.maxTemp}°C
                </Text>
                <Text style={styles.dayDesc}>{item.description}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.placeholder}>No daily data available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const HomeStack = () => {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [currentTab, setCurrentTab] = useState('Current');
  const [activeTabRef, setActiveTabRef] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need access to your location to show weather data.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getUserLocation();
      } else {
        setLocationError('Location permission denied. Please search for a city manually.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationError(null);
        await fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        setLocationError('Unable to retrieve location. Please search for a city manually.');
        console.log(error);
      }
    );
  };

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    try {
      // Get city name from coordinates
      const geoResponse = await fetch(
        `${OPENMETEO_GEOCODING_API}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
      );
      
      if (!geoResponse.ok) {
        setError('Failed to fetch location data. Please check your connection.');
        setLoading(false);
        return;
      }
      
      const geoData = await geoResponse.json();
      
      if (geoData.results && geoData.results.length > 0) {
        const result = geoData.results[0];
        const loc = {
          name: result.name,
          region: result.admin1 || null,
          country: result.country,
          latitude,
          longitude,
        };
        setLocation(loc);
        setSearchQuery(result.name);
        await fetchWeather(latitude, longitude, result.name);
      } else {
        setError('Could not determine location from coordinates.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch location data. Please check your connection or search manually.');
      console.error(err);
      setLoading(false);
    }
  };

  const searchCities = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }
    try {
      const response = await fetch(
        `${OPENMETEO_GEOCODING_API}?name=${query}&count=10&language=en&format=json`
      );
      
      if (!response.ok) {
        setError('Failed to connect to the geocoding service. Please check your connection.');
        setSuggestions([]);
        return;
      }
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setSuggestions(data.results);
        setError(null);
      } else {
        setSuggestions([]);
        // Don't show error immediately while typing, only when user tries to search
      }
    } catch (err) {
      setError('Connection failed. Please check your internet connection and try again.');
      setSuggestions([]);
      console.error(err);
    }
  };

  const selectCity = async (city) => {
    setSearchQuery(city.name);
    setSuggestions([]);
    const loc = {
      name: city.name,
      region: city.admin1 || null,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    };
    setLocation(loc);
    setError(null);
    await fetchWeather(city.latitude, city.longitude, city.name);
  };

  const handleSearchPress = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a city name.');
      return;
    }

    // Try to find the city from suggestions or fetch weather directly
    if (suggestions.length > 0) {
      // User can select from suggestions
      return;
    }

    // If no suggestions, try with the search query directly
    try {
      const response = await fetch(
        `${OPENMETEO_GEOCODING_API}?name=${searchQuery}&count=1&language=en&format=json`
      );
      
      if (!response.ok) {
        setError('Failed to connect to the geocoding service. Please check your connection.');
        return;
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const city = data.results[0];
        await selectCity(city);
      } else {
        setError(`City "${searchQuery}" not found. Please check the city name and try again.`);
        setWeatherData(null);
        setHourlyData([]);
        setDailyData([]);
      }
    } catch (err) {
      setError('Connection failed. Please check your internet connection and try again.');
      console.error(err);
    }
  };

  const fetchWeather = async (latitude, longitude, cityName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${OPENMETEO_WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=time,temperature_2m,weather_code,wind_speed_10m&daily=date,weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      
      if (!response.ok) {
        setError('Failed to fetch weather data. Please check your connection and try again.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.current || !data.hourly || !data.daily) {
        setError('Invalid weather data received. Please try again.');
        setLoading(false);
        return;
      }

      if (data.current) {
        const current = data.current;
        setWeatherData({
          temperature: current.temperature_2m,
          description: getWeatherDescription(current.weather_code),
          windSpeed: current.wind_speed_10m,
        });
      }

      if (data.hourly) {
        const todayHourly = data.hourly.time
          .map((time, index) => ({
            time: new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            temperature: data.hourly.temperature_2m[index],
            description: getWeatherDescription(data.hourly.weather_code[index]),
            windSpeed: data.hourly.wind_speed_10m[index],
          }))
          .filter((_, index) => index < 24);
        setHourlyData(todayHourly);
      }

      if (data.daily) {
        const weekly = data.daily.date.map((date, index) => ({
          date,
          minTemp: data.daily.temperature_2m_min[index],
          maxTemp: data.daily.temperature_2m_max[index],
          description: getWeatherDescription(data.daily.weather_code[index]),
        }));
        setDailyData(weekly);
      }
      
      setError(null);
    } catch (err) {
      setError('Connection failed. Please check your internet connection and try again.');
      setWeatherData(null);
      setHourlyData([]);
      setDailyData([]);
      console.error(err);
    }
    setLoading(false);
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Frosted fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown';
  };

  return (
    <View style={styles.homeContainer}>
      <View style={styles.searchContainer}>
        {locationError && <Text style={styles.locationErrorText}>{locationError}</Text>}
        {error && <Text style={styles.errorMessageText}>{error}</Text>}
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a city..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchCities(text);
            }}
            onSubmitEditing={handleSearchPress}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchPress}
          >
            <MaterialCommunityIcons name="magnify" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.geolocationButton}
            onPress={getUserLocation}
          >
            <MaterialCommunityIcons name="crosshairs-gps" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => selectCity(item)}
              >
                <Text style={styles.suggestionText}>
                  {item.name}, {item.admin1 || ''} {item.country}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
          />
        )}
      </View>
      <Tab.Navigator
        labeled={true}
        sceneAnimationEnabled={true}
        backBehavior="initialRoute"
      >
        <Tab.Screen
          name="Current"
          options={{
            tabBarLabel: 'Current',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="weather-cloudy" size={26} color={color} />
            ),
          }}
        >
          {() => (
            <CurrentScreen
              location={location}
              weatherData={weatherData}
              loading={loading}
              error={error}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Today"
          options={{
            tabBarLabel: 'Today',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="clock" size={26} color={color} />
            ),
          }}
        >
          {() => (
            <TodayScreen
              location={location}
              hourlyData={hourlyData}
              loading={loading}
              error={error}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Weekly"
          options={{
            tabBarLabel: 'Weekly',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-week" size={26} color={color} />
            ),
          }}
        >
          {() => (
            <WeeklyScreen
              location={location}
              dailyData={dailyData}
              loading={loading}
              error={error}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    zIndex: 100,
  },
  locationErrorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  errorMessageText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
    paddingHorizontal: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  geolocationButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  temperature: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    color: '#555',
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  hourItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    marginHorizontal: 0,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  hourTemp: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  hourDesc: {
    fontSize: 14,
    color: '#666',
  },
  hourWind: {
    fontSize: 12,
    color: '#999',
  },
  dayItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    marginHorizontal: 0,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  tempRange: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  dayDesc: {
    fontSize: 14,
    color: '#666',
  },
});
