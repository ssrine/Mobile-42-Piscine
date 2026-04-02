import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();

// ================= SCREEN =================
const ScreenTemplate = ({ title, searchText, isGeolocation }) => {
  const displayText = isGeolocation
    ? 'Geolocation'
    : searchText || '...';

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>
        {title} - {displayText}
      </Text>
    </View>
  );
};

// ================= APP BAR =================
const AppBar = ({ searchText, setSearchText, onGeolocation, isLoading }) => (
  <SafeAreaView edges={['top']} style={styles.appBarSafe}>
    <View style={styles.appBar}>
      <TextInput
        style={styles.input}
        placeholder="Search location..."
        placeholderTextColor="#ccc"
        value={searchText}
        onChangeText={setSearchText}
      />

      <TouchableOpacity
        onPress={onGeolocation}
        disabled={isLoading}
        style={styles.geoBtn}
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
  </SafeAreaView>
);

// ================= MAIN =================
function AppContent() {
  const [searchText, setSearchText] = useState('');
  const [isGeolocation, setIsGeolocation] = useState(false);
  const [loading] = useState(false);

  const insets = useSafeAreaInsets();

  const handleSearch = (text) => {
    setSearchText(text);
    setIsGeolocation(false);
  };

  const handleGeolocation = () => {
    setIsGeolocation(true);
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      {/* TOP BAR */}
      <AppBar
        searchText={searchText}
        setSearchText={handleSearch}
        onGeolocation={handleGeolocation}
        isLoading={loading}
      />

      {/* TABS */}
      <Tab.Navigator
        initialRouteName="Currently"
        tabBarPosition="bottom"
        screenOptions={({ route }) => ({
          swipeEnabled: true,

          tabBarIcon: ({ color }) => {
            let icon = 'cloud';

            if (route.name === 'Currently') icon = 'weather-sunny';
            if (route.name === 'Today') icon = 'calendar-today';
            if (route.name === 'Weekly') icon = 'calendar-week';

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
        <Tab.Screen name="Currently">
          {() => (
            <ScreenTemplate
              title="Currently"
              searchText={searchText}
              isGeolocation={isGeolocation}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Today">
          {() => (
            <ScreenTemplate
              title="Today"
              searchText={searchText}
              isGeolocation={isGeolocation}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Weekly">
          {() => (
            <ScreenTemplate
              title="Weekly"
              searchText={searchText}
              isGeolocation={isGeolocation}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

// ================= ROOT =================
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  appBarSafe: {
    backgroundColor: '#2c3e50',
  },

  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: '#34495e',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
  },

  geoBtn: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
  },

  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});