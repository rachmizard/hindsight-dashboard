---
name: Hindsight Dashboard
description: A calm operational workspace for navigating machine memory.
colors:
  clay-action: "oklch(0.57 0.14 42)"
  clay-soft: "oklch(0.91 0.038 48)"
  auth-clay: "oklch(0.37 0.09 38)"
  auth-foreground: "oklch(0.965 0.012 68)"
  auth-muted: "oklch(0.88 0.025 61)"
  warm-workspace: "oklch(0.975 0.004 66)"
  raised-surface: "oklch(0.995 0.002 70)"
  ink: "oklch(0.255 0.025 43)"
  ink-muted: "oklch(0.45 0.025 48)"
  quiet-border: "oklch(0.875 0.014 61)"
  night-workspace: "oklch(0.19 0.012 43)"
  night-ink: "oklch(0.925 0.012 68)"
  danger: "oklch(0.56 0.19 26)"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.75rem, 5vw, 5rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.65rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 650
    lineHeight: 1.4
rounded:
  sm: "0.5rem"
  md: "0.625rem"
  lg: "0.75rem"
  xl: "1rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.clay-action}"
    textColor: "{colors.raised-surface}"
    rounded: "{rounded.md}"
    height: "2.75rem"
    padding: "0 1rem"
  input:
    backgroundColor: "{colors.raised-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "2.75rem"
    padding: "0 0.875rem"
  surface:
    backgroundColor: "{colors.raised-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.25rem"
---

# Design System: Hindsight Dashboard

## Overview

**Creative North Star: "The Working Notebook"**

Hindsight feels like a well-kept technical notebook translated into a live operations tool: calm enough for sustained focus, structured enough for dense data, and warm enough to feel considered. Familiar dashboard conventions keep the interface invisible during routine work, while the clay accent and restrained editorial moments give it a recognizable voice.

The system rejects generic blue-on-black SaaS styling, decorative glassmorphism, neon glows, purple gradients, oversized marketing metrics, and starter-template ornament. Authentication is a distinct state with its own composition; the application shell belongs only to the workspace.

**Key Characteristics:**

- Warm neutral work surfaces with ink-heavy typography.
- Clay used sparingly for action, selection, and focus.
- Tonal layering and precise dividers instead of floating cards.
- Compact, responsive information density.
- Fully paired light and dark themes with clear operational states.

## Colors

The palette is a restrained set of neutral work surfaces anchored by one clay interaction color.

### Primary

- **Clay Action** (`oklch(0.57 0.14 42)`): Primary buttons, selected navigation, chart emphasis, and focus-adjacent states.
- **Clay Soft** (`oklch(0.91 0.038 48)`): Selected rows and secondary interaction surfaces.

### Neutral

- **Warm Workspace** (`oklch(0.975 0.004 66)`): Light application background.
- **Raised Surface** (`oklch(0.995 0.002 70)`): Inputs, panels, and primary content surfaces.
- **Ink** (`oklch(0.255 0.025 43)`): Primary text and icons.
- **Ink Muted** (`oklch(0.45 0.025 48)`): Secondary text; maintains WCAG AA against the workspace.
- **Quiet Border** (`oklch(0.875 0.014 61)`): Dividers, field outlines, and container boundaries.
- **Night Workspace** (`oklch(0.19 0.012 43)`): Dark application background.
- **Night Ink** (`oklch(0.925 0.012 68)`): Dark-theme primary text.

**The Clay Signal Rule.** Clay marks action, current selection, or meaningful data. It is never a decorative wash across routine surfaces.

## Typography

**Display Font:** Newsreader (Georgia fallback)  
**Body Font:** Manrope (system sans fallback)  
**Label/Mono Font:** Manrope; system monospace only for compact numeric data

**Character:** Manrope carries the operational interface with quiet precision. Newsreader appears only on the authentication brand statement, adding the warm editorial note without entering buttons, labels, tables, or dashboard headings.

