# Phase 1 Improvements

This is the first-round music player backlog. The product work in this phase is effectively complete; the remaining root-README follow-up is also tracked in phase 2 so the active backlog can live in one place.

## Now

- [x] Fix grid and row play buttons so clicking play also selects that track
- [x] Reset playback state correctly when switching songs
- [x] Remove duplicate native browser audio controls and rely on the custom player UI
- [x] Add visible selected-track and now-playing states in the grid and row layouts
- [x] Add active-state styling to the row/grid layout toggle

## Next

- [x] Add previous, next, and autoplay-on-end behavior
- [x] Introduce a queue model based on the current filtered song list
- [x] Persist volume, layout, and last selected track in local storage
- [x] Improve search UX with a persistent input, clearer reset behavior, and better no-results messaging
- [x] Add loading skeletons and stronger empty/error states for the music view

## Later

- [x] Add shuffle and repeat modes
- [x] Improve mobile player ergonomics with larger controls and a compact or bottom player layout
- [x] Promote playlists into a first-class flow instead of only per-row controls
- [x] Improve metadata display with album, duration, and richer track details where available
- [x] Refine the visual system so player, cards, and navigation feel like one design language
- [x] Replace the placeholder home route with a useful media landing page
- [ ] Update the root [README.md](/home/b4v1n4t0r/nodeProjects/wm-v/README.md) so setup and architecture are documented at the top level
