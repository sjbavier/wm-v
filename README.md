# wm-v

`wm-v` is a Vite + React + TypeScript frontend for the Webmane media app. The most complete product surface is the music browser and player at `/media`, which reads music metadata from a Go-backed GraphQL API and streams audio over REST.

## Current Product Focus

- reliable music playback
- clearer music browsing and queue behavior
- cohesive dark, cover-art-driven presentation
- practical documentation for active frontend flows

## Current Routes

- `/` landing page
- `/login` auth flow
- `/media` music browser and player
- `/reference` auth-gated reference content

Historical routes still exist in comments, but they are not active.

## Stack

- React 18
- TypeScript
- Vite
- React Router
- Apollo Client
- Mantine
- styled-components

## Run Locally

Install dependencies and start the dev server:

```bash
yarn
yarn dev
```

Useful commands:

```bash
yarn lint
yarn build
```

Default frontend URL:

```text
http://localhost:5173
```

## Environment

Create a local `.env` with:

```env
VITE_GO_API=http://localhost:8080/
VITE_PYTHON_API=http://localhost:5000
```

Only `VITE_GO_API` is part of the active music flow.

## Backend Interfaces

The `/media` experience depends on two Go API endpoints:

- GraphQL: `${VITE_GO_API}query`
- audio stream: `${VITE_GO_API}music?id=<songId>`

Additional backend notes live in [docs/server-docs/graphql.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/server-docs/graphql.md) and [docs/server-docs/music.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/server-docs/music.md).

## App Structure

Important entry files:

- [src/main.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/main.tsx)
- [src/App.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/App.tsx)
- [src/routes/wm_routes.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/routes/wm_routes.tsx)

Primary music files:

- [src/views/music/MusicContainer.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/views/music/MusicContainer.tsx)
- [src/hooks/useMusic.ts](/home/b4v1n4t0r/nodeProjects/wm-v/src/hooks/useMusic.ts)
- [src/hooks/useAudio.ts](/home/b4v1n4t0r/nodeProjects/wm-v/src/hooks/useAudio.ts)
- [src/providers/useMusicContext.ts](/home/b4v1n4t0r/nodeProjects/wm-v/src/providers/useMusicContext.ts)
- [src/components/music/music_player/MusicPlayer.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/music_player/MusicPlayer.tsx)
- [src/components/music/music_grid/MusicGrid.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/music_grid/MusicGrid.tsx)
- [src/components/music/library_header/MusicLibraryHeader.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/library_header/MusicLibraryHeader.tsx)
- [src/components/music/playlists/PlaylistsDrawer.tsx](/home/b4v1n4t0r/nodeProjects/wm-v/src/components/music/playlists/PlaylistsDrawer.tsx)

## Music Flow

1. `src/main.tsx` creates the Apollo client against `${VITE_GO_API}query`.
2. `MusicContainer` owns the selected song, page state, debounced search, layout preference, queue state, shuffle/repeat, playlist drawer state, and cover-art gradient.
3. `useMusic` fetches a paginated slice of songs for the current page and search input.
4. `useAudio` controls the shared `<audio>` element, playback intent, timeline state, seeking, and autoplay-on-load behavior.
5. `MusicContextProvider` shares container-owned state with the player, library controls, and grid.
6. `MusicPlayer` renders now-playing metadata, transport controls, timeline, and volume.
7. `MusicGrid` renders the current page in row or grid layouts and routes selection/playback actions back through shared context.
8. `PlaylistsDrawer` exposes playlist overview, selected-track membership actions, and playlist creation.

## Current Behavior And Constraints

- library search filters the current paginated library query
- client-side sorting is available for title, artist, album, and recently updated
- client-side playlist, artist, album, and genre filters refine the filtered library
- on compact screens, library filters and detailed queue summaries collapse behind disclosure controls to keep the first viewport focused on browsing and playback
- previous/next/shuffle/repeat follow the current filtered library queue once it is hydrated in the background
- the library header now surfaces when queue sync is still in progress or has fallen back to the current page
- the `/media` view now relies on the app shell as the primary vertical scroll container instead of creating a second page-level scroll region
- the selected track, layout, volume, mute state, shuffle, and repeat preferences persist locally
- playlist creation and membership changes are available from the shared drawer and card-level controls
- some non-music routes and shell behavior are still historical or in-progress

## Documentation

Repo-level architecture and task notes live in:

- [docs/README.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/README.md)
- [docs/tasks/todo/phase-1-improvements.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/tasks/todo/phase-1-improvements.md)
- [docs/tasks/todo/phase-2-improvements.md](/home/b4v1n4t0r/nodeProjects/wm-v/docs/tasks/todo/phase-2-improvements.md)

## Known Gaps

- the filtered-library queue currently depends on a background full-library fetch, which may need a better backend contract as the library grows
- filtering is currently client-side only and does not yet include server-backed refinement
- playlists are still drawer-based rather than a dedicated route or sidebar
- repo-wide TypeScript issues still block a clean `yarn build`
