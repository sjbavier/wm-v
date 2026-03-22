# wm-v Repo Notes

`wm-v` is a Vite/React frontend for the Webmane media app. The most complete surface in this repo is the music browser/player at `/media`, which fetches song metadata over GraphQL and streams audio from a REST endpoint.

## Current Scope

- Browse a paginated song library
- Filter songs with inline search
- Switch between grid and row layouts
- Stream audio for the selected song
- Move through the current filtered queue with previous and next controls
- Autoplay the next track when the current queued track ends
- Use shuffle and repeat modes for transport behavior
- Show extracted cover art colors as the page background
- Persist volume, layout, and last selected track between sessions
- Use a persistent library search with clearer reset behavior
- Show stronger loading, empty-library, no-results, and error states
- Manage playlists directly from both grid and row cards with clearer feedback
- Use a sticky library header to keep search, layout switching, result context, and playlist access together
- Open a shared playlist drawer from the library header for overview and creation flows
- Use a more compact, card-like player layout on smaller screens
- Show richer track metadata in both the active player and library cards
- Use a real landing page at `/` instead of a placeholder home route
- Access auth-gated routes for other app areas such as reference content

## Stack

- React 18 + TypeScript
- Vite
- React Router
- Apollo Client
- Mantine
- styled-components
- Tailwind utility classes in some components

## Run Locally

Install dependencies and start the Vite dev server:

```bash
yarn
yarn dev
```

Default frontend URL:

```text
http://localhost:5173
```

## Environment

Local development currently expects these variables:

```env
VITE_GO_API=http://localhost:8080/
VITE_PYTHON_API=http://localhost:5000
```

Only `VITE_GO_API` is used by the active music flow in this repo.

## Backend Dependencies

The music UI depends on two backend interfaces exposed by the Go API:

- GraphQL endpoint at `${VITE_GO_API}query`
- Audio streaming endpoint at `${VITE_GO_API}music?id=<songId>`

Supporting server notes already live in:

- [server-docs/graphql.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/server-docs/graphql.md)
- [server-docs/music.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/server-docs/music.md)

## App Entry And Routing

Main startup path:

- [src/main.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/main.tsx)
- [src/App.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/App.tsx)
- [src/routes/wm_routes.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/routes/wm_routes.tsx)

Current routes:

- `/` renders the landing page
- `/login` renders the auth flow
- `/media` renders the music player
- `/reference` is protected by `PrivateRoute`
- other historical routes exist in comments but are not active

## Music Feature Walkthrough

Main files:

- [src/views/music/MusicContainer.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/views/music/MusicContainer.tsx)
- [src/hooks/useMusic.ts](/home/b4v1n4t0r/nodeProjects/wm-v/src/hooks/useMusic.ts)
- [src/hooks/useAudio.ts](/home/b4v1n4t0r/nodeProjects/wm-v/src/hooks/useAudio.ts)
- [src/providers/useMusicContext.ts](/home/b4v1n4t0r/nodeProjects/wm-v/src/providers/useMusicContext.ts)
- [src/components/music/music_player/MusicPlayer.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/music_player/MusicPlayer.tsx)
- [src/components/music/music_player/MusicSearch.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/music_player/MusicSearch.tsx)
- [src/components/music/music_grid/MusicGrid.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/music_grid/MusicGrid.tsx)
- [src/components/music/music_grid/LayoutOptions.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/music_grid/LayoutOptions.tsx)
- [src/components/music/library_header/MusicLibraryHeader.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/library_header/MusicLibraryHeader.tsx)
- [src/components/music/playlists/PlaylistsDrawer.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/playlists/PlaylistsDrawer.tsx)
- [src/hooks/usePlaylists.ts](/home/b4v1n4t0r/nodeProjects/wm-v/src/hooks/usePlaylists.ts)

Data flow:

