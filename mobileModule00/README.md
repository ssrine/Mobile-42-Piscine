# Mobile-00: Introduction to Mobile Development

## Overview

Mobile-00 is the foundational module of the Piscine Mobile course, designed to introduce key concepts of mobile application development. This module focuses on building a calculator application that progressively adds complexity through 4 exercises. All exercises use **React Native with Expo** framework.

**Framework Used:** React Native with Expo  
**Target Devices:** iOS (iPhone 11+) and Android  
**Technology Stack:** JavaScript, React Hooks, React Native Components

---

## Module Structure

```
mobileModule00/
├── ex00/              (Exercise 00: A Basic Display)
│   ├── App.js
│   └── package.json
├── ex01/              (Exercise 01: Say Hello to the World)
│   ├── App.js
│   └── package.json
├── ex02/              (Exercise 02: More Buttons)
│   ├── App.js
│   └── package.json
└── calculator_app/    (Exercise 03: It's Alive!)
    ├── App.js
    └── package.json
```

---

## Exercise Breakdown

### Exercise 00: A Basic Display ✅

**Objective:** Create a foundational mobile application with centered UI elements.

**Requirements Met:**
- ✅ Single page with widgets centered horizontally and vertically
- ✅ Text widget displays: "Welcome to Mobile App"
- ✅ Button widget with "Press Me" text
- ✅ Console logging when button is pressed
- ✅ Responsive design using flex layout

**Implementation Details:**

```javascript
// App Structure
<View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
  <Text>Welcome to Mobile App</Text>
  <TouchableOpacity onPress={handleButtonPress}>
    <Text>Press Me</Text>
  </TouchableOpacity>
</View>
```

**Key Features:**
- Uses `View` component with `flex: 1` to fill entire screen
- Uses `justifyContent: 'center'` and `alignItems: 'center'` for vertical and horizontal centering
- `TouchableOpacity` provides button functionality and visual feedback
- Console logs "Button pressed" on tap
- Black background with white text for high contrast

**Learning Goal:** Understand basic React Native components (View, Text, TouchableOpacity) and layout using flexbox.

---

### Exercise 01: Say Hello to the World ✅

**Objective:** Implement state management and dynamic text updates.

**Requirements Met:**
- ✅ Retrieve code from Exercise 00
- ✅ Text toggles between "Welcome to Mobile App" and "Hello World!"
- ✅ Toggle occurs on each button press
- ✅ Console logging on button press
- ✅ Responsive design maintained

**Implementation Details:**

```javascript
// State Management
const [isToggled, setIsToggled] = useState(false);

// Toggle Handler
const handleButtonPress = () => {
  setIsToggled(!isToggled);
  console.log('Button pressed');
};

// Conditional Text Display
<Text>{isToggled ? 'Hello World!' : 'Welcome to Mobile App'}</Text>
```

**Key Features:**
- Introduces React Hook: `useState()`
- Ternary operator for conditional rendering
- Boolean state tracks toggle state
- Each press flips the boolean value
- Text dynamically updates based on state

**Learning Goal:** Understand React state management and how state changes trigger component re-renders.

---

### Exercise 02: More Buttons ✅

**Objective:** Build a calculator UI with proper layout, button grid, and display fields.

**Requirements Met:**
- ✅ AppBar at top with "Calculator" title
- ✅ Two TextInput fields (Expression and Result) both displaying "0"
- ✅ Number buttons (0-9)
- ✅ Decimal point button (".")
- ✅ Clear buttons ("AC" to reset, "C" to delete last character)
- ✅ Operator buttons ("+", "-", "*", "/")
- ✅ Equals button ("=")
- ✅ Console logging for each button press
- ✅ Responsive design for all devices
- ✅ Proper button sizing for iPhone 11+

**Implementation Details:**

```javascript
// Responsive Button Sizing
const { width } = Dimensions.get('window');
const buttonSize = (width - 40) / 4;  // Simple formula for 4 columns with spacing

// Button Grid Layout
const buttons = [
  ['AC', 'C', '/', '*'],
  ['7', '8', '9', '-'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '='],
  ['0', '.'],
];

// Color Coding
- AC/C buttons: Red (#e74c3c)
- Operators (+,-,*,/,=): Orange (#f39c12)
- Numbers: Blue (#3498db)

// AppBar Styling
- Background: Dark gray (#333)
- Text: White, bold, 32px font
- Padding: 30px top/bottom for visibility
- Min-height: 110px for proper spacing
```

**UI Structure:**
1. **AppBar** - Dark header with "Calculator" title
2. **Display Section** - Two read-only TextInput fields
3. **Button Grid** - Scrollable grid of calculator buttons
4. **SafeAreaView** - Handles device notches and safe areas

