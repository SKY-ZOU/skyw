# AI Developer Handoff Document: SKYW Redesign

## Overview
This document serves as a contextual bridge for the next AI agent or developer taking over the `skyw` project. The core objective of the recent development phase was to elevate the website's frontend to match the premium, dynamic, and high-density aesthetic of top-tier financial firms like KKR and the `skyw.group` concept site.

## Tech Stack
*   **Framework:** Next.js 16.1.6 (App Router)
*   **Styling:** Tailwind CSS v4
*   **Animations:** Framer Motion (heavy use of scroll triggers and staggered reveals)
*   **Scroll Engine:** `@studio-freight/lenis` (Custom `SmoothScrollProvider.tsx`)
*   **Database:** Prisma ORM with `@prisma/adapter-libsql`
*   **i18n:** `next-intl`

## Completed Work (V2 & V3 Redesign)
The following components were entirely rebuilt from static or simple designs into high-end animated experiences:

1.  **Lenis Smooth Scrolling (`src/components/providers/SmoothScrollProvider.tsx`)**
    *   Added globally via `app/[locale]/layout.tsx`.
    *   Provides professional scroll dampening (duration 1.2, cubic-bezier ease).
2.  **Smart Header (`src/components/layout/Header.tsx`)**
    *   Hides on scroll down to maximize viewport.
    *   Reveals on scroll up with a backdrop blur and background transition.
3.  **Homepage Restructuring (`src/app/[locale]/HomeClient.tsx`)**
    *   **Hero Visual Ribbon (`HeroRibbon`)**: A bespoke SVG ribbon injected into the background of the Hero section. Uses `clip-path` for an initial horizontal wipe reveal, followed by an infinite 12-second floating animation loop (`y` and `rotate`).
    *   **Cinematic Hero (`HomeHero`)**: Replaced pulse animations with a `useScroll` parallax background and precise staggered text reveals (`mask-image` equivalent via overflow + y translation).
    *   **Brand Narrative (`BrandStorySection`)**: A large typography block where individual words light up (opacity shifts from `0.1` to `1`) based directly on the user's scroll depth (`useScroll` progress mapped to words).
    *   **Animated Metrics (`MetricsStrip`)**: Implemented `AnimatedCounter` to make numbers roll up dynamically using Framer Motion's `animate` function, coupled with a sliding horizontal border layout.
    *   **Staggered Business Grids (`BusinessSection`)**: Replaced symmetrical grid boxes with an staggered, asymmetrical layout featuring deep image hover effects and slow-loading text.
4.  **Database Configuration Fix**
    *   Fixed `URL_SCHEME_NOT_SUPPORTED` error during static build generation by updating `lib/db.ts` to use `file:./dev.db` instead of `file:dev.db`.

## Current Status & Known Issues

### ⚠️ Deployment Delay on Netlify
*   **Status**: All code (including the Hero SVG Ribbon and the V2 Homepage structure) is successfully committed and pushed to the `main` branch on GitHub.
*   **Issue**: The live environment (`skyw-website.netlify.app`) is currently returning the V1 version of the site.
*   **Possible Causes**:
    1.  Netlify is currently in the middle of a build cycle (Next.js static site generation with the newly added heavy framer-motion components may take longer).
    2.  The build sequence on Netlify is failing silently due to environment variables (e.g., missing Turso/Prisma production DB URLs, causing the build to stall or fail to generate static pages).
*   **Next Action Required by AI**: If the user states the site is still not updated, the next AI should ask the user to check their Netlify deploy logs to see if the build returned an error.

## Development Patterns
*   **Easing**: The standard animation easing across the project to maintain the "KKR heavy/premium feel" is `[0.22, 1, 0.36, 1]`.
*   **Transitions**: Hover durations should generally be over `500ms` (e.g., `duration-500` or `1.5s` for image zooms) to ensure deliberate, luxurious micro-interactions.
*   **Local Server**: Running `npm run dev` might crash if port 3000 is occupied by another of the user's projects. Prefer running `PORT=3002 npm run dev`.
