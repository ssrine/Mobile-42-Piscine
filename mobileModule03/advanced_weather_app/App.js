import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';

const Tab = createMaterialBottomTabNavigator();
const screenWidth = Dimensions.get('window').width;

// API Endpoints
const OPENMETEO_GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const OPENMETEO_WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// Weather icon mapping
const getWeatherIcon = (code) => {
  if (code === 0) return 'weather-sunny';
  if (code === 1 || code === 2) return 'weather-partly-cloudy';
  if (code === 3) return 'weather-cloudy';
  if (code === 45 || code === 48) return 'weather-fog';
  if (code >= 51 && code <= 67) return 'weather-rainy';
  if (code >= 71 && code <= 86) return 'weather-snowy';
  if (code >= 80 && code <= 82) return 'weather-pouring';
  if (code >= 95 && code <= 99) return 'weather-lightning';
  return 'weather-cloudy';
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

const CurrentScreen = ({ location, weatherData, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error || !weatherData || !location) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'No weather data available'}</Text>
      </View>
    );
  }

  const iconName = getWeatherIcon(weatherData.weatherCode);

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.screenContent}>
      <View style={styles.currentCard}>
        <Text style={styles.locationText}>
          {location.name}
          {location.region && `, ${location.region}`}
          {', ' + location.country}
        </Text>
        
        <View style={styles.weatherMainContainer}>
          <MaterialCommunityIcons name={iconName} size={120} color="#fff" />
          <Text style={styles.temperatureText}>{Math.round(weatherData.temperature)}°</Text>
        </View>

        <Text style={styles.descriptionText}>{weatherData.description}</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="wind" size={24} color="#fff" />
            <Text style={styles.infoLabel}>Wind</Text>
            <Text style={styles.infoValue}>{Math.round(weatherData.windSpeed)} km/h</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const TodayScreen = ({ location, hourlyData, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error || !hourlyData || hourlyData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'No hourly data available'}</Text>
      </View>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: hourlyData.slice(0, 12).map((item, index) => {
      const hour = parseInt(item.time.split(':')[0]);
      return hour % 4 === 0 ? hour + ':00' : '';
    }),
    datasets: [
      {
        data: hourlyData.slice(0, 12).map((item) => item.temperature),
        color: () => '#FF6B6B',
        strokeWidth: 3,
      },
    ],
  };

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.screenContent}>
      <View style={styles.tabCard}>
        <Text style={styles.locationText}>
          {location.name}
          {location.region && `, ${location.region}`}
          {', ' + location.country}
        </Text>

        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: 'transparent',
              backgroundGradientTo: 'transparent',
              color: () => 'rgba(255, 255, 255, 0.3)',
              strokeWidth: 3,
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#FF6B6B',
              },
              propsForLabels: {
                fontSize: 12,
                fill: '#fff',
              },
            }}
            decorator={() => null}
          />
        </View>

        <View style={styles.hourlyListContainer}>
          <FlatList
            data={hourlyData}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <View style={styles.hourlyItem}>
                <Text style={styles.hourTime}>{item.time}</Text>
                <MaterialCommunityIcons
                  name={getWeatherIcon(item.weatherCode)}
                  size={32}
                  color="#FF6B6B"
                />
                <Text style={styles.hourTemp}>{Math.round(item.temperature)}°C</Text>
                <Text style={styles.hourDesc}>{item.description}</Text>
                <View style={styles.windInfo}>
                  <MaterialCommunityIcons name="wind" size={16} color="#fff" />
                  <Text style={styles.hourWind}>{Math.round(item.windSpeed)} km/h</Text>
                </View>
              </View>
            )}
            scrollEventThrottle={16}
            horizontal={false}
            numColumns={2}
            columnWrapperStyle={styles.hourlyRow}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const WeeklyScreen = ({ location, dailyData, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error || !dailyData || dailyData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'No weekly data available'}</Text>
      </View>
    );
  }

  // Prepare chart data for weekly
  const chartDataWeekly = {
    labels: dailyData.slice(0, 7).map((item) => {
      const date = new Date(item.date);
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    }),
    datasets: [
      {
        data: dailyData.slice(0, 7).map((item) => item.maxTemp),
        color: () => '#FF6B6B',
        strokeWidth: 2,
        label: 'Max',
      },
      {
        data: dailyData.slice(0, 7).map((item) => item.minTemp),
        color: () => '#4ECDC4',
        strokeWidth: 2,
        label: 'Min',
      },
    ],
  };

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.screenContent}>
      <View style={styles.tabCard}>
        <Text style={styles.locationText}>
          {location.name}
          {location.region && `, ${location.region}`}
          {', ' + location.country}
        </Text>

        <View style={styles.chartContainer}>
          <LineChart
            data={chartDataWeekly}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: 'transparent',
              backgroundGradientTo: 'transparent',
              color: () => 'rgba(255, 255, 255, 0.3)',
              strokeWidth: 2,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
              },
              propsForLabels: {
                fontSize: 12,
                fill: '#fff',
              },
            }}
            decorator={() => null}
          />
        </View>

        <View style={styles.weeklyListContainer}>
          <FlatList
            data={dailyData.slice(0, 7)}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            renderItem={({ item }) => {
              const date = new Date(item.date);
              const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
                date.getDay()
              ];

              return (
                <View style={styles.dailyItem}>
                  <View style={styles.dayColumn}>
                    <Text style={styles.dayName}>{dayName}</Text>
                    <Text style={styles.dayDate}>{item.date}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name={getWeatherIcon(item.weatherCode)}
                    size={40}
                    color="#4ECDC4"
                  />
                  <View style={styles.tempColumn}>
                    <Text style={styles.dayDesc}>{item.description}</Text>
                    <View style={styles.tempRange}>
                      <Text style={styles.maxTemp}>{Math.round(item.maxTemp)}°</Text>
                      <Text style={styles.minTemp}>{Math.round(item.minTemp)}°</Text>
                    </View>
                  </View>
                </View>
              );
            }}
            scrollEventThrottle={16}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const AppNavigator = () => {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);

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
        setLocationError('Unable to retrieve location.');
        console.log(error);
      }
    );
  };

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    try {
      const geoResponse = await fetch(
        `${OPENMETEO_GEOCODING_API}?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
      );

      if (!geoResponse.ok) {
        setError('Failed to fetch location data.');
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
        await fetchWeather(latitude, longitude);
      } else {
        setError('Could not determine location from coordinates.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to fetch location data.');
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
        `${OPENMETEO_GEOCODING_API}?name=${query}&count=5&language=en&format=json`
      );

      if (!response.ok) {
        setError('Failed to connect. Please check your connection.');
        setSuggestions([]);
        return;
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setSuggestions(data.results.slice(0, 5));
        setError(null);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
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
    await fetchWeather(city.latitude, city.longitude);
  };

  const handleSearchPress = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a city name.');
      return;
    }

    if (suggestions.length > 0) {
      return;
    }

    try {
      const response = await fetch(
        `${OPENMETEO_GEOCODING_API}?name=${searchQuery}&count=1&language=en&format=json`
      );

      if (!response.ok) {
        setError('Failed to connect. Please check your connection.');
        return;
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const city = data.results[0];
        await selectCity(city);
      } else {
        setError(`City "${searchQuery}" not found.`);
        setWeatherData(null);
        setHourlyData([]);
        setDailyData([]);
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
      console.error(err);
    }
  };

  const fetchWeather = async (latitude, longitude) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${OPENMETEO_WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=time,temperature_2m,weather_code,wind_speed_10m&daily=date,weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );

      if (!response.ok) {
        setError('Failed to fetch weather data.');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.current || !data.hourly || !data.daily) {
        setError('Invalid weather data received.');
        setLoading(false);
        return;
      }

      if (data.current) {
        const current = data.current;
        setWeatherData({
          temperature: current.temperature_2m,
          weatherCode: current.weather_code,
          description: getWeatherDescription(current.weather_code),
          windSpeed: current.wind_speed_10m,
        });
      }

      if (data.hourly) {
        const todayHourly = data.hourly.time
          .map((time, index) => ({
            time: new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            temperature: data.hourly.temperature_2m[index],
            weatherCode: data.hourly.weather_code[index],
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
          weatherCode: data.daily.weather_code[index],
          description: getWeatherDescription(data.daily.weather_code[index]),
        }));
        setDailyData(weekly);
      }

      setError(null);
    } catch (err) {
      setError('Connection failed. Please try again.');
      setWeatherData(null);
      setHourlyData([]);
      setDailyData([]);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.searchHeader}>
          {locationError && <Text style={styles.locationErrorText}>{locationError}</Text>}
          {error && <Text style={styles.errorMessageText}>{error}</Text>}

          <View style={styles.searchInputWrapper}>
            <View style={styles.searchInputContainer}>
              <MaterialCommunityIcons name="magnify" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a city..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  searchCities(text);
                }}
                onSubmitEditing={handleSearchPress}
              />
            </View>

            <TouchableOpacity style={styles.geoButton} onPress={getUserLocation}>
              <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(item, index) => index.toString()}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => selectCity(item)}
                  >
                    <MaterialCommunityIcons name="map-marker" size={18} color="#4ECDC4" />
                    <View style={styles.suggestionContent}>
                      <Text style={styles.suggestionCity}>{item.name}</Text>
                      <Text style={styles.suggestionRegion}>
                        {item.admin1 || ''} {item.country}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        <Tab.Navigator
          labeled={true}
          sceneAnimationEnabled={true}
          activeColor="#FF6B6B"
          inactiveColor="rgba(255, 255, 255, 0.5)"
          barStyle={styles.tabBar}
        >
          <Tab.Screen
            name="Current"
            options={{
              tabBarLabel: 'Current',
              tabBarIcon: ({ color }) => <MaterialCommunityIcons name="weather-cloudy" size={24} color={color} />,
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
              tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clock" size={24} color={color} />,
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
              tabBarIcon: ({ color }) => <MaterialCommunityIcons name="calendar-week" size={24} color={color} />,
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
    </ImageBackground>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  searchHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  locationErrorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  errorMessageText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  geoButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: 250,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  suggestionContent: {
    flex: 1,
    marginLeft: 10,
  },
  suggestionCity: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  suggestionRegion: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  tabBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  screenContainer: {
    flex: 1,
  },
  screenContent: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  currentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  weatherMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 20,
  },
  temperatureText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#fff',
  },
  descriptionText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    fontWeight: '500',
  },
  infoGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoItem: {
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 10,
  },
  hourlyListContainer: {
    marginTop: 20,
    maxHeight: 400,
  },
  hourlyRow: {
    gap: 12,
    marginBottom: 12,
  },
  hourlyItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hourTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  hourTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 4,
  },
  hourDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'center',
  },
  windInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  hourWind: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  weeklyListContainer: {
    marginTop: 20,
    maxHeight: 400,
  },
  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  dayColumn: {
    flex: 0.8,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  dayDate: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  tempColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dayDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  tempRange: {
    flexDirection: 'row',
    gap: 12,
  },
  maxTemp: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  minTemp: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4ECDC4',
  },
});
