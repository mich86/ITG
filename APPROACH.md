# ITF - Technical Approach

## Overview

A responsive vehicle listing application built on the provided React 17 + webpack 4 scaffold. The project implements the required API integration and UI, then goes beyond the brief with accessibility, animation, an accessible modal, atomic design component structure, and webpack performance optimisations.

---

## Tech Stack

| Concern         | Choice                          | Rationale                                                                        |
| --------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| Framework       | React 17                        | Provided in scaffold                                                             |
| Bundler         | webpack 4                       | Provided in scaffold                                                             |
| Styling         | SCSS + BEM                      | Provided in scaffold; BEM enforces consistent, modular naming                    |
| Testing         | Jest 26 + React Testing Library | Provided in scaffold                                                             |
| Linting         | ESLint (airbnb) + Stylelint     | Provided in scaffold; ran clean before submission                                |
| Node version    | 14.x (LTS Fermium)              | Minimum version that avoids all compatibility issues with this stack (see Setup) |
| Package manager | npm (with --legacy-peer-deps)   | Required due to stylelint-config-airbnb peer dependency conflict                 |

---

## Setup Issues

The project scaffold was written for Node 12 and has known compatibility issues with modern Node versions. The following problems were encountered and resolved:

### Node 24 / 22 / 18 - OpenSSL error

```
Error: error:0308010C:digital envelope routines::unsupported
```

webpack 4 uses a legacy MD4 hash algorithm that Node 17+ disabled by default. The `--openssl-legacy-provider` flag can work around this but introduces a further PostCSS error on Node 18+.

### Node 18 - PostCSS export error

```
ERR_PACKAGE_PATH_NOT_EXPORTED: Package subpath './package.json' is not defined by "exports" in postcss/package.json
```

`css-loader@5.0.1` depends on an old postcss version that does not declare subpath exports in the format Node 14+ requires. Node 14 is lenient enough to resolve this; Node 18+ is not.

### Node 18 - peer dependency conflict

```
stylelint-config-airbnb@0.0.0 requires stylelint@^8.0.0 but project has stylelint@^13.9.0
```