1. `MusicContainer` owns the page state for selected song, search text, layout, pagination, audio state, and extracted cover-art colors.
2. `useMusic` runs the `music` GraphQL query with `pageSize`, `pageNumber + 1`, and optional `searchText`.
3. `useAudio` controls the shared `<audio>` element, play/pause state, duration, slider marks, and seek position.
4. `MusicContextProvider` exposes this state to the player and grid components.
5. `MusicPlayer` renders the now-playing metadata, timeline slider, transport controls, volume control, and audio element.
6. `MusicLibraryHeader` keeps search, layout switching, result context, and the playlist drawer entry point in one sticky library surface.
7. `MusicGrid` renders songs in row or grid layouts and changes the selected song when an item is clicked.
8. `PlaylistsDrawer` provides a library-level playlist overview and creation flow, while per-card controls remain lightweight shortcuts.
9. `useCoverart` and `extract-colors` derive a moving background gradient from the selected track art.
10. `MusicContainer` derives a queue from the current filtered page of songs and drives previous, next, shuffle, repeat, autoplay-on-end, persisted player preferences, and the shared playlist drawer state.
11. Playback progression is container-owned: track-end handling, repeat behavior, and next-track selection flow through `MusicContainer`, while the audio hook exposes explicit play/pause/reset actions.

## Repo Layout

High-level areas:

- `src/components`: reusable UI and feature components
- `src/views`: route-level containers
- `src/hooks`: data, audio, media-query, and utility hooks
- `src/providers`: shared React context providers
- `src/lib`: Apollo setup and small utilities
- `docs`: repo and backend notes

Notable non-music areas exist, but several are partial or gated behind auth and commented routes.

## Known Gaps

The repo is functional, but a few things are clearly still in-progress:

- Top-level `README.md` is still the default Vite template
- Several routes in the nav and router are commented out
- Search is now promoted into a dedicated library header, but sorting and richer filtering are still missing
- Queue behavior currently follows the current filtered page of results rather than a cross-page library queue
- Playback intent is now more explicit, but the queue is still page-scoped rather than library-scoped
- Playlists now have a shared drawer, but they are still not a dedicated route or persistent sidebar
- Song metadata fallbacks are inferred from file paths when API data is missing
- Duration is clearest in the active player; library-level duration is still not available from the current GraphQL song query
- Some responsive shell and nav overlap risks remain, especially around nested scrolling and the remaining 3D shell behavior

## Suggested Next Improvement Areas

These are good first targets for the next iteration:

- Add sorting and richer filtering in the library header beyond the current text search
- Expand the queue model beyond the current filtered page while preserving the explicit playback-intent work
- Continue responsive cleanup for shell, nav, and scroll-container overlap artifacts
- Decide whether playlists should stay drawer-based or move into a dedicated route or persistent sidebar
- Consolidate older exploratory music components around the current library-header and playlist-drawer approach
- Update the root [README.md](/home/b4v1n4t0r/nodeProjects/wm-v/README.md) so setup and architecture are documented at the top level

## Suggested Follow-Up Tasks

These are strong near-term tasks based on the current `/media` architecture:

- Add sorting controls to the library header so users can switch between at least title, artist, album, and recently-updated views
- Expand filtering beyond free-text search with focused chips or selects for artist, album, genre, and playlist membership
- Clarify queue scope in the UI and evaluate a queue model that can survive pagination changes
- Extend the shared playlist drawer with rename, delete, and playlist-level browsing actions when backend behavior is ready
- Move the top-level [README.md](/home/b4v1n4t0r/nodeProjects/wm-v/README.md) off the default Vite template so setup and architecture are documented at the repo root
- Resolve unrelated TypeScript and theme/reference build issues so `yarn build` passes cleanly across the whole repo

## Task Files

- Phase 1: [phase-1-improvements.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/tasks/todo/phase-1-improvements.md)
- Phase 2: [phase-2-improvements.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/tasks/todo/phase-2-improvements.md)

## Task List

The completed phase-one history lives in [phase-1-improvements.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/tasks/todo/phase-1-improvements.md), and the active follow-up backlog lives in [phase-2-improvements.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/tasks/todo/phase-2-improvements.md).
