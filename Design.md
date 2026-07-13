# Design Specifications - Forensic.AI

## 1. Color Palette System
The visual style is based on a warm-metallic dark mode layout called **Aurora Gold & Obsidian**.

- **Obsidian Dark Background**: `#07070A`
- **Aurora Gold Accent**: `#E2C799` (used for primary headers, text gradients, buttons, active nodes)
- **Sage Titanium Accent**: `#8E9A86` (used for secondary labels, grid lines, and border strokes)
- **Lilac Platinum**: `#C8A2C8` (used for glow highlights and visual indicators)
- **Base Cards**: `rgba(15, 15, 22, 0.4)` with `backdrop-filter: blur(25px)`

---

## 2. Typography & Hierarchy
- **Futuristic Headers**: `Space Grotesk` (geometric, technical display font).
- **Body Copy**: `Inter` (neutral, high-readability sans-serif font).
- **System Metrics**: Monospaced styles for statistics, counts, and log steps.

---

## 3. 3D Elements
- **Hero Globe**:
  - Structured as 1,200 particle nodes arranged in a golden spiral geometry.
  - Features revolving orbit paths mapping source connections.
  - Responds to pointer moves on screen, tilting dynamically toward the cursor position.
- **Source Network Grid**:
  - Customized interactive SVG graphics displaying spreading nodes and color-coded trustworthiness factors.
