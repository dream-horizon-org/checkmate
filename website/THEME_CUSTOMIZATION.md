# Checkmate Documentation Theme Customization

This document describes the custom theme applied to the Checkmate documentation site to create a unified, cohesive look matching the homepage.

## 🎨 Design System

### Color Palette

#### Primary Colors
```css
/* Light Mode */
--ifm-color-primary: #667eea (Purple-Blue)
--ifm-color-secondary: #764ba2 (Violet)

/* Dark Mode */
--ifm-color-primary: #8099ec (Lighter Purple-Blue)
--ifm-color-secondary: #9370b8 (Lighter Violet)
```

#### Gradient
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

This signature gradient is used across:
- Navbar background
- Primary buttons
- H1 headings (text gradient)
- Active states
- Hover effects

### Typography

- **Headings**: Bold, modern sans-serif
- **H1**: Gradient text effect matching brand colors
- **H2**: Bottom border in primary color
- **H3**: Colored in primary shade
- **Body**: Clean, readable font with proper contrast

## 🧩 Component Styling

### Navbar
- **Background**: Purple-blue gradient
- **Links**: White with hover effects
- **Active State**: White with subtle background
- **Shadow**: Soft shadow for depth

### Sidebar
- **Active Link**: Gradient background with left border
- **Hover**: Subtle primary color tint
- **Collapsible Items**: Smooth transitions
- **Icons**: Custom SVG icons in primary color

### Content Area
- **Cards**: Rounded corners, shadows, hover lift effect
- **Code Blocks**: Rounded with shadows
- **Tables**: Gradient header background
- **Tabs**: Primary color highlights on active tab

### Admonitions
- **Border**: 4px left border in contextual colors
- **Info**: Primary purple-blue
- **Success/Tip**: Green
- **Warning/Caution**: Orange
- **Danger**: Red

### Buttons
- **Primary**: Gradient background with hover lift
- **Secondary**: Outlined with fill on hover
- **Transitions**: Smooth 0.3s ease

## 🌓 Dark Mode

Dark mode automatically adjusts:
- Lighter primary colors for better contrast
- Darker backgrounds (#1a1a2e, #16213e)
- Adjusted navbar gradient
- Proper text contrast
- Maintained visual hierarchy

## ✨ Special Effects

### Hover States
- Lift effect (`translateY(-2px)`)
- Shadow enhancement
- Color transitions

### Scrollbar
- Custom styled with gradient thumb
- Matches primary colors
- Hover state darkens

### Focus States
- Visible outline for accessibility
- Primary color with offset
- All interactive elements

## 📱 Responsive Design

- Mobile-optimized typography sizes
- Collapsible sidebar
- Responsive navbar
- Touch-friendly targets
- Flexible grid layouts

## 🎯 Applied To

1. **Homepage** (`src/pages/index.tsx`)
   - Hero section with gradient
   - Feature cards
   - Tech stack badges
   - CTA section

2. **Documentation Pages** (`custom.css`)
   - All content pages
   - Sidebar navigation
   - TOC (Table of Contents)
   - Search bar

3. **Global Elements**
   - Navbar across all pages
   - Footer styling
   - Code syntax highlighting
   - Admonitions/alerts

## 🔧 Customization Files

- **Main Theme**: `src/css/custom.css`
- **Homepage**: `src/pages/index.tsx` + `index.module.css`
- **Config**: `docusaurus.config.ts`

## 🚀 Benefits

1. **Brand Consistency**: Unified purple-blue theme throughout
2. **Professional Look**: Modern, clean aesthetic
3. **Better UX**: Clear visual hierarchy and interactions
4. **Accessibility**: Proper contrast ratios and focus states
5. **Performance**: CSS-based, no heavy animations

## 📊 Theme Variables Reference

```css
/* Primary Colors */
--ifm-color-primary: #667eea
--ifm-color-primary-dark: #4c63e8
--ifm-color-primary-darker: #3f56e6
--ifm-color-primary-darkest: #2639d4
--ifm-color-primary-light: #8099ec
--ifm-color-primary-lighter: #93a6ee
--ifm-color-primary-lightest: #bdc9f3

/* Backgrounds */
--ifm-background-color: #ffffff
--ifm-background-surface-color: #f8f9ff
--ifm-card-background-color: #ffffff

/* Typography */
--ifm-heading-color: #2d3748
--ifm-font-color-base: #4a5568
--ifm-font-color-secondary: #718096

/* Borders & Shadows */
--ifm-border-color: #e2e8f0
--ifm-global-shadow-lw: 0 2px 8px rgba(0, 0, 0, 0.06)
--ifm-global-shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08)
```

## 🎨 Color Usage Guidelines

- **Primary Gradient**: Hero sections, CTAs, navbar
- **Primary Color**: Links, active states, headings
- **Secondary**: Accents, borders, subtle highlights
- **Neutral**: Body text, backgrounds, borders

## 📝 Future Enhancements

Possible additions:
- Custom logo animation
- Smooth page transitions
- Advanced search styling
- Custom illustrations
- Animated backgrounds

