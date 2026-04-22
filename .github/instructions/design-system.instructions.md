---
applyTo: "**/*.tsx,**/*.jsx,**/*.css"
---

# Voca Design System

You are implementing UI for Voca. Always follow this design system exactly. Do not deviate from established tokens, patterns, or component conventions. When in doubt, refer to the reference implementations in `.github/instructions/` before writing any new component.

## Design Principles

1. **Intentional minimalism** — every element earns its place. No decorative chrome.
2. **Information hierarchy** — users should always know what to do next.
3. **Feedback-first** — every action has an immediate visual response.
4. **Consistency over creativity** — use existing patterns before creating new ones.

---

## Color Tokens

```css
/* Core Palette — 60/30/10 rule */
--color-base:        #0d2218;  /* 60% — Deep Forest (dark bg, sidebar, primary surfaces) */
--color-surface:     #f8f9f7;  /* 30% — Soft Canvas (light bg, cards, form areas) */
--color-accent:      #4ade80;  /* 10% — Electric Mint (CTAs, highlights, active states) */

/* Extended */
--color-base-hover:  #163528;  /* Hover state on dark surfaces */
--color-accent-dim:  #16a34a;  /* Accent on light backgrounds (meets contrast) */
--color-text-dark:   #f0fdf4;  /* Primary text on dark */
--color-text-light:  #111827;  /* Primary text on light */
--color-text-muted:  #6b7280;  /* Secondary text on light */
--color-text-faint:  #9ca3af;  /* Tertiary / placeholder text */

/* Borders */
--color-border:      #e5e7eb;  /* Default border */
--color-border-dark: rgba(74, 222, 128, 0.12); /* Border on dark surfaces */

/* Feedback */
--color-success:     #4ade80;
--color-error:       #f87171;
--color-warning:     #fbbf24;
```

**Rules:**
- Never use purple, blue, or orange in the Voca UI.
- Electric Mint (`#4ade80`) is **only for accents** — never as a large background fill.
- On dark surfaces, use `rgba(74,222,128,0.08–0.15)` for subtle tinted backgrounds.
- Maintain contrast ratio ≥ 4.5:1 for all text.

---

## Typography

```css
/* Load via Google Fonts */
/* Syne: 700, 800 | DM Sans: 300, 400, 500, 600 | JetBrains Mono: 400, 500 */

--font-display: 'Syne', sans-serif;       /* Headlines, logo, hero text */
--font-body:    'DM Sans', sans-serif;    /* All UI text, labels, body, buttons */
--font-mono:    'JetBrains Mono', monospace; /* Code, output text, JSON, filenames */
```

### Scale

| Role | Font | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Page title | Syne | 28px | 800 | -0.8px |
| Section heading | Syne | 20px | 700 | -0.5px |
| Card title | Syne | 17px | 700 | -0.3px |
| Body | DM Sans | 14px | 400 | 0 |
| Label | DM Sans | 12.5px | 500 | 0.1px |
| Caption/hint | DM Sans | 11.5px | 400 | 0 |
| Eyebrow | DM Sans | 11px | 500 | 2.5px (uppercase) |
| Code/filename | JetBrains Mono | 12-13px | 400–500 | 0 |

---

## Spacing System

Based on 4px grid. Prefer these values:

```
4px   (xs)  — icon gaps, tight inline spacing
8px   (sm)  — small gaps between related elements
12px  (md)  — standard component internal padding
16px  (base)— standard spacing unit
20px        — medium gaps
24px  (lg)  — card padding, section gaps
32px  (xl)  — major section separation
48px  (2xl) — page-level padding
```

---

## Border Radius

```
4px   — tags, small chips
6px   — format badges, small buttons
8px   — inputs, secondary buttons
9px   — primary buttons
10px  — tab selectors
12px  — nav items
14px  — small cards
18px  — main cards, drop zone
20px  — large panels
```

---

## Elevation / Shadow

```css
/* Use sparingly — prefer borders over shadows for flat design */
--shadow-sm:  0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);  /* active tab */
--shadow-md:  0 4px 16px rgba(13,34,24,0.12);    /* card hover */
--shadow-lg:  0 12px 40px rgba(74,222,128,0.10); /* drop zone active */
```

---

## Layout

### App Shell

```
[Sidebar 64px fixed left] [Main content area flex-1]
```

- Sidebar: `#0d2218`, fixed, 64px width, `z-index: 100`
- Main content: `margin-left: 64px`, centered content with `max-width: 640px` for single-focus pages
- Page padding: `48px 24px`

### Sidebar

