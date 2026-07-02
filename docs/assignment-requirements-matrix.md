# Assignment Requirements Matrix

This file maps the assignment requirements to implementation deliverables, architectural rationale, and proof points. Use it as a build checklist and as a final submission guide.

## Senior Engineering Standard

The goal is not to demonstrate that a screen can call an API. The app should show senior-level judgment:

- Choose architecture that separates API, persistence, state, navigation, and UI.
- Treat network, storage, and WebView messages as unreliable inputs.
- Keep sensitive data in SecureStore and non-sensitive app data in AsyncStorage or MMKV.
- Make every native feature support the LMS experience instead of existing as a detached demo.
- Optimize high-frequency UI paths such as lists, image loading, and refresh.
- Document tradeoffs and known limitations so reviewers can see intent.

## Part 1 - Authentication & User Management

### 1.1 User Authentication

| Requirement | Implementation Deliverable | Rationale | Proof Point |
| --- | --- | --- | --- |
| Login/register using `/api/v1/users` endpoints | Typed `auth` API service for login, register, refresh, and profile calls | Keeps auth contracts isolated from screens and easier to test | Auth service file, typed request/response interfaces |
| Store auth tokens using Expo SecureStore | Persist access and refresh tokens only in SecureStore | Tokens are sensitive and should not be stored in AsyncStorage | SecureStore utility/store usage |
| Auto-login on restart if token is valid | Auth store initializes from SecureStore and validates or refreshes token | Prevents stale sessions while keeping a smooth user experience | Root layout initialization flow |
| Logout functionality | Clear tokens, reset auth state, route to login | Ensures sensitive state is removed from memory and disk | Logout action and profile/logout UI |
| Basic token refresh handling | Axios response interceptor refreshes on `401` once, then retries original request | Centralizes recovery and prevents screen-level auth duplication | API client interceptor |

### 1.2 Profile Screen

| Requirement | Implementation Deliverable | Rationale | Proof Point |
| --- | --- | --- | --- |
| Display user profile information | Profile screen reads typed user state and API profile data | Keeps profile consistent with authenticated user state | Profile route and auth store |
| Allow profile picture update | Use Expo Image Picker or Camera with permission handling and cancellation state | Demonstrates native capability tied to account management | Avatar update action and permission UX |
| Show user statistics | Derive enrolled count, completed count, progress average, and bookmark count from course state | Avoids duplicated persisted stats that can drift | Profile stats selectors |

## Part 2 - Course Catalog

### 2.1 Course List

| Requirement | Implementation Deliverable | Rationale | Proof Point |
| --- | --- | --- | --- |
| Fetch instructors from `/api/v1/public/randomusers` | Typed course API maps random users into instructor models | Separates source API shape from UI model | Course service mapper |
| Fetch courses from `/api/v1/public/randomproducts` | Typed course API maps products into course models | Lets the app present products as courses without leaking fake naming everywhere | Course service mapper |
| Scrollable course list | LegendList catalog with stable keys and estimated item size | Better recycling and smoother large-list performance | Catalog screen list implementation |
| Course thumbnail, instructor, title, description, bookmark | Reusable memoized CourseCard | Keeps repeated list surfaces consistent | CourseCard component |
| Pull-to-refresh | RefreshControl calls async fetch without blocking existing content | Mobile-native recovery path for stale or failed data | Catalog screen refresh behavior |
| Search filtering | Local search over title, category, instructor, and description | Fast UX and no extra API dependency | Catalog state/selectors |

### 2.2 Course Details Screen

| Requirement | Implementation Deliverable | Rationale | Proof Point |
| --- | --- | --- | --- |
| Complete course information | Details route shows course data, instructor, metadata, and progress | Gives the app a real learning flow beyond catalog browsing | Course details screen |
| Enroll button with visual feedback | Enroll action updates state, persists, triggers haptic/visual state | Optimistic UX makes the app feel native and responsive | Enroll state and UI |
| Bookmark toggle with local storage | Bookmark action persists to AsyncStorage/MMKV and updates UI immediately | Durable app data without treating it as sensitive | Course store persistence |

## Part 3 - WebView Integration

### 3.1 Embedded Content Viewer

| Requirement | Implementation Deliverable | Rationale | Proof Point |
| --- | --- | --- | --- |
| WebView screen for course content | Player route renders `react-native-webview` lesson template | Demonstrates hybrid native/web composition | Player screen |
| Local HTML template | Template receives course data and renders lesson content offline-friendly | Avoids dependence on external content availability | HTML template or generated source |
| Native to WebView communication using headers | Pass course/user/session metadata through WebView headers where supported, plus injected JS for runtime data | Headers satisfy assignment requirement; JS injection handles dynamic updates | WebView `source.headers` and injection code |
| Persist WebView state | WebView completion/progress message updates course store | Makes embedded content part of the native learning state | `onMessage` handler and progress persistence |
| Validate WebView messages | Parse and validate message event payload before state mutation | Web content boundary is untrusted even when local | Message schema or guard function |

