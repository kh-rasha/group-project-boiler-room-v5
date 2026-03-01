# group-project-boiler-room-v5
# Wizardpedia – Harry Potter PWA

Live version:
https://kh-rasha.github.io/group-project-boiler-room-v5/

CI/CD:
Deployment is handled via GitHub Actions.
The application is automatically built and deployed to GitHub Pages on every push to the main branch.
# Accessibility & UX Improvements

## Overview

This update improves the application's accessibility according to WCAG 2.1 AA guidelines.  
The goal was to ensure that users can navigate the app using only a keyboard and experience a clear, readable interface.

---

## Semantic Improvements

- Used semantic HTML elements (`header`, `nav`, `main`, `section`, `footer`)
- Replaced clickable `div` elements with proper `button` or `a` elements
- Ensured form inputs are connected to labels
- Added meaningful ARIA attributes where necessary

---

## Heading Structure

- Ensured one `<h1>` per page
- Verified correct heading hierarchy (H1 → H2 → H3)
- Removed skipped heading levels

---

## Keyboard Accessibility

- Full navigation using `Tab` and `Shift + Tab`
- No focus traps detected
- Menu can be opened and closed using keyboard
- Focus returns correctly after closing menu
- ESC key closes interactive components

---

## Focus Visibility

- Implemented `:focus-visible` styles
- Removed `outline: none` where it blocked accessibility
- Ensured visible focus indicator on all interactive elements

---

## Color Contrast & Readability

- Adjusted text colors to meet WCAG 2.1 AA contrast ratio (minimum 4.5:1)
- Improved contrast for character titles and links
- Verified base font size is at least 16px
- Ensured readable line-height

---

## Accessibility Testing

### Tool Used
- axe DevTools (Chrome extension)
- Lighthouse (Chrome DevTools)

### Pages Tested
- Home
- Characters
- Books
- Movies
- Spells
- Houses
- Favorites
- About

### Results

- No critical accessibility issues
- Color contrast issues resolved
- All pages navigable via keyboard
- Proper heading structure verified
- Focus clearly visible across all views

---

## Manual Verification

The following manual tests were performed:

- Full keyboard navigation without using a mouse
- Opening and closing menu using keyboard
- Navigating through interactive cards
- Verifying no focus trap occurs
- Checking heading structure in DevTools
- Validating contrast ratios using Chrome color picker

---

## Conclusion

The application now supports keyboard-only navigation, follows semantic HTML structure, meets WCAG 2.1 AA contrast requirements, and passes automated accessibility testing using axe DevTools.


## Performance & Loading Speed (Snabb laddning)

Performance was tested using Google Chrome DevTools (Lighthouse and Performance tab).

### Lighthouse Results (Local Test)

Home page:
- Performance: 82
- Accessibility: 100
- Best Practices: 100
- SEO: 83
- Largest Contentful Paint (LCP): 4.2 s
- Cumulative Layout Shift (CLS): 0.01

Characters page:
- LCP: 0.58 s
- CLS: 0.21

## Known Limitations

- New API data cannot be fetched while offline.
- Only previously visited pages and loaded resources are cached.
- If the API is unavailable and no cached version exists, data cannot be displayed.
- Some dynamic updates require an internet connection.

## Error Handling

The application includes basic error handling:

- Network errors display a user-friendly message.
- If the API is unavailable, cached data is used when possible.
- If no cached data exists, the user is informed that data cannot be loaded.
- Offline status is indicated via a visible banner.

### Improvements Made

- Reduced Cumulative Layout Shift (CLS) by reserving layout space for:
    - `#main`
    - `#app`
    - offline banner
- Ensured stable image containers to prevent layout jumps
- Enabled Service Worker caching for static assets
- Verified PWA functionality in production build

### Service Worker

Service Worker is activated and running.
Static resources are cached for improved performance and offline support.

Verified in:
Chrome DevTools → Application → Service Workers

## Installation & Offline Usage

The application can be installed as a Progressive Web App (PWA).

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home Screen"
4. The app can now be used offline after the first load

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share icon
3. Select "Add to Home Screen"
4. Launch from home screen to use in standalone mode

Offline behavior:
- The app shell (HTML, CSS, JS) is cached
- Previously loaded API data is available offline
- Favorites always work offline

## Team Collaboration & Planning

The project was developed by a team of three students.

We divided responsibilities across:
- API integration & routing
- Favorites & local storage
- PWA implementation (Service Worker & Manifest)
- Accessibility & testing
- CI/CD setup

We followed an iterative development process and adjusted the plan when technical challenges required additional time.