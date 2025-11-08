# System Design Document

## ReferralHub - Online Course Platform with Referral Credits

### Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Data Models](#data-models)
4. [Business Logic](#business-logic)
5. [API Design](#api-design)
6. [Security](#security)
7. [Scalability](#scalability)

---

## Overview

### Purpose

ReferralHub is a full-stack web application that combines an online course platform with a referral rewards system. Users can purchase courses, share referral links, and earn credits when their referrals make purchases.

### Key Features

- User authentication and authorization
- Unique referral code generation
- Credit reward system
- Course browsing and purchasing
- Real-time dashboard statistics
- Referral tracking and analytics

### Technology Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (State Management)
- Clerk (Authentication)
- Axios (HTTP Client)

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB (Database)
- Mongoose (ODM)
- Clerk SDK (Auth Verification)

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 14 (React) + Tailwind CSS + Framer Motion  │  │
│  │  - Landing Page                                       │  │
│  │  - Dashboard                                          │  │
│  │  - Courses Page                                       │  │
│  │  - Components (Navbar, Cards, Modals)                │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↕                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Clerk Authentication                     │  │
│  │  - Sign Up / Sign In                                  │  │
│  │  - JWT Token Management                               │  │
│  │  - User Session                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                         Server Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Express.js REST API                         │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Middleware                                     │  │  │
│  │  │  - CORS                                         │  │  │
│  │  │  - JSON Parser                                  │  │  │
│  │  │  - Clerk Auth Verification                      │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Routes                                         │  │  │
│  │  │  - POST /api/profile                            │  │  │
│  │  │  - POST /api/purchase (protected)               │  │  │
│  │  │  - GET /api/dashboard (protected)               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Controllers                                    │  │  │
│  │  │  - createOrUpdateProfile()                      │  │  │
│  │  │  - purchase()                                   │  │  │
│  │  │  - getDashboard()                               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MongoDB Atlas                            │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Collections                                    │  │  │
│  │  │  - users                                        │  │  │
│  │  │  - referralactivities (optional)                │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Indexes                                        │  │  │
│  │  │  - clerkUserId (unique)                         │  │  │
│  │  │  - referralCode (unique)                        │  │  │
│  │  │  - referredBy                                   │  │  │
│  │  │  - hasPurchased                                 │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
Frontend Components
├── app/
│   ├── layout.tsx (Root layout with Clerk)
│   ├── page.tsx (Landing page)
│   ├── dashboard/
│   │   └── page.tsx (Dashboard)
│   └── courses/
│       └── page.tsx (Courses listing)
├── components/
│   ├── Navbar.tsx
│   ├── CourseCard.tsx
│   ├── DashboardCard.tsx
│   └── PurchaseModal.tsx
└── store/
    └── userStore.ts (Zustand state)

Backend Structure
├── config/
│   └── db.ts (MongoDB connection)
├── models/
│   ├── User.ts
│   └── ReferralActivity.ts
├── controllers/
│   └── referralController.ts
├── middlewares/
│   └── clerkAuth.ts
├── routes/
│   └── api.ts
└── app.ts (Express app)
```

---

## Data Models

### User Model

```typescript
interface IUser {
  _id: ObjectId;
  clerkUserId: string;        // Unique Clerk user ID
  email: string;              // User email
  name: string;               // User full name
  referralCode: string;       // Unique referral code (R + 6 chars)
  referredBy: string | null;  // Referral code of referrer
  credits: number;            // Total credits earned
  hasPurchased: boolean;      // First purchase flag
  createdAt: Date;            // Account creation timestamp
  updatedAt: Date;            // Last update timestamp
}
```

**Indexes:**
- `clerkUserId` (unique, indexed)
- `referralCode` (unique, indexed)
- `referredBy` (indexed)
- `hasPurchased` (indexed)
- Compound: `(referredBy, hasPurchased)`

### Purchase Model

```typescript
interface IPurchase {
  _id: ObjectId;
  clerkUserId: string;        // User who made the purchase
  courseId: string;           // ID of purchased course
  courseTitle: string;        // Title of purchased course
  coursePrice: number;        // Price paid for course
  creditsEarned: number;      // Credits earned from this purchase
  purchaseDate: Date;         // Date of purchase
  createdAt: Date;            // Record creation timestamp
  updatedAt: Date;            // Last update timestamp
}
```

**Indexes:**
- `clerkUserId` (indexed)
- Compound: `(clerkUserId, purchaseDate)` (for efficient user purchase history queries)

### ReferralActivity Model (Optional)

```typescript
interface IReferralActivity {
  _id: ObjectId;
  referrerId: string;         // clerkUserId of referrer
  referredId: string;         // clerkUserId of referred user
  referralCode: string;       // Referral code used
  status: 'pending' | 'converted';
  creditsAwarded: number;     // Credits awarded
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Business Logic

### Referral Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Complete Referral Flow Diagram                       │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │  User A      │
                              │  Signs Up    │
                              └──────┬───────┘
                                     │
                                     ▼
                        ┌────────────────────────────┐
                        │ Generate Referral Code     │
                        │ Code: "RABC123"            │
                        │ (R + last 6 chars of ID)   │
                        └────────────┬───────────────┘
                                     │
                                     ▼
                        ┌────────────────────────────┐
                        │ User A Gets Dashboard      │
                        │ - Referral Link            │
                        │ - Credits: 0               │
                        │ - Referred Users: 0        │
                        └────────────┬───────────────┘
                                     │
                                     ▼
                        ┌────────────────────────────┐
                        │ User A Shares Link         │
                        │ app.com/?r=RABC123         │
                        │ (Social, Email, etc.)      │
                        └────────────┬───────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │  User B      │
                              │  Clicks Link │
                              └──────┬───────┘
                                     │
                                     ▼
                        ┌────────────────────────────┐
                        │ User B Signs Up            │
                        │ referredBy: "RABC123"      │
                        │ referralCode: "RXYZ456"    │
                        └────────────┬───────────────┘
                                     │
                                     ▼
                        ┌────────────────────────────┐
                        │ User B Browses Courses     │
                        │ Sees: "Earn 2 credits on   │
                        │ first purchase!"           │
                        └────────────┬───────────────┘
                                     │
                                     ▼
                        ┌────────────────────────────┐
                        │ User B Selects Course      │
                        │ - Course: "React Bootcamp" │
                        │ - Price: $99               │
                        └────────────┬───────────────┘
                                     │
                                     ▼
                        ┌────────────────────────────┐
                        │ User B Confirms Purchase   │
                        └────────────┬───────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    ATOMIC TRANSACTION (MongoDB Session)                     │
│                                                                             │
│  Step 1: Validate Purchase                                                 │
│    ├─ Check: User B exists                                                 │
│    ├─ Check: Course not already purchased by User B                        │
│    └─ Get: User B's hasPurchased status                                    │
│                                                                             │
│  Step 2: Create Purchase Record                                            │
│    ├─ Save to Purchase collection:                                         │
│    │   - clerkUserId: User B's ID                                          │
│    │   - courseId: "1"                                                     │
│    │   - courseTitle: "React Bootcamp"                                     │
│    │   - coursePrice: 99                                                   │
│    │   - creditsEarned: 4 (if first purchase & referred)                  │
│    │   - purchaseDate: now()                                               │
│                                                                             │
│  Step 3: Award Credits to User B (if first purchase)                       │
│    ├─ IF hasPurchased = false:                                             │
│    │   ├─ Set hasPurchased = true                                          │
│    │   ├─ IF referredBy exists:                                            │
│    │   │   └─ Add 4 credits (2 purchase + 2 referral bonus)               │
│    │   └─ ELSE:                                                            │
│    │       └─ Add 2 credits (purchase only)                                │
│    └─ ELSE: No credits (not first purchase)                                │
│                                                                             │
│  Step 4: Award Credits to Referrer (if applicable)                         │
│    ├─ IF User B was referred AND first purchase:                           │
│    │   ├─ Find User A by referralCode "RABC123"                            │
│    │   └─ Add 2 credits to User A                                          │
│    └─ Log referral conversion                                              │
│                                                                             │
│  Step 5: Commit Transaction                                                │
│    └─ All changes saved atomically                                         │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
                        ┌────────────────────────────┐
                        │ Success Response           │
                        │ - Message: "Purchase       │
                        │   successful! You earned   │
                        │   4 credits!"              │
                        │ - creditsEarned: 4         │
                        └────────────┬───────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
        ┌───────────────────────┐       ┌───────────────────────┐
        │ User A Dashboard      │       │ User B Dashboard      │
        │ Updates:              │       │ Updates:              │
        │ - Credits: 2          │       │ - Credits: 4          │
        │ - Referred Users: 1   │       │ - hasPurchased: true  │
        │ - Converted Users: 1  │       │ - Purchased Courses:  │
        │ - Conversion Rate:    │       │   * React Bootcamp    │
        │   100%                │       │     ($99, +4 credits) │
        └───────────────────────┘       └───────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                         Subsequent Purchase Flow                             │
└─────────────────────────────────────────────────────────────────────────────┘

User B Purchases Another Course
      ↓
┌────────────────────────────────────────────────────────────────────────────┐
│  ATOMIC TRANSACTION                                                         │
│  1. Check: Course not already purchased                                     │
│  2. Create Purchase Record (creditsEarned: 0)                               │
│  3. No credits awarded (hasPurchased already true)                          │
│  4. Commit transaction                                                      │
└────────────────────────────────────────────────────────────────────────────┘
      ↓
User B Dashboard Shows:
  - Credits: 4 (unchanged)
  - Purchased Courses: 2
  - Both courses listed with purchase details
```

### Credit Allocation Rules

1. **First Purchase Only:** Credits awarded only on first purchase
2. **Dual Reward:** Both referrer and referred user earn 2 credits
3. **Atomic Transaction:** Prevents double-crediting
4. **Invalid Codes:** Silently ignored (no error to user)
5. **Self-Referral:** Prevented by different clerkUserId check
6. **No Referral:** Direct sign-ups still earn 2 credits on purchase

### Referral Code Generation

```typescript
function generateReferralCode(clerkUserId: string): string {
  // Take last 6 characters of Clerk user ID
  const suffix = clerkUserId.slice(-6).toUpperCase();
  return `R${suffix}`;
}

// Example:
// clerkUserId: "user_2abc123xyz"
// referralCode: "R23XYZ"
```

---

## API Design

### Endpoint Overview

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/profile` | No | Create user profile |
| POST | `/api/purchase` | Yes | Process course purchase |
| GET | `/api/dashboard` | Yes | Get user stats |
| GET | `/api/purchases` | Yes | Get purchased courses |

### Request/Response Flow

#### 1. Create Profile

```
Client                          Server                      Database
  │                               │                            │
  │  POST /api/profile            │                            │
  │  { clerkUserId, email, ... }  │                            │
  │─────────────────────────────>│                            │
  │                               │  Check if user exists      │
  │                               │──────────────────────────>│
  │                               │<──────────────────────────│
  │                               │  Create new user           │
  │                               │──────────────────────────>│
  │                               │<──────────────────────────│
  │  { success: true, user }      │                            │
  │<─────────────────────────────│                            │
```

#### 2. Purchase Flow

```
Client                          Server                      Database
  │                               │                            │
  │  POST /api/purchase           │                            │
  │  Authorization: Bearer token  │                            │
  │─────────────────────────────>│                            │
  │                               │  Verify JWT token          │
  │                               │  Start transaction         │
  │                               │──────────────────────────>│
  │                               │  Check hasPurchased        │
  │                               │<──────────────────────────│
  │                               │  Update user + credits     │
  │                               │──────────────────────────>│
  │                               │  Update referrer credits   │
  │                               │──────────────────────────>│
  │                               │  Commit transaction        │
  │                               │<──────────────────────────│
  │  { success: true, user }      │                            │
  │<─────────────────────────────│                            │
```

---

## Security

### Authentication Flow

```
1. User signs in via Clerk
2. Clerk issues JWT token
3. Frontend stores token in memory
4. Frontend sends token in Authorization header
5. Backend verifies token with Clerk SDK
6. Backend extracts clerkUserId from token
7. Backend processes request
```

### Security Measures

1. **JWT Verification:** All protected routes verify Clerk tokens
2. **Environment Variables:** Sensitive data in .env files
3. **Input Validation:** All inputs validated before processing
4. **MongoDB Injection:** Prevented by Mongoose schema validation
5. **CORS:** Configured to allow only trusted origins
6. **Atomic Transactions:** Prevent race conditions
7. **Password Security:** Handled by Clerk (bcrypt + salt)
8. **HTTPS Only:** All production traffic encrypted

### Data Protection

- User passwords never stored (Clerk handles)
- JWT tokens expire after session
- Database credentials in environment variables
- API keys never exposed to client
- MongoDB Atlas IP whitelist

---

## Scalability

### Current Capacity

- **Users:** Supports thousands of concurrent users
- **Database:** MongoDB Atlas auto-scales
- **API:** Stateless design allows horizontal scaling

### Scaling Strategy

#### Horizontal Scaling

```
Load Balancer
      │
      ├─── Server Instance 1
      ├─── Server Instance 2
      └─── Server Instance 3
            │
            └─── MongoDB Replica Set
```

#### Caching Strategy

```
Client Request
      ↓
CDN (Static Assets)
      ↓
Redis Cache (Session Data)
      ↓
Application Server
      ↓
MongoDB (Persistent Data)
```

### Performance Optimizations

1. **Database Indexes:** Efficient query performance
2. **Connection Pooling:** Reuse MongoDB connections
3. **Code Splitting:** Next.js automatic code splitting
4. **Image Optimization:** Next.js Image component
5. **API Response Caching:** Cache dashboard data
6. **Lazy Loading:** Load components on demand

### Monitoring

- **Error Tracking:** Sentry integration
- **Performance:** Lighthouse scores
- **Uptime:** UptimeRobot monitoring
- **Database:** MongoDB Atlas metrics
- **Logs:** Centralized logging (Winston)

---

## Data Flow Examples

### Example 1: New User Registration

```
1. User visits: https://app.com/?r=RABC123
2. User clicks "Sign Up"
3. Clerk handles authentication
4. Frontend calls POST /api/profile with:
   - clerkUserId: "user_xyz"
   - email: "user@example.com"
   - referralParam: "RABC123"
5. Backend creates user:
   - referralCode: "RXYZ"
   - referredBy: "RABC123"
   - credits: 0
6. User redirected to dashboard
```

### Example 2: Purchase and Credit Award

```
1. User B (referred by User A) clicks "Buy Course"
2. Frontend shows purchase modal with course details
3. User confirms purchase
4. Frontend calls POST /api/purchase with:
   - JWT token in Authorization header
   - Body: { courseId, courseTitle, coursePrice }
5. Backend starts transaction:
   a. Verify User B exists
   b. Check course not already purchased
   c. Create Purchase record
   d. IF first purchase (hasPurchased = false):
      - Set hasPurchased = true
      - Add 4 credits to User B (2 + 2 referral bonus)
      - Find User A by referralCode
      - Add 2 credits to User A
   e. ELSE: No credits awarded
   f. Commit transaction
6. Frontend shows success message with credits earned
7. Dashboard updates with:
   - New credits
   - Purchased course in "My Courses" section
   - Updated statistics
```

### Example 3: Dashboard Statistics

```
1. User A opens dashboard
2. Frontend makes parallel API calls:
   - GET /api/dashboard (user stats)
   - GET /api/purchases (purchased courses)
3. Backend queries:
   Dashboard endpoint:
   a. User A's data (credits, referralCode)
   b. Count users where referredBy = User A's code
   c. Count users where referredBy = User A's code AND hasPurchased = true
   
   Purchases endpoint:
   d. Find all Purchase records where clerkUserId = User A
   e. Sort by purchaseDate descending
4. Backend returns:
   Dashboard: { credits: 4, referredUsers: 5, convertedUsers: 2 }
   Purchases: [{ courseTitle, coursePrice, creditsEarned, purchaseDate }, ...]
5. Frontend displays:
   - Statistics cards
   - Referral link section
   - Purchased courses list
   - Action cards
```

---

## Error Handling

### Error Types

1. **Validation Errors:** Invalid input data
2. **Authentication Errors:** Invalid or expired token
3. **Business Logic Errors:** Already purchased, user not found
4. **Database Errors:** Connection issues, query failures
5. **Network Errors:** Timeout, connection refused

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Additional context",
  "code": "ERROR_CODE"
}
```

---

## Future Enhancements

1. **Email Notifications:** Notify users of referral conversions
2. **Credit Redemption:** Use credits for discounts
3. **Referral Leaderboard:** Gamification
4. **Analytics Dashboard:** Detailed referral analytics
5. **Social Sharing:** One-click share to social media
6. **Multi-tier Rewards:** Different credit amounts per course
7. **Referral Expiry:** Time-limited referral links
8. **Admin Panel:** Manage users and credits

---

## Conclusion

ReferralHub demonstrates a scalable, secure, and maintainable architecture for a referral-based course platform. The system uses modern technologies, follows best practices, and is designed for future growth.

**Key Strengths:**
- ✅ Type-safe with TypeScript
- ✅ Atomic transactions prevent data corruption
- ✅ Scalable architecture
- ✅ Secure authentication
- ✅ Responsive UI
- ✅ Well-documented

**Production Readiness:**
- Add comprehensive testing
- Implement monitoring and alerting
- Set up CI/CD pipeline
- Add rate limiting
- Implement caching layer
- Configure CDN for static assets