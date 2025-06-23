# Supabase Authentication Setup

This app now has Supabase authentication integrated. Here's how it works:

## How it works

1. **App.tsx** - The main app component now manages authentication state

   - Shows a loading indicator while checking authentication
   - Displays the Auth component if user is not authenticated
   - Shows the main app (BottomTabNavigator) if user is authenticated

2. **Auth Component** (`components/Auth.tsx`) - Handles sign in/sign up

   - Email and password authentication
   - Sign up with email verification
   - Sign in with existing credentials

3. **useAuth Hook** (`hooks/useAuth.ts`) - Custom hook for authentication state

   - Provides session, user, loading state
   - Includes signOut function
   - Can be used in any component

4. **Star Screen** - Example of using authentication in a screen
   - Shows user email when logged in
   - Provides sign out functionality

## Environment Variables

Make sure you have these environment variables set in your `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage in Components

To use authentication in any component:

```typescript
import { useAuth } from "../hooks/useAuth";

function MyComponent() {
  const { user, session, loading, signOut } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <View>
      {user ? <Text>Welcome, {user.email}!</Text> : <Text>Please sign in</Text>}
    </View>
  );
}
```

## Authentication Flow

1. App starts and shows loading indicator
2. Checks for existing session
3. If session exists → shows main app
4. If no session → shows Auth component
5. User can sign in/sign up
6. On successful auth → automatically shows main app
7. User can sign out from Star screen

## Features

- ✅ Email/password authentication
- ✅ Session persistence
- ✅ Automatic session refresh
- ✅ Loading states
- ✅ Sign out functionality
- ✅ User info display
- ✅ TypeScript support
