# TASC LMS Frontend - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### 1. Setup Environment
```bash
cd front/TASC-LMS-frontend
cp .env.example .env.local
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to: `http://localhost:5173`

---

## ✅ Prerequisites

- ✅ Node.js 18+ installed
- ✅ Backend running at `http://127.0.0.1:8000`
- ✅ Backend database migrated
- ✅ Dependencies installed (already done via `npm install`)

---

## 🧪 Quick Test Flow

### Test Authentication (5 minutes)

1. **Register:** Go to `/register`
   - Fill form with test email
   - Complete all 3 steps
   - Click "Create Account"

2. **Verify Email:** 
   - Check backend console for verification link
   - Click link → "Email Verified Successfully!"

3. **Login:** Go to `/login`
   - Enter credentials
   - Redirected to dashboard

4. **Logout:**
   - Click avatar → "Logout"
   - Redirected to login

✅ **Success!** Auth integration working.

---

## 📁 Key Files

### Infrastructure (New)
- `src/lib/api.ts` - API client
- `src/contexts/AuthContext.tsx` - Auth state
- `src/components/ProtectedRoute.tsx` - Route guards
- `src/types/api.ts` - TypeScript types

### Pages (Modified)
- `src/pages/LoginPage.tsx` - Real login
- `src/pages/RegistrationPage.tsx` - Real registration
- `src/pages/EmailVerificationPage.tsx` - Email verification
- `src/pages/PasswordReset.tsx` - Password reset

### Config
- `.env.example` - Environment template
- `.env.local` - Your local config (create this)

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Ensure backend allows `http://localhost:5173` |
| Network Error | Check backend is running |
| 401 Error | Logout and login again |
| Module not found | Run `npm install` |

---

## 📚 Full Documentation

- **Complete Guide:** `AUTH_INTEGRATION.md`
- **Summary:** `AUTH_INTEGRATION_SUMMARY.md`
- **Backend Spec:** `../../project-documents/SYSTEM_CONTEXT.md`

---

## 🎯 What's Integrated

- ✅ Login / Logout
- ✅ Registration
- ✅ Email Verification
- ✅ Password Reset
- ✅ Token Management
- ✅ Protected Routes
- ✅ Role-Based Access
- ✅ Google OAuth

## ⏳ Not Yet Integrated

- ⏳ Dashboard data (courses, enrollments)
- ⏳ Course catalog API
- ⏳ Payment flow
- ⏳ User profile updates

---

**Ready to test!** 🎉
