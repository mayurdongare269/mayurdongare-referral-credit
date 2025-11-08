# 🏗️ Technical Architecture - Deep Dive

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Browser (User B)                                          │ │
│  │  URL: https://edushare.com/?r=RABC123                     │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Next.js App Router                                  │ │ │
│  │  │  - useSearchParams() reads "?r=RABC123"             │ │ │
│  │  │  - Stores in JavaScript variable                    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                          ↓                                 │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Clerk Authentication                                │ │ │
│  │  │  - User clicks "Sign Up"                            │ │ │
│  │  │  - Clerk modal opens                                │ │ │
│  │  │  - User enters credentials                          │ │ │
│  │  │  - Clerk creates account                            │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                          ↓                                 │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  React useEffect Hook                                │ │ │
│  │  │  - Detects new user                                  │ │ │
│  │  │  - Calls createUserProfile()                         │ │ │
│  │  │  - Sends referralParam to backend                    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
                              ↓ POST /api/profile
                              ↓ { referralParam: "RABC123" }
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER SIDE                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Express.js API                                            │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Middleware: Clerk JWT Verification                  │ │ │
│  │  │  - Validates JWT token                               │ │ │
│  │  │  - Extracts clerkUserId                              │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                          ↓                                 │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Controller: createOrUpdateProfile()                 │ │ │
│  │  │  1. Generate referral code for new user             │ │ │
│  │  │  2. Validate referralParam against database         │ │ │
│  │  │  3. Create user with referredBy field               │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                              ↓ MongoDB Query
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  MongoDB Atlas                                             │ │
│  │                                                            │ │
│  │  Collection: users                                         │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Document (User A - Referrer)                        │ │ │
│  │  │  {                                                   │ │ │
│  │  │    clerkUserId: "user_abc123",                       │ │ │
│  │  │    referralCode: "RABC123",  ← Matches!              │ │ │
│  │  │    credits: 0                                        │ │ │
│  │  │  }                                                   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                          ↓                                 │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  Document (User B - New User)                        │ │ │
│  │  │  {                                                   │ │ │
│  │  │    clerkUserId: "user_xyz789",                       │ │ │
│  │  │    referralCode: "RXYZ789",                          │ │ │
│  │  │    referredBy: "RABC123",  ← Stored!                 │ │ │
│  │  │    credits: 0,                                       │ │ │
│  │  │    hasPurchased: false                               │ │ │
│  │  │  }                                                   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack Deep Dive

### Frontend Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Framework                                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js 14 (App Router)                               │ │
│  │  - File-based routing                                  │ │
│  │  - Server-side rendering                               │ │
│  │  - API routes                                          │ │
│  │  - Built-in optimization                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 2: UI Library                                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React 18                                              │ │
│  │  - Component-based architecture                        │ │
│  │  - Hooks (useState, useEffect, custom hooks)          │ │
│  │  - Virtual DOM                                         │ │
│  │  - Concurrent rendering                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 3: Type Safety                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  TypeScript                                            │ │
│  │  - Static type checking                                │ │
│  │  - Interface definitions                               │ │
│  │  - Compile-time error detection                        │ │
│  │  - Better IDE support                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 4: Styling                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Tailwind CSS                                          │ │
│  │  - Utility-first CSS                                   │ │
│  │  - Responsive design                                   │ │
│  │  - Custom theme                                        │ │
│  │  - JIT compiler                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 5: Animation                                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Framer Motion                                         │ │
│  │  - Declarative animations                              │ │
│  │  - Gesture support                                     │ │
│  │  - SVG animations                                      │ │
│  │  - Layout animations                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 6: Authentication                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Clerk                                                 │ │
│  │  - User management                                     │ │
│  │  - JWT tokens                                          │ │
│  │  - OAuth providers                                     │ │
│  │  - Session management                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 7: HTTP Client                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Axios                                                 │ │
│  │  - Promise-based HTTP client                           │ │
│  │  - Request/response interceptors                       │ │
│  │  - Automatic JSON transformation                       │ │
│  │  - Error handling                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Backend Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYERS                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Runtime                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Node.js                                               │ │
│  │  - JavaScript runtime                                  │ │
│  │  - Event-driven architecture                           │ │
│  │  - Non-blocking I/O                                    │ │
│  │  - NPM ecosystem                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 2: Framework                                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express.js                                            │ │
│  │  - Minimal web framework                               │ │
│  │  - Middleware support                                  │ │
│  │  - Routing                                             │ │
│  │  - Request/response handling                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 3: Type Safety                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  TypeScript                                            │ │
│  │  - Type definitions                                    │ │
│  │  - Interface contracts                                 │ │
│  │  - Compile-time checks                                 │ │
│  │  - Better refactoring                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 4: Database                                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  MongoDB                                               │ │
│  │  - NoSQL document database                             │ │
│  │  - Flexible schema                                     │ │
│  │  - Horizontal scaling                                  │ │
│  │  - ACID transactions                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 5: ODM                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Mongoose                                              │ │
│  │  - Schema definition                                   │ │
│  │  - Model creation                                      │ │
│  │  - Query building                                      │ │
│  │  - Validation                                          │ │
│  │  - Middleware hooks                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 6: Authentication                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Clerk SDK                                             │ │
│  │  - JWT verification                                    │ │
│  │  - User validation                                     │ │
│  │  - Token decoding                                      │ │
│  │  - Session management                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

### Request Flow (Purchase Example)

