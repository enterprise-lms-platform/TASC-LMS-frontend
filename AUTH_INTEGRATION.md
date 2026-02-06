# AUTH INTEGRATION DOCUMENTATION

## Overview
This document describes the authentication integration completed for the TASC LMS frontend. The integration connects the existing UI to the Django backend API for complete authentication flows.

---

## Files Created

### New Infrastructure Files
1. **`src/types/api.ts`** - TypeScript interfaces for API contracts
   - User types, auth request/response types
   - Error handling types
   - Based on SYSTEM_CONTEXT.md backend specification

2. **`src/lib/api.ts`** - Axios API client with JWT token management
   - Automatic token injection in requests
   - Token refresh on 401 errors
   - Request/response interceptors
   - Helper functions for token storage

3. **`src/contexts/AuthContext.tsx`** - Global authentication state management
   - User state (login, logout, register)
   - Auto-bootstrap on app load (calls /auth/me/)
   - Token refresh logic
   - Error handling

4. **`src/components/ProtectedRoute.tsx`** - Route guard component
   - Checks authentication status
   - Role-based access control
   - Loading states
   - Access denied screens

5. **`src/pages/EmailVerificationPage.tsx`** - Email verification handler
   - Handles email verification links
   - Extracts uidb64 and token from URL
   - Displays success/error states

6. **`.env.example`** - Environment configuration template
   - VITE_API_BASE_URL configuration

---

## Files Modified

### Core Application Files
1. **`package.json`**
   - Added `axios@^1.7.9` dependency

2. **`src/App.tsx`**
   - Wrapped app with `AuthProvider`
   - Added `ProtectedRoute` guards to all authenticated routes
   - Added role-based access control
   - Updated email verification route

### Authentication Pages
3. **`src/pages/LoginPage.tsx`**
   - Integrated with `useAuth()` hook
   - Real API login calls
   - Email verification error handling
   - Role-based redirects after login
   - Google OAuth integration
   - Removed non-existent social providers

4. **`src/pages/RegistrationPage.tsx`**
   - Integrated with `useAuth()` hook
   - Real API registration calls
   - Error display
   - Success state handling
   - Google OAuth integration
   - Removed non-existent social providers

5. **`src/pages/PasswordReset.tsx`**
   - Complete password reset flow
   - Request reset form
   - Confirm reset form (with uidb64/token)
   - Success/error handling
   - API integration

### Dashboard Components
6. **`src/components/learner/TopBar.tsx`**
   - Integrated with `useAuth()` hook
   - Displays real user data
   - Functional logout button
   - User menu with profile/settings/logout

---

## How to Run Locally

### Prerequisites
- Node.js 18+ installed
- Backend running at `http://127.0.0.1:8000`
- Backend database migrated and running

### Setup Steps

1. **Create Environment File**
   ```bash
   cd front/TASC-LMS-frontend
   cp .env.example .env.local
   ```

2. **Configure Backend URL** (if different from default)
   Edit `.env.local`:
   ```
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

3. **Install Dependencies** (already done)
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:5173`

---

## Manual Testing Guide

### Test Scenario 1: Complete Registration → Verification → Login Flow

#### Step 1: Register New User
1. Navigate to `http://localhost:5173/register`
2. Fill in Step 1 (Account):
   - Email: `testuser@example.com`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
   - Click "Continue"

3. Fill in Step 2 (Profile):
   - First Name: `Test`
   - Last Name: `User`
   - Phone (optional): `+1234567890`
   - Country: `Uganda`
   - Timezone: `East Africa Time (UTC+3)`
   - Click "Continue"

4. Fill in Step 3 (Confirm):
   - Check "I agree to the Terms of Service and Privacy Policy"
   - Click "Create Account"

5. **Expected Result:**
   - Success screen appears
   - Message: "Account Created Successfully!"
   - "We've sent a verification email to your inbox"

#### Step 2: Verify Email
1. **Backend Console (Django runserver):**
   - Check console for verification email output
   - Look for URL like: `http://localhost:5173/verify-email/<uidb64>/<token>`

2. **Copy verification link and open in browser**

3. **Expected Result:**
   - Email verification page shows "Verifying Your Email..."
   - Then: "Email Verified Successfully!"
   - "Go to Login" button appears