- Logo (WaveformIcon) at top
- Nav icons (20px) centered in 44×44px buttons, border-radius 12px
- Tooltip on hover: appears to the right at `left: 54px`
- Active state: `background: rgba(74,222,128,0.12)`
- Hover state: `background: rgba(74,222,128,0.08)`
- Avatar initials at bottom (34px circle, green border)
- Notification dot: 6px circle, `#4ade80`, top-right of icon

---

## Components

### Button

```tsx
// Primary — dark CTA
className="bg-[#0d2218] text-[#f0fdf4] rounded-[9px] px-5 py-3 text-sm font-semibold
           hover:bg-[#163528] hover:-translate-y-px hover:shadow-md transition-all"

// Secondary — outlined
className="border border-[#e5e7eb] bg-white text-[#374151] rounded-[8px] px-4 py-2
           text-[13px] font-medium hover:border-[#4ade80] hover:bg-[#f0fdf4] hover:text-[#0d2218]"

// Ghost action (icon + label)
className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#374151]
           hover:text-[#0d2218] transition-colors"
```

Always include `gap` between icon and label. Icon size: 15px for action buttons, 16px for standalone.

### Input

```tsx
className="w-full px-3.5 py-2.5 border border-[#e5e7eb] rounded-[8px] text-sm
           text-[#111827] bg-white outline-none font-['DM_Sans']
           placeholder:text-[#c4c9c2]
           focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10
           transition-[border-color,box-shadow]"
```

Label above input: `text-[12.5px] font-medium text-[#374151] mb-1.5 block`
Hint below input: `text-[11.5px] text-[#9ca3af] mt-1`

### Card

```tsx
// Standard card
className="bg-white rounded-[18px] border border-[#e5e7eb] overflow-hidden"

// Dark surface card
className="bg-[#0d2218] rounded-[18px] border border-[rgba(74,222,128,0.08)]"
```

### Tab Selector

```tsx
// Container
className="flex bg-[#eff1ee] rounded-[10px] p-1 gap-0.5"

// Tab button
className={`flex-1 py-2 rounded-[7px] text-[13.5px] font-medium transition-all
  ${active
    ? 'bg-white text-[#0d2218] font-semibold shadow-sm'
    : 'bg-transparent text-[#6b7280] hover:text-[#374151]'}`}
```

### Badge / Meta tag

```tsx
// Success/active
className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[11.5px] font-medium
           bg-[rgba(74,222,128,0.08)] text-[#16a34a] border border-[rgba(74,222,128,0.15)]"

// Neutral format tag
className="px-2.5 py-1 bg-[#f3f4f2] rounded-[6px] text-[11px] font-semibold
           text-[#6b7280] font-mono tracking-[0.5px]"
```

### Divider with label

```tsx
<div className="flex items-center gap-3">
  <div className="flex-1 h-px bg-[#e9ebe8]" />
  <span className="text-[12px] text-[#9ca3af] whitespace-nowrap">ou continue com</span>
  <div className="flex-1 h-px bg-[#e9ebe8]" />
</div>
```

---

## Motion & Animation

```css
/* Standard entrance — use on cards and page sections */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Waveform animation — use on loading states */
@keyframes wave-bar {
  0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
  50%       { transform: scaleY(1);   opacity: 1;   }
}

/* Pulse ring — use on active step indicators */
@keyframes pulse-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.3); }
  50%       { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
}
```

**Rules:**
- Entrance animations: `fadeUp 0.4s ease` with staggered `animation-delay` (0.1s increments)
- Hover transitions: `all 0.18s ease` or `0.2s ease`
- Never animate layout properties (`width`, `height`) — use `transform` and `opacity`
- Loading states use the waveform animation — never use a generic spinner for brand moments

---

## Icons

Use inline SVG only. No icon library imports. Standard stroke properties:
```tsx
fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
```

Icon sizes: 14px (tiny), 16px (default), 20px (nav), 24px (feature), 28px (hero zone)

---

## Responsiveness

- Sidebar collapses to hidden on `< 768px` — content takes full width
- Cards: full width on mobile, max-width constrained on desktop
- Touch targets: minimum 44×44px for all interactive elements
- Font sizes: never below 12px on mobile

---

## Dos and Don'ts

**DO:**
- Use `#0d2218` as the primary brand color — it's the identity anchor
- Keep the Electric Mint as a precise accent, not a mood
- Use JetBrains Mono for all technical output (filenames, transcriptions, JSON)
- Animate entrances with `fadeUp` on all primary content blocks
- Use `rounded-[18px]` for all main content cards

**DON'T:**
- Don't use Tailwind's default color palette (slate, gray, etc.) — use the custom hex values
- Don't use Inter, Roboto, or system fonts
- Don't add gradients to interactive elements
- Don't use shadows as primary borders — combine border + subtle shadow only on hover
- Don't create new layout patterns without checking this document first