## Part 4 - Native Features

### 4.1 Local Notifications

| Requirement | Implementation Deliverable | Rationale | Proof Point |
| --- | --- | --- | --- |
| Request notification permissions | Permission request service with platform guard | Avoids crashes and respects user consent | Notification utility |
| Notify when user bookmarks 5+ courses | Bookmark action triggers milestone notification once | Makes notifications contextual and product-relevant | Bookmark logic and notification call |
| 24-hour inactivity reminder | Schedule/cancel reminder on app start or meaningful activity | Encourages re-engagement without server push complexity | Notification scheduling service |

### Additional Native Features

| Feature | Implementation Deliverable | Rationale | Proof Point |
| --- | --- | --- | --- |
| Network monitoring | NetInfo-powered offline banner and request-aware state | Makes API failures understandable and recoverable | OfflineBanner and network hook |
| Camera/image picker | Avatar update or course proof upload flow | Shows platform permission handling and media integration | Profile avatar flow |
| Downloads/offline resources | Store lesson resource metadata or downloadable lesson assets where feasible | Demonstrates practical offline-learning thinking | Download/offline resource service |
| Haptics | Feedback for enroll, bookmark, search, completion | Native feel without visual noise | Haptic service usage |

## Part 5 - State Management & Performance

### 5.1 State Management

| Requirement | Implementation Deliverable | Rationale | Proof Point |
| --- | --- | --- | --- |
| Authentication state | Dedicated auth store using SecureStore | Keeps sensitive session lifecycle isolated | Auth store |
| Course list and bookmarks | Course store with async fetch actions and persisted bookmarks | Supports durable catalog interactions | Course store |
| User preferences | Persist theme, search history, notification preferences, or last-opened course | Shows app-level personalization | Preferences storage |
| Situation-specific storage | SecureStore for tokens, AsyncStorage/MMKV for non-sensitive app data | Storage choice follows data sensitivity | Storage utilities |

### 5.2 List Optimization

| Requirement | Implementation Deliverable | Rationale | Proof Point |
| --- | --- | --- | --- |
| LegendList optimization | Use `keyExtractor`, estimated item size, stable render item, memoized row components | Reduces layout churn and memory pressure | Catalog list code |
| Proper keys | Course IDs and instructor IDs used consistently | Prevents incorrect recycling and stale UI | List key extractors |
| Memoization | Memoize CourseCard and expensive selectors/callbacks where useful | Avoids re-rendering every card on unrelated state changes | Memoized components/selectors |
| Pull-to-refresh without jank | Preserve current list while refreshing and show lightweight refresh state | Keeps mobile interactions smooth | Refresh implementation |

## Part 6 - Error Handling

### 6.1 Network Errors

| Requirement | Implementation Deliverable | Rationale | Proof Point |
| --- | --- | --- | --- |
| API failures with retry | Central retry for recoverable errors and screen-level retry buttons | Supports transient mobile network failures | API client and error UI |
| User-friendly errors | Empty/error states use plain language and recovery action | Avoids raw technical errors in UI | Error components |
| Timeout handling | Axios timeout and timeout-specific messaging | Prevents indefinite loading | API client timeout config |
| Offline mode banner | NetInfo-based banner visible across authenticated app | Makes offline state obvious | OfflineBanner |

### 6.2 WebView Error Handling

| Requirement | Implementation Deliverable | Rationale | Proof Point |
| --- | --- | --- | --- |
| Failed WebView loads | `onError` / `onHttpError` state with retry and fallback content | Embedded content should fail gracefully | Player error state |
| WebView recovery | Retry reloads local content and preserves last native progress | Prevents lesson loss from transient failure | Player retry action |
| Navigation safety | Restrict unexpected external navigation or open it intentionally in system browser | Reduces WebView security risk | WebView navigation guard |

## Final Submission Evidence

- README updated with SDK version, setup, and architecture decisions.
- Screenshots or demo recording for auth, catalog, details, WebView, profile, offline/error states.
- Validation logs for `expo-doctor`, TypeScript, lint, and Android/iOS build.
- A short architecture section explaining storage boundaries, API retry strategy, WebView bridge, native features, and performance decisions.
- Known limitations and next-step improvements.
