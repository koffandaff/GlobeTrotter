# API Reference

Base URL: `/api/v1`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Dashboard

### Get Dashboard

Aggregated view for the home screen: recent trips, recommended destinations, and budget highlights in a single call.

**Endpoint:** `GET /dashboard`

**Authentication:** Required (Bearer token)

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `recentTripsLimit` | integer | 5 | Number of recent trips to return (1-20) |
| `recommendationsLimit` | integer | 6 | Number of recommended destinations to return (1-20) |

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "recentTrips": [
      {
        "id": "uuid",
        "name": "string",
        "description": "string|null",
        "coverImageUrl": "string|null",
        "startDate": "ISO8601|null",
        "endDate": "ISO8601|null",
        "status": "DRAFT|PLANNED|ONGOING|COMPLETED|CANCELLED",
        "totalEstimatedCost": "number|null",
        "currency": "USD",
        "stopsCount": 3,
        "createdAt": "ISO8601"
      }
    ],
    "recommendedDestinations": [
      {
        "id": "uuid",
        "name": "string",
        "country": "string",
        "countryCode": "string",
        "imageUrl": "string|null",
        "costIndex": "number|null",
        "popularityScore": "number",
        "reason": "string|null"
      }
    ],
    "budgetHighlights": {
      "totalBudget": "number|null",
      "totalSpent": "number",
      "totalEstimated": "number",
      "currency": "USD",
      "byCategory": [
        {
          "category": "TRANSPORT|ACCOMMODATION|ACTIVITY|FOOD|OTHER",
          "budget": "number|null",
          "spent": "number",
          "estimated": "number"
        }
      ],
      "tripsWithBudget": 2,
      "tripsWithoutBudget": 3
    }
  }
}
```

**Errors:**
- `401 UNAUTHORIZED` - Missing or invalid access token
- `429 TOO MANY REQUESTS` - Rate limit exceeded

## Auth

### Login
`POST /auth/login`

### Register
`POST /auth/register`

### Refresh Token
`POST /auth/refresh`

### Logout
`POST /auth/logout`

### Get Current User
`GET /auth/me`

### Change Password
`POST /auth/change-password`

### Forgot Password
`POST /auth/forgot-password`

### Verify OTP
`POST /auth/verify-otp`

### Reset Password
`POST /auth/reset-password`

### Accept Invite
`POST /auth/accept-invite`

## Users (Admin)

### List Users
`GET /users`

### Get User
`GET /users/:id`

### Update User Role
`PATCH /users/:id/role`

### Update User Status
`PATCH /users/:id/status`