---
name: Brew & Go
description: Fresh coffee, delivered to your door.
colors:
  primary: "#8b4513"
  primary-hover: "#6a340e"
  secondary: "#d2b48c"
  accent: "#9aae7f"
  gold: "#d4af37"
  background: "#faf9f7"
  foreground: "#3c2415"
  card: "#ffffff"
  input-bg: "#f5f3f0"
  border: "rgba(60, 36, 21, 0.1)"
  destructive: "#d4183d"
typography:
  display:
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "30px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.sm}"
    padding: "14px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  card-menu:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.md}"
    padding: "0"
  input-text:
    backgroundColor: "{colors.input-bg}"
    rounded: "{rounded.sm}"
    padding: "12px"
---

# Design System: Brew & Go

## 1. Overview

**Creative North Star: "The Resident's Morning Sanctuary"**

The design balances modern luxury with everyday convenience, creating a welcoming mood that highlights premium quality without feeling intimidating. We use an airy, uncluttered layout with straightforward typography and generous negative space to ensure the ordering process is effortless. Interactions are smooth and precise, reflecting the craftsmanship of a perfect cup.

This system rejects the "slop" of generic fast-food apps and cluttered delivery platforms. It is built for a high-end residential context where the interface is a quiet, reliable concierge rather than a loud salesperson.

**Key Characteristics:**
- **Warm Minimalism**: Clean lines paired with a rich, coffee-inspired palette.
- **Effortless Density**: Generous spacing that respects the user's attention.
- **Tactile Precision**: Subtle feedback and smooth transitions that reflect artisanal craft.

## 2. Colors

The palette is a rich, warm journey from roasted beans to creamy lattes, anchored by deep browns and soft neutrals.

### Primary
- **Roasted Espresso** (#8b4513): The core brand color, used for primary actions and brand presence. It represents strength and depth.

### Secondary
- **Steamed Milk** (#d2b48c): A warm, milky tan used for secondary UI elements, categories, and accents.
- **Crema Gold** (#d4af37): Reserved for high-priority brand moments (like the logo) to add a touch of luxury.

### Tertiary
- **Matcha Green** (#9aae7f): A subtle accent color for specific statuses or healthy options.

### Neutral
- **Paper Filter** (#faf9f7): The base background color, chosen to be softer and warmer than pure white.
- **Coffee Bean** (#3c2415): The primary text color, ensuring high readability and a cohesive feel.
- **Porcelain** (#ffffff): Used for cards and surface elevations to provide contrast against the warm background.

### Named Rules
**The 10% Roast Rule.** The primary "Roasted Espresso" accent should cover no more than 10% of any given screen. Its role is to guide and anchor, not to overwhelm.

## 3. Typography

**Display Font:** Segoe UI (system-fallback)
**Body Font:** Segoe UI (system-fallback)

The typography is functional, modern, and transparent. It doesn't draw attention to itself, allowing the coffee photography and product names to take center stage.

### Hierarchy
- **Display** (Bold, 32px, 1.2): Used for the main header title.
- **Headline** (Bold, 26px, 1.3): Used for sub-sections and major modal titles.
- **Title** (Bold, 16px, 1.4): Used for product names in cards and cart items.
- **Body** (Regular, 15px, 1.5): The standard for descriptions, notes, and labels.
- **Label** (Bold, 13px, 0.05em spacing): Used for small UI meta-data and uppercase accents.

### Named Rules
**The Clarity First Rule.** Never use decorative or script fonts for functional text. If the user can't read it while half-asleep in their robe, it's failed.

## 4. Elevation

The system is primarily flat and minimal, using subtle background tints to keep the UI clean and airy.

### Shadow Vocabulary
- **Interactive Glow** (0 8px 16px rgba(139, 69, 19, 0.08)): A soft, warm shadow used only on hover for cards and buttons.
- **Cart Lift** (0 8px 24px rgba(139, 69, 19, 0.4)): A stronger, more vibrant shadow for the floating cart button to ensure it feels "above" the content.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation, focus) or for persistent floating actions.

## 5. Components

### Buttons
- **Shape:** Rounded corners (8px radius)
- **Primary:** Filled with Roasted Espresso, bold white text, 14px padding.
- **Secondary:** Transparent with Roasted Espresso border and text.
- **Hover:** Darkens the background slightly and adds a subtle lift.

### Cards
- **Menu Card:** White background, 12px radius, zero padding on the container to allow the image to bleed to the edges.
- **Content:** 16px internal padding for text and actions.
- **In-Cart State:** 1px solid Roasted Espresso border with a very subtle warm tint background.

### Inputs
- **Style:** Filled with "input-bg" neutral, 8px radius, 12px padding.
- **Focus:** 1px solid Roasted Espresso with a 2px soft glow.

### Navigation
- **Category Tabs:** Pill-shaped buttons with 20px radius. Active state uses Primary color; inactive uses a subtle border and white background.

## 6. Do's and Don'ts

### Do:
- **Do** use generous white space (md/lg spacing) between product groups.
- **Do** use OKLCH for color manipulations in CSS if supported, ensuring neutrals are tinted toward the brand hue.
- **Do** provide high contrast for all functional text (Coffee Bean on Paper Filter).

### Don't:
- **Don't** use heavy drop shadows or outdated gradients.
- **Don't** use neon or overly vibrant colors that feel "commercial" or "mass-market".
- **Don't** use "side-stripe" borders as a primary way to indicate status or hierarchy.
- **Don't** use cartoonish illustrations or "slop" assets.
- **Don't** clutter the screen with redundant labels; let the photography do the work.
