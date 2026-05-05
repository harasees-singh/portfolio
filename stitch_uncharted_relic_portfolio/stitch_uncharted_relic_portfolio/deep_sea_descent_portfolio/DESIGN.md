---
name: Deep Sea Descent Portfolio
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#bacac5'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#859490'
  outline-variant: '#3c4a46'
  surface-tint: '#3cddc7'
  primary: '#57f1db'
  on-primary: '#003731'
  primary-container: '#2dd4bf'
  on-primary-container: '#00574d'
  inverse-primary: '#006b5f'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#afe0ff'
  on-tertiary: '#00354a'
  tertiary-container: '#5ec9ff'
  on-tertiary-container: '#005371'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3cddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
typography:
  h1:
    fontFamily: Newsreader
    fontSize: 4.5rem
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Newsreader
    fontSize: 3rem
    fontWeight: '400'
    lineHeight: '1.2'
  h3:
    fontFamily: Newsreader
    fontSize: 2rem
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.1em
  code:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  gutter: 1.5rem
  margin: 2rem
---

## Brand & Style

The design system is built on the concept of verticality and immersion, mirroring the journey from the ocean's surface to the unexplored abyss. It targets a high-end engineering and design audience, balancing technical precision with a cinematic, atmospheric aesthetic.

The visual style is a hybrid of **Glassmorphism** and **Minimalism**. It uses translucent layers to simulate the density of water and progressive darkening to indicate hierarchy and depth. The emotional response should be one of calm, focused exploration—where complex engineering projects feel like bioluminescent discoveries in a vast, dark environment. 

Key visual drivers include:
- **Atmospheric Depth:** Using background blurs and gradient overlays to create a sense of three-dimensional space.
- **Engineering Precision:** High-contrast, sharp typography and thin lines that suggest technical schematics.
- **Subtle Motion:** Particle effects and slow-moving gradients that mimic marine snow and underwater currents.

## Colors

This design system utilizes a vertical gradient palette to signify "depth" within the interface. 

- **Surface (Primary/Accent):** Teals and aquas (#2DD4BF) are used for interactive elements and primary highlights, representing the sun-drenched surface.
- **Mid-Depth (Secondary):** Deep midnight blues (#0F172A) serve as the primary container colors, creating a transition between the light and the dark.
- **The Abyss (Neutral/Background):** A near-black inky blue (#020617) acts as the base background color, providing infinite depth.

Gradients should primarily flow vertically (top-to-bottom) from teal to deep blue. Use high-chroma teals sparingly to maintain a professional, "engineering-first" look.

## Typography

The typography strategy pairs a literary, sophisticated serif with a utilitarian sans-serif to create a "Research & Development" feel.

- **Headlines:** Newsreader is used for storytelling. Large headings should be set with light weights and tight letter-spacing to evoke the feeling of a premium editorial or a classic maritime log.
- **Interface & Body:** Inter provides the "engineering precision." It is used for all functional text, data displays, and body copy.
- **Labels:** Small caps with increased tracking are used for metadata and technical specs, mimicking the look of sonar displays or blueprints.

## Layout & Spacing

This design system employs a **Fixed Grid** model within a fluid container to maintain a structured, scientific look.

- **Grid:** A 12-column grid with a maximum width of 1440px.
- **Rhythm:** An 8px base grid (using a 4px minor unit) ensures technical alignment. 
- **White Space:** Large vertical margins (XL spacing) between sections are encouraged to simulate the vastness of the ocean.
- **Alignment:** Content should be centered or strongly left-aligned to mimic technical documentation.

## Elevation & Depth

Depth is conveyed through **Glassmorphism** and tonal layering rather than traditional drop shadows.

- **Backdrop Blur:** Use `backdrop-filter: blur(12px)` on all cards and overlays to simulate light diffusing through water.
- **Surface Layering:** Elements closer to the user are lighter and more transparent; background elements are darker and more opaque.
- **Inner Glows:** Instead of outer shadows, use subtle 1px inner borders (top-down) in a lighter teal to suggest light hitting the "top" of an underwater object.
- **Particles:** A subtle background animation of "marine snow" (low-opacity white dots) should exist between the background layer and the content layers.

## Shapes

The shape language is architectural and structured. Following the **ROUND_FOUR** (minimal) principle, the system uses tight radii to maintain a professional, high-spec appearance.

- **Base Radius:** 0.25rem (4px) for small elements like buttons and tags.
- **Large Radius:** 0.5rem (8px) for cards and main containers.
- **Interactive States:** Maintain sharp corners; do not use pill shapes. This reinforces the "technical instrument" metaphor.

## Components

### Buttons
Primary buttons use a solid teal-to-blue vertical gradient with white text. Secondary buttons use a "Ghost" style with a 1px teal border and a subtle backdrop blur.

### Cards
Cards are the primary vehicle for the glassmorphism effect. They should have a semi-transparent dark blue background, a 1px stroke (opacity 10-20%), and a light inner-top glow.

### Chips & Tags
Technical tags should use the `label-caps` typography style. They are small, rectangular, and use a high-contrast background (teal text on a very dark blue base) to look like equipment labels.

### Input Fields
Inputs are flat with a bottom-only border, evoking the feel of a data entry terminal. Focus states should trigger a subtle teal outer glow (simulating bioluminescence).

### Navigation
The navigation should be a persistent, top-aligned bar with a high-strength backdrop blur, appearing as though it is floating on the surface of the "water" as the user scrolls down into the abyss of the portfolio projects.