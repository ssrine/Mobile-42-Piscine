# Weather App - Mobile-01 Piscine

## Objective
Create a responsive weather application with a structured navigation system, search functionality, and geolocation capabilities.

## Features

### Exercise 00: BottomBar
- **Bottom Navigation with 3 Tabs:**
  - Currently (cloud icon)
  - Today (calendar today icon)
  - Weekly (calendar week icon)
- **Tab Navigation:**
  - Click tabs to switch between them
  - Swipe gesture support for tab switching
  - Currently tab selected by default on app start
  - Each tab displays its own content
- **Responsive Design:**
  - Works on all device sizes (phone, tablet, landscape, portrait)
  - Proper spacing and sizing for different screens

### Exercise 01: TopBar
- **AppBar with Search TextField:**
  - Search for locations by typing
  - Real-time input handling
  - Placeholder text for guidance
- **Geolocation Button:**
  - Click to get current location
  - Uses expo-location for GPS access
  - Requests permissions automatically
  - Shows loading indicator while fetching location
  - Error handling for permission denied or location fetch failure
- **Dynamic Content Display:**
  - All tabs display the active tab name
  - Shows search text when user types in search bar
  - Shows "Geolocation" when geolocation button is clicked
  - Search text is cleared when geolocation is used
  - Geolocation flag is cleared when user types in search

## Technologies Used
- **React Native** with Expo
- **React Navigation** for tab-based navigation
- **expo-location** for geolocation
- **Material Community Icons** for icons
- **Responsive Design** with Flexbox

## How to Run
```bash
npm install
npm start
```

Then select your platform:
- `a` for Android
- `i` for iOS
- `w` for Web

## Project Structure
```
weather_app/
├── App.js (Main application with AppBar, TabBar, and Tab content)
├── package.json (Dependencies and scripts)
└── README.md (This file)
```

## Implementation Details

### State Management
- `searchText`: Current search input text
- `isGeolocation`: Flag indicating if geolocation is active
- `isLoadingLocation`: Flag for loading state during geolocation request

### Permission Handling
- Automatically requests location permissions
- Gracefully handles permission denial
- Shows appropriate alerts to user

### Responsive Features
- Uses `Dimensions` API for responsive sizing
- Flexbox layout for adaptive UI
- Proper spacing and padding adjustments
- Color-coded interface for better UX

## Future Enhancements (Mobile-02)
- Weather data integration with API
- Real weather forecasts for Currently, Today, and Weekly views
- Location address display from geolocation
- Weather conditions visualization
- Temperature display and detailed information
