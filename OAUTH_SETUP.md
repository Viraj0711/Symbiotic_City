# OAuth Integration Setup Guide

This guide will help you set up OAuth authentication with Facebook, Google, Twitter, and Instagram for your Symbiotic City application.

## Overview

OAuth social login has been implemented with the following flow:

1. User clicks social login button on frontend
2. Redirects to provider's authorization page
3. User grants permission
4. Provider redirects back to your app with authorization code
5. Backend exchanges code for access token
6. Backend fetches user profile from provider
7. Backend creates/updates user and returns JWT token
8. Frontend stores token and redirects to home page

## Prerequisites

Before you start, make sure you have:

- A deployed version of your app (or use localhost for testing)
- Admin access to create apps on each OAuth provider platform

## Provider Setup Instructions

### 1. Facebook OAuth Setup

**Step 1: Create Facebook App**":

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Consumer" as app type
4. Enter app name: "Symbiotic City"
5. Click "Create App"

**Step 2: Configure OAuth Settings**:

1. In your app dashboard, go to "Settings" → "Basic"
2. Copy your **App ID** and **App Secret**
3. Add them to your backend `.env` file:

   FACEBOOK_APP_ID=your_app_id_here
   FACEBOOK_APP_SECRET=your_app_secret_here

4. Go to "Products" → "Facebook Login" → "Settings"
5. Add Valid OAuth Redirect URIs:
   - Development: `http://localhost:5173/auth/callback/facebook`
   - Production: `https://yourdomain.com/auth/callback/facebook`

**Step 3: Frontend Configuration**:

1. Copy your **App ID** to frontend `.env`:

   VITE_FACEBOOK_APP_ID=your_app_id_here

### 2. Google OAuth Setup

**Step 1: Create Google Cloud Project**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Symbiotic City"
3. Enable "Google+ API" for your project

**Step 2: Create OAuth Credentials**:

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Add Authorized redirect URIs:
   - Development: `http://localhost:5173/auth/callback/google`
   - Production: `https://yourdomain.com/auth/callback/google`
5. Click "Create"
6. Copy your **Client ID** and **Client Secret**

**Step 3: Environment Configuration**
Backend `.env`:

GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

Frontend `.env`:

VITE_GOOGLE_CLIENT_ID=your_client_id_here

### 3. Twitter OAuth Setup

**Step 1: Create Twitter App**:

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign up for a developer account if you haven't
3. Click "Create Project" → Enter project details
4. Click "Create App" → Enter app details

**Step 2: Configure OAuth 2.0**:

1. In your app settings, go to "App Settings" → "OAuth 2.0 Settings"
2. Enable OAuth 2.0
3. Set Type to "Web App"
4. Add Callback URLs:
   - Development: `http://localhost:5173/auth/callback/twitter`
   - Production: `https://yourdomain.com/auth/callback/twitter`
5. Copy your **Client ID** and **Client Secret**

**Step 3: Environment Configuration**
Backend `.env`:

TWITTER_CLIENT_ID=your_client_id_here
TWITTER_CLIENT_SECRET=your_client_secret_here

Frontend `.env`:

VITE_TWITTER_CLIENT_ID=your_client_id_here

**Note:** Twitter OAuth 2.0 requires PKCE. The current implementation uses a basic code verifier. For production, implement proper PKCE flow.

### 4. Instagram OAuth Setup

**Step 1: Use Facebook App**
Instagram OAuth uses the same app as Facebook. If you've already set up Facebook:

1. Go to your Facebook app dashboard
2. Add "Instagram Basic Display" product
3. Create a new Instagram App

**Step 2: Configure Instagram Settings**:

1. Go to "Products" → "Instagram Basic Display" → "Basic Display"
2. Click "Create New App"
3. Add Valid OAuth Redirect URIs:
   - Development: `http://localhost:5173/auth/callback/instagram`
   - Production: `https://yourdomain.com/auth/callback/instagram`
4. Add Instagram test users (required for development)
5. Copy your **Instagram App ID** and **Instagram App Secret**

**Step 3: Environment Configuration**
Backend `.env`:

INSTAGRAM_APP_ID=your_instagram_app_id_here
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here

Frontend `.env`:

VITE_INSTAGRAM_APP_ID=your_instagram_app_id_here

## Final Configuration

### Backend Environment Variables (`.env`)

```env
# Existing configuration...
NODE_ENV=development
PORT=3001
DATABASE_URL=your_database_url

# Add these OAuth variables:
FRONTEND_URL=http://localhost:5173

# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Twitter OAuth
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# Instagram OAuth
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
```

### Frontend Environment Variables (`.env`)

```env
# Existing configuration...
VITE_API_URL=http://localhost:3001/api

# Add these OAuth variables:
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_TWITTER_CLIENT_ID=your_twitter_client_id
VITE_INSTAGRAM_APP_ID=your_instagram_app_id
```

## Installation

Install the axios package for backend OAuth requests:

```bash
cd backend
npm install axios
```

## Testing OAuth Flow

1. **Start both servers:**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Test each provider:**
   - Navigate to `/login` or `/signup`
   - Click a social login button
   - Authorize the app on the provider's page
   - You should be redirected back and logged in

3. **Check for errors:**
   - Open browser DevTools Console
   - Check backend terminal for error messages
   - Verify redirect URLs match exactly in provider settings

## Common Issues

### 1. "Redirect URI Mismatch"

- **Cause:** The callback URL doesn't match what's configured in the provider
- **Solution:** Ensure the callback URLs in provider settings exactly match:
  - `http://localhost:5173/auth/callback/{provider}` (no trailing slash)

### 2. "Invalid Client ID"

- **Cause:** Environment variables not loaded or incorrect
- **Solution:**
  - Restart dev servers after updating `.env` files
  - Verify no typos in variable names
  - Check `.env` files are in correct directories

### 3. "User email not provided"

- **Cause:** Some providers require special permissions for email access
- **Solution:**
  - Facebook: Request `email` permission in app review
  - Twitter: Email might not be available; app creates user with username-based email
  - Instagram: Similar to Twitter, uses username for email

### 4. "CORS Error"

- **Cause:** Backend not configured to accept requests from frontend
- **Solution:** Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL

## Production Deployment

When deploying to production:

1. **Update callback URLs** in all provider settings to your production domain
2. **Update environment variables:**
   - Backend: Set `FRONTEND_URL=https://yourdomain.com`
   - Frontend: Set `VITE_API_URL=https://api.yourdomain.com`
3. **Use HTTPS** - OAuth providers require HTTPS for production apps
4. **Submit for app review** if required by provider (especially Facebook/Instagram)
5. **Implement rate limiting** to prevent abuse
6. **Add logging** for OAuth errors in production

## Security Considerations

- ✅ Never commit `.env` files to git
- ✅ Use different OAuth apps for development and production
- ✅ Implement CSRF protection (state parameter) - already included
- ✅ Validate OAuth tokens on backend before creating sessions
- ✅ Rotate secrets regularly
- ✅ Monitor for suspicious OAuth activity
- ⚠️ Implement PKCE for Twitter OAuth in production
- ⚠️ Consider adding 2FA for sensitive operations

## Support

If you encounter issues:

1. Check provider documentation links in this guide
2. Review browser console and backend logs
3. Verify all environment variables are set correctly
4. Test with a fresh incognito browser window
5. Check that your OAuth apps are in "development" mode (allows testing)

## Additional Resources

- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Twitter OAuth 2.0 Documentation](https://developer.twitter.com/en/docs/authentication/oauth-2-0)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
