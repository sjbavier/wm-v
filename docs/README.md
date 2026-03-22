# wm-v Repo Notes

`wm-v` is a Vite/React frontend for the Webmane media app. The most complete surface in this repo is the music browser/player at `/media`, which fetches song metadata over GraphQL and streams audio from a REST endpoint.

## Current Scope

- Browse a paginated song library
- Filter songs with inline search
- Switch between grid and row layouts
- Stream audio for the selected song
- Move through the current filtered library queue with previous and next controls
- Autoplay the next track when the current queued track ends
- Use shuffle and repeat modes for transport behavior
- Show extracted cover art colors as the page background
- Persist volume, mute, layout, shuffle, repeat mode, and the last selected track between sessions
- Use a persistent library search with clearer reset behavior
- Sort the current filtered library by title, artist, album, or recently updated
- Refine the filtered library with client-side playlist, artist, album, and genre controls
- Show stronger loading, empty-library, no-results, and error states
- Manage playlists directly from both grid and row cards with clearer feedback
- Use a sticky library header to keep search, layout switching, result context, and playlist access together
- Show explicit queue sync or page-fallback status when the filtered-library playback queue is still hydrating
- Open a shared playlist drawer from the library header for overview, creation, sorting, rename, delete, and browse flows
- Keep the player in the sticky control stack and slim it down on larger screens as the page scrolls
- Use a more compact, card-like player layout on smaller screens that keeps timeline and transport first
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
- [src/components/music/library_header/FilterOptions.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/library_header/FilterOptions.tsx)
- [src/components/music/playlists/PlaylistsDrawer.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/playlists/PlaylistsDrawer.tsx)
- [src/hooks/usePlaylists.ts](/home/b4v1n4t0r/nodeProjects/wm-v/src/hooks/usePlaylists.ts)

Data flow:

1. `MusicContainer` owns the page state for selected song, search text, layout, pagination, audio state, and extracted cover-art colors.
2. `useMusic` runs the `music` GraphQL query with `pageSize`, `pageNumber + 1`, and optional `searchText`.
3. `useAudio` controls the shared `<audio>` element, play/pause state, duration, slider marks, and seek position.
4. `MusicContextProvider` exposes this state to the player and grid components.
5. `MusicPlayer` renders the now-playing metadata, timeline slider, transport controls, volume control, and audio element, and it can compress on larger screens once the sticky stack is in active scroll use.
6. `MusicLibraryHeader` keeps search, client-side filters, layout switching, result context, queue sync status, and the playlist drawer entry point in one sticky library surface.
7. `MusicGrid` renders songs in row or grid layouts and changes the selected song when an item is clicked.
8. `PlaylistsDrawer` provides a library-level playlist overview plus creation, sorting, browse, rename, and delete flows, while per-card controls remain lightweight shortcuts.
9. `MusicContainer` keeps a paginated grid view while sorting and refining the filtered library client-side by playlist, artist, album, genre, or most recently updated.
10. `useCoverart` and `extract-colors` derive a moving background gradient from the selected track art.
11. `MusicContainer` hydrates the full filtered library in the background with a second `music` query sized to `totalItemsCount`, then drives previous, next, shuffle, repeat, autoplay-on-end, persisted player preferences, and the shared playlist drawer state from that filtered-library queue while the visible grid remains paginated.
12. Playback progression is container-owned: track-end handling, repeat behavior, and next-track selection flow through `MusicContainer`, while the audio hook exposes explicit play/pause/reset actions.

Recent responsive cleanup reduced competing scroll and sticky layers on `/media`. On smaller breakpoints, the library header shifts to progressive disclosure for filters and detailed summary chips, the player trims secondary metadata so timeline and transport stay dominant, and the grid plus playlist controls now use tighter sizing and radius choices to match the rest of the sticky surface system. On larger breakpoints, the player can slim down further as the sticky stack remains in view during scroll. The app shell is now the main vertical scroll owner, and `/media` should avoid reintroducing its own full-height vertical scroll container.

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

- Several routes in the nav and router are commented out
- Search is now promoted into a dedicated library header, and client-side filtering is available there, but server-backed filtering is still missing
- Playback intent is now more explicit, and the queue follows the filtered library instead of only the visible page
- The filtered-library queue currently depends on a background full-library hydration pass using a second `music` query sized to `totalItemsCount`, because the GraphQL music query does not yet expose server-side sorting or queue semantics
- Playlists now have a shared drawer with create, sort, browse, rename, and delete flows, but they are still not a dedicated route or persistent sidebar
- Song metadata fallbacks are inferred from file paths when API data is missing
- Duration is clearest in the active player; library-level duration is still not available from the current GraphQL song query
- On XS/SM, the now-playing/player block collapses secondary metadata so timeline and transport stay foregrounded, and on larger screens it now compresses further once the sticky stack is actively in scroll use; the grid and playlist controls also follow the same tighter surface rhythm
- Some shell and nav overlap risks remain, especially around the remaining 3D shell behavior

## Suggested Next Improvement Areas

These are good first targets for the next iteration:

- Expand the current client-side filtering and sorting controls into server-backed library controls as backend support improves
- Reduce the cost and coupling of the background filtered-library queue hydration if the library grows large
- Simplify the mobile now-playing/player controls and transport layout now that header disclosure and scroll ownership have been cleaned up
- Decide whether playlists should stay drawer-based or move into a dedicated route or persistent sidebar
- Consolidate older exploratory music components around the current library-header and playlist-drawer approach

## Suggested Follow-Up Tasks

These are strong near-term tasks based on the current `/media` architecture:

- Extend filtering beyond the current playlist, artist, album, and genre controls with eventual server-backed filtering
- Decide whether playlist browsing should stay as a drawer-to-library shortcut or grow into a dedicated route if the drawer stops scaling
- Resolve unrelated TypeScript and theme/reference build issues so `yarn build` passes cleanly across the whole repo

## Task Files

- Phase 1: [phase-1-improvements.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/tasks/todo/phase-1-improvements.md)
- Phase 2: [phase-2-improvements.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/tasks/todo/phase-2-improvements.md)

## Task List

The completed phase-one history lives in [phase-1-improvements.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/tasks/todo/phase-1-improvements.md), and the active follow-up backlog lives in [phase-2-improvements.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/tasks/todo/phase-2-improvements.md).