```
┌─────────────────────────────────────────────────────────────┐
│  Step 1: User Action                                         │
│  User clicks "Enroll Now" button                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Frontend Event Handler                              │
│  onClick={() => handlePurchaseClick(course)}                │
│  - Sets selected course                                      │
│  - Opens purchase modal                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 3: User Confirms                                       │
│  User clicks "Confirm" in modal                             │
│  handleConfirmPurchase() is called                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Get Auth Token                                      │
│  const token = await getToken();                            │
│  - Retrieves JWT from Clerk                                 │
│  - Token contains clerkUserId                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 5: HTTP Request                                        │
│  axios.post('/api/purchase', {                              │
│    courseId: "1",                                           │
│    courseTitle: "React Bootcamp",                           │
│    coursePrice: 99                                          │
│  }, {                                                       │
│    headers: { Authorization: `Bearer ${token}` }           │
│  })                                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 6: Server Receives Request                             │
│  Express.js route: POST /api/purchase                       │
│  - CORS middleware                                          │
│  - JSON parser middleware                                   │
│  - Clerk auth middleware                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 7: JWT Verification                                    │
│  requireAuth middleware:                                     │
│  - Extracts token from header                               │
│  - Verifies with Clerk                                      │
│  - Decodes clerkUserId                                      │
│  - Attaches to req.clerkUserId                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 8: Controller Logic                                    │
│  purchase() function:                                        │
│  1. Start MongoDB transaction                               │
│  2. Find user by clerkUserId                                │
│  3. Check if course already purchased                       │
│  4. Calculate credits                                       │
│  5. Create purchase record                                  │
│  6. Update user credits                                     │
│  7. Update referrer credits (if applicable)                 │
│  8. Commit transaction                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 9: Database Operations                                 │
│  MongoDB Atlas:                                             │
│  - Insert into purchases collection                         │
│  - Update users collection (buyer)                          │
│  - Update users collection (referrer)                       │
│  - All in single transaction                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 10: Response                                           │
│  res.json({                                                 │
│    success: true,                                           │
│    message: "Purchase successful!",                         │
│    creditsEarned: 4,                                        │
│    user: updatedUser                                        │
│  })                                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 11: Frontend Receives Response                         │
│  - Close modal                                              │
│  - Show success message                                     │
│  - Redirect to dashboard                                    │
│  - Update UI with new credits                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: HTTPS                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  - All traffic encrypted                               │ │
│  │  - TLS/SSL certificates                                │ │
│  │  - Prevents man-in-the-middle attacks                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 2: Authentication                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Clerk                                                 │ │
│  │  - Password hashing (bcrypt)                           │ │
│  │  - JWT tokens                                          │ │
│  │  - Session management                                  │ │
│  │  - OAuth providers                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 3: Authorization                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  JWT Verification Middleware                           │ │
│  │  - Validates token signature                           │ │
│  │  - Checks expiration                                   │ │
│  │  - Extracts user ID                                    │ │
│  │  - Prevents token tampering                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 4: Input Validation                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  - Type checking (TypeScript)                          │ │
│  │  - Schema validation (Mongoose)                        │ │
│  │  - Sanitization                                        │ │
│  │  - Required field checks                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 5: Database Security                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  - Parameterized queries (Mongoose)                    │ │
│  │  - No SQL injection                                    │ │
│  │  - Connection string in env vars                       │ │
│  │  - IP whitelisting                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 6: Transaction Safety                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  - Atomic operations                                   │ │
│  │  - Rollback on error                                   │ │
│  │  - Prevents race conditions                            │ │
│  │  - Data consistency                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                          ↓                                   │
│  Layer 7: Environment Variables                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  - API keys in .env                                    │ │
│  │  - Not in version control                              │ │
│  │  - Different per environment                           │ │
│  │  - Loaded at runtime                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Optimizations

### Frontend Optimizations

```
1. Code Splitting
   - Next.js automatic code splitting
   - Dynamic imports for heavy components
   - Lazy loading

2. Image Optimization
   - Next.js Image component
   - Automatic WebP conversion
   - Responsive images

3. Caching
   - Browser caching
   - Service workers (optional)
   - Static asset caching

4. Bundle Size
   - Tree shaking
   - Minification
   - Compression (gzip/brotli)
```

### Backend Optimizations

```
1. Database Indexes
   - Unique indexes on clerkUserId, referralCode
   - Compound index on (referredBy, hasPurchased)
   - Faster queries

2. Connection Pooling
   - Reuse MongoDB connections
   - Reduce connection overhead
   - Better performance

3. Atomic Operations
   - Single database round trip
   - Consistent data
   - No race conditions

4. Efficient Queries
   - Projection (select specific fields)
   - Lean queries (plain objects)
   - Aggregation pipelines
```

---

## Scalability Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CURRENT ARCHITECTURE                      │
│                    (Single Instance)                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Frontend   │────────▶│   Backend    │                 │
│  │  (Vercel)    │         │  (Railway)   │                 │
│  └──────────────┘         └──────┬───────┘                 │
│                                   │                          │
│                                   ▼                          │
│                          ┌──────────────┐                   │
│                          │   MongoDB    │                   │
│                          │   (Atlas)    │                   │
│                          └──────────────┘                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SCALABLE ARCHITECTURE                     │
│                    (Multiple Instances)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Frontend   │────────▶│Load Balancer │                 │
│  │  (Vercel)    │         └──────┬───────┘                 │
│  └──────────────┘                │                          │
│                          ┌───────┴───────┐                  │
│                          │               │                  │
│                          ▼               ▼                  │
│                  ┌──────────────┐ ┌──────────────┐         │
│                  │  Backend #1  │ │  Backend #2  │         │
│                  └──────┬───────┘ └──────┬───────┘         │
│                         │                │                  │
│                         └────────┬───────┘                  │
│                                  ▼                          │
│                         ┌──────────────┐                   │
│                         │   MongoDB    │                   │
│                         │ Replica Set  │                   │
│                         └──────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

---

This technical architecture document provides a complete understanding of how all the technologies work together in your EduShare platform! 🚀
