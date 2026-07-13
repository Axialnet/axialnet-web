# axialnet Website — Content Redesign Plan

**Scope of this document:** Content and messaging changes only. Visual design, CSS, layout, color palette, typography, and animations remain untouched — the current theme is confirmed correct and should not be altered.

**Why this redesign:** The current site reads as a landing page for GeoLLM specifically. axialnet is positioned as a general ML studio (GeoLLM is the flagship product, not the whole identity). This document restructures copy across the existing sections so the site communicates "studio building a repeatable pipeline across engineering domains" rather than "single product company."

---

## 1. Guiding Principle

Every section keeps its current HTML structure, classes, and visual treatment. Only text content, labels, and (in one case) a new lightweight section are added. No new components, no new CSS classes required beyond what already exists in the file.

---

## 2. Section-by-Section Changes

### 2.1 Hero (`<section class="hero">`)

| Element | Current | Change To | Why |
|---|---|---|---|
| `hero__label` | `Working paper · GeoLLM v0.1` | `axialnet · ML Studio` | Removes product-specific framing from the very first thing a visitor reads |
| `hero__h1` | "Machine learning for physical-world engineering systems." | **No change** | Already studio-level framing — this line does its job correctly |
| `hero__desc` | "Axialnet develops domain-specific AI for geotechnical and infrastructure engineering — fields where hallucination has real-world consequences." | "Axialnet builds domain-specific AI systems for engineering fields that AI has largely bypassed — starting with geotechnical, extending to transportation and infrastructure." | Signals GeoLLM as a starting point, not a boundary |
| `panel-title` ("GeoLLM · Live Inference") | — | `Flagship: GeoLLM — Live Inference` | Marks this panel as one example of the studio's output, not the studio itself |
| Metrics bar | No change | No change | These are GeoLLM-specific stats and are fine living inside a panel explicitly labeled as the flagship |

### 2.2 NEW: Capability / Thesis Strip (insert between Hero and Projects)

This is the one new section. Keep it short — one screen, no heavy visuals needed. Reuse the existing `section-pad`, `wrap`, and `section-label` classes so it matches the site's existing rhythm exactly.

**Suggested content:**
- Section label: `HOW WE WORK`
- Heading: "One pipeline. Many domains."
- Body (2–3 sentences): "axialnet's model is a repeatable pipeline — domain data curation, parameter-efficient fine-tuning, and secure on-premise deployment — applied across engineering sub-verticals rather than built around a single product. GeoLLM and LaneDisciplineNet are both instances of this same underlying approach."
- Optional: a compressed 3-step visual (Data → Fine-tune → Deploy) using the same `flow-box` styling already defined for the Methods section, just fewer steps and smaller scale.

Purpose: this is currently the biggest content gap. The page jumps from hero straight into two project cards with nothing connecting them as expressions of one studio thesis.

### 2.3 Projects (`<section class="projects">`)

| Element | Current | Change To | Why |
|---|---|---|---|
| GeoLLM `proj-tag` | `In development` | `Flagship · Live` | GeoLLM is deployed at geollm.axialnet.in — the tag should reflect that status and its role as flagship |
| LaneDisciplineNet `proj-tag` | `In development` | `Research · Proof of concept` | Differentiates it from GeoLLM — frames it as evidence of range, not a second equal flagship |
| `section-label` | `ACTIVE RESEARCH` | No change | Still accurate and works for both framings |
| Project descriptions | No change | No change | Already well-written and technically specific — do not touch |

### 2.4 Methods (`<section class="methods">`)

| Element | Current | Change To | Why |
|---|---|---|---|
| Intro copy above flow diagram | (implicit — diagram just appears) | Add one sentence: "The same pipeline underlies every axialnet project. Shown below as applied to GeoLLM." | Makes explicit that Methods describes the *general* studio process, using GeoLLM only as the walkthrough example |
| Flow diagram content, method-step cards | No change | No change | These are well-built and generalize fine as-is |

### 2.5 About (`<section class="about">`)

This section currently carries the most single-product framing and needs the most attention.

| Element | Current | Change To | Why |
|---|---|---|---|
| `founder-info` tag line | `ML Engineering · Geotechnical AI` | `ML Engineering · Applied Research` | Removes the hard geotech label from the founder's own identity tag |
| `about-body` paragraph 1 | "Axialnet was founded at IIT (BHU) Varanasi. The thesis is simple: physical-world domains — geotechnical, structural, infrastructure engineering — have been almost entirely bypassed by the AI boom, because AI teams don't speak the domain." | No change | Already studio-framed and accurate — keep as-is |
| `about-body` paragraph 2 | "We do. We are building from the domain down: deep understanding first, then the models to match it." | Add a third paragraph: "axialnet operates as a studio: each project is both a standalone product and a proof point for the underlying pipeline." | States the studio model explicitly, once, in the section that visitors read for company identity |

### 2.6 Contact (`<section class="contact">`)

| Element | Current | Change To | Why |
|---|---|---|---|
| `contact-left` intro | "We are looking for geotechnical engineers, infrastructure firms, and researchers who want AI that genuinely understands their domain." | "We are looking for geotechnical engineers, infrastructure firms, researchers, and teams in adjacent engineering domains who want AI that genuinely understands their field." | Widens the inbound net beyond geotech without diluting the specificity that makes the pitch credible |
| Form fields, layout | No change | No change | Functional, no content issue here |

### 2.7 Footer (`<footer class="site-footer">`)

| Element | Current | Change To | Why |
|---|---|---|---|
| `footer-left` tagline | "ML for physical-world engineering systems." | No change | Matches the hero H1 — already studio-level, consistent |
| Footer nav | Lists GeoLLM, LaneDisciplineNet, Methods under "Research" | No change | Structure already correct — adding future projects here later is just a matter of appending links |

---

## 3. Final Section Order

1. Hero *(reframed)*
2. **Capability / Thesis strip** *(new)*
3. Projects *(tags updated)*
4. Methods *(one intro line added)*
5. About *(reframed, one paragraph added)*
6. Contact *(intro line widened)*
7. Footer *(unchanged)*

---

## 4. Implementation Checklist

- [ ] Update `hero__label` text
- [ ] Update `hero__desc` text
- [ ] Relabel `panel-title` to include "Flagship:"
- [ ] Build new Capability section using existing `section-pad` / `wrap` / `section-label` / `flow-box` classes
- [ ] Update GeoLLM `proj-tag` text and class if a new tag style is desired (optional — text change alone works with existing `tag-active` class)
- [ ] Update LaneDisciplineNet `proj-tag` text
- [ ] Add one intro sentence to Methods section, above the flow diagram
- [ ] Update founder tag line in About
- [ ] Add third paragraph to About body
- [ ] Widen Contact intro copy
- [ ] Proofread full page for consistency (search for any remaining "geotechnical-only" language sitewide)

**No CSS, layout, or asset changes required.** This is a text-only pass across an already-correct visual theme.