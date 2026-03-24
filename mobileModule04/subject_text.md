# Piscine Mobile - Module 04
Auth and Database

**Summary:** This document outlines the subject for Module 04 of the Mobile Piscine.

**Version:** 1.2

---

## Contents

1. [Instructions](#instructions)
2. [Specific Instructions](#specific-instructions)
3. [Exercise 00: Login Page](#exercise-00-login-page)
4. [Exercise 01: Profile Page](#exercise-01-profile-page)

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

To begin this module, you will create a new project app named **"diary_app"** in a new repository called **"mobileModule04"**.

This project will continue into the next module.

Your new application will be a **diary app**.

It will allow you to:
- Create diary entries
- Read diary entries
- Delete diary entries

The diary will be protected by an authentication system.

All entries will be stored in a database.

In this module, your task is to set up the foundation of your application with an authentication system and database.

---

## Exercise 00: Login Page

**Exercise:** Login Page

**Turn-in directory:** mobileModule04

**Files to turn in:** diary_app and all necessary files

**Forbidden functions:** None

Start by creating the login page.

This page must include:
- A login button that either redirects to an authentication page or directly to the diary page if the user is already logged in.
- The option for the user to log in using a **Google** or **GitHub** account.

You must choose an authentication system where users can be stored and managed.

You may use an authentication system like **Firebase**, **AWS**, etc.

**Expected Result:**
For your diary app, the login page should contain authentication buttons and handle user sessions appropriately.

---

## Exercise 01: Profile Page

**Exercise:** Profile Page

**Turn-in directory:** mobileModule04

**Files to turn in:** diary_app and all necessary files

**Forbidden functions:** None

The next step is to create the profile page.

This page should only be accessible if the user is logged in.

The authentication system should redirect the user to this page after logging in, or directly if they are already logged in.

### Database Setup

Before creating the page, you will need to set up a database to store all diary entries.

In the database, you need to store:
- The user's email address.
- The date of each entry.
- The title of each entry.
- The user's feeling of the day.
- The content of the entry.

### Profile Page Features

You must be able to **create**, **read**, and **delete** entries, so you need to implement the logic for these operations.

For now, create a profile page that includes:
- A list of all diary entries.
- A button to create a new entry.
- When a user taps on an entry, they should be able to read it.
- A button to delete an entry.

### Real-time Updates

When a new entry is created, the list must be updated.

When an entry is deleted, the list must also be updated.

### Evaluation Requirements

For the evaluation, you must create a Google account for your evaluator to test your app.

Ensure that this account contains some diary entries.

---

## Database Structure Example

```
Diary Entries Collection:
├── Entry 1
│   ├── email: "user@example.com"
│   ├── date: "2024-01-15"
│   ├── title: "My Day"
│   ├── feeling: "happy"
│   └── content: "Today was a great day..."
├── Entry 2
│   ├── email: "user@example.com"
│   ├── date: "2024-01-14"
│   ├── title: "First Entry"
│   ├── feeling: "excited"
│   └── content: "Starting my diary..."
└── ...
```

---

## Submission and peer-evaluation

Turn in your assignment in your Git repository as usual. Only the work inside your repository will be evaluated during the defense. Don't hesitate to double check the names of your folders and files to ensure they are correct.

The evaluation process will happen on the computer of the evaluated group.
