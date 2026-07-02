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
