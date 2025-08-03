# Ella's Portfolio Documentation

Welcome to the documentation for Ella's Art Therapy Portfolio website. This documentation covers all features, components, and systems implemented in the project.

## Project Overview

A single-page portfolio website for Ella Beardsley, an Art Therapist, featuring:
- Professional background and experience
- Art gallery with various mediums
- Admin dashboard for content management
- Contact information and social links

## Documentation Structure

### 1. [Single-Page Portfolio](./single-page-portfolio.md)
- Architecture and navigation system
- Section components and layouts
- Responsive design implementation
- Performance optimizations

### 2. [Authentication System](./authentication.md)
- JWT-based authentication
- User management and security
- Protected routes and API endpoints
- Setup and usage instructions

### 3. [Components](./components/) (Coming Soon)
- Masonry Gallery
- GooeyNav Navigation
- ScrollReveal Animations
- SpotlightCard

### 4. [API Documentation](./api/) (Coming Soon)
- Gallery endpoints
- Authentication endpoints
- Content management APIs

## Tech Stack

- **Frontend**: Next.js 15.3.5, React 19, TypeScript
- **Styling**: Chakra UI, CSS Modules, Styled JSX
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Animations**: GSAP, Framer Motion
- **Deployment**: Vercel

## Quick Start

1. **Development Setup**
   ```bash
   npm install
   npm run dev
   ```

2. **Environment Variables**
   ```env
   MONGO_USER=your_user
   MONGO_PASS=your_password
   MONGO_CLUSTER=your_cluster
   MONGO_DB=Portfolio
   JWT_SECRET=your_secret_key
   ```

3. **Admin Setup**
   - Navigate to `/admin/setup`
   - Create initial admin account
   - Login at `/admin/login`

## Project Structure

```
source/
├── docs/                 # Documentation files
├── public/              
│   └── assets/          # Images and media
├── src/
│   ├── blocks/          # Reusable UI components
│   ├── components/      # Page components
│   ├── hooks/           # Custom React hooks
│   ├── managers/        # Database models & managers
│   ├── middleware/      # API middleware
│   ├── pages/           # Next.js pages
│   │   ├── api/        # API endpoints
│   │   └── admin/      # Admin pages
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
└── Ella.json            # Static portfolio data
```

## Current Features

✅ **Completed**
- Single-page layout with sections
- Smooth scroll navigation
- Admin authentication system
- MongoDB integration
- Responsive design
- Gallery with Masonry layout

🚧 **In Progress**
- Admin dashboard
- Content management system

📋 **Planned**
- Testimonial carousel
- Contact form
- Booking calendar
- Downloadable resume
- Section reordering
- Theme customization

## Contributing

This is a private portfolio project. For any issues or suggestions, please contact the development team.

## Security Notes

- Never commit `.env` files
- Keep JWT_SECRET secure
- Use strong admin passwords
- Regular security updates
- HTTPS in production

## Performance Tips

- Images are lazy-loaded
- Components use dynamic imports
- Database queries are optimized
- Static data cached locally

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

Private project - All rights reserved