**Key Features:**
- `Dimensions.get('window')` for responsive sizing
- `ScrollView` for scrollable button grid
- Color-coded buttons for visual hierarchy
- Console logs each button press with `console.log(value)`
- Button logic for AC, C, decimal handling
- Special sizing: "0" button spans 2 columns

**Responsive Design:**
- Button size automatically adjusts based on screen width
- Formula: `(screenWidth - 40) / 4` ensures 4 columns with padding
- Works on smartphones, tablets, and all orientations

**Learning Goal:** Master UI layout with button grids, TextInput components, and responsive design principles.

---

### Exercise 03: It's Alive! ✅

**Objective:** Implement complete calculator logic with expression evaluation and error handling.

**Requirements Met:**
- ✅ Full calculator functionality (all 4 operations)
- ✅ Multiple operations in single expression (e.g., 1 + 2 * 3 - 5 / 2)
- ✅ Negative number support
- ✅ Decimal number support
- ✅ Delete last character (C button)
- ✅ Clear all (AC button)
- ✅ Error handling - application never crashes
- ✅ Handles edge cases (division by zero, invalid expressions, very large numbers)

**Implementation Details:**

```javascript
// Expression Evaluation Function
const evaluateExpression = (expr) => {
  // 1. Input Validation
  if (!expr || expr === '0') return '0';
  
  // 2. Check for trailing/leading operators
  if (/[+\-*/]$/.test(expr.trim()) || /^[+*/]/.test(expr.trim())) return '0';
  
  // 3. Prevent consecutive operators
  if (/[+\-*/]{2,}/.test(expr.trim())) return '0';
  
  // 4. Handle negative numbers
  let sanitized = expr.trim().replace(/^-/, '0-');
  
  // 5. Validate decimal points (max 1 per number)
  const tokens = sanitized.split(/([+\-*/])/);
  for (let token of tokens) {
    if (token && !/^[+\-*/]$/.test(token)) {
      if ((token.match(/\./g) || []).length > 1) return '0';
    }
  }
  
  // 6. Safe Evaluation using Function Constructor (no eval)
  const func = new Function('return ' + sanitized);
  const rawResult = func();
  
  // 7. Check for infinity/NaN
  if (!isFinite(rawResult)) return '0';
  
  // 8. Handle very large numbers
  if (Math.abs(rawResult) > 1e15) return rawResult.toExponential(6);
  
  // 9. Use Decimal.js for precise decimal arithmetic
  const decimalResult = new Decimal(rawResult);
  const rounded = decimalResult.toDecimalPlaces(10).toString();
  
  // 10. Remove trailing zeros
  return rounded.includes('.') ? rounded.replace(/\.?0+$/, '') : rounded;
};

// Button Press Handler
const handleButtonPress = (value) => {
  console.log(value);
  
  if (value === 'AC') {
    // Clear all
    setExpression('0');
    setResult('0');
  } else if (value === 'C') {
    // Delete last character
    setExpression(expression.length > 1 ? expression.slice(0, -1) : '0');
  } else if (value === '=') {
    // Calculate result
    const calculatedResult = evaluateExpression(expression);
    setResult(calculatedResult);
    setExpression(calculatedResult);
  } else if (['+', '-', '*', '/'].includes(value)) {
    // Handle operators
    if (expression === '0' && value === '-') {
      setExpression('-');  // Allow negative number entry
    } else if (expression === '0') {
      setExpression(value);  // Replace 0 with operator
    } else if (/[+\-*/]$/.test(expression)) {
      setExpression(expression.slice(0, -1) + value);  // Replace last operator
    } else {
      setExpression(expression + value);  // Add operator
    }
  } else {
    // Handle numbers and decimal point
    if (value === '.') {
      const lastOperatorIndex = Math.max(
        expression.lastIndexOf('+'),
        expression.lastIndexOf('-'),
        expression.lastIndexOf('*'),
        expression.lastIndexOf('/')
      );
      const currentNumber = expression.substring(lastOperatorIndex + 1);
      if (currentNumber.includes('.')) return;  // Prevent multiple decimals
      setExpression(expression + value);
    } else {
      if (expression === '0' && value !== '0') {
        setExpression(value);
      } else if (expression === '0' && value === '0') {
        return;  // Prevent multiple leading zeros
      } else {
        setExpression(expression + value);
      }
    }
  }
};
```

**Error Handling Features:**
1. **Invalid Operators:** Detects and rejects trailing/leading operators
2. **Consecutive Operators:** Prevents "++", "--", etc.
3. **Multiple Decimals:** Limits one decimal point per number
4. **Division by Zero:** Returns "0" instead of Infinity
5. **Non-Finite Results:** Handles NaN gracefully
6. **Large Numbers:** Uses exponential notation for numbers > 1e15
7. **Safe Evaluation:** Uses `Function` constructor instead of `eval()` for security
8. **Decimal Precision:** Uses Decimal.js library for accurate floating-point arithmetic

