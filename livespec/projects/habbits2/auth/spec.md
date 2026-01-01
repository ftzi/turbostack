# Authentication Flow [HAB.auth]

User authentication flows including sign-up, sign-in, and sign-out.

## Entry Points

| Route | Description |
|-------|-------------|
| `/auth` | Better Auth authentication pages |

## UI

Better Auth provides authentication pages with multiple methods:
- **Email/Password** - Available when no OAuth configured
- **Google OAuth** - Available when credentials configured
- **Magic Link** - Always available (console fallback or email via Resend)

---

## Sign Up [HAB.auth.signup]

New users can create an account.

### Scenario: Sign up with email and password [HAB.auth.signup.email]

Testing: e2e

- WHEN unauthenticated user visits `/auth`
- AND submits sign-up form with valid email and password
- THEN account is created
- AND user is redirected to `/dashboard`
- AND user is authenticated

### Scenario: Access protected route after signup [HAB.auth.signup.access]

Testing: e2e

- WHEN user signs up successfully
- THEN can access protected routes like `/dashboard`
- AND session persists across page navigation

---

## Sign In [HAB.auth.signin]

Existing users can log in.

### Scenario: Sign in with credentials [HAB.auth.signin.email]

Testing: e2e

- WHEN user visits `/auth`
- AND submits sign-in form with valid credentials
- THEN user is authenticated
- AND redirected to `/dashboard`

---

## Sign Out [HAB.auth.signout]

Authenticated users can log out.

### Scenario: Sign out from dashboard [HAB.auth.signout.dashboard]

Testing: e2e

- WHEN authenticated user clicks "Sign out" in user dropdown
- THEN `authClient.signOut()` is called
- AND user session is cleared
- AND user is redirected to `/` (home page)
- AND user cannot access protected routes

### Scenario: Cannot access protected routes after signout [HAB.auth.signout.protected]

Testing: e2e

- WHEN user signs out
- AND attempts to visit `/dashboard`
- THEN is redirected to authentication
- AND cannot access protected content

---

## Session Persistence [HAB.auth.session]

User sessions persist across page loads.

### Scenario: Session persists on reload [HAB.auth.session.reload]

Testing: e2e

- WHEN authenticated user reloads page
- THEN remains authenticated
- AND can access protected routes
- AND user info is still available

---

## Route Protection [HAB.auth.protection]

Dashboard routes require authentication.

### Scenario: Unauthenticated access redirects [HAB.auth.protection.redirect]

Testing: e2e

- WHEN unauthenticated user visits `/dashboard`
- THEN is redirected to authentication
- AND cannot view protected content
