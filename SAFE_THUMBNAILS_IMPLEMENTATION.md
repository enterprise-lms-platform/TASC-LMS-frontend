# Safe Course Thumbnails Implementation

## Summary

Implemented a frontend-only solution to ensure every course card displays safe, demo-ready images without relying on arbitrary external URLs.

## Changes Made

### 1. Local Thumbnail Assets

**Location**: `src/assets/course-thumbnails/`

Created 8 SVG placeholder thumbnails (800x400px):
- `safety.jpg` - EHS / Safety courses (orange)
- `welding.jpg` - Welding courses (red)
- `electrical.jpg` - Electrical courses (yellow)
- `plumbing.jpg` - Plumbing courses (blue)
- `scaffolding.jpg` - Scaffolding courses (gray)
- `business.jpg` - Business/Assessment courses (purple)
- `certification.jpg` - Certification courses (green)
- `default.jpg` - Default fallback (indigo)

**Note**: These are SVG placeholders. Replace with actual JPG images (800x400px, <100KB each) from stock photo sites (Unsplash, Pexels, Pixabay) for production.

See `src/assets/course-thumbnails/README.md` for details.

---

### 2. Course Helper Utility

**File**: `src/utils/courseHelpers.ts` (NEW)

#### Functions:

##### `isAllowedImageUrl(url: string): boolean`
- Validates external image URLs against an allowlist
- Currently allows: `images.unsplash.com`, `source.unsplash.com`
- Add production/staging CDN domains as needed

##### `getCourseThumbnail(course): string`
- **Priority logic**:
  1. If `course.thumbnail` exists and is from an allowed host → use it
  2. Otherwise → map `course.category.slug` to local thumbnail
  3. Fall back to `default.jpg`

#### Category Mapping:
```typescript
'welding'       → welding.jpg
'ews'/'ehs'     → safety.jpg
'safety'        → safety.jpg
'scaffolding'   → scaffolding.jpg
'electrical'    → electrical.jpg
'plumbing'      → plumbing.jpg
'assessment'    → business.jpg
'certification' → certification.jpg
(other)         → default.jpg
```

---

### 3. Component Updates

#### `src/components/landing/Courses.tsx`
**Changes**:
- Import `getCourseThumbnail` helper
- Call helper when mapping API response to display format:
  ```typescript
  image: getCourseThumbnail({
    thumbnail: course.thumbnail,
    slug: course.slug,
    category: course.category,
  })
  ```
- Add runtime safety to `<img>`:
  - `loading="lazy"` (performance)
  - `referrerPolicy="no-referrer"` (privacy)
  - `onError` handler → swap to `default.jpg` if external URL fails

#### `src/components/catalogue/CoursesGrid.tsx`
**Changes**:
- Import `getCourseThumbnail` helper
- Call helper when mapping API response:
  ```typescript
  image: getCourseThumbnail({
    thumbnail: course.thumbnail,
    slug: course.slug,
    category: course.category,
  })
  ```

#### `src/components/catalogue/CourseCard.tsx`
**Changes**:
- Add state for `imageSrc` and `imageError`
- Add `handleImageError` function to swap to default on load failure
- Update `<CardMedia>`:
  - `loading="lazy"`
  - `referrerPolicy="no-referrer"`
  - `onError={handleImageError}`

---

### 4. Type Fixes

**File**: `src/types/api.ts`

Fixed TypeScript error where `PublicCourseDetail.instructor` (type `PublicInstructor`) was incompatible with `PublicCourse.instructor` (type `number`).

**Solution**:
```typescript
export interface PublicCourseDetail extends Omit<PublicCourse, 'instructor'> {
  // ... other fields
  instructor: PublicInstructor | null; // Full instructor object in detail view
}
```

---

## Security Features

### Image Loading Safety
1. **Allowlist**: Only external images from trusted hosts (Unsplash) are used
2. **Referrer Policy**: `no-referrer` prevents leaking user data to external hosts
3. **Lazy Loading**: Images load only when visible (performance + privacy)
4. **Error Handling**: Failed external images automatically fall back to local default

