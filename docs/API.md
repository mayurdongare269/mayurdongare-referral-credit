# API Documentation

## Base URL

```
Development: http://localhost:4000
Production: https://your-api-domain.com
```

## Authentication

Protected endpoints require a Clerk JWT token in the Authorization header:

```
Authorization: Bearer <clerk_jwt_token>
```

## Endpoints

### 1. Create/Update User Profile

Create or update a user profile after Clerk signup.

**Endpoint:** `POST /api/profile`

**Authentication:** Not required

**Request Body:**

```json
{
  "clerkUserId": "user_2abc123xyz",
  "email": "john@example.com",
  "name": "John Doe",
  "referralParam": "RABC123"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| clerkUserId | string | Yes | Clerk user ID |
| email | string | No | User email address |
| name | string | No | User full name |
| referralParam | string | No | Referral code from URL parameter |

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "_id": "64abc123...",
    "clerkUserId": "user_2abc123xyz",
    "email": "john@example.com",
    "name": "John Doe",
    "referralCode": "R23XYZ",
    "referredBy": "RABC123",
    "credits": 0,
    "hasPurchased": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "error": "clerkUserId is required"
}
```

**Error Response (500):**

```json
{
  "error": "Server error",
  "details": "Error message"
}
```

---

### 2. Process Purchase

Process a course purchase and award credits.

