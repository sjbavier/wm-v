# Phase 2 Improvements

This backlog tracks the second round of player-focused improvements after the phase-1 reliability and UX pass. It now also carries the active follow-up work after the sticky library header and shared playlist drawer landed on `/media`.

## Now

- [x] Add shuffle and repeat modes
- [x] Improve mobile player ergonomics with a more compact player layout
- [x] Promote playlists beyond buried row-only controls
- [x] Unify search, layout switching, result context, and playlist entry into a sticky library header
- [x] Add a shared playlist drawer for overview and playlist creation
- [x] Separate playback controls from library browsing controls

## Next

- [x] Improve metadata display with album, duration, and richer track details where available
- [x] Refine the visual system so player, cards, and navigation feel like one design language
- [x] Replace the placeholder home route with a useful media landing page
- [x] Centralize playback intent so same-track replay and end-of-track progression use explicit actions
- [x] Move search and layout controls into a shared sticky library header instead of splitting them across player and grid
- [x] Add a shared playlist drawer so playlists are accessible from the library surface, not only card-level menus
- [x] Update the root [README.md](/home/b4v1n4t0r/nodeProjects/wm-v/README.md) so setup and architecture are documented at the top level

## Later

- [x] Expand the queue model beyond the current filtered page while preserving the explicit playback-intent work
- [ ] Promote playlists beyond the current drawer into a dedicated route or persistent sidebar
- [x] Expand the library header beyond current text search and page-level sorting with richer filtering
- [x] Clarify queue-source status in the UI when the filtered-library queue is still syncing or falls back to the current page
- [ ] Add playlist sorting, rename, and delete flows once backend support and product rules are clear
- [ ] Consolidate older exploratory music components around the current library-header and playlist-drawer approach
- [ ] Consider moving the playlist drawer state fully into shared context if more library surfaces need to open it
- [ ] Finish responsive polish after the single-scroll/mobile-disclosure pass, with focus on the now-playing/player block and remaining small-screen density issues
- [ ] Address unrelated repo-wide TypeScript issues so `yarn build` passes cleanly

## Progress Notes

- Progress: `/media` now uses mobile disclosure for filters and summary details, and no longer relies on a second vertical scroll region inside the page view.
