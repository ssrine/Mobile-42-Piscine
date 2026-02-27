import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function App() {
  const handleButtonPress = () => {
    console.log('Button pressed');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white', fontSize: 18, marginBottom: 20 }}>
        Welcome to Mobile App
      </Text>
      <TouchableOpacity
        onPress={handleButtonPress}
        style={{
          backgroundColor: '#007AFF',
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          Press Me
        </Text>
      </TouchableOpacity>
    </View>
  );
}