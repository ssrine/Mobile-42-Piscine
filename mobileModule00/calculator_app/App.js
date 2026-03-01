import { View, Text, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useState } from 'react';
import Decimal from 'decimal.js';

export default function App() {
  const [expression, setExpression] = useState('0');
  const [result, setResult] = useState('0');
  const { width } = Dimensions.get('window');

  const buttonSize = (width - 40) / 4;

  const evaluateExpression = (expr) => {
    try {
      if (!expr || expr === '0') {
        return '0';
      }

      if (/[+\-*/]$/.test(expr.trim()) || /^[+*/]/.test(expr.trim())) {
        return '0';
      }

      let sanitized = expr.trim();

      if (/[+\-*/]{2,}/.test(sanitized)) {
        return '0';
      }

      sanitized = sanitized.replace(/^-/, '0-');

      const tokens = sanitized.split(/([+\-*/])/);
      for (let token of tokens) {
        if (token && !/^[+\-*/]$/.test(token)) {
          if ((token.match(/\./g) || []).length > 1) {
            return '0';
          }
        }
      }

      // eslint-disable-next-line no-new-func
      const func = new Function('return ' + sanitized);
      const rawResult = func();

      if (!isFinite(rawResult)) {
        return '0';
      }

      if (Math.abs(rawResult) > 1e15) {
        return rawResult.toExponential(6);
      }

      const decimalResult = new Decimal(rawResult);
      const rounded = decimalResult.toDecimalPlaces(10).toString();

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
      if (expression === '0' && value === '-') {
        setExpression('-');
      } else if (expression === '0') {
        setExpression(value);
      } else if (/[+\-*/]$/.test(expression)) {
        setExpression(expression.slice(0, -1) + value);
      } else {
        setExpression(expression + value);
      }
    } else {
      if (value === '.') {
        const lastOperatorIndex = Math.max(
          expression.lastIndexOf('+'),
          expression.lastIndexOf('-'),
          expression.lastIndexOf('*'),
          expression.lastIndexOf('/')
        );
        const currentNumber = expression.substring(lastOperatorIndex + 1);
        if (currentNumber.includes('.')) {
          return;
        }
        setExpression(expression + value);
      } else {
        if (expression === '0' && value !== '0') {
          setExpression(value);
        } else if (expression === '0' && value === '0') {
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