#### Step 3: Login
1. Click "Go to Login" or navigate to `http://localhost:5173/login`

2. Enter credentials:
   - Email: `testuser@example.com`
   - Password: `TestPass123!`
   - Click "Sign In"

3. **Expected Result:**
   - Redirected to appropriate dashboard (Learner dashboard for new users)
   - TopBar shows user name and email
   - User is authenticated

#### Step 4: Verify Protected Routes
1. Navigate to different protected routes:
   - `/learner` - Should work
   - `/instructor` - Should show "Access Denied" (unless user is instructor)
   - `/superadmin` - Should show "Access Denied"

2. **Expected Result:**
   - Role-based access control works
   - Appropriate error messages for unauthorized access

#### Step 5: Logout
1. Click on user avatar in TopBar
2. Click "Logout" in dropdown menu

3. **Expected Result:**
   - Redirected to `/login`
   - Tokens cleared from localStorage
   - Cannot access protected routes

4. Try accessing `/learner` directly:
   - Should redirect to `/login`

---

### Test Scenario 2: Login Failure Cases

#### Test 2.1: Login Before Email Verification
1. Register a new user: `unverified@example.com`
2. DO NOT verify email
3. Try to login with these credentials

**Expected Result:**
- Error alert: "Please verify your email address before logging in."

#### Test 2.2: Invalid Credentials
1. Navigate to `/login`
2. Enter wrong password for existing user

**Expected Result:**
- Error alert: "Invalid email or password. Please try again."

---

### Test Scenario 3: Password Reset Flow

#### Step 1: Request Password Reset
1. Navigate to `http://localhost:5173/passwordreset`
2. Enter email: `testuser@example.com`
3. Click "Send Reset Link"

**Expected Result:**
- Success message: "Password reset link has been sent to your email"
- Success screen appears

#### Step 2: Confirm Password Reset
1. **Backend Console:**
   - Check console for password reset email output
   - Look for reset URL with `uidb64` and `token` parameters

2. **Open reset link in browser:**
   `http://localhost:5173/passwordreset?uidb64=<uidb64>&token=<token>`

3. Enter new password:
   - New Password: `NewTestPass123!`
   - Confirm Password: `NewTestPass123!`
   - Click "Reset Password"

**Expected Result:**
- Success message appears
- Auto-redirected to login after 2 seconds

#### Step 3: Login with New Password
1. Login with:
   - Email: `testuser@example.com`
   - Password: `NewTestPass123!`

**Expected Result:**
- Login successful
- Redirected to dashboard

---

### Test Scenario 4: Token Refresh

#### Step 1: Login and Access Dashboard
1. Login as any user
2. Navigate to learner dashboard
3. **Open DevTools → Application → Local Storage**
4. Note the `access_token` value

#### Step 2: Force Token Expiry
1. **Option A - Wait:** Wait for access token to expire (default: 5 minutes)
2. **Option B - Manual:** Delete `access_token` from localStorage (keep `refresh_token`)

#### Step 3: Make API Request
1. Navigate to another page or refresh
2. App will attempt to call `/api/v1/auth/me/`

**Expected Result:**
- Token automatically refreshed using refresh token
- New access_token stored in localStorage
- User remains logged in
- No redirect to login page

#### Step 4: Logout and Retry
1. Logout
2. Try accessing `/learner`

**Expected Result:**
- Redirected to login (no valid refresh token)

---

### Test Scenario 5: Google OAuth

#### Prerequisites
- Backend Google OAuth configured
- Google credentials in backend `.env`

#### Test Steps
1. Navigate to `/login` or `/register`
2. Click "Continue with Google" button

**Expected Result:**
- Redirected to Google OAuth consent screen
- After authorization, redirected back to app
- User logged in automatically

**Note:** If backend Google OAuth is not configured, button will redirect but fail. This is expected.

---

## API Endpoints Used

All endpoints are prefixed with `/api/v1/`

### Authentication
- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login (returns JWT tokens)
- `POST /auth/logout/` - User logout
- `POST /auth/refresh/` - Refresh access token
- `GET /auth/me/` - Get current user info
- `GET /auth/verify-email/<uidb64>/<token>/` - Verify email address
- `POST /auth/password-reset/` - Request password reset
- `POST /auth/password-reset-confirm/` - Confirm password reset
- `GET /auth/google/login/` - Google OAuth initiation

