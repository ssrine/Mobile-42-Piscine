# Piscine Mobile - Module 02: API and Data Management

## Summary
This module builds upon Module 01 to add real data to the weather app using APIs and device geolocation.

**Version:** 2.2

---

## Table of Contents
1. [Instructions](#instructions)
2. [Specific Instructions](#specific-instructions)
3. [Introduction](#introduction)
4. [Exercise 00: Where are we?](#exercise-00-where-are-we)
5. [Exercise 01: Searcher](#exercise-01-searcher)
6. [Exercise 02: Fill the Views](#exercise-02-fill-the-views)
7. [Exercise 03: What's wrong with you?](#exercise-03-whats-wrong-with-you)
8. [Submission and peer-evaluation](#submission-and-peer-evaluation)

---

## Instructions

- Only this page will serve as reference. Do not trust rumors.
- Read attentively the whole document before beginning.
- Your exercises will be corrected by your piscine colleagues.
- The document can be relied upon, do not blindly trust the demos or pictures example which can contain not required additions.
- Got a question? Ask your peer on the right. Otherwise, try your peer on the left.
- By Odin, by Thor! Use your brain!

**Note:** Intra indicates the date and the hour of closing for your repositories. This date and hour also corresponds to the beginning of the peer-evaluation period for the corresponding piscine day. This peer-evaluation period lasts exactly 24h. After 24h passed, your missing peer grades will be completed with a 0.

---

## Specific Instructions

This module is a continuation of the previous one. For clarity, you will copy the project from the previous module into a new repository to continue working on it.

---

## Introduction

In this module, you'll enhance your weather app by integrating real APIs and device geolocation capabilities.

---

## Exercise 00: Where are we?

**Turn-in directory:** `mobileModule02`  
**Files to turn in:** `medium_weather_app` and all necessary files  
**Forbidden functions:** None

### Objective
In the previous module, you created a weather app that currently displays simple text. Now it's time to add real data to your app.

To achieve this, you will need:
- A weather API
- Geolocation using the device's GPS
- A Geocoding API to retrieve the city name from the coordinates

### Implementation

Start by implementing geolocation. When the application starts or when the user clicks a geolocation button, you need to determine the device's location to fetch the weather.

**Requirements:**
- Use the device's GPS to get the coordinates
- This requires obtaining the user's permission to retrieve and use their location
- Handle both cases: when the user grants permission and when they deny it

**Permission Granted:**
- Retrieve the coordinates and use them to fetch the weather
- For now, just display the coordinates as text

**Permission Denied:**
- Your app should still function
- The user should be able to enter a city name in the search field to get the weather
- The user must be informed that you don't have access to their location

### Important Notes
You must not use an external API for geolocation; you are required to use the device's GPS to obtain the coordinates.

---

## Exercise 01: Searcher

**Turn-in directory:** `mobileModule02`  
**Files to turn in:** `medium_weather_app` and all necessary files  
**Forbidden functions:** None

### Objective
Implement a search functionality to get weather by entering a city name, country, region, etc.

### Implementation

**Search Functionality:**
- Use the weather API to get the weather
- Use the Geocoding API to obtain city names from coordinates or coordinates from city names
- When you query the API for weather by city name, you will often receive a list of cities matching the name you entered

**Suggestion List:**
Display a suggestion list of cities with each suggestion showing:
- The city name
- The city's region
- The country of the city

This will allow the user to choose the correct city.

**Dynamic Updates:**
- The suggestion list should update dynamically as the user types in the search bar
- When the user selects a city from the list, fetch the weather for that specific city
- The user should also be able to search without selecting a city from the list

### APIs Used
- **Geocoding API from Open-Meteo:** To get coordinates from city names and populate the search list

---

## Exercise 02: Fill the Views

**Turn-in directory:** `mobileModule02`  
**Files to turn in:** `medium_weather_app` and all necessary files  
**Forbidden functions:** None

### Objective
Populate the views with weather data from the API.

### Tab: "Current"
Display:
- The location (city name, region, and country)
- The current temperature (in Celsius)
- The current weather description (e.g., cloudy, sunny, rainy)
- The current wind speed (in km/h)

### Tab: "Today"
Display:
- The location (city name, region, and country)
- A list of the day's weather, showing:
  - The time of day
  - The temperature at each hour
  - The weather description at each hour
  - The wind speed (in km/h) at each hour

### Tab: "Weekly"
Display:
- The location (city name, region, and country)
- A list of the weather for each day of the week, including:
  - The date
  - The minimum and maximum temperatures of the day
  - The weather description (e.g., cloudy, sunny, rainy)

### Important Points
- When you run the application, it should start on the first tab "Current"
- When you perform a search, you should remain on the tab where you initiated the search
- When switching tabs, always display the data from the last search
- For now, don't focus on the design—just ensure that the information is displayed correctly

### APIs Used
- **Weather Forecast API from Open-Meteo:** To fetch current, hourly, and daily weather data

---

## Exercise 03: What's wrong with you?

**Turn-in directory:** `mobileModule02`  
**Files to turn in:** `medium_weather_app` and all necessary files  
**Forbidden functions:** None

### Objective
Handle error cases and edge cases properly.

### Error Handling
Handle the following situations:
- The user enters a city name that doesn't exist
- The connection to the API fails

**User Feedback:**
- Inform the user that the city name is invalid or that there was a connection issue
- The message should remain visible until the user enters a valid city name or the connection to the API is restored

### Important Notes
Never underestimate the user's ability to break your application! You must always be prepared to handle any edge cases.

---

## Submission and peer-evaluation

Turn in your assignment in your Git repository as usual. Only the work inside your repository will be evaluated during the defense. Don't hesitate to double check the names of your folders and files to ensure they are correct.

The evaluation process will happen on the computer of the evaluated group.

---

## Project Structure

```
mobileModule02/
├── medium_weather_app/
│   ├── App.js (Main application component)
│   ├── package.json (Dependencies)
│   └── README.md (This file)
```

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

## Dependencies

- `react-native`: Core React Native framework
- `@react-navigation/*`: Navigation libraries for tab and stack navigation
- `react-native-community-geolocation`: For GPS geolocation
- `react-native-vector-icons`: For icon support
- Additional navigation and UI libraries

## API References

- **Open-Meteo Geocoding API:** https://geocoding-api.open-meteo.com/v1/search
- **Open-Meteo Weather Forecast API:** https://api.open-meteo.com/v1/forecast

## Notes

- This is a Piscine Mobile learning exercise
- Focus on functionality first, then design
- Always handle edge cases and user errors
- Test with real device location services
