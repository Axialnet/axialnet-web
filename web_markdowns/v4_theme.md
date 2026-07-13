# Axialnet v4 Theme Guide

This guide breaks down the visual language, frontend stack, and design system used in `axialnet-v4`. You can use this reference to build the exact same type of webpage for any content or website.

## 1. Core Theme Concept

**Style:** True white · Structured · Research/Academic  
**Vibe:** Highly technical, precise, academic yet modern and clean. It avoids flashy backgrounds, favoring crisp typography and structured borders.

## 2. Typography

The design relies entirely on the **IBM Plex** family, which gives it a distinct engineering/academic feel:

*   **Serif (IBM Plex Serif):** Used for large, impactful headings and titles. Weight: 300 (Light). Used to give an academic/paper-like aesthetic. Sometimes italicized for emphasis.
*   **Sans (IBM Plex Sans):** Used for the main body text, buttons, and general reading content. Weights: 300 (Light) and 400 (Regular).
*   **Mono (IBM Plex Mono):** Used for section labels, metric numbers, technical data, and UI elements. Weights: 400 (Regular) and 500 (Medium). Gives a technical, "data-heavy" look.

*Google Fonts Import:*
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;1,300;1,400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

## 3. Color Palette

The color scheme is highly constrained, prioritizing contrast and structure over decoration.

**Backgrounds & Surfaces:**
*   `--white`: `#ffffff` (Primary background)
*   `--off`: `#f7f7f5` (Secondary background for panels/cards)
*   `--surface`: `#f0f0ee`

**Typography & Elements (Inks):**
*   `--ink`: `#111110` (Primary high-contrast text, titles)
*   `--ink-2`: `#3a3a38` (Secondary text, hover states)
*   `--ink-3`: `#696966` (Body text, descriptions)
*   `--ink-4`: `#9a9a96` (Subtle text, labels, metadata)
*   `--ink-5`: `#c4c4c0` (Faintest text)

**Structure (Lines):**
*   `--line`: `#e4e4e0` (Primary borders and dividers)
*   `--line-2`: `#d0d0cb` (Darker borders, scrollbar thumb)

**Accents (Used sparingly for statuses):**
*   `--green`: `#15803d` (Live status dots, active tags)
*   `--green-bg`: `#f0fdf4`
*   `--blue`: `#1c4ed8` (Link hovers)
*   `--blue-bg`: `#eff6ff`
*   `--red`: `#b91c1c`

## 4. Layout & Structure

*   **Max Width:** The main content wrapper is constrained to `1100px` with `48px` side padding (`.wrap`).
*   **Section Spacing:** Generous vertical padding (`96px`) between sections (`.section-pad`).
*   **Grid System:** Uses CSS Grid (`display: grid`) extensively for multi-column layouts (e.g., hero split, project rows, methods, contact).
*   **Borders:** Structured heavily with 1px solid borders (`var(--line)`) to separate sections, cards, and data points.
*   **Border Radii:** Small, tight corners. 
    *   `--r`: `4px` (Buttons, inputs)
    *   `--r-md`: `8px` (Charts)
    *   `--r-lg`: `12px` (Cards, panels)

## 5. Key UI Components & Aesthetics

*   **Section Labels:** Always uppercase, monospaced (`IBM Plex Mono`), small font size (`.65rem`), and heavily letter-spaced (`.2em`). Color: `--ink-4`.
*   **Sticky Header:** Uses a transparent background that transitions to a semi-transparent white background with a blur effect (`backdrop-filter: blur(12px)`) when scrolled.
*   **Buttons:**
    *   Primary: Solid black (`--ink`), white text, sans-serif, slightly rounded.
    *   Submit/Action: Monospaced, solid black.
    *   Text Links: Monospaced with an arrow, or simple sans-serif with hover color change.
*   **Data Panels/Cards:** Light off-white background with a subtle border. Often includes a header and footer section with monospaced metadata (e.g., "Live Inference", "Status: RUNNING").
*   **Metric Bars:** Full-width separated blocks displaying large monospaced numbers alongside small monospaced labels.
*   **Divider Band:** An infinite scrolling marquee banner with monospaced text to highlight technologies or key terms.
*   **Animations:** Smooth, subtle reveal animations on scroll (`opacity` and `transform: translateY(20px)`), cascaded using CSS custom properties for delays (`--delay`).

## 6. Frontend Stack

The exact site is built using basic, vanilla web technologies to keep it lightweight and fast:
*   **HTML5:** Semantic HTML (`<header>`, `<section>`, `<nav>`, `<footer>`).
*   **CSS3 (Vanilla):** No Tailwind or external frameworks. Uses CSS variables (custom properties) for theming, CSS Grid/Flexbox for layout, and standard CSS animations/transitions.
*   **JavaScript (Vanilla):** Used for simple interactions like the mobile menu toggle, scroll reveal logic (Intersection Observer), and potentially Canvas drawing (for the data panel visualization).

## How to Replicate

To build a site with this exact design system:
1.  **Set up the CSS Variables:** Copy the `:root` variables from the `axialnet-v4` stylesheet.
2.  **Import Fonts:** Import the IBM Plex font family (Serif, Sans, Mono).
3.  **Use the Wrapper:** Constrain your content within a max-width container (`1100px`).
4.  **Embrace Borders:** Use 1px borders to separate semantic sections and data points.
5.  **Strict Typography Hierarchy:** 
    *   Titles/H1: `var(--serif)`, large, weight 300.
    *   Body: `var(--sans)`, weight 300/400.
    *   Labels/Data/Metadata: `var(--mono)`, small, uppercase (for section titles).
6.  **Avoid Solid Background Colors:** Stick to white and off-white. Use borders to define space.
