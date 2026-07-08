# MedBridge AI (Clinical Vitality System)

MedBridge AI is a mobile-first web application designed to optimize emergency blood reserves, coordinate volunteer donor appointments, and manage real-time hospital dispatch tracking. 

Built using **React Native (Expo Web)** and aligned with the **Clinical Vitality System** design guidelines.

---

## 🚀 Quick Start Guide

Follow these steps to clone, install, and run the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/meem08/medbridge.git
cd medbridge
```

### 2. Install Frontend Dependencies
The Expo app is in the frontend folder. Due to React 19 peer dependencies with Expo Web support, install packages there with the legacy resolution flag:
```bash
cd frontend
npm install --legacy-peer-deps
```

### 3. Run the Web Application
Start the development server from the frontend folder targeting your web browser:
```bash
cd frontend
npm run web
```
This will compile the assets and open the application in Google Chrome or your default web browser (typically at `http://localhost:8081`).

### 4. Optional: Start the Backend
If you also want the API server running, open a second terminal and install/run it from the backend folder:
```bash
cd backend
npm install
npm run dev
```

---

## 📱 Alternative Runs (Native Mobile)

If you wish to test the application on physical mobile devices or simulated emulators:

* **iOS Simulator**:
  ```bash
  npm run ios
  ```
* **Android Emulator**:
  ```bash
  npm run android
  ```
* **Physical Device (Expo Go)**:
  ```bash
  npm run start
  ```
  Scan the terminal's QR code using the **Expo Go** application on your iPhone or Android phone.

---

## ✨ Features

* **Light Desktop Bezel Wrapper**: Automatically wraps the UI inside an exact `390px` x `884px` rounded preview container on desktop screens with light gutters, adapting to 100% full-screen on mobile screens.
* **Auth Bottom Tab Bar**: A locked bottom menu on onboarding and login screens (`Help`, `Security`, `Info`).
* **Deep Linking**: Updates Chrome's address bar dynamically (e.g. `/login`, `/welcome`, `/hospital`, `/donor`) allowing direct bookmarking and native back/forward button clicks.
* **Onboarding Carousel**: Interactive 3-stage slider introduction with custom illustrations.
* **Dual Portals**: Specialized layouts and actions for **Hospital Coordinators** (reserves checking, emergency dispatching) and **Volunteer Donors** (slot booking, history metrics).
