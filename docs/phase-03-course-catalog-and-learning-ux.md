# Phase 03 - Course Catalog And Learning UX

## Goal

Create the core LMS experience: browsing courses, viewing details, bookmarking, enrolling, and tracking learning progress.

## Scope

- Build a performant course catalog screen.
- Add search, category filtering, refresh, and empty states.
- Build course detail screens with instructor, rating, price, stock, and lesson metadata.
- Add bookmark and enrollment interactions.
- Show enrolled courses separately from the public catalog.
- Track progress and completion percentage.

## Implementation Notes

- Use virtualized or recycled lists for catalog performance.
- Keep CourseCard reusable across catalog, bookmarks, and enrolled courses.
- Make each interaction update local state immediately, then persist it.
- Provide skeleton loading states for perceived performance.
- Use route params through Expo Router for course detail and player screens.

## Acceptance Checks

- Catalog loads from FreeAPI data.
- Search and category filters work together.
- Pull-to-refresh updates the catalog.
- Bookmarked courses appear in the saved/bookmarks screen.
- Enrolled courses appear in the enrolled/my-courses screen.
- Progress appears consistently across course cards, details, and player return flow.

## Evaluator Proof Points

- The LMS is not just a static API list; it has durable learning state.
- The UI is responsive under loading, empty, error, and offline conditions.
- The list implementation is chosen for mobile performance rather than convenience only.

## Senior-Level Decisions To Document

- Why random products and random users are mapped into domain models instead of used raw in UI components.
- How bookmark and enroll actions remain responsive while still persisting durable state.
- How list rendering avoids jank during search, refresh, and navigation.
- How empty states guide users toward recovery instead of simply showing no data.

## Current Completion Notes

- Catalog uses `LegendList` with stable course IDs, estimated item sizing, pull-to-refresh, skeleton loading, and route-based navigation to details.
- Search and category filtering now work together across course title, category, description, and instructor name.
- API failures surface a recoverable catalog empty state with retry instead of silently falling through to an empty list.
- Course snapshots and instructor snapshots are persisted in AsyncStorage so bookmarked and enrolled courses survive app restart even when the FreeAPI random endpoints return different records later.
- Bookmark, enrollment, progress, and search history state remains optimistic in the UI and is persisted through the course store.
- Bookmarked courses show progress when the same course is enrolled, and the detail screen shows enrolled progress before entering the player.
- Enrolled courses, bookmarks, detail, and player routes share the same course store state so completion percentage stays consistent after player return.

## Validation Result

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed with no warnings.