### Hierarchy

- **Display** (600, `clamp(2.75rem, 5vw, 5rem)`, 0.98): Authentication brand statement only.
- **Headline** (650, `1.65rem`, 1.2): Page-level dashboard headings.
- **Title** (600, `0.875rem`, 1.4): Sections, chart captions, and panels.
- **Body** (400, `0.9375rem`, 1.55): UI content with prose held near 68 characters.
- **Label** (650, `0.75rem`, 1.4): Metrics, field metadata, and compact controls.

**The Operational Type Rule.** Serif is reserved for the auth brand moment; the working interface uses one sans family.

## Elevation

The system is flat by default and creates depth through tonal differences, dividers, and inset composition. Shadows are structural and rare: popovers and floating overlays may lift, but static content panels do not.

### Shadow Vocabulary

- **Low** (`0 1px 2px color-mix(in oklab, var(--foreground) 8%, transparent)`): Small structural separation where a divider is insufficient.
- **Medium** (`0 6px 8px -6px color-mix(in oklab, var(--foreground) 24%, transparent)`): Popovers and tooltips only.

**The Flat-at-Rest Rule.** Static dashboard surfaces use a border or a tonal step, never a wide ambient shadow.

## Components

Components feel refined and restrained: familiar geometry, strong state clarity, and no decorative effects.

### Buttons

- **Shape:** Compact rounded rectangle (`0.625rem`).
- **Primary:** Clay Action with high-contrast light text, 44px minimum height.
- **Hover / Focus:** Subtle tonal shift; a two-pixel visible focus outline with no layout movement.
- **Secondary / Ghost:** Neutral or transparent at rest, with Clay Soft used only on interaction.

### Chips

- **Style:** Small rounded rectangles rather than oversized pills; solid for type, outlined for metadata.
- **State:** Selection uses both color and contrast, never color alone.

### Cards / Containers

- **Corner Style:** `0.75rem`.
- **Background:** Raised Surface over Warm Workspace; paired night tokens in dark mode.
- **Shadow Strategy:** Flat at rest.
- **Border:** One-pixel Quiet Border.
- **Internal Padding:** `1rem` to `1.5rem`, adjusted for information density.

### Inputs / Fields

- **Style:** 44px minimum height, visible one-pixel outline, raised surface, `0.625rem` radius.
- **Focus:** Ring token with clear contrast and no size change.
- **Error / Disabled:** Error uses icon, text, and destructive color; disabled controls retain legibility and remove pointer interaction.

### Navigation

The sidebar uses icons plus labels, 44px rows, a soft selected background, and a persistent active-bank control. Mobile replaces it with a modal sheet triggered from the header. The login route never renders workspace navigation.

### Data Surfaces

Metrics share one divided band instead of becoming four floating cards. Charts use horizontal bars with direct category labels, theme-aware color, textual accessible summaries, and responsive containers. Memory and recall results use divided rows so the content—not the container—defines hierarchy.

## Do's and Don'ts

### Do:

- **Do** keep the active bank and current section visible.
- **Do** use Clay Action for primary actions, selection, focus, and meaningful chart emphasis.
- **Do** preserve 44px interactive targets, visible focus rings, and WCAG 2.2 AA contrast.
- **Do** use skeletons shaped like the content they replace.
- **Do** design loading, empty, error, disabled, populated, light, dark, desktop, and mobile states together.

### Don't:

- **Don't** use generic blue-on-black SaaS dashboards.
- **Don't** use decorative glassmorphism, neon glows, or purple gradients.
- **Don't** turn routine data into oversized metric cards that feel like marketing.
- **Don't** embed authentication screens inside the authenticated application shell.
- **Don't** ship starter-template copy, inconsistent component styles, or low-contrast gray text.
- **Don't** pair a one-pixel border with a wide decorative shadow.
- **Don't** use display typography in UI labels, buttons, tables, or routine dashboard headings.
