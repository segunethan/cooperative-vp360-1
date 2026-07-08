# Design System Specification: The Architectural Ledger

## 1. Overview & Creative North Star
The "Architectural Ledger" is the Creative North Star for this design system. It moves away from the "disposable" feel of many fintech apps, instead drawing inspiration from high-end editorial accounting and sustainable architecture. 

The system rejects the "floating box" aesthetic of standard Material or Human Interface guidelines. Instead, it treats the mobile screen as a series of **Intentional Strata**—layered, solid foundations that feel grounded and permanent. By utilizing high-contrast typography and a sophisticated tonal palette, we convey "Authority" through stability and "Transparency" through clear, unadorned information hierarchy. We break the template look by using **Asymmetric Breathing Room**: large, intentional gaps that guide the eye toward critical financial data without the clutter of traditional dividers.

---

## 2. Colors: The Verdant Palette
The palette is rooted in the "Deep Forest Green" (#1B4332), representing institutional strength and growth.

### Surface Hierarchy & Nesting
This system operates on a **"No-Line" Rule**. Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts.
- **Base Layer:** `surface` (#f9faf6) or `surface_container_lowest` (#ffffff).
- **Secondary Sectioning:** Use `surface_container_low` (#f3f4f1) to define large content blocks.
- **Information Nests:** To highlight a specific data point within a section, use `surface_container_high` (#e8e8e5). This creates a "recessed" or "elevated" feel through tonal transition alone.

### The "Glass & Gradient" Rule
To prevent a flat, "budget" appearance, primary CTAs and Hero Data Points (like total balance) should utilize a **Signature Texture**:
- **Hero Gradient:** Transition from `primary` (#012d1d) to `primary_container` (#1b4332) at a 135-degree angle. This adds "soul" and depth to the growth narrative.
- **Glassmorphism:** For floating navigation bars or modal headers, use `surface` at 80% opacity with a `20px` backdrop-blur. This ensures the user never loses context of the "ledger" beneath.

---

## 3. Typography: Editorial Authority
We pair **Manrope** (Display/Headlines) with **Inter** (Body/Labels) to balance character with high-utility readability.

| Level | Token | Font | Size | Weight | Intent |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Manrope | 3.5rem | 700 | Large balance reveals |
| **Headline** | `headline-md` | Manrope | 1.75rem | 600 | Page titles, authoritative statements |
| **Title** | `title-lg` | Inter | 1.375rem | 600 | Card titles, section headers |
| **Body** | `body-lg` | Inter | 1rem | 400 | Standard reading, member info |
| **Label** | `label-md` | Inter | 0.75rem | 500 | Form labels, metadata |

**Editorial Note:** Use `on_surface` (#1a1c1a) for all primary text to maintain a high-contrast ratio (AA/AAA compliant). Never use weights below 400.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are largely replaced by **Tonal Stacking**.

- **The Layering Principle:** Place a `surface_container_lowest` (#ffffff) card on a `surface_container_low` (#f3f4f1) background. The contrast is subtle but enough to signify "interactive" vs "static."
- **Ambient Shadows:** Only used for elevated components like Bottom Sheets.
    - **Color:** `on_surface` at 6% opacity.
    - **Blur:** 24px (Soft, diffused light).
- **The "Ghost Border" Fallback:** If a container requires more definition (e.g., in high-glare environments), use a "Ghost Border": `outline_variant` (#c1c8c2) at **15% opacity**. 100% opaque borders are strictly forbidden.

---

## 5. Components: Robust Utility

### Buttons (The Interaction Pillars)
All buttons use the `xl` (0.75rem) roundedness for a modern yet sturdy feel. 
- **Primary:** `primary` background with `on_primary` text. Use the **Hero Gradient** for the "Growth" CTA.
- **Secondary:** `secondary_container` background with `on_secondary_container` text.
- **Tap Targets:** Minimum height of **12** (3rem) to ensure accessibility for all literacy and motor skill levels.

### Form Fields (Clear Transparency)
- **Visuals:** Use `surface_container_highest` for the input background.
- **Active State:** Change background to `surface_container_lowest` and add a 2px `primary` bottom-border (no full box border).
- **Error State:** Use `error` (#ba1a1a) for the bottom border and helper text.

### Data Visualization & Progress
- **Track:** `surface_container_high` (#e8e8e5).
- **Fill:** `secondary` (#2c694e) for growth; `primary_fixed` (#c1ecd4) for completed states.
- **Data Cards:** Forbid divider lines. Use `10` (2.5rem) vertical spacing between list items to create a clean, editorial look.

### Specialized Component: The "Growth Pillar"
A bespoke vertical progress bar for savings goals. Use a tall, wide bar with `primary_fixed` background and a `primary` fill, topped with a `title-sm` label for the percentage.

---

## 6. Do’s and Don'ts

### Do
- **Use "Aggressive" White Space:** Use the `8` (2rem) and `10` (2.5rem) spacing tokens to separate major sections.
- **Align to the Left:** Keep an editorial feel with left-aligned headers and data.
- **Layer Surfaces:** Always place lighter surfaces on darker "container" surfaces to show importance.

### Don't
- **Don't use 1px lines:** Do not use dividers between list items; use background shifts or spacing.
- **Don't use low contrast:** Never use `secondary_fixed_dim` for text; it is for background accents only.
- **Don't use thin fonts:** Avoid "Light" or "Thin" weights; they undermine the "Authoritative" brand pillar.
- **Don't use standard greys:** All neutrals in this system are "Warm Greys" (tinted with green/yellow) to ensure the financial platform feels "organic" and "alive."