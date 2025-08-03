# Ella Beardsley - Art Therapy Portfolio

A professional single-page portfolio website for art therapist Ella Beardsley, featuring complete admin management, client booking, and contact functionality.

## 🎨 Features

- **Single-Page Portfolio** - Smooth scrolling navigation with 6 sections
- **Gallery Management** - Upload and manage artwork with admin interface
- **Contact Form** - Email integration for client inquiries
- **Testimonial Carousel** - Social proof from past clients
- **Booking Calendar** - Calendly integration for appointment scheduling
- **Admin Dashboard** - Complete content management system
- **Mobile Responsive** - Perfect experience on all devices

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure:

```bash
# Database
MONGO_USER=your_mongodb_username
MONGO_PASS=your_mongodb_password
MONGO_CLUSTER=your_cluster_name
MONGO_DB=ella_portfolio

# Email (for contact form)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CONTACT_EMAIL=ella@example.com

# Authentication
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Configure Calendly URL
- **Option A (Recommended)**: Use the admin dashboard at `/admin/settings` → "Third-Party Integrations"
- **Option B**: Edit `src/components/BookingCalendar.tsx` line 10 for default URL

### 4. Run Development Server
```bash
npm run dev
```

### 5. Setup Admin Account
1. Visit `http://localhost:3000/admin/setup`
2. Create your admin account
3. Login at `/admin/login`
4. Start managing content!

## 📱 Portfolio Sections

1. **Hero** - Professional introduction
2. **About** - Personal background and approach
3. **Experience** - Professional background
4. **Gallery** - Artwork portfolio (admin manageable)
5. **Testimonials** - Client reviews carousel
6. **Booking** - Appointment scheduling
7. **Contact** - Contact form and information

## 🔧 Admin Features

- **Dashboard** - Overview with quick actions
- **Gallery Management** - Upload, edit, delete artwork
- **Profile Management** - Update personal info, experience, education
- **Settings** - Configure site preferences
- **Analytics** - View site performance metrics

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
Compatible with any Node.js hosting platform (Netlify, Railway, etc.)

## 📚 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Styled JSX, responsive design
- **Backend**: MongoDB, JWT authentication
- **Integrations**: Calendly, Email (nodemailer)
- **Components**: react-slick carousel

## 🆘 Support

For setup help or customizations, refer to:
- `docs/project-context.md` - Complete project documentation
- `.env.example` - Environment variable reference
- `/admin/setup` - Initial admin account creation

---

Built with ❤️ for art therapy professionals
