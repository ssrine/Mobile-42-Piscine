# Exercise 03: It's Alive! - Full Calculator App

## Objective
Transform Exercise 02 into a fully functional calculator that evaluates mathematical expressions with proper error handling.

## Features
- Fully functional calculator with expression evaluation
- Supports all operations:
  - Addition (+)
  - Subtraction (-)
  - Multiplication (*)
  - Division (/)
- Expression capabilities:
  - Multiple operations in one expression (e.g., 1 + 2 * 3 - 5 / 2)
  - Negative numbers (press "-" before entering a number)
  - Decimal numbers
  - Delete last character with "C"
  - Clear all with "AC"
- Robust error handling:
  - Division by zero handling (returns 0)
  - Invalid expressions (returns 0)
  - Prevents multiple decimal points in one number
  - Prevents consecutive operators
  - Prevents expressions starting with operators
  - Handles very large numbers (scientific notation)
  - **Application NEVER crashes**
- Debug console logging for all button presses
- Responsive design for all devices
- Uses Decimal.js for precise arithmetic

## How to Run
```bash
npm install
npm start
```

Then select your platform:
- `a` for Android
- `i` for iOS
- `w` for Web

## Implementation Details
- Expression evaluation using Function constructor (safer than eval)
- Decimal.js library for accurate decimal arithmetic
- Input validation for all edge cases
- Floating-point error prevention with proper rounding
- Comprehensive error handling with try-catch
- Console logging for debugging
- Responsive grid layout with color-coded buttons

## Example Usage
1. Enter expression: `5 + 3 * 2`
2. Press `=` → displays `11`
3. Clear with `AC` → displays `0`
4. Enter negative: `-5 + 3` → press `=` → displays `-2`
5. Decimal: `10 / 3` → press `=` → displays appropriate result
6. Division by zero: `5 / 0` → handled gracefully, returns `0`
