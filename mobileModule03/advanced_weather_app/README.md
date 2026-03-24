# Piscine Mobile - Module 03: Design

## Summary
This module focuses on enhancing the weather app with a professional design, including styled UI components, temperature charts, and weather visualizations.

**Version:** 1.2

---

## Table of Contents
1. [Instructions](#instructions)
2. [Specific Instructions](#specific-instructions)
3. [Introduction](#introduction)
4. [Exercise 00: Search bar](#exercise-00-search-bar)
5. [Exercise 01: Background](#exercise-01-background)
6. [Exercise 02: Current weather](#exercise-02-current-weather)
7. [Exercise 03: Today's weather](#exercise-03-todays-weather)
8. [Exercise 04: Weekly weather](#exercise-04-weekly-weather)
9. [Submission and peer-evaluation](#submission-and-peer-evaluation)

---

## Instructions

- If you have problems installing the tools needed for your project on the 42 computers, you can use a virtual machine
- Only this page will serve as reference. Do not trust rumors
- Read attentively the whole document before beginning
- Your exercises will be corrected by your piscine colleagues
- The document can be relied upon, do not blindly trust the demos or pictures example which can contain not required additions
- Got a question? Ask your peer on the right. Otherwise, try your peer on the left
- By Odin, by Thor! Use your brain!

**Note:** Intra indicates the date and the hour of closing for your repositories. This date and hour also corresponds to the beginning of the peer-evaluation period. This peer-evaluation period lasts exactly 24h. After 24h passed, your missing peer grades will be completed with a 0.

---

## Specific Instructions

In this module, you will continue developing your project from the previous module. For clarity and to avoid confusion, you will copy your previous project into a new folder and continue working on it.

---

## Introduction

Congratulations! You have completed the previous module and have a working app. Now it's time to make it more visually appealing and functional!

You are free to choose any design you want, as long as you follow the constraints imposed by the subject.

The choice of a color palette is important for any application. While this will not be graded, it's worth noting that the theme of an application is rarely chosen at random.

---

## Exercise 00: Search bar

**Turn-in directory:** `mobileModule03`  
**Files to turn in:** `advanced_weather_app` and all necessary files  
**Forbidden functions:** None

### Objective
Create a visually appealing and easy-to-use search bar.

### Requirements
- The search bar and list of suggestions should be visually appealing and easy to see
- The geolocation button must be clearly visible
- The user must understand the purpose of the search bar and what they are searching for
- Display **maximum 5 suggestions** at the same time
- The city name should be clearly visible in suggestions
- Include location icon with city name and region/country information

### Implementation Details
- Search input with clear placeholder text
- GPS geolocation button with distinct color
- Suggestion list with city icon, name, and location info
- Responsive and touch-friendly UI elements

---

## Exercise 01: Background

**Turn-in directory:** `mobileModule03`  
**Files to turn in:** `advanced_weather_app` and all necessary files  
**Forbidden functions:** None

### Objective
Add a professional background that enhances the app without obstructing information.

### Requirements
- The background image must be relevant to the app (weather-themed)
- It should not obstruct the display of information
- It must cover the entire screen
- When switching between tabs, the background must remain fixed and should not change
- The background should not be duplicated—it should be present once at the base of your application and visible throughout

### Implementation Details
- Background image applied at the app level (using ImageBackground)
- Semi-transparent overlay (rgba) to ensure text readability
- Maintains continuity across all tabs
- Responsive to screen orientation

---

## Exercise 02: Current weather

**Turn-in directory:** `mobileModule03`  
**Files to turn in:** `advanced_weather_app` and all necessary files  
**Forbidden functions:** None

### Objective
Display the current weather with a professional and intuitive design.

### Required Information
- The location (city name, region, and country)
- The current temperature (prominently displayed)
- The current weather description
- The current weather icon
- The current wind speed

### Design Requirements
- All information must be clearly visible and well-placed
- Users should understand what the app is displaying within 3 seconds
- Use weather icons to represent conditions visually
- Information should be organized in an easy-to-scan layout
- Card-based design with good contrast

### Implementation Details
- Large temperature display (72pt font)
- Weather icon matching the current condition
- Color-coded information sections
- Wind speed with icon indicator
- Smooth loading state with spinner

---

## Exercise 03: Today's weather

**Turn-in directory:** `mobileModule03`  
**Files to turn in:** `advanced_weather_app` and all necessary files  
**Forbidden functions:** None

### Objective
Display hourly weather forecast with a chart and detailed list.

### Required Information
- The location (city name, region, and country)
- A chart with a temperature curve for the day
- A list containing:
  - The time of day
  - The temperature
  - The weather condition (icon or text)
  - The wind speed

### Design Requirements
- The chart must display the hours and temperature
- The list must be scrollable
- Each hour should show weather icon and key information
- Organized grid layout for hourly cards
- Chart with clear axis labels and data points

### Implementation Details
- Line chart displaying hourly temperatures using react-native-chart-kit
- First 12 hours of the day displayed on chart
- Complete 24-hour list in 2-column grid format
- Scrollable list view with proper spacing
- Color-coded temperature lines
- Interactive visualization

---

## Exercise 04: Weekly weather

**Turn-in directory:** `mobileModule03`  
**Files to turn in:** `advanced_weather_app` and all necessary files  
**Forbidden functions:** None

### Objective
Display weekly weather forecast with a chart and detailed list.

### Required Information
- The location (city name, region, and country)
- A chart with two curves: one for minimum and one for maximum temperature
- A list containing:
  - The day of the week
  - The minimum temperature
  - The maximum temperature
  - The weather condition (icon or text)

### Design Requirements
- The chart must display the days of the week along with min/max temperatures
- The list must be scrollable
- Distinct colors for min and max temperatures
- Clear day labels on the chart
- Temperature ranges displayed in the list

### Implementation Details
- Dual-line chart for min/max temperatures using react-native-chart-kit
- 7-day forecast with day names
- Each day showing date, min/max temps, and weather condition
- Color-coded temps (warm vs. cool)
- Weather icons for each day
- Scrollable list with proper spacing

---

## Design Specifications

### Color Palette
- **Primary Accent:** #FF6B6B (Warm/Hot indicator)
- **Secondary Accent:** #4ECDC4 (Cold/Cool indicator)
- **Surface:** rgba(255, 255, 255, 0.1) (Semi-transparent white)
- **Text:** #FFFFFF (White)
- **Error:** #FF6B6B (Red)

### Typography
- Titles: 18pt, Semi-bold (600)
- Large Display: 72pt, Bold
- Body: 14-16pt, Regular
- Small: 11-13pt, Regular
- Labels: 12pt, Semi-bold (600)

### Spacing
- Padding: 16pt standard
- Gaps between elements: 8-12pt
- Border radius: 12-20pt for rounded corners

### Components
- Cards: Semi-transparent with border
- Buttons: Rounded corners, clear affordance
- Icons: 20-40pt size, white color
- Charts: Transparent background, white text

---

## Submission and peer-evaluation

Turn in your assignment in your Git repository as usual. Only the work inside your repository will be evaluated during the defense. Don't hesitate to double check the names of your folders and files to ensure they are correct.

The evaluation process will happen on the computer of the evaluated group.

---

## Project Structure

```
mobileModule03/
├── advanced_weather_app/
│   ├── App.js (Main application with design)
│   ├── package.json (Dependencies)
│   └── README.md (This file)
```

## Key Dependencies

- `react-native-chart-kit`: For temperature curve charts
- `react-native-vector-icons`: For weather and UI icons
- `@react-navigation/material-bottom-tabs`: For styled bottom navigation

## Getting Started

### Prerequisites
- React Native environment set up
- Node.js and npm installed

### Installation

```bash
# Install dependencies
npm install
```

### Running the App

```bash
# For Android
npm run android

# For iOS
npm run ios

# Start the development server
npm start
```

## Design Highlights

✓ Professional background image with overlay
✓ Styled search bar with max 5 suggestions
✓ Weather-themed color scheme
✓ Clear weather icons for each condition
✓ Temperature charts for hourly and weekly data
✓ Responsive grid layouts
✓ Smooth animations and transitions
✓ Fixed background across all tabs
✓ Intuitive information hierarchy

## Notes

- This module focuses on design and user experience
- The 3-second rule: Users should understand what's displayed within 3 seconds
- Weather icons are automatically selected based on weather conditions
- Charts are responsive and scale to screen size
- All colors and styling follow the specified palette
