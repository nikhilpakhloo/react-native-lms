# Phase 05 - Performance, Security, And Resilience

## Goal

Harden the app so it behaves like a production mobile application under real-world constraints.

## Scope

- Optimize list rendering and avoid unnecessary re-renders.
- Add offline detection and user-facing offline states.
- Add retry behavior for recoverable API failures.
- Add error boundaries around high-risk UI areas such as root navigation, course details, and the WebView player.
- Review sensitive storage, token handling, and WebView security.
- Confirm strict TypeScript coverage across app code.
- Add defensive guards around nullable API data.
- Keep bundle and asset usage practical for mobile.

## Implementation Notes

- Memoize expensive list item components when useful.
- Keep global state slices focused to reduce render churn.
- Use typed service functions instead of ad hoc API calls from screens.
- Cache images and reusable course data where it improves perceived speed without hiding stale critical data.
- Avoid logging tokens or sensitive user data.
- Validate data crossing trust boundaries: API responses, persisted data, and WebView messages.
- Prefer deterministic fallbacks for image and content failures.

## Acceptance Checks

- Large course lists scroll smoothly.
- App handles airplane mode or API downtime gracefully.
- Refresh/retry paths work without restarting the app.
- No sensitive tokens are stored in AsyncStorage.
- TypeScript and lint checks pass without errors.
- WebView cannot navigate freely to arbitrary external content unless explicitly intended.
- Error boundaries catch render failures and provide a recovery action.

## Evaluator Proof Points

- Performance choices are visible in implementation and architecture notes.
- Security choices cover storage, network, and WebView boundaries.
- The app has resilience for mobile-specific failure modes.
- Offline mode, retry mechanisms, and error boundaries are implemented as first-class flows.

## Senior-Level Decisions To Document

- Which UI paths are performance-critical and how they are protected from unnecessary renders.
- Which failures are retried automatically and which require explicit user action.
- How timeouts, offline detection, and stale cached data work together.
- How WebView navigation, message parsing, token storage, and logs follow a security-first mindset.