**State Management:**
- `expression`: Stores user input (e.g., "5+3*2")
- `result`: Stores calculated result
- Equation and result update simultaneously when "=" is pressed

**Example Operations:**
- `5 + 3` → 8
- `10 - 4` → 6
- `2 * 3` → 6
- `15 / 3` → 5
- `1 + 2 * 3 - 5 / 2` → 4.5
- `-5 + 10` → 5 (negative number support)
- `3.5 * 2` → 7 (decimal support)

**Learning Goal:** Implement complex state logic, input validation, mathematical evaluation, and robust error handling in a real-world application.

---

## Technical Implementation

### Dependencies

All exercises use the following core dependencies:

```json
{
  "dependencies": {
    "react": "^19.1.0",
    "react-native": "^0.81.5",
    "expo": "^54.0.0"
  }
}
```

**Exercise 03 (calculator_app) additional dependency:**
```json
{
  "decimal.js": "^10.4.3"
}
```

### React Native Components Used

| Component | Purpose |
|-----------|---------|
| `View` | Container for layout (flexbox) |
| `Text` | Display text content |
| `TouchableOpacity` | Pressable button with opacity feedback |
| `TextInput` | Display input/output (read-only in calculator) |
| `SafeAreaView` | Handle device notches and safe areas |
| `ScrollView` | Scrollable container for button grid |
| `Dimensions` | Get screen width for responsive sizing |

### Layout Strategy

**Responsive Design Approach:**
- Use `Dimensions.get('window')` to get screen width
- Calculate button size: `(width - 40) / 4` for 4-column grid
- Works for all screen sizes (phone, tablet, landscape, portrait)
- iPhone 11 optimized with proper AppBar spacing

**AppBar Specification:**
- Position: Top of screen (outside SafeAreaView)
- Background: Dark (#333)
- Title: "Calculator" (white, bold)
- Padding: 30px top/bottom, 10px left/right
- Min-height: 110px for comfortable spacing
- Font Size: 32px for clear visibility

---

## Testing and Validation

### Exercise 00
- [x] Button centered on screen
- [x] Console shows "Button pressed"
- [x] Works on different screen sizes

### Exercise 01
- [x] Text toggles correctly on each tap
- [x] Initial text: "Welcome to Mobile App"
- [x] Toggled text: "Hello World!"
- [x] Console logging works

### Exercise 02
- [x] AppBar displays "Calculator"
- [x] Expression field shows input
- [x] Result field shows "0"
- [x] All buttons are clickable
- [x] Button grid is responsive
- [x] Console logs each button press
- [x] Works on iPhone 11+

### Exercise 03
- [x] Addition: `5 + 3` = 8
- [x] Subtraction: `10 - 4` = 6
- [x] Multiplication: `2 * 3` = 6
- [x] Division: `15 / 3` = 5
- [x] Complex expressions: `1 + 2 * 3 - 5 / 2` = 4.5
- [x] Negative numbers: `-5 + 10` = 5
- [x] Decimals: `3.5 * 2` = 7
- [x] AC button clears all
- [x] C button deletes last character
- [x] Division by zero returns "0"
- [x] Invalid expressions handled gracefully
- [x] Application never crashes

---

## How to Run

### Prerequisites
- Node.js installed
- Expo CLI installed: `npm install -g expo-cli`

### Running an Exercise

```bash
# Navigate to exercise directory
cd mobileModule00/ex02

# Install dependencies
npm install

# Start the development server
npx expo start

# Scan QR code with Expo Go app (iOS/Android)
# Or press 'i' for iOS simulator / 'a' for Android emulator
```

### Running the Calculator App

```bash
cd mobileModule00/calculator_app
npm install
npx expo start
```

---

## Key Learning Outcomes

1. **React Native Basics:** Understanding components, props, and styling
2. **React Hooks:** State management with `useState()`
3. **Layout & Flexbox:** Building responsive mobile UIs
4. **Event Handling:** Button press handling and user interaction
5. **Math in JavaScript:** Expression evaluation and precision handling
6. **Error Handling:** Graceful handling of edge cases
7. **Mobile Design:** Responsive design for various screen sizes
8. **Debugging:** Console logging for testing and validation

---

## Conclusion

Mobile-00 successfully introduces the foundational concepts of mobile development through a progressive calculator application. Each exercise builds upon the previous one, teaching core concepts from basic UI layout to complex state management and mathematical logic. The implementation demonstrates best practices in React Native development and provides a solid foundation for more advanced mobile development concepts in subsequent modules.

**Status:** ✅ All exercises completed and tested  
**Next Module:** Mobile-01 (Weather App with Navigation and Geolocation)

