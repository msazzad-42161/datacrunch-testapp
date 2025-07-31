# DataCrunch Test App

A React Native mobile application built with Expo that integrates with the Open Library API to provide book search and management functionality.

## 📱 Project Overview

This is a cross-platform mobile application that allows users to:
- Search for books using the Open Library API
- View detailed book information
- Manage personal book collections
- Navigate through an intuitive interface

## 🛠 Tech Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: Zustand
- **API Integration**: TanStack React Query
- **Form Handling**: React Hook Form with Zod validation
- **API Source**: [Open Library API](https://openlibrary.org/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm** or **yarn**: Latest version
- **Expo CLI**: Version 16.11.0 or higher
- **Git**: For version control

### For Physical Device Testing
- **Expo Go App**: Download from App Store (iOS) or Google Play Store (Android)

### For Emulator/Simulator Testing
- **Android Studio**: With Android SDK and emulator setup
- **Xcode**: (macOS only) for iOS simulator

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/msazzad-42161/datacrunch-testapp.git
cd datacrunch-testapp
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Start the Development Server
```bash
npm start
# or
expo start
```

This will open the Expo DevTools in your browser with a QR code.

#### Run on Specific Platforms

**Android:**
```bash
npm run android
# or
expo run:android
```

**iOS:**
```bash
npm run ios
# or
expo run:ios
```

**Web:**
```bash
npm run web
# or
expo start --web
```

### Using Expo Go (Recommended for Quick Testing)

1. Install Expo Go on your mobile device
2. Run `expo start` in your terminal
3. Scan the QR code with:
   - **iOS**: Camera app or Expo Go app
   - **Android**: Expo Go app

## 🏗 Build Process

### Development Build
```bash
npx expo build --profile development
```

### Preview Build (APK for Android)
```bash
npx expo build --profile preview
```

### Production Build
```bash
npx expo build --profile production
```

## 📊 Project Structure

```
datacrunch-testapp/
├── .expo/                  # Expo configuration cache
├── .vscode/               # VS Code settings
├── android/               # Android-specific files
├── assets/                # Static assets (images, fonts, icons)
├── components/            # Reusable UI components
├── dist/                  # Distribution/build files
├── hooks/                 # Custom React hooks
├── navigation/            # Navigation configuration
├── node_modules/          # Dependencies (auto-generated)
├── providers/             # Context providers and global state
├── screens/               # Screen components
├── services/              # API services and utilities
├── store/                 # Zustand store configuration
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions and helpers
├── .gitignore            # Git ignore patterns
├── app.json              # Expo app configuration
├── App.tsx               # Root component
├── babel.config.js       # Babel configuration
├── eas.json              # EAS Build configuration
├── index.ts              # Entry point
├── metro.config.js       # Metro bundler configuration
├── package-lock.json     # Locked dependency versions
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Configuration Files

### EAS Build Configuration (`eas.json`)
- **Development**: Internal distribution with development client
- **Preview**: Internal distribution, Android APK build
- **Production**: Auto-increment versioning enabled

### Key Dependencies
- **UI/Navigation**: React Navigation v7 (Stack & Bottom Tabs), React Native Gesture Handler
- **State Management**: Zustand for global state management
- **API Integration**: TanStack React Query for server state and caching
- **Forms**: React Hook Form with Zod validation and Hookform Resolvers
- **Storage**: AsyncStorage for local data persistence
- **Notifications**: Expo Notifications for push notifications
- **Media**: Expo Image Picker for image selection
- **Device Info**: Expo Device and Expo Constants for device information

## 🚀 Submission & Deployment

### EAS Submit (App Stores)

#### iOS App Store
```bash
eas build --platform ios
```

#### Google Play Store
```bash
eas build --platform android
```

## 🔌 Open Library API Integration

The app integrates with the Open Library API for book data:

**Base URL**: `https://openlibrary.org/`

**Key Endpoints Used**:
- Search: `/search.json?q={query}`
- Book Details: `/works/{id}.json`
- Cover Images: `/covers/{id}-{size}.jpg`

**Implementation**: API calls are managed through React Query for efficient caching and state management.


### Testing on Devices
- Use Expo Go for quick testing during development
- Use development builds for testing native features
- Test on both iOS and Android platforms

## 🔧 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx expo start --clear
```

**Cache problems:**
```bash
npm start -- --reset-cache
```

**Node modules issues:**
```bash
rm -rf node_modules
npm install
```

**iOS simulator not opening:**
```bash
npx expo run:ios --device
```

### Development Tips
- Use `console.log()` statements for debugging (visible in terminal)
- Enable remote debugging in Expo DevTools
- Use React DevTools browser extension
- Check network requests in browser developer tools

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Open Library API Documentation](https://openlibrary.org/developers/api)
- [React Navigation Documentation](https://reactnavigation.org/)
- [TanStack Query Documentation](https://tanstack.com/query)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation links above

---

**Happy Coding! 🚀**