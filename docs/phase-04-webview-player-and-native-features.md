# Phase 04 - WebView Player And Native Features

## Goal

Demonstrate the assignment's hybrid requirement by bridging native React Native screens with WebView lesson content and native device capabilities.

## Scope

- Build a lesson/player screen using `react-native-webview`.
- Load local or generated lesson HTML content.
- Send course metadata from native to WebView.
- Send progress/completion events from WebView back to native.
- Persist progress changes from WebView messages.
- Add native feedback features such as haptics and notifications.
- Add camera or image picker functionality where it supports the LMS experience, such as avatar updates or course proof uploads.
- Add a download-oriented native feature where practical, such as saving lesson resources or preparing offline content metadata.
- Handle WebView loading, error, and navigation safety.

## Implementation Notes

- Use `injectedJavaScript` or `injectJavaScript` for native-to-web communication.
- Use `window.ReactNativeWebView.postMessage` for web-to-native communication.
- Validate all WebView messages before mutating state.
- Restrict navigation where appropriate so untrusted content cannot take over the player.
- Use Expo Haptics for meaningful interaction feedback.
- Use Expo Notifications for reminders, milestones, or re-engagement.
- Use NetInfo or an equivalent network monitor to adapt player behavior when connectivity changes.
- Use Expo Image Picker or Camera only behind permission checks and graceful denial states.

## Acceptance Checks

- Opening a course starts the WebView player.
- Native data appears inside the WebView lesson.
- Completing a lesson inside WebView updates native course progress.
- Progress remains after app restart.
- WebView errors have a recoverable UI.
- Haptics and notifications are integrated without crashing on unsupported platforms.
- Camera/image picker and download-related flows handle permission denial, cancellation, and platform limitations.

## Evaluator Proof Points

- The app bridges native and web content bidirectionally.
- WebView messages are treated as untrusted input and validated.
- Native modules are integrated as part of the product experience, not just demo buttons.
- Native features include notifications, downloads or offline-resource handling, camera/image picking, and network monitoring.

## Senior-Level Decisions To Document

- Why WebView receives stable metadata through headers and dynamic state through JavaScript injection.
- How WebView messages are validated before progress is persisted.
- How notification scheduling avoids repeated milestone spam.
- How native features improve the LMS experience instead of appearing as disconnected examples.
