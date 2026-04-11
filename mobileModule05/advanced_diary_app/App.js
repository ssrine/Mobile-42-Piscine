import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import AgendaScreen from './screens/AgendaScreen';
import NewEntryScreen from './screens/NewEntryScreen';
import EntryDetailScreen from './screens/EntryDetailScreen';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();
const AgendaStack = createNativeStackNavigator();

const stackOptions = {
  headerStyle: { backgroundColor: '#FFF8F0' },
  headerTintColor: '#5C3317',
  headerTitleStyle: { fontWeight: '700', fontSize: 18 },
  contentStyle: { backgroundColor: '#FFF8F0' },
  headerShadowVisible: false,
};

function ProfileStackNav({ user }) {
  return (
    <ProfileStack.Navigator screenOptions={stackOptions}>
      <ProfileStack.Screen name="Profile" options={{ headerShown: false }}>
        {(props) => <ProfileScreen {...props} user={user} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen
        name="NewEntry"
        options={{ title: 'New Entry', presentation: 'modal', headerLeft: () => null }}
      >
        {(props) => <NewEntryScreen {...props} user={user} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen
        name="EntryDetail"
        component={EntryDetailScreen}
        options={{ title: '' }}
      />
    </ProfileStack.Navigator>
  );
}

function AgendaStackNav({ user }) {
  return (
    <AgendaStack.Navigator screenOptions={stackOptions}>
      <AgendaStack.Screen name="Agenda" options={{ headerShown: false }}>
        {(props) => <AgendaScreen {...props} user={user} />}
      </AgendaStack.Screen>
      <AgendaStack.Screen
        name="EntryDetail"
        component={EntryDetailScreen}
        options={{ title: '' }}
      />
    </AgendaStack.Navigator>
  );
}

function MainTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFF8F0',
          borderTopColor: '#EDD9BE',
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 14,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#8B4513',
        tabBarInactiveTintColor: '#C4A080',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'ProfileTab') {
            return (
              <MaterialCommunityIcons
                name={focused ? 'account' : 'account-outline'}
                size={size}
                color={color}
              />
            );
          }
          return (
            <MaterialCommunityIcons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="ProfileTab" options={{ title: 'Profile' }}>
        {() => <ProfileStackNav user={user} />}
      </Tab.Screen>
      <Tab.Screen name="AgendaTab" options={{ title: 'Agenda' }}>
        {() => <AgendaStackNav user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF8F0" />
        {user ? (
          <NavigationContainer>
            <MainTabs user={user} />
          </NavigationContainer>
        ) : (
          <LoginScreen />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
  },
});
