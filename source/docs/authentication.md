# Authentication System Documentation

## Overview
The portfolio includes a secure authentication system for admin access, allowing Ella to manage her portfolio content through a protected admin dashboard.

## Features

### 1. JWT-Based Authentication
- Uses JSON Web Tokens (JWT) for secure authentication
- Tokens stored in httpOnly cookies for enhanced security
- 7-day token expiration with automatic renewal on activity

### 2. User Management
- MongoDB-based user storage with bcrypt password hashing
- Role-based access control (admin/user roles)
- Secure password comparison methods

### 3. Protected Routes
- Client-side route protection with automatic redirects
- Server-side API endpoint protection via middleware
- Loading states during authentication checks

## Components

### User Model (`/src/managers/UserModel.ts`)
MongoDB schema for user accounts with:
- Email (unique, lowercase, trimmed)
- Password (bcrypt hashed)
- Role (admin/user)
- Timestamps (createdAt, updatedAt)
- Password comparison method

### Authentication Utilities (`/src/utils/auth.ts`)
Helper functions for token management:
- `generateToken()` - Creates JWT tokens
- `verifyToken()` - Validates and decodes tokens
- `setTokenCookie()` - Sets secure httpOnly cookies
- `removeTokenCookie()` - Clears authentication cookies
- `getTokenFromCookies()` - Extracts token from request

### Auth Middleware (`/src/middleware/authMiddleware.ts`)
Protects API endpoints:
- `withAuth()` - HOC for protecting API routes
- Optional `requireAdmin` parameter for admin-only endpoints
- Adds user data to request object

### useAuth Hook (`/src/hooks/useAuth.ts`)
React hook for client-side auth:
- Provides current user state
- Loading state during auth checks
- `logout()` function
- `checkAuth()` function for manual auth refresh

### ProtectedRoute Component (`/src/components/ProtectedRoute.tsx`)
Wrapper component for protected pages:
- Redirects unauthenticated users to login
- Shows loading spinner during auth check
- Optional `requireAdmin` prop for admin-only pages

## API Endpoints

### POST `/api/auth/setup`
Creates the initial admin user (only works if no admin exists).

**Request body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Admin user created successfully",
  "email": "admin@example.com"
}
```

### POST `/api/auth/login`
Authenticates user and sets auth cookie.

**Request body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### POST `/api/auth/logout`
Clears authentication cookie.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### GET `/api/auth/me`
Returns current authenticated user (requires auth).

**Response:**
```json
{
  "user": {
    "userId": "user_id",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

## Pages

### Admin Setup (`/admin/setup`)
- One-time setup page for creating the initial admin account
- Form validation for email and password
- Password confirmation field
- Automatic redirect to login after creation

### Admin Login (`/admin/login`)
- Secure login form with email/password
- Error handling and loading states
- Automatic redirect to admin dashboard on success
- Clean, centered design with form validation

## Security Features

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Minimum password length enforcement
   - Password confirmation on setup

2. **Token Security**
   - httpOnly cookies prevent XSS attacks
   - Secure flag in production
   - SameSite strict for CSRF protection
   - Token expiration and validation

3. **Environment Variables**
   - JWT_SECRET stored in .env file
   - MongoDB credentials protected
   - Different secrets for development/production

## Usage Example

### Protecting an Admin Page
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <div>
        {/* Admin dashboard content */}
      </div>
    </ProtectedRoute>
  );
}
```

### Using the Auth Hook
```tsx
import { useAuth } from '@/hooks/useAuth';

export default function Component() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (user) {
    return (
      <div>
        Welcome, {user.email}!
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
  
  return <div>Not logged in</div>;
}
```

### Protecting an API Route
```ts
import { withAuth } from '@/middleware/authMiddleware';

async function handler(req, res) {
  // req.user contains authenticated user data
  res.json({ message: 'Protected data' });
}

export default withAuth(handler, true); // true = require admin
```

## Setup Instructions

1. **Environment Setup**
   - Ensure `JWT_SECRET` is set in `.env` file
   - Use a strong, unique secret in production

2. **Initial Admin Creation**
   - Navigate to `/admin/setup`
   - Enter Ella's email and a secure password
   - Confirm the password and submit

3. **Login Process**
   - Go to `/admin/login`
   - Enter credentials
   - Will redirect to admin dashboard on success

## Troubleshooting

### "Admin user already exists" error
- An admin account has already been created
- Use the login page instead of setup

### Login fails with correct credentials
- Check MongoDB connection
- Verify environment variables are loaded
- Check browser console for errors

### Automatic logout
- Token may have expired (7 days)
- Simply log in again to get a new token

### Protected routes not working
- Ensure cookies are enabled
- Check for CORS issues if API is on different domain
- Verify JWT_SECRET matches between requests