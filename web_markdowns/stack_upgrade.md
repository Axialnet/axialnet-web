# Web Stack Upgrade Strategy

This document outlines the rationale and strategy for upgrading the frontend architecture of the Axialnet website from its current vanilla implementation to a robust, scalable framework.

## 1. The Current State: Vanilla HTML / CSS / JS

The current `axialnet-v4` site is built using Vanilla HTML, CSS, and JavaScript.

**Pros of the Current Stack:**
*   **Performance:** Zero overhead, instant loading, no JavaScript bundles to parse.
*   **Simplicity:** Easy to understand for simple landing pages; no build steps or dependencies required.
*   **Total Control:** Direct manipulation of the DOM and CSS without framework constraints.

**Limitations for Scaling:**
*   **Lack of Component Reusability:** UI elements like buttons, navigation bars, and project cards must be copy-pasted across pages. Updating a core element requires manual changes everywhere.
*   **State Management:** As the application demands more interactivity (e.g., dynamic data loading, complex forms, user sessions), manually tracking and updating the DOM becomes brittle and bug-prone.
*   **Routing:** Implementing seamless navigation across multiple pages without full-page reloads is complex to build and maintain from scratch.
*   **Global CSS Conflicts:** As the stylesheet grows, global CSS classes run a high risk of overriding each other inadvertently.

---

## 2. Recommended Stack: Next.js + React + TypeScript

To prepare for future scaling—whether adding complex engineering dashboards, research portals, or authentication—the transition to a modern component-based framework is necessary. 

The industry standard recommendation for this scale is **Next.js**.

### Why Next.js?
1.  **Component-Based Architecture (React):** Break the UI down into reusable pieces (e.g., `<Hero />`, `<ProjectCard />`, `<ContactForm />`). Build once, reuse anywhere.
2.  **Type Safety (TypeScript):** Catch errors at compile-time rather than run-time. This is critical for maintaining stability in a growing codebase.
3.  **Hybrid Rendering (SSR / SSG):** Next.js supports Server-Side Rendering and Static Site Generation. This means you retain the lightning-fast load times and perfect SEO of your current static site, while gaining the dynamic capabilities of a React application.
4.  **File-Based Routing:** Creating a new page is as simple as adding a new file to the `app/` directory, completely eliminating manual routing configuration.

### Styling Strategy
*   **CSS Modules:** To preserve the exact aesthetic of the `axialnet-v4` theme without the risk of global conflicts, we will use CSS Modules. This allows us to keep writing standard Vanilla CSS, but the framework automatically scopes those styles to their specific components.

---

## 3. Alternative Considerations

*   **Vite + React (SPA):** Ideal if SEO is entirely irrelevant and the goal is strictly a client-side web application or internal dashboard. Faster build times than Next.js, but lacks native SSR.
*   **Astro:** The best choice if the site will remain predominantly static content (like a blog or documentation site) with only isolated "islands" of interactivity. Astro ships zero JS by default.

---

## 4. Migration Plan

Transitioning the existing site to Next.js is straightforward because the design system is already well-defined.

1.  **Initialize Project:** Run `npx create-next-app@latest` with TypeScript enabled.
2.  **Port Design Tokens:** Move the `:root` CSS variables from the existing `style.css` into the Next.js `globals.css` file.
3.  **Component Extraction:** Break the existing `index.html` into logical React components:
    *   `components/Layout/Header.tsx`
    *   `components/Layout/Footer.tsx`
    *   `components/Home/Hero.tsx`
    *   `components/Home/Projects.tsx`
4.  **Style Migration:** Convert section-specific CSS into CSS Modules (e.g., `Hero.module.css`).
5.  **Reimplement Logic:** Convert the vanilla JavaScript (e.g., scroll reveal animations, mobile menu toggles) into React hooks (`useEffect`, `useState`).

By adopting this stack, the platform will be fully equipped to handle complex engineering data visualizations, user authentication, and expansive content scaling without compromising the premium, precise aesthetic established in v4.
