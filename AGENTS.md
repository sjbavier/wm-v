# AGENTS.md

This file governs the entire repository rooted at this directory.

## Project Summary

- `wm-v` is a Vite + React + TypeScript frontend.
- The most active feature area is the music player at `/media`.
- The frontend depends on a Go backend exposed through `VITE_GO_API`.
- Music metadata is fetched through GraphQL at `${VITE_GO_API}query`.
- Audio streams are fetched through REST at `${VITE_GO_API}music?id=<songId>`.

## Primary Goal

When working in this repo, prioritize improvements to:

- music player reliability
- music browsing UX
- visual cohesion
- documentation

## First Files To Read

Start here before making changes:

- `src/views/music/MusicContainer.tsx`
- `src/components/music/music_player/MusicPlayer.tsx`
- `src/components/music/music_grid/MusicGrid.tsx`
- `src/hooks/useAudio.ts`
- `src/hooks/useMusic.ts`
- `src/providers/useMusicContext.ts`
- `src/routes/wm_routes.tsx`
- `docs/README.md`

## Commands

Use these standard commands:

- `yarn dev`
- `yarn build`
- `yarn lint`

## Editing Expectations

- Prefer focused, incremental changes over broad rewrites.
- Preserve the current dark, ambient, cover-art-driven design direction unless the task is explicitly a redesign.
- Keep new code in TypeScript and follow existing React patterns in nearby files.
- Use `styled-components` and Mantine consistently with the surrounding component instead of introducing a third styling approach.
- Do not remove commented-out product areas unless the task explicitly asks for cleanup.
- Document meaningful architecture or workflow discoveries in `docs/README.md`.

## Delegation Guidance

Use subagents when the user explicitly asks for delegation or parallel exploration, or when parallel work will clearly accelerate delivery.

Good delegation targets:

- repo exploration and architecture mapping
- UX audits and improvement prioritization
- isolated implementation tasks with disjoint file ownership
- verification work that can run in parallel with local implementation

Do not delegate:

- the immediate blocking task on the critical path if the main agent needs that result next
- overlapping edits to the same files
- vague “look around” tasks without a concrete output

When delegating implementation work:

- assign clear file ownership
- state that other agents may also be editing the repo
- tell subagents not to revert unrelated changes
- ask for a concise summary plus changed file list

## Current Product Notes

- `/media` is the main user-facing surface.
- The grid/list play action is currently a known weak spot: row play and selected song state are not fully synchronized.
- The player currently mixes custom playback UI with native browser audio controls.
- Queue, next/previous, repeat, and shuffle are not first-class yet.
- Several routes exist historically but are commented out or incomplete.

## Documentation

- Keep `docs/README.md` current when architecture, setup, or active feature behavior changes.
- Prefer documenting current behavior and known limitations rather than aspirational claims.

## Safety

- Check `git status` before and after substantial edits.
- Do not revert unrelated user changes.
- If backend behavior is unclear, inspect existing docs in `docs/server-docs/` before making assumptions.
