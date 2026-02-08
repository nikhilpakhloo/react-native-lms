# 🎓 Mini LMS Mobile App - React Native Expo

A high-performance, senior-grade Mini Learning Management System (LMS) built with React Native Expo. This project demonstrates advanced proficiency in native integration, hybrid WebView architectures, and extreme performance optimization.

## 🚀 Key Features

### 🔐 Authentication & User Management
- **Full Auth Flow**: Secure Login/Register using FreeAPI endpoints.
- **Secure Persistence**: JWT tokens stored in **Expo SecureStore**.
- **Session Management**: Automated auto-login and robust token refresh logic in Axios interceptors.
- **Dynamic Profile**: User stats (Enrollments, Progress, Bookmarks) and avatar updates.

### 📚 Course Ecosystem
- **Native Product Feed**: Real-time integration with `randomproducts` and `randomusers` APIs.
- **Industry-Leading Lists**: Driven by **LegendList** for maximum recycling efficiency.
- **Search & Filter**: Real-time search with history persistence and categorical filtering.
- **Course Player**: Hybrid experience using **WebView** with bidirectional communication.

### 🌐 Hybrid WebView Integration
- **Local Templates**: Loads a custom HTML template for lesson content.
- **Bidirectional Bridge**:
    - **Native 👉 Web**: Injecting course metadata via `injectJavaScript`.
    - **Web 👉 Native**: Completion signals sent from Web to Native store via `onMessage`.

---

## 🛠 Setup Instructions

### Prerequisites
- **Node.js**: v18 or higher (v20 recommended)
- **Expo Go**: Available on Play Store / App Store
- **Android Studio / Xcode**: For local emulator testing

### Installation Steps
1. **Clone & Install**:
   ```bash
   git clone [repository-url]
   cd lms
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables-needed)).

3. **Start Development**:
   ```bash
   npx expo start
   ```

4. **Run on Native**:
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS
   ```

---

## 🔑 Environment Variables Needed

The app uses `EXPO_PUBLIC_` prefixed variables which are automatically loaded by Expo.

Create a `.env` file:
```env
EXPO_PUBLIC_API_URL=https://api.freeapi.app/api/v1
```

---

## 🏗 Key Architectural Decisions

1. **State Partitioning**: 
   - **Auth**: Isolated in a dedicated store with `SecureStore` persistence for token safety.
   - **Catalog**: Managed via `useCourseStore` with `AsyncStorage` for rapid access to bookmarked/enrolled data.
2. **List Optimization**: Chose **LegendList** over FlatList/FlashList to satisfy the senior-engineering requirement for advanced list recycling and minimal memory footprint.
3. **Hybrid Communication**: Instead of just displaying a URL, the WebView uses a message-passing bridge. This allows the Native app to retain control over the course progress lifecycle.
4. **Resilient Networking**: Implemented a global Axios client with automated retry logic and an `OfflineBanner` to handle spotty connectivity.

---

## 📸 Screenshots

| Courses Feed | Course Details | Bookmarks | Profile |
| :---: | :---: | :---: | :---: |
| ![Courses](assets/screenshots/courses.png) | ![Details](assets/screenshots/details.png) | ![Saved](assets/screenshots/saved.png) | ![Profile](assets/screenshots/profile.png) |

*(Note: High-quality mockups provided in `assets/screenshots/`)*

---

Developed with ❤️ for the React Native Expo Developer Assignment.
