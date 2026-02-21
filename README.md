# Apotheos - Innovation & Wellness Hub Website

![Apotheos Logo](https://img.shields.io/badge/Apotheos-Innovation%20%26%20Wellness-50808E?style=for-the-badge)

## Overview

This is the official website for **Apotheos**, a nonprofit Innovation & Wellness Hub located in Nevada City, California. The website is designed to showcase our mission of building community through innovation, education, and wellness.

## Project Description

Apotheos exists to bridge the gap for remote workers, founders, and creatives who have relocated to smaller, lifestyle-driven towns. We provide structured founder ecosystems, access to capital, professional development, and integrated wellness support in the heart of the Sierra Foothills.

## Brand Identity

### Colors
- **Primary Slate**: `#50808E` - Main brand color
- **Secondary Sage**: `#84B59F` - Backgrounds and highlights
- **Accent Eucalyptus**: `#69A297` - Buttons and CTAs
- **Charcoal**: `#2C3E50` - Body text
- **Off-White**: `#F5F5F5` - Backgrounds

### Typography
- **Primary Font**: Georgia (serif) - Used for headings and brand name
- **Secondary Font**: Arial (sans-serif) - Used for body text and UI elements

### Tagline
*"Building Community Through Innovation, Education & Wellness"*

## Features

### 🎨 Design Features
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern Animations**: Smooth scroll animations and transitions throughout
- **Parallax Effects**: Dynamic hero section with parallax scrolling
- **Interactive Elements**: Hover effects, card tilts, and ripple animations
- **Accessibility**: WCAG AA compliant with proper contrast ratios

### 📱 Sections
1. **Hero Section**: Eye-catching introduction with animated elements
2. **Opportunity**: Explains the market gap and potential
3. **Mission**: Four core pillars of our mission
4. **Location**: Why Nevada City is the perfect location
5. **Model**: Our integrated approach (Innovation + Creative + Wellness)
6. **Structure**: Nonprofit operations and revenue model
7. **Programs**: Six core programs and services
8. **Membership**: Three-tier membership model with pricing
9. **Impact**: Community impact metrics
10. **Market**: Regional service area and growth targets
11. **Vision**: Long-term goals and aspirations
12. **Join Us**: Call-to-action for partners and supporters
13. **Contact**: Contact form and location information

### ⚡ Technical Features
- Pure HTML, CSS, and JavaScript (no frameworks required)
- Intersection Observer API for scroll animations
- CSS Grid and Flexbox for responsive layouts
- Custom CSS animations and transitions
- Mobile-first responsive design
- Cross-browser compatible
- SEO optimized with semantic HTML
- Fast loading and performance optimized

## File Structure

```
yamani-website/
├── index.html          # Main HTML file
├── styles.css          # All styles and animations
├── script.js           # JavaScript functionality
├── README.md           # This file
├── pptx_content/       # Extracted PowerPoint content (temporary)
├── docx_content/       # Extracted Word doc content (temporary)
└── extract_ppt.py      # Python script for content extraction (temporary)
```

## Installation & Setup

1. **Clone or download** this repository to your local machine

2. **Open the website**:
   - Simply open `index.html` in any modern web browser
   - No build process or server required!

3. **For development**:
   ```bash
   # If you want to use a local server (optional)
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Customization Guide

### Updating Colors
All colors are defined as CSS variables in `styles.css`:
```css
:root {
    --primary-slate: #50808E;
    --secondary-sage: #84B59F;
    --accent-eucalyptus: #69A297;
    /* ... more colors */
}
```

### Updating Content
All content is directly in `index.html`. Search for section IDs to find specific content:
- `#home` - Hero section
- `#mission` - Mission statement
- `#programs` - Programs and services
- `#membership` - Membership tiers
- etc.

### Adding Images
To add images:
1. Place images in an `images/` folder
2. Update the `<img>` tags or add CSS background images
3. Use the lazy loading pattern already in `script.js`

### Contact Form Integration
The contact form currently shows an alert. To integrate with a backend:

1. Uncomment the fetch code in `script.js`
2. Update the endpoint URL
3. Set up your backend to handle POST requests

Example backend integration:
```javascript
fetch('/api/contact', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
})
```

## Deployment

### GitHub Pages
1. Push code to GitHub
2. Go to Settings → Pages
3. Select branch and folder
4. Your site will be live at `https://[username].github.io/[repo-name]`

### Netlify
1. Drag and drop the folder to Netlify
2. Or connect your GitHub repo
3. Site deploys automatically

### Traditional Hosting
1. Upload all files via FTP
2. Ensure `index.html` is in the root directory
3. Done!

## Performance Optimization

The website is already optimized for performance:
- ✅ Minimal dependencies (no frameworks)
- ✅ Optimized CSS with proper specificity
- ✅ Debounced scroll events
- ✅ Lazy loading support for images
- ✅ Efficient animations using CSS transforms
- ✅ Intersection Observer for scroll animations

## Accessibility Features

- Semantic HTML5 elements
- ARIA labels where needed
- Keyboard navigation support
- Focus visible indicators
- High contrast ratios (WCAG AA)
- Responsive text sizing
- Alt text support for images

## SEO Features

- Semantic HTML structure
- Meta descriptions
- Proper heading hierarchy
- Descriptive link text
- Mobile-friendly design
- Fast page load times

## Future Enhancements

Potential additions for future versions:
- [ ] Blog section for updates and stories
- [ ] Member testimonials with photos
- [ ] Event calendar integration
- [ ] Photo gallery from events
- [ ] Newsletter signup integration
- [ ] Social media feed integration
- [ ] Virtual tour of the space
- [ ] Member portal login

## Credits

**Design & Development**: Based on brand identity guide and presentation deck
**Location**: 107 Sacramento Street, Nevada City, CA 95959
**Organization Type**: 501(c)(3) Nonprofit

## Contact

For questions about the website or Apotheos:
- **Address**: 107 Sacramento Street, Nevada City, CA 95959
- **Website**: [Coming Soon]

## License

© 2026 Apotheos Innovation & Wellness Hub. All rights reserved.

---

## Technical Notes

### Animation Classes
- `.animate-slide-up` - Slides element up on page load
- `.fade-in-on-scroll` - Fades in when scrolled into view
- `.delay-1` through `.delay-6` - Stagger animations

### JavaScript Events
- Mobile menu toggle
- Smooth scroll navigation
- Scroll progress indicator
- Card tilt effects
- Form submission handling
- Animated counters
- Parallax scrolling

### Responsive Breakpoints
- Desktop: > 968px
- Tablet: 641px - 968px
- Mobile: ≤ 640px

---

**Built with ❤️ for the Nevada City community**