**Endpoint:** `POST /api/purchase`

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <clerk_jwt_token>
```

**Request Body:**

```json
{
  "courseId": "1",
  "courseTitle": "Full Stack Web Development Bootcamp",
  "coursePrice": 99
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| courseId | string | Yes | Unique course identifier |
| courseTitle | string | Yes | Course title |
| coursePrice | number | Yes | Course price in dollars |

**Success Response (200) - First Purchase:**

```json
{
  "success": true,
  "message": "Purchase successful! You earned 4 credits (2 for first purchase + 2 referral bonus)!",
  "creditsEarned": 4,
  "user": {
    "_id": "64abc123...",
    "clerkUserId": "user_2abc123xyz",
    "email": "john@example.com",
    "name": "John Doe",
    "referralCode": "R23XYZ",
    "referredBy": "RABC123",
    "credits": 4,
    "hasPurchased": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  },
  "purchase": {
    "_id": "64def456...",
    "clerkUserId": "user_2abc123xyz",
    "courseId": "1",
    "courseTitle": "Full Stack Web Development Bootcamp",
    "coursePrice": 99,
    "creditsEarned": 4,
    "purchaseDate": "2024-01-15T10:35:00.000Z"
  }
}
```

**Success Response (200) - Subsequent Purchase:**

```json
{
  "success": true,
  "message": "Purchase successful! (Credits only awarded on first purchase)",
  "creditsEarned": 0,
  "user": {
    "_id": "64abc123...",
    "clerkUserId": "user_2abc123xyz",
    "credits": 4,
    "hasPurchased": true
  },
  "purchase": {
    "_id": "64def789...",
    "courseId": "2",
    "courseTitle": "Advanced JavaScript & TypeScript",
    "coursePrice": 79,
    "creditsEarned": 0,
    "purchaseDate": "2024-01-16T14:20:00.000Z"
  }
}
```

**Error Response (400) - Missing Fields:**

```json
{
  "error": "Missing required fields: courseId, courseTitle, coursePrice"
}
```

**Error Response (400) - Already Purchased:**

```json
{
  "error": "You have already purchased this course."
}
```

**Error Response (401):**

```json
{
  "message": "Unauthorized"
}
```

**Error Response (404):**

```json
{
  "error": "User not found"
}
```

**Error Response (500):**

```json
{
  "error": "Purchase failed",
  "details": "Error message"
}
```

---

### 3. Get Dashboard Data

Retrieve user dashboard statistics.

**Endpoint:** `GET /api/dashboard`

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <clerk_jwt_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "referralCode": "R23XYZ",
    "credits": 4,
    "referredUsers": 5,
    "convertedUsers": 2,
    "hasPurchased": true,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| referralCode | string | User's unique referral code |
| credits | number | Total credits earned |
| referredUsers | number | Count of users who signed up with this code |
| convertedUsers | number | Count of referred users who made a purchase |
| hasPurchased | boolean | Whether user has made their first purchase |
| email | string | User email |
| name | string | User name |

**Error Response (401):**

```json
{
  "message": "Unauthorized"
}
```

**Error Response (404):**

```json
{
  "error": "User not found"
}
```

**Error Response (500):**

```json
{
  "error": "Server error",
  "details": "Error message"
}
```

---

### 4. Get Purchased Courses

Retrieve all courses purchased by the user.

**Endpoint:** `GET /api/purchases`

**Authentication:** Required

**Headers:**

```
Authorization: Bearer <clerk_jwt_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64def456...",
      "clerkUserId": "user_2abc123xyz",
      "courseId": "1",
      "courseTitle": "Full Stack Web Development Bootcamp",
      "coursePrice": 99,
      "creditsEarned": 4,
      "purchaseDate": "2024-01-15T10:35:00.000Z",
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    },
    {
      "_id": "64def789...",
      "clerkUserId": "user_2abc123xyz",
      "courseId": "2",
      "courseTitle": "Advanced JavaScript & TypeScript",
      "coursePrice": 79,
      "creditsEarned": 0,
      "purchaseDate": "2024-01-16T14:20:00.000Z",
      "createdAt": "2024-01-16T14:20:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| _id | string | Purchase record ID |
| clerkUserId | string | User who made the purchase |
| courseId | string | Course identifier |
| courseTitle | string | Course title |
| coursePrice | number | Price paid |
| creditsEarned | number | Credits earned from this purchase |
| purchaseDate | string | ISO date of purchase |

**Error Response (401):**

```json
{
  "message": "Unauthorized"
}
```

**Error Response (500):**

```json
{
  "error": "Server error",
  "details": "Error message"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding rate limiting middleware.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

## Example Usage

### JavaScript/TypeScript (Axios)

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:4000';

// Create profile
const createProfile = async (clerkUserId: string, email: string, name: string, referralParam?: string) => {
  const response = await axios.post(`${API_URL}/api/profile`, {
    clerkUserId,
    email,
    name,
    referralParam
  });
  return response.data;
};

// Make purchase
const makePurchase = async (token: string, courseId: string, courseTitle: string, coursePrice: number) => {
  const response = await axios.post(
    `${API_URL}/api/purchase`,
    {
      courseId,
      courseTitle,
      coursePrice
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

// Get dashboard
const getDashboard = async (token: string) => {
  const response = await axios.get(`${API_URL}/api/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Get purchased courses
const getPurchasedCourses = async (token: string) => {
  const response = await axios.get(`${API_URL}/api/purchases`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
```

### cURL

```bash
# Create profile
curl -X POST http://localhost:4000/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "clerkUserId": "user_2abc123xyz",
    "email": "john@example.com",
    "name": "John Doe",
    "referralParam": "RABC123"
  }'

# Make purchase
curl -X POST http://localhost:4000/api/purchase \
  -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "1",
    "courseTitle": "Full Stack Web Development Bootcamp",
    "coursePrice": 99
  }'

# Get dashboard
curl -X GET http://localhost:4000/api/dashboard \
  -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN"

# Get purchased courses
curl -X GET http://localhost:4000/api/purchases \
  -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN"
```

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "ReferralHub API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Profile",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"clerkUserId\": \"user_2abc123xyz\",\n  \"email\": \"john@example.com\",\n  \"name\": \"John Doe\",\n  \"referralParam\": \"RABC123\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/profile",
          "host": ["{{baseUrl}}"],
          "path": ["api", "profile"]
        }
      }
    },
    {
      "name": "Make Purchase",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{clerkToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"courseId\": \"1\",\n  \"courseTitle\": \"Full Stack Web Development Bootcamp\",\n  \"coursePrice\": 99\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/purchase",
          "host": ["{{baseUrl}}"],
          "path": ["api", "purchase"]
        }
      }
    },
    {
      "name": "Get Dashboard",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{clerkToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/dashboard",
          "host": ["{{baseUrl}}"],
          "path": ["api", "dashboard"]
        }
      }
    },
    {
      "name": "Get Purchased Courses",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{clerkToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/purchases",
          "host": ["{{baseUrl}}"],
          "path": ["api", "purchases"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4000"
    },
    {
      "key": "clerkToken",
      "value": "your_clerk_jwt_token_here"
    }
  ]
}
```
