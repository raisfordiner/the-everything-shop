# API Documentation

## Authentication

### POST /auth/register
Register a new user.

**Request Body:**
- `username` (string, required): 6-20 chars, alphanumeric + _ -
- `email` (string, required): Valid email
- `password` (string, required): Min 8 chars, with lowercase, uppercase, digit, special char
- `password_confirmation` (string, required): Must match password

**Responses:**
- 200: User registered successfully
- 400: Invalid request or validation error
- 500: Registration failed

### POST /auth/login
Login a user.

**Request Body:**
- `email` (string, required): Valid email
- `password` (string, required): Password

**Responses:**
- 200: Login successful, sets cookies
- 400: Invalid credentials
- 500: Login failed

### POST /auth/logout
Logout a user. Requires authentication.

**Responses:**
- 200: Logout successful
- 401: Unauthorized
- 500: Logout failed

### POST /auth/refresh-token
Refresh access token. Requires valid refresh token.

**Responses:**
- 200: Access token refreshed
- 401: Invalid refresh token
- 500: Failed to refresh

## User

### GET /user/info
Get user information. Requires authentication.

**Responses:**
- 200: User data
- 401: Unauthorized

## Health

### GET /health
Health check.

**Responses:**
- 200: { status: "ok", timestamp: ISO string }