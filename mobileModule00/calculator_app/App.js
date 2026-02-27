import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions, Alert } from 'react-native';
import { useState } from 'react';
import Decimal from 'decimal.js';

export default function App() {
  const [expression, setExpression] = useState('0');
  const [result, setResult] = useState('0');
  const { width, height } = Dimensions.get('window');
  const isPortrait = height >= width;
  const buttonSize = isPortrait ? width / 5 : width / 7;

  const evaluateExpression = (expr) => {
    try {
      // Validate expression
      if (!expr || expr === '0') {
        return '0';
      }

      // Check for invalid patterns
      if (/[+\-*/]$/.test(expr.trim()) || /^[+*/]/.test(expr.trim())) {
        return '0';
      }

      // Replace operators with proper spacing for evaluation
      let sanitized = expr.trim();

      // Replace consecutive operators (invalid)
      if (/[+\-*/]{2,}/.test(sanitized)) {
        return '0';
      }

      // Use Function constructor for safe evaluation (alternative to eval)
      // Handle negative numbers at the start
      sanitized = sanitized.replace(/^-/, '0-');

      // Validate decimal points
      const tokens = sanitized.split(/([+\-*/])/);
      for (let token of tokens) {
        if (token && !/^[+\-*/]$/.test(token)) {
          if ((token.match(/\./g) || []).length > 1) {
            return '0'; // Multiple decimals in one number
          }
        }
      }

      // Evaluate using Function constructor (safer than eval)
      // eslint-disable-next-line no-new-func
      const func = new Function('return ' + sanitized);
      const rawResult = func();

      // Check for division by zero
      if (!isFinite(rawResult)) {
        return '0'; // Handle Infinity or NaN
      }

      // Handle very large numbers
      if (Math.abs(rawResult) > 1e15) {
        return rawResult.toExponential(6);
      }

      // Round to avoid floating point errors
      const decimalResult = new Decimal(rawResult);
      const rounded = decimalResult.toDecimalPlaces(10).toString();

      // Remove trailing zeros after decimal point
      if (rounded.includes('.')) {
        return rounded.replace(/\.?0+$/, '');
      }

      return rounded;
    } catch (e) {
      console.log('Error evaluating expression:', e.message);
      return '0';
    }
  };

  const handleButtonPress = (value) => {
    console.log(value);

    if (value === 'AC') {
      setExpression('0');
      setResult('0');
    } else if (value === 'C') {
      if (expression.length > 1) {
        setExpression(expression.slice(0, -1));
      } else {
        setExpression('0');
      }
    } else if (value === '=') {
      const calculatedResult = evaluateExpression(expression);
      setResult(calculatedResult);
      setExpression(calculatedResult);
    } else if (['+', '-', '*', '/'].includes(value)) {
      // Handle operators
      if (expression === '0' && value === '-') {
        // Allow negative number
        setExpression('-');
      } else if (expression === '0') {
        // Replace 0 with operator (except for negative)
        setExpression(value);
      } else if (/[+\-*/]$/.test(expression)) {
        // If last character is operator, replace it
        setExpression(expression.slice(0, -1) + value);
      } else {
        setExpression(expression + value);
      }
    } else {
      // Numbers and decimal point
      if (value === '.') {
        // Check if decimal already exists in current number
        const lastOperatorIndex = Math.max(
          expression.lastIndexOf('+'),
          expression.lastIndexOf('-'),
          expression.lastIndexOf('*'),
          expression.lastIndexOf('/')
        );
        const currentNumber = expression.substring(lastOperatorIndex + 1);
        if (currentNumber.includes('.')) {
          return; // Don't add another decimal
        }
        setExpression(expression + value);
      } else {
        // Number
        if (expression === '0' && value !== '0') {
          setExpression(value);
        } else if (expression === '0' && value === '0') {
          // Don't add multiple leading zeros
          return;
        } else {
          setExpression(expression + value);
        }
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
                    backgroundColor: ['AC', 'C'].includes(btn)
                      ? '#e74c3c'
                      : ['/', '*', '+', '-', '='].includes(btn)
                        ? '#f39c12'
                        : '#3498db',
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
