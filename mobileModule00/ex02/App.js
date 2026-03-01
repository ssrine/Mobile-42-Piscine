import { View, Text, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [expression, setExpression] = useState('0');
  const [result, setResult] = useState('0');
  const { width } = Dimensions.get('window');

  const buttonSize = (width - 40) / 4;

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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* AppBar */}
      <View style={{
        backgroundColor: '#333',
        paddingTop: 30,
        paddingBottom: 30,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 110,
      }}>
        <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>
          Calculator
        </Text>
      </View>

      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Display Section */}
        <View style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>
            Expression
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              padding: 10,
              fontSize: 16,
              marginBottom: 15,
              color: '#000',
              backgroundColor: '#f9f9f9',
            }}
            value={expression}
            editable={false}
          />

          <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>
            Result
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              padding: 10,
              fontSize: 16,
              marginBottom: 20,
              color: '#000',
              backgroundColor: '#f9f9f9',
            }}
            value={result}
            editable={false}
          />
        </View>

        {/* Buttons Grid */}
        <ScrollView style={{ paddingHorizontal: 5 }} showsVerticalScrollIndicator={false}>
          {buttons.map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 8,
              }}
            >
              {row.map((btn) => {
                let bgColor = '#3498db';
                if (['AC', 'C'].includes(btn)) bgColor = '#e74c3c';
                if (['/', '*', '+', '-', '='].includes(btn)) bgColor = '#f39c12';

                return (
                  <TouchableOpacity
                    key={btn}
                    onPress={() => handleButtonPress(btn)}
                    style={{
                      width: btn === '0' ? buttonSize * 2 + 8 : buttonSize,
                      height: buttonSize,
                      backgroundColor: bgColor,
                      borderRadius: 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 4,
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                      {btn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}