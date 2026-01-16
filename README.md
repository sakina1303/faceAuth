# Face Match Demo - Android App using Expo SDK 54

A modern React Native (Expo) demo application for face enrollment and authentication. This project demonstrates camera usage, local file system operations, and pixel-level face comparison logic with a polished UI/UX.

## ✨ Features

-   **📸 Face Enrollment**: Capture your face using the front camera with a guided overlay.
-   **🔐 Face Verification**: Authenticate by comparing a live capture against the enrolled face.
-   **🖼️ Modern UI/UX**:
    -   **Gradient Animations**: Smooth, animated results screen.
    -   **Custom Theming**: Consistent Blue/White/Gray design system (`#4A90E2`).
    -   **Feedback**: Haptic-like visuals and clear success/failure states.
    -   **Vector Icons**: Clean navigation with standard icons.
-   **⚙️ Tech Stack**:
    -   **Expo SDK 54**: Latest Expo features.
    -   **React Native**: Core framework.
    -   **Expo Camera**: For image capture.
    -   **Crypto/Pixel Logic**: Robust comparison algorithm (Legacy FileSystem API compatibility).
    -   **Animated API**: Stable, native-driver based animations.

## 📱 Screens

1.  **Enrollment**: Securely capture and save your face data locally.
2.  **Verify**: Real-time camera capture for authentication.
3.  **Result**: Instant visual feedback on match success or failure.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the App
```bash
npx expo start
```
-   Scan the QR code with **Expo Go** on Android.
-   Press `a` to open in Android Emulator.
-   Press `i` to open in iOS Simulator.

## 📦 Build APK (Android)

### EAS Build (Recommended)
```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configure
eas build:configure

# 4. Build Preview APK
eas build -p android --profile preview
```

## 🛠️ Project Structure

```
facematch/
├── App.js                      # Main Navigation & Theme Setup
├── babel.config.js             # Babel Configuration
├── components/
│   └── CustomButton.js         # Reusable styled button component
├── screens/
│   ├── EnrollmentScreen.js     # Capture logic with camera overlay
│   ├── AuthenticationScreen.js # Verification logic
│   └── ResultScreen.js         # Animated result display
└── utils/
    └── faceUtils.js            # Image processing & comparison logic
```

## 📝 Technical Notes

-   **Face Matching**: Uses a pixel-difference heuristic (MSE) on resized images for a robust demo experience without heavy ML libraries.
-   **Storage**: Images are stored securely in the device's local document directory.
-   **Privacy**: All processing happens locally on the device.

---
Built with ❤️ using Expo.
