# Accessibility Commitment

## 1. Our commitment

Accessibility is a quality concern, not an afterthought. This project targets **WCAG 2.2 Level AA** for all user-facing pages and interactive components.

Supported environments:

| Environment | Coverage |
| :--- | :--- |
| **Browsers** | Last 2 major versions of Chrome, Firefox, and Safari |
| **Screen readers** | No screen reader testing was carried out during this tech test. Semantic HTML, ARIA attributes, and live regions are in place; formal testing with VoiceOver and NVDA would be a next step in a production project. |
| **Input methods** | Pointer (mouse/touch) and keyboard |

---

## 2. What is implemented

### 2.1 Page structure

- The app entry (`src/index.js`) wraps `<VehicleList />` in a `<main>` landmark.
- A visually-hidden `<h1>Jaguar Vehicles</h1>` is the first heading on the page, providing a meaningful page title for screen reader users without affecting the visual layout.
- Heading hierarchy (`h1` → `h2`) is respected: each `VehicleCard` renders an `<h2>` for the vehicle name.
- `<html lang="en">` is set in `public/index.html`.
- A meaningful `<title>` and `<meta name="description">` are present in `public/index.html`.
- A `<noscript>` message is in place for users with JavaScript disabled.

### 2.2 Keyboard navigation

- All interactive elements (buttons) are reachable and operable by keyboard alone.
- The `Button` atom (`components/atoms/Button/index.js`) renders a native `<button type="button">` — never a `<div>` or `<span>`.
- The `Button` component accepts and forwards `aria-label` and `aria-haspopup` as first-class props.
- The Modal's close button and the "Read more" trigger are both reachable by Tab and activatable by Enter/Space.

### 2.3 Focus management — Modal

The `Modal` organism (`components/organisms/Modal/index.js`) implements the [WAI-ARIA dialog (modal) pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal):

- On open: saves `document.activeElement` as the previously focused element and shifts focus to the first focusable element inside the dialog.
- **Focus trap:** Tab on the last focusable element wraps to the first; Shift+Tab on the first wraps to the last.
- **Escape key** closes the modal.
- On close: focus is restored to the "Read more" button that opened the modal.
- Body scroll is locked (`document.body.style.overflow = 'hidden'`) while the modal is open.

### 2.4 Focus indicators

- **Global fallback:** `global-styles.scss` applies a `3px solid #005fcc` outline with `2px offset` on `:focus-visible` for any element not handled explicitly.
- **Read-more buttons:** A `:focus-visible` ring is applied in `VehicleCard/style.scss`.
- **Modal close button:** A `:focus-visible` ring is applied in `Modal/style.scss`.
- `outline: none` is never used without a `:focus-visible` alternative.

### 2.5 ARIA attributes and roles

