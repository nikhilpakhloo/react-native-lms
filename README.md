# 🎓 Mini LMS Mobile App - React Native Expo

A high-performance, senior-grade Mini Learning Management System (LMS) built with React Native Expo. This project demonstrates advanced proficiency in native integration, hybrid WebView architectures, and extreme performance optimization.

## 🚀 Key Features

### 🔐 Authentication & User Management
- **Full Auth Flow**: Secure Login/Register using FreeAPI v1 endpoints.
- **Secure Persistence**: JWT tokens stored in **Expo SecureStore** with hardware encryption.
- **Session Management**: Automated auto-login and robust token refresh logic in Axios interceptors.
- **Dynamic Profile**: User stats (Enrollments, Progress, Bookmarks) and avatar updates via API.

### 📚 Course Ecosystem
- **Native Product Feed**: Real-time integration with `randomproducts` and `randomusers` APIs.
- **Industry-Leading Lists**: Driven by **LegendList** for maximum recycling efficiency and 60fps scrolling.
- **Search & Filter**: Real-time search with history persistence (AsyncStorage) and categorical filtering.
- **Haptic Feedback**: Meaningful tactile feedback via **Expo Haptics** for all major interactions.

### 🌐 Hybrid WebView Integration
- **Local Templates**: Loads a custom HTML template for lesson content for zero-latency loading.
- **Bidirectional Bridge**:
    - **Native 👉 Web**: Injecting course metadata via `injectJavaScript`.
    - **Web 👉 Native**: Completion signals sent from Web to Native store via `onMessage`.

### � Proactive Engagement
- **Engagement Engine**: Milestone notifications (e.g., when bookmarking the 5th course).
- **Inactivity Reminders**: Scheduled notifications to encourage return after 24 hours of inactivity.

---

## 🛠 Project Structure & Documentation

### Folder Architecture
```text
src/
├── api/          # Axios client, interceptors, and typed API services
├── app/          # Expo Router file-based navigation (Auth, Tabs, Player)
├── components/   # Reusable UI (CourseCard, OfflineBanner, Skeletons)
├── hooks/        # Custom hooks (useKeyboard, useNetworkStatus)
├── store/        # Zustand state management (Auth, Course Catalog)
└── utils/        # Services (Haptics, Notifications, Storage, Validation)
```

### Technical Compliance
- **SDK**: Expo SDK 54 (Latest Stable)
- **Language**: 100% TypeScript (Strict Mode)
- **Platforms**: Universal support for **iOS** and **Android**
- **Orientation**: Full support for both **Portrait** and **Landscape** modes
- **Architecture**: New Architecture enabled for maximized performance

---

## 🏗 Key Architectural Decisions

1. **State Partitioning**: 
   - **Auth**: Isolated in a dedicated store with `SecureStore` persistence for token safety.
   - **Catalog**: Managed via `useCourseStore` with `AsyncStorage` for rapid access to bookmarked/enrolled data.
2. **List Optimization**: Chose **LegendList** over FlatList/FlashList to satisfy senior-engineering requirements for advanced list recycling and minimal memory footprint.
3. **Hybrid Communication**: Instead of just displaying a URL, the WebView uses a message-passing bridge. This allows the Native app to retain control over the course progress lifecycle.
4. **Resilient Networking**: Implemented a global Axios client with automated retry logic and an `OfflineBanner` to handle spotty connectivity.
5. **UI/UX Excellence**: Customized **NativeWind** (Tailwind CSS for React Native) for a premium, responsive, and dark-mode compatible design system.

---

## 🛠 Setup & Installation

### Prerequisites
- **Node.js**: v18+ 
- **Package Manager**: npm or yarn
- **Expo Go** or a development build

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/nikhilpakhloo/react-native-lms.git
   cd react-native-lms
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   Create a `.env` file:
   ```env
   EXPO_PUBLIC_API_URL=https://api.freeapi.app/api/v1
   ```
4. **Run the application**:
   ```bash
   npx expo start
   ```

---

## 📸 Screenshots

| Courses Feed | Course Details | Bookmarks | Profile |
| :---: | :---: | :---: | :---: |
| ![Courses](assets/screenshots/courses.png) | ![Details](assets/screenshots/details.png) | ![Saved](assets/screenshots/saved.png) | ![Profile](assets/screenshots/profile.png) |

*(Note: Real screenshots should be placed in `assets/screenshots/`)*

---

Developed with ❤️ for the Mini LMS Developer Assignment.
