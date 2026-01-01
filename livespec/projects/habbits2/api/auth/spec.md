# Authentication API [HAB.api.auth]

Authentication procedures for session validation and health checks.

## Entry Points

| Procedure | Description |
|-----------|-------------|
| `auth.ping` | Authenticated health check endpoint |

## Design Decisions

### Using Better Auth for Session Management

**Choice:** Better Auth library with Drizzle adapter

**Rationale:** Better Auth provides:
- Multiple authentication methods (OAuth, magic link, email/password)
- Flexible provider configuration
- Built-in session management with token-based authentication
- Type-safe integration with TypeScript and oRPC

---

## Authenticated Health Check [HAB.api.auth.ping]

Verifies that a user is authenticated and returns session information.

### Scenario: Successful ping when authenticated [HAB.api.auth.ping.success]

- WHEN authenticated user calls auth.ping
- THEN returns pong message with timestamp
- AND includes the authenticated user's ID
- AND timestamp is current server time

### Scenario: Rejection when not authenticated [HAB.api.auth.ping.unauthorized]

- WHEN unauthenticated user calls auth.ping
- THEN throws UNAUTHORIZED error
- AND error message is "You must be logged in"

### Scenario: User ID matches session [HAB.api.auth.ping.user-id]

- WHEN authenticated user calls auth.ping
- THEN returned userId matches the session's user ID
- AND userId is a valid user identifier
