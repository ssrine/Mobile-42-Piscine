import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useState } from 'react';
import Decimal from 'decimal.js';

export default function App() {
  const [expression, setExpression] = useState('0');
  const [result, setResult] = useState('0');

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const buttons = [
    ['AC', 'C', '/', '*'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', '', ''],
  ];

  // Dynamic button sizing
  const horizontalPadding = 20;
  const verticalPadding = 20;
  const buttonCols = 4;
  const buttonRows = 5;
  const bottomSpace = isLandscape ? 40 : 20;

  const buttonWidth =
    (width - horizontalPadding * 2 - 10 * (buttonCols - 1)) / buttonCols;
  const buttonHeight =
    (height * (isLandscape ? 0.65 : 0.5) -
      verticalPadding * 2 -
      10 * (buttonRows - 1) -
      bottomSpace) /
    buttonRows;

  const fontSize = Math.min(buttonWidth, buttonHeight) / 2.5;
  const displayFontSize = fontSize * 1.2;

  // ---------------------------
  // Calculator Logic
  // ---------------------------
  const evaluateExpression = (expr) => {
    try {
      if (!expr || expr === '0') return '0';
      if (/[+\-*/]$/.test(expr) || /^[+*/]/.test(expr)) return '0';
      if (/[+\-*/]{2,}/.test(expr)) return '0';

      let sanitized = expr.replace(/^-/, '0-');
      const parts = sanitized.split(/([+\-*/])/);
      for (let p of parts) {
        if (p && !/^[+\-*/]$/.test(p)) {
          if ((p.match(/\./g) || []).length > 1) return '0';
        }
      }

      if (/\/0+(\D|$)/.test(sanitized)) return '0';
      const func = new Function('return ' + sanitized);
      const raw = func();

      if (!isFinite(raw)) return '0';
      if (Math.abs(raw) > 1e15) return raw.toExponential(6);

      const decimal = new Decimal(raw);
      let rounded = decimal.toDecimalPlaces(10).toString();
      if (rounded.includes('.')) rounded = rounded.replace(/\.?0+$/, '');
      return rounded;
    } catch {
      return '0';
    }
  };

  const handleButtonPress = (value) => {
    console.log('Pressed:', value);

    if (value === 'AC') {
      setExpression('0');
      setResult('0');
      return;
    }
    if (value === 'C') {
      setExpression(expression.length > 1 ? expression.slice(0, -1) : '0');
      return;
    }
    if (value === '=') {
      const res = evaluateExpression(expression);
      setResult(res);
      setExpression(res);
      return;
    }
    if (['+', '-', '*', '/'].includes(value)) {
      if (expression === '0' && value === '-') {
        setExpression('-');
        return;
      }
      if (/[+\-*/]$/.test(expression)) {
        setExpression(expression.slice(0, -1) + value);
      } else {
        setExpression(expression + value);
      }
      return;
    }
    if (value === '.') {
      const lastOp = Math.max(
        expression.lastIndexOf('+'),
        expression.lastIndexOf('-'),
        expression.lastIndexOf('*'),
        expression.lastIndexOf('/')
      );
      const current = expression.substring(lastOp + 1);
      if (current.includes('.')) return;
      setExpression(expression + value);
      return;
    }
    if (expression === '0') setExpression(value);
    else setExpression(expression + value);
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <View style={{ flex: 1, backgroundColor: '#2f3e46' }}>
      <StatusBar barStyle="light-content" />

      {/* AppBar */}
      <SafeAreaView style={{ backgroundColor: '#344e41' }}>
        <View style={{ paddingVertical: 15, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>Calculator</Text>
        </View>
      </SafeAreaView>

      {/* Main */}
      <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: horizontalPadding }}>
        {/* Display */}
        <View style={{ paddingVertical: 10 }}>
          <Text style={{ color: '#aaa', fontSize: 16, textAlign: 'right' }}>Expression</Text>
          <TextInput
            value={expression}
            editable={false}
            style={{
              color: '#fff',
              fontSize: displayFontSize,
              textAlign: 'right',
              marginBottom: 10,
            }}
          />

          <Text style={{ color: '#aaa', fontSize: 16, textAlign: 'right' }}>Result</Text>
          <TextInput
            value={result}
            editable={false}
            style={{
              color: '#fff',
              fontSize: displayFontSize,
              textAlign: 'right',
            }}
          />
        </View>

        {/* Buttons */}
        <View style={{ paddingBottom: bottomSpace }}>
          {buttons.map((row, i) => (
            <View
              key={i}
              style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}
            >
              {row.map((btn, j) => {
                if (!btn) return <View key={j} style={{ width: buttonWidth, height: buttonHeight }} />;

                let bg = '#84a98c';
                let color = '#000';
                if (['AC', 'C'].includes(btn)) {
                  bg = '#e63946';
                  color = '#fff';
                }
                if (['/', '*', '+', '-', '='].includes(btn)) {
                  bg = '#f4a261';
                  color = '#fff';
                }

                const widthBtn = btn === '0' ? buttonWidth * 2 + 10 : buttonWidth;
                const borderRadius = btn === '0' ? 12 : 8;

                return (
                  <TouchableOpacity
                    key={j}
                    onPress={() => handleButtonPress(btn)}
                    style={{
                      width: widthBtn,
                      height: buttonHeight,
                      backgroundColor: bg,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: borderRadius,
                    }}
                  >
                    <Text style={{ fontSize: fontSize, color, fontWeight: 'bold' }}>{btn}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}