| Component | Attribute / Role | Purpose |
| :--- | :--- | :--- |
| `VehicleList` (loading) | `role="status"`, `aria-label="Loading vehicles"` | Live region that announces loading state |
| `VehicleList` (error) | `role="alert"` | Immediately announces error messages |
| `VehicleList` (results) | `aria-label="Available vehicles"` | Names the vehicle list for screen readers |
| `VehicleCard` | `aria-labelledby={headingId}` | Associates each `<article>` with its `<h2>` |
| `VehicleCard` button | `aria-haspopup="dialog"` | Signals that the button opens a dialog |
| `VehicleCardSkeleton` | `aria-hidden="true"` | Hides decorative loading placeholders from assistive technology |
| `Modal` | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` | Full WAI-ARIA dialog semantics |
| Modal backdrop | `aria-hidden="true"` | Removes decorative backdrop from the accessibility tree |
| Modal close button | `aria-label="Close"` | Provides an accessible name for the icon-only close control |

### 2.6 Semantic HTML

- Each vehicle is wrapped in an `<article aria-labelledby="…">` element.
- Vehicle specifications in the modal use a `<dl>` / `<dt>` / `<dd>` description list.
- The vehicle list uses `<ul>` / `<li>` structure.
- Skeleton placeholders use `<li>` to match the list context.

### 2.7 Images

- All vehicle images include a descriptive `alt` attribute: `` `Jaguar ${id.toUpperCase()}` ``.
- `loading="lazy"` is set on all images.
- Explicit `width` and `height` attributes are provided on `<img>` to prevent cumulative layout shift (CLS).
- The `VehicleImage` atom renders a responsive `<picture>` with a 16:9 source for wider viewports and a 1:1 fallback `<img>`.

### 2.8 Motion

- The card list fade-in animation (`@keyframes fadeInUp`) in `VehicleList/style.scss` is suppressed via `@media (prefers-reduced-motion: reduce)`.
- The skeleton shimmer animation in `VehicleCardSkeleton/style.scss` is suppressed via `@media (prefers-reduced-motion: reduce)`, falling back to a static grey background.

### 2.9 Screen-reader-only content

- `.visually-hidden` in `global-styles.scss` uses the standard clip/position technique to hide content visually while keeping it in the accessibility tree.
- The page `<h1>` uses this class so screen reader users get a meaningful page title without it appearing in the visual layout.

---

## 3. Known limitations and future work

| Area | Description | Priority |
| :--- | :--- | :--- |
| **No skip link** | There is no "Skip to main content" link at the top of the page. Because there is no persistent navigation bar in this app the omission has minimal impact, but it should be added for production. | Medium |
| **No automated a11y tests** | `jest-axe` or `pa11y` are not integrated. Axe assertions in the existing Jest/RTL suite would catch regressions automatically. | Medium |
| **No dark mode** | The app uses a fixed light palette; a `prefers-color-scheme: dark` theme would need a full contrast re-check. | Low |
| **Focus trap not extracted** | The modal focus-trap logic lives inline in `Modal/index.js`. Extracting it to a `useFocusTrap` hook would allow reuse if additional dialogs are introduced. | Low |
| **Backdrop not keyboard-dismissable** | The overlay backdrop is clickable but not directly keyboard-accessible. The Escape key and the close button provide full keyboard dismissal, which satisfies the ARIA dialog pattern. | Low |
| **Screen reader testing** | No screen reader testing was carried out. Semantic HTML and ARIA are in place but should be verified with VoiceOver and NVDA before a production release. | High |
| **Error state readability** | The error `role="alert"` region renders the raw `error.message` string. This should be mapped to a user-friendly message before production. | Medium |

---

## 4. Development guidelines

When adding or modifying UI in this project, follow these rules.

### Headings
- Every page / view must have exactly one `<h1>`.
- Use `<h2>` for card-level headings; do not skip heading levels (e.g. do not jump from `h1` to `h3`).
- If the `<h1>` should not be visible, apply the `.visually-hidden` class — do not omit it entirely.

### Interactive elements
- Use the `Button` atom for all clickable actions; never add `onClick` to a `<div>` or `<span>`.
- Ensure every interactive element has a visible focus indicator; do not use `outline: none` without a `:focus-visible` alternative.
- Pass `aria-label` to `Button` whenever the button's text content alone does not describe its action in context.

### Modal / dialog
- Follow the WAI-ARIA dialog pattern already established in `Modal/index.js`.
- Always restore focus to the triggering element on close.
- Always lock body scroll while a modal is open.
- Always trap focus within the dialog.

### Images
- Decorative images: `alt=""`.
- Informative images: concise, meaningful alt text — not the filename or "image of an image".
- Always supply explicit `width` and `height` to avoid layout shift.

### Loading and error states
- Loading regions: use `role="status"` and `aria-label` to describe what is loading.
- Error regions: use `role="alert"` so errors are announced immediately.
- Skeleton placeholders: always add `aria-hidden="true"` so assistive technology skips them.

### Motion
- Add `@media (prefers-reduced-motion: reduce)` overrides to every CSS animation or transition you introduce, as is already done in `VehicleList/style.scss` and `VehicleCardSkeleton/style.scss`.
