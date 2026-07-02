# Phase 01 - Foundation And SDK Baseline

## Goal

Establish a stable Expo SDK 57 baseline that is ready for mobile development, native builds, strict TypeScript, Expo Router, and NativeWind.

## Scope

- Verify Expo SDK 57 dependencies are aligned with `npx expo install --fix`.
- Keep TypeScript strict mode enabled.
- Confirm Expo Router entrypoint and route structure.
- Confirm NativeWind integration through Babel, Metro, global CSS, and type declarations.
- Configure Android build properties for SDK 57.
- Keep environment configuration outside source code.
- Identify platform-specific code paths for Android, iOS, and web-safe fallbacks.

## Implementation Notes

- API base should come from `EXPO_PUBLIC_API_URL`.
- SDK 57 Android defaults should target API 36.
- `expo-build-properties` should be used for native build settings that must survive prebuild.
- Generated native folders should remain disposable unless the project intentionally moves to checked-in native code.

## Acceptance Checks

- `npx expo-doctor@latest` passes.
- `npx tsc --noEmit` passes.
- `npm run lint` has no errors.
- `npx expo prebuild --platform android --no-install` regenerates native Android config successfully.
- Android build tools installed locally match the configured build tools version.
- Platform-specific branches are intentional and guarded with `Platform.OS` or capability checks.

## Evaluator Proof Points

- The project uses the latest stable Expo SDK requested by the assignment.
- The setup is reproducible from `package.json`, `package-lock.json`, `app.json`, and `.env` documentation.
- Native build configuration is explicit and explainable.
- Expo SDK modules are integrated through supported config plugins and runtime APIs.

## Current Completion Notes

- Expo SDK 57 dependency alignment is present in `package.json`.
- React Native is aligned to `0.86.0`, React to `19.2.3`, and React Native Web to `0.21.0`.
- TypeScript strict mode is enabled in `tsconfig.json`.
- Expo Router is configured through `main: "expo-router/entry"` and the `expo-router` config plugin.
- NativeWind is configured through Babel, Metro, `global.css`, and `nativewind-env.d.ts`.
- Android compile and target SDK are set to 36 through `expo-build-properties`.
- Android Build Tools is set to `36.1.0` as a local workaround because the installed `36.0.0` folder is corrupted on this machine.
- README setup and validation instructions now reflect the SDK 57 baseline.

## Validation Result

- `npx expo install --check`: passed, dependencies are up to date.
- `npx expo-doctor@latest`: passed, 20/20 checks.
- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with warnings only.
- `npx expo prebuild --platform android --no-install`: passed.
- Generated Android config contains `android.compileSdkVersion=36`, `android.targetSdkVersion=36`, and `android.buildToolsVersion=36.1.0`.
