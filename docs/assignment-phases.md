# Mini LMS Assignment Phases

This plan breaks the Mini LMS assignment into implementation phases that can be built, tested, and reviewed independently. Each phase has a concrete outcome, proof points for evaluators, and acceptance checks.

## Phase Map

1. [Phase 01 - Foundation And SDK Baseline](./phase-01-foundation-and-sdk-baseline.md)
2. [Phase 02 - API, Auth, And Persistence](./phase-02-api-auth-and-persistence.md)
3. [Phase 03 - Course Catalog And Learning UX](./phase-03-course-catalog-and-learning-ux.md)
4. [Phase 04 - WebView Player And Native Features](./phase-04-webview-player-and-native-features.md)
5. [Phase 05 - Performance, Security, And Resilience](./phase-05-performance-security-and-resilience.md)
6. [Phase 06 - QA, Polish, And Submission](./phase-06-qa-polish-and-submission.md)

Use [assignment-requirements-matrix.md](./assignment-requirements-matrix.md) as the evaluator-facing checklist that maps every assignment requirement to implementation evidence.

## Evaluation Bar

This project should not read as a basic CRUD app. Each phase should preserve evidence of:

- Critical thinking: architecture decisions with clear tradeoffs.
- Problem solving: practical solutions for mobile constraints, flaky networks, WebView boundaries, and persistence.
- Code quality: typed, maintainable, testable, and locally coherent modules.
- Real-world focus: resilient errors, offline states, timeouts, and performance under scroll and restart.
- Innovation: product-minded native features that improve the learning experience beyond a checklist.
- Security-first mindset: token isolation, guarded WebView messages, safe storage boundaries, and no sensitive logging.

## Assignment Targets

- Build with React Native Expo latest stable SDK and TypeScript strict mode.
- Use Expo Router for navigation.
- Use NativeWind for styling.
- Use SecureStore for sensitive data.
- Use AsyncStorage or MMKV for app data.
- Integrate `https://api.freeapi.app/`.
- Demonstrate native features, WebView integration, production-grade state management, performance, and security.

## Mandatory Skills Matrix

| Skill Area | What The App Must Demonstrate | Primary Phase |
| --- | --- | --- |
| React Native & Expo | Expo architecture, SDK modules, native build config, platform-aware code paths | [Phase 01](./phase-01-foundation-and-sdk-baseline.md) |
| TypeScript | Strict mode, typed API contracts, interfaces, generics, safe route and state models | [Phase 02](./phase-02-api-auth-and-persistence.md) |
| WebView | Bidirectional communication, JavaScript injection, validated messages, persisted learning progress | [Phase 04](./phase-04-webview-player-and-native-features.md) |
| State Management | Async actions, loading/error states, persistence, state partitioning, durable progress | [Phase 02](./phase-02-api-auth-and-persistence.md) |
| API Integration | Axios client, interceptors, retry logic, token refresh, typed service layer | [Phase 02](./phase-02-api-auth-and-persistence.md) |
| Performance | Optimized lists, memoization, image/cache strategy, render control, skeleton states | [Phase 05](./phase-05-performance-security-and-resilience.md) |
| Native Features | Notifications, downloads, camera/image picker, haptics, network monitoring | [Phase 04](./phase-04-webview-player-and-native-features.md) |
| Error Handling | Error boundaries, offline mode, retry UI, WebView error recovery, guarded persistence | [Phase 05](./phase-05-performance-security-and-resilience.md) |

## Evidence To Preserve

- Screenshots or screen recordings for core workflows.
- Notes about API endpoints and fallback behavior.
- Validation output from `expo-doctor`, TypeScript, lint, and Android/iOS builds.
- A short architecture explanation covering native-web bridge, persistence choices, and performance decisions.
