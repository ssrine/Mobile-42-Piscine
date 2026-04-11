import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const buttons = [
    ['AC', 'C', '/', '*'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', '', ''], 
  ];

  const horizontalPadding = 20;
  const verticalPadding = 20;
  const buttonCols = 4;
  const buttonRows = 5;

  const bottomSpace = isLandscape ? 40 : 20;

  const buttonWidth =
    (width - horizontalPadding * 2 - 10 * (buttonCols - 1)) / buttonCols;
  const buttonHeight =
    (height * (isLandscape ? 0.65 : 0.5) - verticalPadding * 2 - 10 * (buttonRows - 1) - bottomSpace) /
    buttonRows;

  const fontSize = Math.min(buttonWidth, buttonHeight) / 2.5;
  const displayFontSize = fontSize * 1.2;

  return (
    <View style={{ flex: 1, backgroundColor: '#2f3e46' }}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={{ backgroundColor: '#344e41' }}>
        <View style={{ paddingVertical: 15, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>Calculator</Text>
        </View>
      </SafeAreaView>

      <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: horizontalPadding }}>
        <View style={{ paddingVertical: 10 }}>
          <Text style={{ color: '#aaa', fontSize: 16, textAlign: 'right' }}>Expression</Text>
          <TextInput
            value="0"
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
            value="0"
            editable={false}
            style={{
              color: '#fff',
              fontSize: displayFontSize,
              textAlign: 'right',
            }}
          />
        </View>

        <View style={{ paddingBottom: bottomSpace }}>
          {buttons.map((row, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
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

                let widthBtn = btn === '0' ? buttonWidth * 2 + 10 : buttonWidth;
                let borderRadius = btn === '0' ? 12 : 8;

                return (
                  <TouchableOpacity
                    key={j}
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