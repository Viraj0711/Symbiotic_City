# Gender-Based Avatar System Implementation

## Overview

Successfully implemented a gender-based avatar system where users can select their gender during signup, and the system will display appropriate avatars based on their selection.

## Changes Made

### Frontend Changes

#### 1. Created Gender Avatar Components

**File:** `frontend/src/components/GenderAvatars.tsx`

- Created `MaleAvatar` - Blue-themed avatar with short hair
- Created `FemaleAvatar` - Pink-themed avatar with longer hair and dress
- Created `NeutralAvatar` - Green-themed neutral avatar
- Created `GenderAvatar` wrapper component that renders the appropriate avatar based on gender

#### 2. Updated Signup Page

**File:** `frontend/src/pages/Signup.tsx`

- Added gender state variable with type `'male' | 'female' | 'other' | 'prefer-not-to-say'`
- Added gender selection UI with 4 buttons (Male, Female, Other, Prefer not to say)
- Styled with green theme matching the application design
- Updated signup call to pass gender parameter

#### 3. Updated Dashboard

**File:** `frontend/src/pages/Dashboard.tsx`

- Imported `GenderAvatar` component
- Replaced `StickFigure` with `GenderAvatar` component
- Avatar now displays based on user's gender selection
- Kept `StickFigure` component for backwards compatibility

#### 4. Updated Authentication Context

**File:** `frontend/src/contexts/AuthContext.tsx`

- Updated `signUp` function signature to accept gender parameter
- Passes gender to `api.register()` call

#### 5. Updated API Client

**File:** `frontend/src/lib/supabase.ts`

- Added `gender` field to `User` interface
- Updated `register()` method to accept and send gender parameter
- Default gender set to 'prefer-not-to-say'

### Backend Changes

#### 1. Updated User Interface

**File:** `backend/src/config/database.ts`

- Added `gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'` to `IUser` interface

#### 2. Updated User Model

**File:** `backend/src/models/User.ts`

- Updated `create()` method to include gender in INSERT query
- Added gender as parameter in SQL query (position $8)
- Default value set to 'prefer-not-to-say'

#### 3. Updated Auth Routes

**File:** `backend/src/routes/auth.ts`

- Extracts `gender` from request body in register endpoint
- Passes gender to `User.create()` method

#### 4. Database Migration

**File:** `backend/src/migrations/002_add_gender_column.sql`

- Adds gender column to users table
- Sets CHECK constraint for valid values
- Sets default value to 'prefer-not-to-say'
- Updates existing users with default value

**File:** `backend/src/migrations/runGenderMigration.ts`

- Script to run the gender column migration

## Features

### Avatar Selection

- **Male:** Blue-themed avatar with short hair and pants
- **Female:** Pink-themed avatar with longer hair and dress
- **Other/Prefer not to say:** Green-themed neutral avatar

### Default Behavior

- If user doesn't select gender, defaults to "Prefer not to say"
- Shows neutral green-themed avatar for "other" and "prefer-not-to-say"

### User Experience

- Gender selection is optional
- Clean, accessible button-based selection
- Matches application's green sustainability theme
- Responsive design with proper spacing

## How to Apply Changes

### Run Database Migration

```bash
cd backend
npm run build
node dist/migrations/runGenderMigration.js
```

### Testing

1. Sign up a new user and select gender
2. Check that appropriate avatar is displayed on Dashboard
3. Verify gender is stored in database
4. Test all gender options (male, female, other, prefer not to say)

## UI Alignment

The gender selection UI is properly aligned:

- Positioned after role selection
- Uses 2x2 grid layout for the 4 options
- Consistent spacing and styling with role selection
- Green theme throughout (emerald-500/600 colors)

## Benefits

1. ✅ Personalized user experience
2. ✅ Inclusive gender options
3. ✅ Privacy-respecting (prefer not to say option)
4. ✅ Visually consistent with app theme
5. ✅ Type-safe implementation
6. ✅ Database-backed persistence

## Future Enhancements

- Allow users to change gender in profile settings
- Add more avatar customization options
- Support custom avatar uploads with gender defaults
