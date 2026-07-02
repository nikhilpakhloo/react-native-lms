# Mini LMS Mobile App - React Native Expo

A senior-grade Mini Learning Management System built with React Native Expo. The app is designed to demonstrate native Expo modules, WebView integration, secure persistence, state management, API resilience, and mobile performance practices.

## Foundation Status

- Expo SDK: 57
- React Native: 0.86.0
- React: 19.2.3
- React Native Web: 0.21.0
- TypeScript: strict mode enabled
- Navigation: Expo Router
- Styling: NativeWind
- Android SDK target: compile SDK 36, target SDK 36
- Android build properties: managed with `expo-build-properties`

Expo SDK 57 documents Node `22.13.x` as the minimum. The local environment is newer and satisfies that requirement.

## Key Features

### Authentication And User Management

- Login and register flows through FreeAPI user endpoints.
- Sensitive auth token persistence with Expo SecureStore.
- Session initialization on app start.
- Logout flow that clears sensitive auth state.
- Profile screen with user stats and avatar-oriented native media support planned.

### Course Ecosystem

- Course data from `randomproducts`.
- Instructor data from `randomusers`.
- LegendList-based course browsing.
- Search, filtering, pull-to-refresh, bookmarks, enrolled courses, and progress state.
- AsyncStorage-backed non-sensitive app data.

### Hybrid WebView Integration

- Lesson player screen using `react-native-webview`.
- Local or generated HTML lesson content.
- Native-to-WebView metadata flow.
- WebView-to-native progress and completion messages.
- WebView error recovery path.

### Native Features

- Expo Notifications for bookmark milestones and inactivity reminders.
- Expo Haptics for important interactions.
- Network monitoring and offline banner.
- Expo Image Picker for profile-related media flows.

## Documentation

The assignment execution plan lives in `docs/`:

- `docs/assignment-phases.md`
- `docs/assignment-requirements-matrix.md`
- `docs/phase-01-foundation-and-sdk-baseline.md`
- `docs/phase-02-api-auth-and-persistence.md`
- `docs/phase-03-course-catalog-and-learning-ux.md`
- `docs/phase-04-webview-player-and-native-features.md`
- `docs/phase-05-performance-security-and-resilience.md`
- `docs/phase-06-qa-polish-and-submission.md`

## Project Structure

```text
src/
  api/          Axios client, interceptors, and typed API services
  app/          Expo Router routes
  components/   Reusable UI components
  hooks/        Custom React Native hooks
  store/        Zustand state management
  utils/        Haptics, notifications, storage, and validation helpers
```

## Setup

### Prerequisites

- Node.js 22.13 or newer
- npm
- Android Studio or Expo-supported Android tooling for native builds
- Android SDK platform 36

This project currently points Android builds at Build Tools `36.1.0` because the local `36.0.0` installation was corrupted. Reinstalling Build Tools `36.0.0` via Android Studio SDK Manager is also valid for SDK 57.

### Install

```bash
npm install
```

### Environment

Create `.env`:

```env
EXPO_PUBLIC_API_URL=https://api.freeapi.app/api/v1
```

### Run

```bash
npx expo start
```

For Android development builds:

```bash
npx expo run:android
```

## Validation

Useful Phase 1 checks:

```bash
npx expo install --check
npx expo-doctor@latest
npx tsc --noEmit
npm run lint
npx expo prebuild --platform android --no-install
```

## Architecture Decisions

1. Auth and catalog state are separated so sensitive session lifecycle does not mix with durable course preferences.
2. SecureStore is reserved for credentials; AsyncStorage is used for non-sensitive app state.
3. API behavior is centralized through an Axios client with token injection, refresh handling, timeout configuration, and retry paths.
4. WebView content is treated as a boundary: messages should be validated before mutating native state.
5. List performance is a first-class requirement, so catalog screens use LegendList and memoized row components.
