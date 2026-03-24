# Piscine Mobile - Module 05
Manage Data and Display

**Summary:** This document outlines the subject for Module 05 of the Mobile Piscine.

**Version:** 1.00

---

## Contents

1. [Instructions](#instructions)
2. [Specific Instructions](#specific-instructions)
3. [Exercise 00: Profile Page](#exercise-00-profile-page)
4. [Exercise 01: Agenda Page](#exercise-01-agenda-page)

---

## Instructions

- If you have problems installing the tools needed for your project on the 42 computers, you can use a virtual machine. In this case, you will have to:
  - Install the virtual machine software on your computer.
  - Install the operating system of your choice.
  - Install the tools needed for your project.
  - Make sure you have the space on your session to install all of this.
  - You must have everything installed before the evaluation.
- **Only this page will serve as reference. Do not trust rumors.**
- **Read attentively the whole document before beginning.**
- Your exercises will be corrected by your piscine colleagues.
- The document can be relied upon, do not blindly trust the demos or pictures example which can contain not required additions.
- Got a question? Ask your peer on the right. Otherwise, try your peer on the left.
- **By Odin, by Thor! Use your brain!!!**

**Note:** Intra indicates the date and hour of closing for your repositories. This date and hour also corresponds to the beginning of the peer-evaluation period for the corresponding piscine day. This peer-evaluation period lasts exactly 24h. After 24h passed, your missing peer grades will be completed with a 0.

---

## Specific Instructions

This project is a continuation of **Module 04**. You will need to implement a new feature in the application you have already developed.

For clarity and to avoid confusion, **copy your previous project into a new folder** and continue working from there.

### Application Structure

Your application must now have **3 pages**:

1. **First page:** Login page with login buttons
2. **Second page:** Profile page (enhanced)
3. **Third page:** Agenda page (new)

### Requirements

**The app requires an internet connection to work.**

---

## Exercise 00: Profile Page

**Exercise:** Profile Page

**Turn-in directory:** mobileModule05

**Files to turn in:** advanced_diary_app and all necessary files

**Forbidden functions:** None

### Objective

Now that you have a diary application that allows adding and deleting entries, the next step is to add more features to the profile page.

### Required Displays

The profile page must display at least the following information:

#### User Information
- **The user's name**
- **A logout button** that logs out the user and redirects them to the login page

#### Entry Management
- **A list showing the last 2 entries added by the user**, including:
  - The date
  - The feeling
  - The title of each entry
- **The ability to select an entry** to view its details
- **The ability to delete an entry** from the detail view

#### Statistics
- **The total number of entries**
- **A list showing the feelings and their percentage of use** across all entries

#### New Entry
- **A button to add a new entry**

### Real-time Updates

**All information must be updated in real time** when an entry is added or deleted.

### Visual Presentation

Your profile page should display:
- User greeting with name
- Total entries count prominently
- Feeling statistics with percentage breakdown
- Recent entries (last 2) with date and feeling
- Create and manage entry buttons

---

## Exercise 01: Agenda Page

**Exercise:** Agenda Page

**Turn-in directory:** mobileModule05

**Files to turn in:** advanced_diary_app and all necessary files

**Forbidden functions:** None

### Objective

Now, let's implement the agenda page!

This page must display a calendar.

### Calendar Requirements

#### Display
- **When you open this page, the calendar should display the current date**
- You can **select a date from the calendar**

#### Entry Listing
- **When you select a date**, a scrollable list of entries from that date should appear
- You should be able to **select an entry** to view its details
- If you **delete an entry**, the list must be updated accordingly

### Real-time Updates

The agenda page should update automatically when entries are added, deleted, or dates change.

### Visual Features

The calendar should:
- Display the current month
- Highlight the current date
- Show which dates have entries (visual indicator)
- Allow easy date navigation
- Display entries in a scrollable list below the calendar

---

## Calendar Library

For this project, we recommend using the **"react-native-calendars"** (or equivalent for your framework) dependency.

This library provides:
- Modern calendar interface
- Customizable appearance
- Easy date selection
- Performance optimization

---

## File Structure

```
mobileModule05/
├── advanced_diary_app/
│   ├── App.js (Main application)
│   ├── package.json (Dependencies)
│   ├── README.md (Documentation)
│   └── subject_text.md (This file)
```

---

## Testing Checklist

Before submission, verify:

- [ ] Login page works correctly
- [ ] Profile page displays all required information
- [ ] Statistics are calculated correctly
- [ ] Last 2 entries display correctly
- [ ] Can create new entries
- [ ] Can view entry details
- [ ] Can delete entries with confirmation
- [ ] Real-time updates work immediately
- [ ] Agenda calendar displays correctly
- [ ] Can select dates on calendar
- [ ] Entries filter by selected date
- [ ] Time displays correctly for each entry
- [ ] Can manage entries from agenda page
- [ ] Logout functionality works
- [ ] App handles offline errors gracefully

---

## Submission and peer-evaluation

Turn in your assignment in your Git repository as usual. Only the work inside your repository will be evaluated during the defense. Don't hesitate to double check the names of your folders and files to ensure they are correct.

The evaluation process will happen on the computer of the evaluated group.