---

## Token Management

### Storage
- **Access Token:** Stored in `localStorage` as `access_token`
- **Refresh Token:** Stored in `localStorage` as `refresh_token`

### Token Lifecycle
1. **Login:** Both tokens stored
2. **API Requests:** Access token sent in `Authorization: Bearer <token>` header
3. **Token Expiry:** On 401 response, automatically refresh using refresh token
4. **Logout:** Both tokens cleared

### Security Considerations
- Tokens stored in localStorage (consider httpOnly cookies for production)
- Refresh token used only for token refresh endpoint
- Failed refresh clears all tokens and redirects to login

---

## Protected Routes

Routes are protected with `<ProtectedRoute>` component:

### All Authenticated Users
- `/learner/*`
- `/checkout`
- `/invoice`

### Role-Specific Access
- **Instructor:** `/instructor/*` (instructor or tasc_admin)
- **Manager:** `/manager` (lms_manager, org_admin, or tasc_admin)
- **Finance:** `/finance` (finance or tasc_admin)
- **Admin:** `/superadmin` (tasc_admin only)

---

## Error Handling

### API Errors
- Displayed as MUI Alert components
- Extracted from backend response format
- Supports both detail strings and field-specific errors

### Network Errors
- Handled by axios interceptors
- User-friendly error messages
- Fallback to generic error message

### Authentication Errors
- 401: Token refresh attempted automatically
- 403: Access denied message shown
- Email verification errors: Specific message shown

---

## Known Limitations

1. **Password Reset Endpoints:**
   - Backend endpoints assumed based on common Django patterns
   - May need adjustment if backend uses different endpoints

2. **Change Password:**
   - Endpoint exists in API client but no UI implemented yet
   - Can be added later as needed

3. **Resend Verification Email:**
   - Not implemented in backend (commented in code)
   - Timer still works in UI

4. **Google OAuth:**
   - Only provider implemented (Microsoft/LinkedIn removed)
   - Requires backend configuration

5. **MFA (Multi-Factor Authentication):**
   - Original VerificationPage is for MFA setup (not used)
   - Backend doesn't enforce MFA currently
   - Can be integrated later

---

## Next Steps (Not Included)

1. **Dashboard Data Integration:**
   - Connect course catalog to `/api/v1/catalogue/courses/`
   - Connect enrollments to `/api/v1/learning/enrollments/`
   - Connect payments to `/api/v1/payments/`

2. **Profile Management:**
   - Update user profile endpoint
   - Avatar upload (if backend supports)

3. **Change Password:**
   - Add change password UI for authenticated users
   - Wire up to `/auth/change-password/`

4. **Email Preferences:**
   - Newsletter subscription management

5. **Enhanced Security:**
   - Consider httpOnly cookies instead of localStorage
   - Implement CSRF protection
   - Add rate limiting UI feedback

---

## Troubleshooting

### Issue: "CORS Error"
**Solution:** Ensure backend has `http://localhost:5173` in `CORS_ALLOWED_ORIGINS`

### Issue: "Network Error"
**Solution:** Check backend is running at `http://127.0.0.1:8000`

### Issue: "401 Unauthorized"
**Solution:** Check tokens in localStorage, try logout and login again

### Issue: "Email not verified"
**Solution:** Check backend console for verification link, click it

### Issue: "Access Denied"
**Solution:** User role doesn't match required role for route

### Issue: "Module not found: axios"
**Solution:** Run `npm install` to install dependencies

---

## Testing Checklist

- [ ] User can register with valid details
- [ ] Email verification link works
- [ ] User can login after verification
- [ ] User cannot login before verification
- [ ] Invalid credentials show error
- [ ] User is redirected based on role after login
- [ ] Protected routes require authentication
- [ ] Role-based routes check user role
- [ ] TopBar shows real user data
- [ ] Logout clears tokens and redirects to login
- [ ] Password reset request works
- [ ] Password reset confirm works
- [ ] Can login with new password
- [ ] Token refresh works automatically
- [ ] Expired tokens redirect to login
- [ ] Google OAuth button redirects correctly

---

**Integration Date:** 2026-02-07  
**Backend API Version:** v1  
**Frontend Framework:** React 19.2.0 + TypeScript 5.9.3  
**Backend Source:** SYSTEM_CONTEXT.md
