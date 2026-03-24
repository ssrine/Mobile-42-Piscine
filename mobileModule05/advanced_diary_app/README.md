# Piscine Mobile - Module 05: Manage Data and Display

## Summary
This module enhances the diary application with advanced data management and visualization features. Users can view comprehensive statistics, manage entries across an intuitive interface, and browse their diary through a calendar-based agenda view.

**Version:** 1.00

---

## Table of Contents
1. [Instructions](#instructions)
2. [Specific Instructions](#specific-instructions)
3. [Exercise 00: Profile Page](#exercise-00-profile-page)
4. [Exercise 01: Agenda Page](#exercise-01-agenda-page)
5. [Features Overview](#features-overview)
6. [Architecture](#architecture)
7. [Usage Guide](#usage-guide)
8. [Submission and peer-evaluation](#submission-and-peer-evaluation)

---

## Instructions

- If you have problems installing the tools needed for your project on the 42 computers, use a virtual machine
- Only this page will serve as reference. Do not trust rumors
- Read attentively the whole document before beginning
- Your exercises will be corrected by your piscine colleagues
- The document can be relied upon, do not blindly trust the demos or pictures
- Got a question? Ask your peer on the right. Otherwise, try your peer on the left
- By Odin, by Thor! Use your brain!

**Note:** Intra indicates the date and hour of closing for your repositories. This date and hour also corresponds to the beginning of the peer-evaluation period. This peer-evaluation period lasts exactly 24h. After 24h passed, your missing peer grades will be completed with a 0.

---

## Specific Instructions

This project is a continuation of **Module 04**. You will implement new features in the application you have already developed.

**Important:** For clarity and to avoid confusion, copy your previous project into a new folder and continue working from there.

Your application must now have **3 pages**:
- **First page:** Login page with login buttons
- **Second page:** Profile page (enhanced)
- **Third page:** Agenda page (new)

**Requirement:** The app requires an internet connection to work.

---

## Exercise 00: Profile Page

**Turn-in directory:** `mobileModule05`  
**Files to turn in:** `advanced_diary_app` and all necessary files  
**Forbidden functions:** None

### Objective
Enhance the profile page with comprehensive statistics and better entry management.

### Required Information Display

#### User Information
- **User's name** displayed at the top
- **Logout button** that logs out and redirects to login page
- Professional header with user greeting

#### Entry Statistics
- **Total number of entries** (prominently displayed)
- **Feeling statistics** showing:
  - Each feeling type
  - Percentage of use across all entries
  - Visual representation in grid format

#### Recent Entries
- **Last 2 entries** displayed with:
  - Entry date
  - Entry feeling (emoji)
  - Entry title
  - Tap to view full details

#### Entry Management
- **View entry details** by tapping on any entry
- **Delete entry** with confirmation dialog
- **Add new entry** button (floating action button)

#### Real-time Updates
- **List updates automatically** when entry is added
- **List updates automatically** when entry is deleted
- **Statistics refresh** immediately after changes
- **No manual refresh needed**

### Implementation Details

#### Data Display
1. **Header Section:**
   - User's display name
   - Logout button (icon)
   - Professional styling

2. **Statistics Section:**
   - Total entries count (large, prominent number)
   - Feeling breakdown with percentages
   - Color-coded feeling indicators

3. **Recent Entries Section:**
   - Last 2 entries (sorted by date, newest first)
   - Entry card with title, date, feeling emoji
   - Tappable to view full content

4. **Entry Management:**
   - View modal with full content
   - Delete button in detail view
   - Confirmation before deletion
   - Form to create new entry

### Real-time Functionality
✓ Firestore snapshot listeners for live updates
✓ Automatic statistics recalculation
✓ Instant list refresh on changes
✓ No polling required

---

## Exercise 01: Agenda Page

**Turn-in directory:** `mobileModule05`  
**Files to turn in:** `advanced_diary_app` and all necessary files  
**Forbidden functions:** None

### Objective
Implement a calendar-based agenda view for browsing diary entries by date.

### Required Features

#### Calendar Display
- **Calendar component** showing current month
- **Visual indication** of dates with entries
- **Current date highlighted** with special styling
- **Easy date selection** by tapping

#### Date Selection
- **Open with current date** displayed by default
- **Tap any date** to view entries for that date
- **Visual feedback** showing selected date
- **Dates with entries** marked with dots or special styling

#### Entries List
- **Scrollable list** of entries for selected date
- **Shows all entries** from that date (sorted by time)
- **Each entry displays:**
  - Entry title
  - Entry time
  - Feeling emoji
  - Content preview (first 2 lines)

#### Entry Management
- **Tap entry** to view full details
- **View full content** in modal
- **Delete functionality** with confirmation
- **Real-time list updates** after deletion

#### Real-time Updates
- **Calendar marks update** when entries change
- **Entries list refreshes** automatically
- **No manual refresh** required

### Implementation Details

#### Calendar Component
- Modern, intuitive calendar interface
- Themable colors matching app design
- Clear indication of selected date
- Marked dates showing entry availability

#### Date-based Filtering
- Query entries by selected date
- Real-time streaming with Firestore listeners
- Sort entries by time (latest first)
- Handle date conversions properly

#### User Experience
- Empty state message for no entries
- Smooth transitions between dates
- Clear date display with full formatting
- Touch-friendly UI elements

### Calendar Library
The app uses **react-native-calendars** for the calendar functionality:
- Integrates seamlessly with React Native
- Professional appearance
- Full customization support
- Efficient date handling

---

## Features Overview

### Page 1: Login
✓ Google OAuth authentication
✓ Session persistence
✓ Auto-redirect to profile if logged in
✓ Professional login UI

### Page 2: Profile (Enhanced)
✓ User information display
✓ Total entries count
✓ Feeling statistics with percentages
✓ Last 2 recent entries
✓ Entry details view
✓ Add new entry functionality
✓ Delete entry with confirmation
✓ Real-time updates (live)
✓ Logout button
✓ Professional UI design

### Page 3: Agenda (New)
✓ Interactive calendar
✓ Current date display
✓ Date selection
✓ Marked dates (showing entries)
✓ Date-filtered entries list
✓ Entry details modal
✓ Delete functionality
✓ Real-time updates
✓ Empty state handling
✓ Time display for entries

---

## Architecture

### Navigation Structure
```
Root Navigator
├── Login Screen
└── Main App (Tab Navigator)
    ├── Profile Tab
    │   ├── Profile Screen (with modals)
    │   ├── Create Entry Modal
    │   └── View Entry Modal
    └── Agenda Tab
        ├── Agenda Screen
        └── View Entry Modal
```

### Data Flow
1. **Authentication:** Firebase Auth with Google OAuth
2. **Real-time Database:** Firestore with snapshot listeners
3. **State Management:** React hooks (useState, useEffect)
4. **Styling:** React Native StyleSheet with theme colors

### Real-time Updates
- **onSnapshot listeners** for each screen
- **Automatic re-render** on data changes
- **User-email filtering** for data isolation
- **Efficient queries** with proper indexing

---

## Usage Guide

### User Workflow

#### Logging In
1. Open app
2. Tap "Sign in with Google"
3. Authenticate with Google account
4. Automatically redirected to Profile tab

#### Managing Entries from Profile
1. **View statistics:** Top card shows total entries
2. **Check feelings:** Grid shows feeling percentages
3. **See recent entries:** Last 2 entries displayed
4. **Create entry:** Tap + button
   - Fill title, select feeling, write content
   - Tap "Save Entry"
   - Entry appears in list immediately
5. **View details:** Tap any entry
   - See full content, date, feeling
   - Tap "Delete Entry" if needed
   - Confirm deletion
6. **Logout:** Tap logout icon in header

#### Browsing via Agenda
1. Tap "Agenda" tab
2. Calendar shows current month
3. Dates with entries are marked
4. **Select a date:** Tap any date on calendar
5. **View entries:** List shows all entries from that date
6. **See details:** Tap any entry
   - Review full content
   - Delete if needed
7. **Switch dates:** Tap different date to update list

#### Data Updates
- Create new entry → instantly appears in lists
- Delete entry → instantly removed from lists
- Change dates → lists update automatically
- No refresh button needed

---

## Color Scheme

| Element | Color | Usage |
|---------|-------|-------|
| Primary | #FF6B6B | Create button, feeling warm colors |
| Secondary | #4ECDC4 | Calendar selected, cool indicators |
| Success | #4ECDC4 | Positive actions |
| Error | #FF6B6B | Delete actions |
| Surface | rgba(255,255,255,0.1) | Cards and backgrounds |
| Text | #fff | Primary text |
| Text Secondary | rgba(255,255,255,0.8) | Secondary text |
| Muted | rgba(255,255,255,0.6) | Disabled, labels |

---

## Dependencies

### Key Packages
- **firebase**: ^10.5.0 - Backend services
- **react-native-calendars**: ^1.1298.0 - Calendar component
- **expo-auth-session**: ^5.4.0 - OAuth authentication
- **@react-navigation**: ^6.x - App navigation

### Icons
- **react-native-vector-icons**: Material Community Icons

---

## Setup Instructions

### Installation
```bash
npm install
```

### Configuration
1. **Firebase Setup** (from Module 04):
   - Replace firebaseConfig with your credentials
   - Ensure Firestore database is active
   - Verify Google OAuth is enabled

2. **Google OAuth**:
   - Set GOOGLE_CLIENT_ID in code
   - Configure redirect URIs

3. **Run Application**:
```bash
# Android
npm run android

# iOS
npm run ios

# Development
npm start
```

---

## Testing Checklist

### Profile Page Tests
- [ ] User name displays correctly
- [ ] Total entries count is accurate
- [ ] Feeling statistics sum to 100%
- [ ] Last 2 entries display correctly
- [ ] Can create new entry
- [ ] New entry appears immediately
- [ ] Can view entry details
- [ ] Can delete entry with confirmation
- [ ] Statistics update after changes
- [ ] Logout button works
- [ ] App redirects to login after logout

### Agenda Page Tests
- [ ] Calendar displays current month
- [ ] Current date is highlighted
- [ ] Dates with entries are marked
- [ ] Can select different dates
- [ ] Entries list updates on date change
- [ ] All entries for date are shown
- [ ] Entry time displays correctly
- [ ] Can view entry details from agenda
- [ ] Can delete entries from agenda
- [ ] Empty state appears when no entries
- [ ] Real-time updates work

### Real-time Tests
- [ ] Create entry on one screen, see on other
- [ ] Delete entry updates both screens
- [ ] Statistics refresh automatically
- [ ] Calendar marks update without refresh
- [ ] No lag or delay in updates

---

## File Structure

```
mobileModule05/
├── advanced_diary_app/
│   ├── App.js (Main application)
│   ├── package.json (Dependencies)
│   └── README.md (This file)
```

---

## Performance Considerations

### Optimization
- Firestore queries filtered by user email
- Limit data fetching to necessary fields
- Use snapshot listeners for efficiency
- Debounce list updates
- Proper component memoization

### Scalability
- Database structured for growth
- Efficient indexing on email field
- Query optimization ready
- Future pagination support

---

## Security Notes

- Firestore security rules filter by authenticated user email
- Google OAuth provides secure authentication
- No sensitive data in local storage
- Session managed by Firebase Auth
- HTTPS enforced for all connections

---

## Troubleshooting

### Calendar Issues
- Ensure react-native-calendars is properly installed
- Clear app cache if calendar doesn't render
- Check theme colors for visibility

### Real-time Updates Not Working
- Verify Firestore snapshot listeners are active
- Check database permissions
- Ensure user is authenticated
- Monitor Firestore quota usage

### Missing Entries
- Check user email matches auth provider
- Verify Firestore security rules
- Clear app cache and restart
- Check date format consistency

---

## Known Limitations

- Calendar shows month view only (can be extended)
- No past date navigation limit (can be added)
- Fixed 2-entry preview (can be adjusted)
- No entry search/filter (future enhancement)
- No offline support (requires internet)

---

## Future Enhancements

- Search entries by title or content
- Filter by feeling type
- Custom date ranges
- Export entries as PDF
- Backup to cloud storage
- Dark/light theme toggle
- Multiple language support
- Recurring entries
- Reminders and notifications

---

## Submission and Peer-Evaluation

Turn in your assignment in your Git repository as usual. Only the work inside your repository will be evaluated during the defense.

**Important:** Double-check the names:
- Repository name: `mobileModule05`
- Project folder: `advanced_diary_app`
- Main file: `App.js`

The evaluation process will happen on the computer of the evaluated group.

**Before submission, ensure:**
- All three pages work correctly
- Real-time updates function properly
- Firebase is properly configured
- Test data exists with varied entries
- All CRUD operations work
- Calendar marks entries accurately
- No console errors or warnings
- App handles offline gracefully

---

## Contact & Support

For questions or issues:
- Ask peer on the right
- Ask peer on the left
- Use your brain!

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.00 | Module 05 | Initial release with Profile & Agenda pages |

---

## Credits

Piscine Mobile - School 42 Network
Module 05: Manage Data and Display
