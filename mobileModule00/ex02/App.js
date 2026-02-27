import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [expression, setExpression] = useState('0');
  const [result, setResult] = useState('0');
  const { width, height } = Dimensions.get('window');
  const isPortrait = height >= width;
  const buttonSize = isPortrait ? width / 5 : width / 7;

  const handleButtonPress = (value) => {
    console.log(value);
    
    if (value === 'AC') {
      setExpression('0');
      setResult('0');
    } else if (value === 'C') {
      setExpression(expression.length > 1 ? expression.slice(0, -1) : '0');
    } else if (value === '=') {
      // Will be implemented in Exercise 03
    } else {
      if (expression === '0' && value !== '.') {
        setExpression(value);
      } else if (value === '.' && expression.includes('.')) {
        return;
      } else {
        setExpression(expression + value);
      }
    }
  };

  const buttons = [
    ['AC', 'C', '/', '*'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.'],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* AppBar */}
      <View style={{
        backgroundColor: '#2c3e50',
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          Calculator
        </Text>
      </View>

      {/* Display TextFields */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 15, paddingVertical: 20, justifyContent: 'flex-start' }}>
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Expression</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 5,
              padding: 15,
              fontSize: 16,
              backgroundColor: 'white',
              color: '#333',
            }}
            value={expression}
            editable={false}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Result</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 5,
              padding: 15,
              fontSize: 16,
              backgroundColor: 'white',
              color: '#333',
            }}
            value={result}
            editable={false}
          />
        </View>

        {/* Calculator Buttons Grid */}
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          {buttons.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              {row.map((btn) => (
                <TouchableOpacity
                  key={btn}
                  onPress={() => handleButtonPress(btn)}
                  style={{
                    width: btn === '0' ? buttonSize * 2 + 10 : buttonSize,
                    height: buttonSize,
                    backgroundColor: ['AC', 'C'].includes(btn) ? '#e74c3c' : ['/', '*', '+', '-', '='].includes(btn) ? '#f39c12' : '#3498db',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    marginRight: btn === '.' ? 10 : 0,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                    {btn}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}