# Phase 02 - API, Auth, And Persistence

## Goal

Build a secure data layer that integrates FreeAPI, persists sessions safely, and keeps app data available across launches.

## Scope

- Centralize network calls in a typed API client.
- Implement login, register, token persistence, refresh, and logout.
- Store sensitive tokens with Expo SecureStore.
- Store app data such as bookmarks, course progress, enrolled courses, and search history in AsyncStorage or MMKV.
- Model API data with TypeScript interfaces.
- Use generics for shared API response envelopes and reusable store helpers where they reduce duplication.
- Handle loading, error, retry, and offline states.

## Implementation Notes

- Use `https://api.freeapi.app/api/v1` as the API base unless overridden by `.env`.
- Keep auth state separate from course state.
- Avoid storing access or refresh tokens in AsyncStorage.
- Use request interceptors for token injection.
- Use response interceptors for refresh or forced logout on auth failure.
- Add retry rules for recoverable network and server failures without retrying unsafe mutations blindly.
- Normalize API responses at the boundary so UI components do not depend on raw response shapes.

## Acceptance Checks

- Login and register flows work from a fresh install.
- Auth survives app restart.
- Logout clears SecureStore tokens and sensitive in-memory state.
- Course/bookmark/progress data survives app restart.
- Network failures show meaningful UI instead of silent failure.
- API, auth, and persistence code remains strongly typed under strict TypeScript.

## Evaluator Proof Points

- SecureStore is used for sensitive credentials.
- AsyncStorage or MMKV is used for non-sensitive application data.
- State management is deliberate, typed, and separated by responsibility.
- API integration includes real error handling and recovery paths.
- Interceptors, retry behavior, and async store actions are centralized rather than scattered across screens.

## Senior-Level Decisions To Document

- Why tokens live in SecureStore while bookmarks, progress, preferences, and search history live in AsyncStorage or MMKV.
- How the API client avoids duplicated auth and retry logic across screens.
- How auto-login handles invalid or expired tokens without leaving the app in a half-authenticated state.
- How profile statistics are derived from course state instead of being duplicated in multiple stores.

## Current Completion Notes

- Auth tokens are stored in Expo SecureStore under dedicated auth and refresh token keys.
- Non-sensitive app state uses typed AsyncStorage helpers through `Storage.getItem<T>` and `Storage.setItem<T>`.
- Auth startup now validates the cached access token with `/users/current-user` before restoring the session.
- Auth startup attempts refresh-token recovery before clearing local credentials.
- Axios remains the centralized API client for request token injection, response refresh handling, timeout behavior, and retry behavior.
- Course persistence now restores typed bookmarks, enrolled course IDs, progress, and search history.
- Profile stats are derived from course state: enrolled count, bookmark count, completed courses, and average progress.
- Profile UI now has real avatar upload feedback and actionable account rows instead of placeholder-only settings.

## Validation Result

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with warnings only.
