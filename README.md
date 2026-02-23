# group-project-boiler-room-v5
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


## Performance (Snabb laddning)

### What was improved
- Reduced Cumulative Layout Shift (CLS) by reserving space for main app content (`#main` / `#app`)
- Reserved space for the offline banner to prevent layout jumps
- Improved layout stability across Home and Characters pages

### Performance measurements
Measured using Chrome DevTools (Performance / Lighthouse).

Results (local):
- Home: LCP 0.24s, CLS 0.01
- Characters: LCP 0.58s, CLS 0.21

### Cache (Service Worker)
Verified that the PWA service worker is active in Chrome DevTools → Application → Service Workers.