Resolved with `npm install --legacy-peer-deps` (the flag npm 7+ requires for packages written against npm 6's looser peer dependency resolution).

### Solution

**Node 14 LTS** avoids all three issues in one. Setup:

```bash
nvm use 14
npm install --legacy-peer-deps
npm start
```

The `.nvmrc` has been updated to `v14.21.3` and `.npmrc` contains `legacy-peer-deps=true` so the correct environment is documented and reproducible.

---

## Architecture

### Component structure - Atomic Design

Components are organised following Atomic Design principles:

- **Atoms** - `Button` (base button reset + accessible type), `VehicleImage` (responsive `<picture>` with 16:9 and 1:1 sources)
- **Molecules** - `VehicleCard` (composes atoms into a card), `VehicleCardSkeleton` (shimmer placeholder matching card layout)
- **Organisms** - `VehicleList` (data fetching, grid, modal state), `Modal` (accessible dialog)

Each component has its own SCSS file. The `VehicleList` organism owns data fetching via the `useData` custom hook - no other component makes network requests.

### Data flow

```
VehicleList (organism)
  └── useData() hook
        └── getData() - src/api/index.js
              └── request() - src/api/helpers.js (native fetch)
                    ├── GET /api/vehicles.json
                    └── GET /api/vehicle_[id].json (parallel, per vehicle)
```

---

## Task Implementation

### Task 1 - API (`src/api/`)

`request()` in `helpers.js` uses the native browser `fetch` API - no external HTTP library. It throws on non-2xx responses so broken URLs are caught upstream.

`getData()` in `index.js`:

1. Fetches `/api/vehicles.json` - if this fails, the error propagates (correct per the test spec)
2. Fires all detail requests in parallel with `Promise.all` - performant, not sequential
3. Wraps each detail fetch in `try/catch` returning `null` on failure - handles `vehicle_problematic.json` (404)
4. Filters out `null` results and any vehicle where `vehicle.price` is falsy

**Filtering result - 4 vehicles displayed, not 7:**

| Vehicle                         | Reason filtered                         |
| ------------------------------- | --------------------------------------- |
| `xf`                            | `"price": ""` - empty string is falsy   |
| `xj`                            | No `price` field - `undefined` is falsy |
| `problematic`                   | 404 on `apiUrl` - caught and removed    |
| `xe`, `fpace`, `ftype`, `ipace` | Shown ✓                                 |

The single `vehicle.price` check catches both empty strings and missing fields - no separate null/empty checks needed.

### Task 2 - VehicleList component

`useData.js` was already correctly scaffolded to call `getData()`. The component was updated to map over the returned vehicles and render semantic HTML:

- `<ul>` / `<li>` list structure
- `<article>` per vehicle (self-contained content)
- `<picture>` with responsive `<source>` - 16:9 image for tablet+, 1:1 for mobile
- `Array.isArray()` guard protects against the test mock passing a string as the vehicles value

### Task 3 - Responsive design

Mobile-first SCSS using `min-width` media queries:

| Breakpoint        | Layout                                                 |
| ----------------- | ------------------------------------------------------ |
| Default (mobile)  | Vertical list - 1:1 image left (35% width), text right |
| 768px+ (tablet)   | 2-column CSS Grid - 16:9 image top, centred text below |
| 1024px+ (desktop) | 4-column CSS Grid                                      |

The grid gap + `background-color` trick creates border lines between cards without double-border issues.

---

## Beyond the Requirements

### Accessibility (WCAG 2.1)

- `<main>` landmark wrapping the content
- Visually-hidden `<h1>` for correct heading hierarchy (h1 → h2 per card)
- `role="status"` on loading state, `role="alert"` on error state
- `aria-label` on the vehicle list
- `aria-labelledby` on each `<article>` pointing to its `<h2>` via unique `id`
- `:focus-visible` focus ring for keyboard users
- `.visually-hidden` utility class (standard clip pattern)

Lighthouse Accessibility score: **100**

### Accessible modal ("Read more")

The README listed an accessible modal as a nice-to-have. Implemented with:

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Focus trap - Tab and Shift+Tab cycle only within the modal
- Escape key closes
- Focus returns to the "Read more" button that opened it on close
- Body scroll locked while open
- Shows: vehicle image, price, description, body style, drivetrain, passengers, emissions (template interpolated)

### Staggered fade-in animation

`@keyframes fadeInUp` on each card with `animation-delay` set per card index via inline style. Respects `prefers-reduced-motion`.

### Loading skeleton

`VehicleCardSkeleton` molecule renders shimmer placeholder cards matching the card layout during the loading state - replaces the plain "Loading" text. Pure CSS, no library. `SKELETON_COUNT = 4` is a named constant (not a magic number) approximating the expected result count.

### PropTypes

Added to all components for runtime type validation and as inline documentation of expected data shapes.

### Performance

- `loading="lazy"` on all images - native browser API, no JS cost
- `width`/`height` attributes on images (`470×470` for 1:1, `470×246` for 16:9) - prevents Cumulative Layout Shift
- `useCallback` on `handleReadMore` and `handleModalClose` - stable references across renders
- `React.memo` on `VehicleCard` - prevents unnecessary re-renders when modal state changes in the parent

### webpack optimisations

- `splitChunks` - separates vendor bundle (React, 355KB) from app code (96KB), down from a single 1.41MB bundle. Vendor chunk is cached separately between deploys.
- `contenthash` filenames in production - correct cache busting, unchanged files are served from cache
- Faster dev source maps (`eval-cheap-module-source-map`)

### SEO

- `<title>` updated from the scaffold default
- `<meta name="description">` updated
- `robots.txt` changed from `Disallow: /` (scaffold default, prevents indexing) to `Allow: /`

Lighthouse scores against production build:

| Category       | Score |
| -------------- | ----- |
| Performance    | 71    |
| Accessibility  | 100   |
| Best Practices | 100   |
| SEO            | 100   |

---

## What Was Not Implemented

### Redux

The README listed Redux as a nice-to-have. It was deliberately excluded. The application has only local state: the vehicle list (from the API), loading/error flags, and the selected vehicle for the modal. All of this is local to `VehicleList` and managed cleanly with `useState`. Redux adds actions, reducers, a store, and selectors for zero practical benefit here - it would be the right choice if multiple unrelated components needed to share vehicle state, which they do not.

---

## What I Would Do Differently in a Production Context

### Upgrade the stack

webpack 4 + Node 14 is end-of-life. In a production project I would upgrade to webpack 5 + Node 20 LTS, which resolves all the setup compatibility issues and unlocks Module Federation, improved tree shaking, and native asset modules.

### TypeScript

The codebase uses PropTypes for type safety. TypeScript would give compile-time checking, better IDE support, and remove the need for PropTypes entirely. The component interfaces and API response shapes are well-defined and would translate directly to TS interfaces.

### Testing coverage

The scaffold provided tests for `getData()` and `VehicleList` loading/error/results states. In production I would add:

- Unit tests for `VehicleCard`, `Modal`, and each atom
- Integration tests for the full data flow (API → hook → component)
- Accessibility tests using `jest-axe`
- E2E tests (Playwright) covering: page load, modal open/close, keyboard navigation

### CI/CD

- Feature branches with short-lived PRs, never pushing directly to `master`
- GitHub Actions running lint, tests, and a production build check on every PR
- Branch protection requiring passing checks before merge

---
