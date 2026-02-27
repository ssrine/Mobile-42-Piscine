import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

// Tab Content Components
const CurrentlyScreen = ({ searchText, isGeolocation }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>
      Currently
    </Text>
    <Text style={{ fontSize: 16, color: '#666' }}>
      {isGeolocation ? 'Geolocation' : searchText || 'Enter location to search'}
    </Text>
  </View>
);

const TodayScreen = ({ searchText, isGeolocation }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>
      Today
    </Text>
    <Text style={{ fontSize: 16, color: '#666' }}>
      {isGeolocation ? 'Geolocation' : searchText || 'Enter location to search'}
    </Text>
  </View>
);

const WeeklyScreen = ({ searchText, isGeolocation }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>
      Weekly
    </Text>
    <Text style={{ fontSize: 16, color: '#666' }}>
      {isGeolocation ? 'Geolocation' : searchText || 'Enter location to search'}
    </Text>
  </View>
);

// AppBar Component
const AppBar = ({ searchText, setSearchText, onGeolocation, isLoadingLocation }) => {
  return (
    <View
      style={{
        backgroundColor: '#2c3e50',
        paddingHorizontal: 15,
        paddingVertical: 15,
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {/* Search TextField */}
      <TextInput
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: 8,
          paddingHorizontal: 15,
          paddingVertical: 10,
          fontSize: 14,
          color: '#333',
        }}
        placeholder="Search location..."
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Geolocation Button */}
      <TouchableOpacity
        onPress={onGeolocation}
        disabled={isLoadingLocation}
        style={{
          backgroundColor: '#3498db',
          borderRadius: 8,
          padding: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isLoadingLocation ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <MaterialCommunityIcons name="crosshairs-gps" size={24} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const [searchText, setSearchText] = useState('');
  const [isGeolocation, setIsGeolocation] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Request geolocation permissions and get location
  const handleGeolocation = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access geolocation was denied');
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log('Location:', location);

      // Try to get address from coordinates
      try {
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (addressResponse && addressResponse.length > 0) {
          const address = addressResponse[0];
          const locationName = address.city || address.region || 'Your Location';
          console.log('Location Name:', locationName);
        }
      } catch (geocodeError) {
        console.log('Geocoding error:', geocodeError);
      }

      // Set isGeolocation to true and clear search text
      setIsGeolocation(true);
      setSearchText('');
      setIsLoadingLocation(false);
    } catch (error) {
      console.error('Geolocation error:', error);
      Alert.alert('Error', 'Failed to get geolocation');
      setIsLoadingLocation(false);
    }
  };

  // Clear geolocation flag when user types in search
  const handleSearchChange = (text) => {
    setSearchText(text);
    setIsGeolocation(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* AppBar */}
      <AppBar
        searchText={searchText}
        setSearchText={handleSearchChange}
        onGeolocation={handleGeolocation}
        isLoadingLocation={isLoadingLocation}
      />

      {/* Tab Navigation */}
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = 'cloud-question';

              if (route.name === 'Currently') {
                iconName = 'cloud-Sun';
              } else if (route.name === 'Today') {
                iconName = 'calendar-today';
              } else if (route.name === 'Weekly') {
                iconName = 'calendar-week';
              }

              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#3498db',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              backgroundColor: '#2c3e50',
              borderTopColor: '#34495e',
              borderTopWidth: 1,
              paddingBottom: 5,
              paddingTop: 5,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              marginTop: 5,
            },
          })}
        >
          <Tab.Screen
            name="Currently"
            options={{
              tabBarLabel: 'Currently',
            }}
            children={() => <CurrentlyScreen searchText={searchText} isGeolocation={isGeolocation} />}
          />
          <Tab.Screen
            name="Today"
            options={{
              tabBarLabel: 'Today',
            }}
            children={() => <TodayScreen searchText={searchText} isGeolocation={isGeolocation} />}
          />
          <Tab.Screen
            name="Weekly"
            options={{
              tabBarLabel: 'Weekly',
            }}
            children={() => <WeeklyScreen searchText={searchText} isGeolocation={isGeolocation} />}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}
