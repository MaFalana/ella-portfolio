# Single-Page Portfolio Documentation

## Overview
The portfolio has been converted from a multi-page application to a single-page application (SPA) with smooth scrolling navigation between sections.

## Architecture Changes

### From Multi-Page to Single-Page
**Before:** Separate page files for each section
- `/pages/index.tsx` - Home
- `/pages/about.tsx` - About page
- `/pages/gallery.tsx` - Gallery page
- `/pages/background.tsx` - Background page
- `/pages/contact.tsx` - Contact page
- `/pages/testimonials.tsx` - Testimonials page

**After:** All sections in one page
- `/pages/index.tsx` - Contains all sections with hash navigation

## New Components & Features

### 1. Unified Index Page (`/pages/index.tsx`)
The main page now includes all portfolio sections:

```tsx
<Layout>
  <section id="hero">...</section>
  <section id="about">...</section>
  <section id="background">...</section>
  <section id="gallery">...</section>
  <section id="testimonials">...</section>
  <section id="contact">...</section>
</Layout>
```

### 2. Updated Navigation (`/components/NavBar.tsx`)
- Hash-based navigation (`#hero`, `#about`, etc.)
- Smooth scrolling to sections
- Active section highlighting based on scroll position
- Fixed positioning with backdrop blur
- Only visible on the homepage

**Features:**
- Automatic active state updates on scroll
- Smooth scroll animation on click
- Responsive to window resizing
- GooeyNav particle effects on active item

### 3. Section Styles (`/styles/single-page.css`)
New stylesheet for single-page layout:

- **Section Base**: Minimum viewport height, consistent padding
- **Hero Section**: Gradient background, centered content
- **About Section**: Grid layout with headshot and bio
- **Background Section**: Timeline design for work experience
- **Gallery Section**: Masonry grid with GSAP animations
- **Testimonials Section**: Placeholder for carousel (coming soon)
- **Contact Section**: Dark theme with social links

### 4. Data Integration
Portfolio data is loaded from two sources:
1. **Static Data** - `Ella.json` for personal info, education, employment
2. **Dynamic Data** - MongoDB API for gallery items with fallback

## Navigation Flow

### Smooth Scrolling Implementation
```javascript
// Smooth scroll on navigation click
element.scrollIntoView({ behavior: 'smooth' });

// CSS smooth scrolling
html { scroll-behavior: smooth; }

// Section anchors account for fixed navbar
section { scroll-margin-top: 70px; }
```

### Active Section Detection
The navbar tracks scroll position and highlights the current section:
1. Monitors window scroll events
2. Calculates which section is in viewport
3. Updates GooeyNav active state
4. Provides visual feedback with particles

## Responsive Design

### Breakpoints
- Desktop: 1200px+ (full layout)
- Tablet: 768px-1200px (adjusted grids)
- Mobile: <768px (stacked layout)

### Mobile Optimizations
- Single column layouts
- Adjusted typography sizes
- Touch-friendly navigation
- Optimized timeline display

## Section Details

### Hero Section
- Full viewport height
- Gradient background
- Professional title display
- Smooth entry point

### About Section
- Professional headshot from `Ella.json`
- Personal introduction
- Current position highlight
- Responsive image sizing

### Background Section
- **Timeline Component**: Alternating left/right alignment
- **Education Grid**: Card-based layout
- Dynamic data from `Ella.json`
- Visual hierarchy with colors

### Gallery Section
- Masonry grid layout
- GSAP animations on load
- Hover effects (scale, blur-to-focus)
- Multiple media types support
- API integration with fallback

### Contact Section
- Contact information display
- Social media links (filtered by availability)
- Placeholder for contact form
- Dark theme for contrast

## Performance Optimizations

1. **Dynamic Imports**
   - Masonry component loaded on demand
   - Reduces initial bundle size

2. **Image Optimization**
   - Lazy loading for gallery items
   - Preload critical images
   - Multiple format support

3. **State Management**
   - Minimal re-renders
   - Efficient scroll listeners
   - Debounced resize handlers

## Future Enhancements

Based on the mission statement, upcoming features include:
- Testimonial carousel component
- Contact form with email integration
- Booking calendar system
- Admin-controlled section ordering
- Scroll-triggered animations
- Theme customization options

## Usage Tips

### Adding New Sections
1. Add section to index.tsx with unique ID
2. Update NavBar items array
3. Style in single-page.css
4. Maintain consistent section structure

### Modifying Navigation
1. Edit items array in NavBar.tsx
2. Ensure href matches section ID
3. Update scroll detection if needed

### Styling Sections
1. Use section-specific classes
2. Maintain responsive breakpoints
3. Follow existing color scheme
4. Test smooth scroll behavior