### No Backend Changes
- No changes to models, serializers, migrations, or API endpoints
- Existing `course.thumbnail` field still works (if from allowed host)
- Solution is entirely frontend-based and reversible

---

## Files Changed/Added

### New Files:
- `src/assets/course-thumbnails/` (directory)
  - `safety.jpg`
  - `welding.jpg`
  - `electrical.jpg`
  - `plumbing.jpg`
  - `scaffolding.jpg`
  - `business.jpg`
  - `certification.jpg`
  - `default.jpg`
  - `README.md`
- `src/utils/courseHelpers.ts`

### Modified Files:
- `src/components/landing/Courses.tsx`
- `src/components/catalogue/CoursesGrid.tsx`
- `src/components/catalogue/CourseCard.tsx`
- `src/types/api.ts`

---

## Build Verification

✅ TypeScript compilation: **PASSED**
✅ Vite production build: **SUCCESS**

```bash
npm run build
# ✓ built in 8.53s
```

---

## Testing Checklist

### Landing Page (`/`)
- [ ] Featured courses section displays 3 courses
- [ ] Each course shows an image (no broken images)
- [ ] Images load with lazy loading (check browser devtools)
- [ ] If backend thumbnail is from Unsplash → it displays
- [ ] If backend thumbnail is blocked/invalid → local fallback displays
- [ ] No console errors related to images

### Course Catalogue (`/courses`)
- [ ] Course grid displays paginated courses
- [ ] All course cards show images (no broken images)
- [ ] Images load with lazy loading
- [ ] Category-based thumbnails map correctly (e.g., Safety courses → orange safety.jpg)
- [ ] Pagination works without breaking images
- [ ] No console errors related to images

### Network Safety
- [ ] Check Network tab: external images only from `images.unsplash.com`
- [ ] Check Network tab: no referrer headers sent to external hosts
- [ ] Simulate network throttling: images don't block page load

### Error Handling
- [ ] Manually break an external image URL → verify fallback to default.jpg
- [ ] Check console for image load errors → should gracefully handle

---

## Production Recommendations

### 1. Replace SVG Placeholders
Download real JPG images (800x400px, <100KB each) and replace the SVG placeholders:
- Use royalty-free stock photos from Unsplash, Pexels, or Pixabay
- Ensure images match the category theme (e.g., safety gear, welding sparks)
- Optimize images using tools like TinyPNG or ImageOptim

### 2. Expand Allowlist (Optional)
If you use a production CDN, add its domain to `ALLOWED_IMAGE_HOSTS` in `courseHelpers.ts`:
```typescript
const ALLOWED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'source.unsplash.com',
  'cdn.yourdomain.com', // Add your CDN
];
```

### 3. Content Security Policy (Future)
Consider adding a CSP header to restrict image sources:
```http
Content-Security-Policy: img-src 'self' https://images.unsplash.com;
```

---

## Rollback Plan

If issues arise, revert these changes:
1. Remove `src/utils/courseHelpers.ts`
2. Remove `src/assets/course-thumbnails/` directory
3. Restore original image mapping logic in:
   - `src/components/landing/Courses.tsx` (line 69)
   - `src/components/catalogue/CoursesGrid.tsx` (line 93)
4. Restore original `<img>` rendering in:
   - `src/components/landing/Courses.tsx` (line 252-260)
   - `src/components/catalogue/CourseCard.tsx` (line 50)

---

## Next Steps

1. **Replace SVG placeholders** with actual images
2. **Test in staging** environment (all checklist items above)
3. **Monitor console** for any image-related warnings/errors
4. **Gather user feedback** on image quality and loading speed
5. **Consider backend enhancement** (future): add `thumbnail_category` field to serve category-specific images from backend

---

## Notes

- All external images go through the allowlist + error handling
- Local images are served from `src/assets/` (bundled by Vite)
- No performance impact: lazy loading ensures images load only when visible
- No security risk: referrer policy + allowlist prevent data leaks
- Backend-agnostic: works with any backend response (thumbnail present or not)

---

**Implementation Date**: 2026-02-10
**Build Status**: ✅ PASSING
**Ready for Staging**: ✅ YES
