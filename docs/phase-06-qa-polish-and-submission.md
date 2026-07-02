# Phase 06 - QA, Polish, And Submission

## Goal

Prepare the assignment for review with a polished user experience, reproducible setup, and clear evidence that requirements were met.

## Scope

- Verify all mandatory technologies are present and documented.
- Test primary workflows end to end.
- Update README with accurate SDK, setup, architecture, and feature notes.
- Add screenshots or a short demo recording.
- Document known limitations and tradeoffs.
- Confirm Android and, if available, iOS build paths.

## End-To-End Workflows

- Fresh install to register/login.
- Authenticated restart and auto-session restore.
- Browse catalog, search, filter, and refresh.
- Open course detail.
- Bookmark a course and verify it appears in bookmarks.
- Enroll in a course and verify it appears in enrolled courses.
- Start lesson in WebView.
- Complete lesson and verify progress persists.
- Logout and verify sensitive state is cleared.

## Acceptance Checks

- `npm install` works from a clean checkout.
- `npx expo-doctor@latest` passes.
- `npx tsc --noEmit` passes.
- `npm run lint` has no errors.
- `npx expo run:android` or equivalent Android build works on a correctly configured Android SDK.
- README reflects the actual Expo SDK and implemented features.

## Submission Checklist

- Include API base configuration instructions.
- Include architecture notes for state, persistence, WebView bridge, and native features.
- Include screenshots or video evidence.
- Include any Android SDK requirements such as API level and Build Tools version.
- Call out any deliberate compromises or future improvements.
- Include a mandatory-skills checklist showing where each required skill is demonstrated in the app.
- Include the requirement-to-evidence mapping from [assignment-requirements-matrix.md](./assignment-requirements-matrix.md).

## Evaluator Proof Points

- The app can be installed and reviewed without tribal knowledge.
- Requirements are mapped clearly to implementation evidence.
- The final project feels like a thoughtful mobile product rather than a collection of isolated technical demos.

## Current Completion Notes

- README now documents Expo SDK 57, React Native 0.86, React 19.2.3, Node 22.13.x, setup, environment variables, validation commands, architecture decisions, and known limitations.
- Startup scripts guard against Node 24 before Metro launches, preventing the NativeWind/Metro `addedFiles` crash from appearing as an app failure.
- Requirement matrix now reflects the actual FlatList catalog implementation, stable keys, deduped random product data, WebView bridge validation, SecureStore token boundary, native features, and resilience work.
- Technical constraints are documented and enforced: Expo SDK 57, TypeScript strict mode, Node 22.13.x startup guard, no deprecated Expo ImagePicker media type API, and portrait/landscape support through app config plus responsive catalog/detail layouts.
- Phase docs now include validation results for API/auth persistence, course catalog UX, WebView/native features, performance/security hardening, and final submission prep.
- Remaining external review artifact: screenshots or a short screen recording should be captured from a Node 22.13.x run showing auth, catalog, detail/enroll, WebView completion, profile, and offline/error states.

## Validation Result

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with no warnings.
- `npx expo-doctor@latest`: passed, 20/20 checks.
- `scripts/check-node-version.js`: intentionally blocks Node 24 and instructs reviewers to switch to Node 22.13.x.
