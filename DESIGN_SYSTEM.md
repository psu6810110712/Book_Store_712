# 🎨 Minimal Design System

## Overview
This design system follows minimalist principles with a focus on clarity, consistency, and usability.

---

## Color Palette

### Primary Color
- **Primary Blue**: `#2563eb` - Used for main actions, logo, and interactive elements
- **Primary Hover**: `#1d4ed8` - Hover state for primary actions
- **Primary Light**: `#dbeafe` - Backgrounds for primary-related content

### Neutral Colors (Gray Scale)
```
50:  #fafafa  - Subtle backgrounds
100: #f5f5f5  - Card backgrounds
200: #e5e5e5  - Borders
300: #d4d4d4  
400: #a3a3a3  - Disabled text
500: #737373  - Placeholder text
600: #525252  - Secondary text
700: #404040  
800: #262626  - Dark mode borders
900: #171717  - Primary text
```

### Semantic Colors
- **Success**: `#10b981` (Green) - Success messages, positive states
- **Warning**: `#f59e0b` (Amber) - Warnings, caution
- **Error**: `#ef4444` (Red) - Errors, destructive actions
- **Info**: `#3b82f6` (Blue) - Informational messages

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes
- Body: `14px`
- Small: `12px`
- Large: `16px`
- H1-H6: Use Ant Design defaults with `font-weight: 600`

### Line Height
- Default: `1.6`
- Headings: `1.2`

---

## Spacing

Using a consistent 4px base unit:

```css
--spacing-xs: 0.25rem  (4px)
--spacing-sm: 0.5rem   (8px)
--spacing-md: 1rem     (16px)
--spacing-lg: 1.5rem   (24px)
--spacing-xl: 2rem     (32px)
```

---

## Border Radius

```css
--radius-sm: 0.375rem  (6px)
--radius-md: 0.5rem    (8px)
--radius-lg: 0.75rem   (12px)
```

---

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
```

---

## Component Guidelines

### Cards
- Background: `#ffffff` (light) / `#171717` (dark)
- Border: `1px solid #e5e5e5`
- Border Radius: `8px`
- Shadow: `--shadow-sm`
- Padding: `32px` (large) or `16px` (small)

### Buttons
- Primary: Blue background (`#2563eb`)
- Secondary: Transparent with border
- Danger: Red (`#ef4444`)
- Hover: Darken by 10%

### Tables
- Header Background: `#fafafa` (light) / `#262626` (dark)
- Border: `1px solid #e5e5e5`
- Row Hover: `#fafafa` (light) / `#404040` (dark)

### Tags
- Blue: Category tags
- Green: Success states
- Red: Low stock, errors
- Yellow: Warnings
- Gray: Neutral info

---

## Dark Mode

### Background Colors
- Page: `#0a0a0a`
- Surface: `#171717`
- Hover: `#262626`

### Border Colors
- Main: `#262626`
- Subtle: `#404040`

### Text Colors
- Primary: `#fafafa`
- Secondary: `#a3a3a3`
- Muted: `#737373`

---

## Usage Examples

### CSS Variables
```css
background-color: var(--bg-surface);
color: var(--text-primary);
border: 1px solid var(--border-color);
padding: var(--spacing-md);
border-radius: var(--radius-md);
box-shadow: var(--shadow-sm);
```

### Ant Design Theme
```jsx
<ConfigProvider
    theme={{
        token: {
            colorPrimary: '#2563eb',
            colorSuccess: '#10b981',
            colorWarning: '#f59e0b',
            colorError: '#ef4444',
            borderRadius: 6,
            fontSize: 14,
        }
    }}
>
```

---

## Principles

### ✅ Do's
- Use consistent spacing (multiples of 4px)
- Stick to the defined color palette
- Use semantic colors appropriately
- Maintain high contrast for accessibility
- Keep borders subtle (`1px`)
- Use shadows sparingly

### ❌ Don'ts
- Don't use bright, saturated colors for backgrounds
- Don't use gradients extensively
- Don't use borders darker than `#404040` in light mode
- Don't mix different border-radius values
- Don't use font sizes below 12px
- Don't use more than 3 colors in a single component

---

## Accessibility

### Contrast Ratios (WCAG 2.1)
- Normal text: Minimum 4.5:1
- Large text (18px+): Minimum 3:1
- UI components: Minimum 3:1

### Color Usage
- Never rely on color alone to convey information
- Use icons and text labels alongside colors
- Ensure all interactive elements have visible focus states

---

## File Structure

```
src/
├── index.css           # Global styles & CSS variables
├── App_Router.jsx      # Theme configuration
└── components/
    └── *.jsx           # Use inline styles with CSS variables
```

---

Created with ❤️ for a clean, minimal, and accessible UI
