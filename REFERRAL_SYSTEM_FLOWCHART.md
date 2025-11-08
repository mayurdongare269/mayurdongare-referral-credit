# Complete Referral System Flowchart

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EDUSHARE REFERRAL SYSTEM ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────┐
                                    │  CLERK   │
                                    │   AUTH   │
                                    └────┬─────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
            ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
            │   Sign Up    │    │   Sign In    │    │   Session    │
            │   (Clerk)    │    │   (Clerk)    │    │  Management  │
            └──────┬───────┘    └──────┬───────┘    └──────────────┘
                   │                    │
                   └────────┬───────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  POST /profile  │
                   │  Create User    │
                   └────────┬────────┘
                            │
                            ▼
                   ┌─────────────────────────────┐
                   │  MongoDB - users collection │
                   │  • clerkUserId              │
                   │  • referralCode (generated) │
                   │  • referredBy (from URL)    │
                   │  • credits: 0               │
                   │  • hasPurchased: false      │
                   └─────────────────────────────┘
```

## 🔄 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 1: USER A SIGNS UP                              │
└─────────────────────────────────────────────────────────────────────────────┘

                            User A visits site
                                    ↓
                            Clicks "Sign Up"
                                    ↓
                        ┌───────────────────────┐
                        │   Clerk Auth Flow     │
                        │   • Email/Password    │
                        │   • Google OAuth      │
                        │   • GitHub OAuth      │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  POST /api/profile    │
                        │  {                    │
                        │    clerkUserId,       │
                        │    email,             │
                        │    name,              │
                        │    referralParam: null│
                        │  }                    │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  User A Created       │
                        │  • ID: user_abc123    │
                        │  • Code: RABC123      │
                        │  • Credits: 0         │
                        │  • referredBy: null   │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  Redirect to Home     │
                        └───────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                    STEP 2: USER A SHARES REFERRAL LINK                       │
└─────────────────────────────────────────────────────────────────────────────┘

                        User A opens Dashboard
                                    ↓
                        ┌───────────────────────┐
                        │  GET /api/dashboard   │
                        │  Authorization: token │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  Dashboard Shows:     │
                        │  • Referral Code      │
                        │  • Referral Link      │
                        │  • Credits: 0         │
                        │  • Referred: 0        │
                        └───────────┬───────────┘
                                    ↓
                        User A copies link:
                        app.com/?r=RABC123
                                    ↓
                        ┌───────────────────────┐
                        │  Shares via:          │
                        │  • Social Media       │
                        │  • Email              │
                        │  • Messaging Apps     │
                        │  • Direct Link        │
                        └───────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                      STEP 3: USER B CLICKS LINK                              │
└─────────────────────────────────────────────────────────────────────────────┘

                    User B clicks: app.com/?r=RABC123
                                    ↓
                        ┌───────────────────────┐
                        │  Landing Page Loads   │
                        │  • URL param stored   │
                        │  • r=RABC123          │
                        └───────────┬───────────┘
                                    ↓
                        User B clicks "Sign Up"
                                    ↓
                        ┌───────────────────────┐
                        │   Clerk Auth Flow     │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  POST /api/profile    │
                        │  {                    │
                        │    clerkUserId,       │
                        │    email,             │
                        │    name,              │
                        │    referralParam:     │
                        │      "RABC123"        │
                        │  }                    │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  Validate RABC123     │
                        │  • Find User A        │
                        │  • Code exists? ✓     │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  User B Created       │
                        │  • ID: user_xyz789    │
                        │  • Code: RXYZ789      │
                        │  • Credits: 0         │
                        │  • referredBy:        │
                        │    "RABC123"          │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  Redirect to Home     │
                        └───────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                   STEP 4: USER B BROWSES COURSES                             │
└─────────────────────────────────────────────────────────────────────────────┘

                        User B opens /courses
                                    ↓
                        ┌───────────────────────┐
                        │  GET /api/dashboard   │
                        │  Check hasPurchased   │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  hasPurchased: false  │
                        │  Show Banner:         │
                        │  "First Purchase      │
                        │   Bonus! +2 credits"  │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  Display 12 Courses   │
                        │  • Web Development    │
                        │  • Design             │
                        │  • Data Science       │
                        │  • Mobile Dev         │
                        │  • Business           │
                        │  • DevOps             │
                        └───────────┬───────────┘
                                    ↓
                        User B selects course
                        "React Bootcamp - $99"


┌─────────────────────────────────────────────────────────────────────────────┐
│                  STEP 5: USER B MAKES FIRST PURCHASE                         │
└─────────────────────────────────────────────────────────────────────────────┘

                        User B clicks "Buy Now"
                                    ↓
                        ┌───────────────────────┐
                        │  Purchase Modal       │
                        │  • Course: React      │
                        │  • Price: $99         │
                        │  • You'll earn:       │
                        │    +2 credits         │
                        └───────────┬───────────┘
                                    ↓
                        User B clicks "Confirm"
                                    ↓
                        ┌───────────────────────┐
                        │  POST /api/purchase   │
                        │  Authorization: token │
                        │  {                    │
                        │    courseId: "1",     │
                        │    courseTitle:       │
                        │      "React Bootcamp",│
                        │    coursePrice: 99    │
                        │  }                    │
                        └───────────┬───────────┘
                                    ↓
        ┌───────────────────────────────────────────────────┐
        │         ATOMIC TRANSACTION BEGINS                 │
        └───────────────────────────────────────────────────┘
                                    ↓
        ┌───────────────────────────────────────────────────┐
        │  Step 1: Validate                                 │
        │  • User B exists? ✓                               │
        │  • Course not purchased? ✓                        │
        │  • hasPurchased = false? ✓                        │
        └───────────────────┬───────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────────────────┐
        │  Step 2: Create Purchase Record                   │
        │  purchases collection:                            │
        │  {                                                │
        │    clerkUserId: "user_xyz789",                    │
        │    courseId: "1",                                 │
        │    courseTitle: "React Bootcamp",                 │
        │    coursePrice: 99,                               │
        │    creditsEarned: 4,                              │
        │    purchaseDate: now()                            │
        │  }                                                │
        └───────────────────┬───────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────────────────┐
        │  Step 3: Update User B                            │
        │  users collection:                                │
        │  {                                                │
        │    hasPurchased: false → true,                    │
        │    credits: 0 → 4                                 │
        │      (2 purchase + 2 referral bonus)              │
        │  }                                                │
        └───────────────────┬───────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────────────────┐
        │  Step 4: Find User A by referralCode "RABC123"    │
        │  • User A found ✓                                 │
        └───────────────────┬───────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────────────────┐
        │  Step 5: Update User A                            │
        │  users collection:                                │
        │  {                                                │
        │    credits: 0 → 2                                 │
        │      (earned from referral)                       │
        │  }                                                │
        └───────────────────┬───────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────────────────┐
        │         TRANSACTION COMMITS                       │
        │         All changes saved atomically              │
        └───────────────────┬───────────────────────────────┘
                            ↓
                        ┌───────────────────────┐
                        │  Success Response     │
                        │  {                    │
                        │    success: true,     │
                        │    message: "Purchase │
                        │      successful! You  │
                        │      earned 4 credits"│
                        │    creditsEarned: 4,  │
                        │    user: {...},       │
                        │    purchase: {...}    │
                        │  }                    │
                        └───────────┬───────────┘
                                    ↓
                        ┌───────────────────────┐
                        │  Frontend Updates     │
                        │  • Show success msg   │
                        │  • Redirect dashboard │
                        └───────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                    STEP 6: DASHBOARDS UPDATE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

        ┌─────────────────────────────────────────────────────┐
        │              USER B DASHBOARD                        │
        ├─────────────────────────────────────────────────────┤
        │  GET /api/dashboard                                 │
        │  GET /api/purchases                                 │
        │                                                     │
        │  ┌─────────────────────────────────────────────┐  │
        │  │  Total Credits: 4                           │  │
        │  │  Referred Users: 0                          │  │
        │  │  Converted Users: 0                         │  │
        │  │  Conversion Rate: 0%                        │  │
        │  └─────────────────────────────────────────────┘  │
        │                                                     │
        │  ┌─────────────────────────────────────────────┐  │
        │  │  MY PURCHASED COURSES                       │  │
        │  │                                             │  │
        │  │  🎓 React Bootcamp                          │  │
        │  │     Jan 15, 2024 • $99                      │  │
        │  │                        +4 Credits  [View]   │  │
        │  └─────────────────────────────────────────────┘  │
        └─────────────────────────────────────────────────────┘

        ┌─────────────────────────────────────────────────────┐
        │              USER A DASHBOARD                        │
        ├─────────────────────────────────────────────────────┤
        │  GET /api/dashboard                                 │
        │  GET /api/purchases                                 │
        │                                                     │
        │  ┌─────────────────────────────────────────────┐  │
        │  │  Total Credits: 2                           │  │
        │  │  Referred Users: 1                          │  │
        │  │  Converted Users: 1                         │  │
        │  │  Conversion Rate: 100%                      │  │
        │  └─────────────────────────────────────────────┘  │
        │                                                     │
        │  ┌─────────────────────────────────────────────┐  │
        │  │  REFERRAL ACTIVITY                          │  │
        │  │                                             │  │
        │  │  👥 Total Referrals: 1                      │  │
        │  │  ✅ Converted: 1                            │  │
        │  │  💰 Credits Earned: 2                       │  │
        │  └─────────────────────────────────────────────┘  │
        └─────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│              STEP 7: USER B PURCHASES SECOND COURSE                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    User B selects another course
                    "JavaScript Course - $79"
                                    ↓
                        User B clicks "Buy Now"
                                    ↓
                        ┌───────────────────────┐
                        │  Purchase Modal       │
                        │  • Course: JavaScript │
                        │  • Price: $79         │
                        │  • Note: Credits only │
                        │    on first purchase  │
                        └───────────┬───────────┘
                                    ↓
                        User B clicks "Confirm"
                                    ↓
                        ┌───────────────────────┐
                        │  POST /api/purchase   │
                        │  {                    │
                        │    courseId: "2",     │
                        │    courseTitle:       │
                        │      "JavaScript",    │
                        │    coursePrice: 79    │
                        │  }                    │
                        └───────────┬───────────┘
                                    ↓
        ┌───────────────────────────────────────────────────┐
        │         ATOMIC TRANSACTION BEGINS                 │
        └───────────────────────────────────────────────────┘
                                    ↓
        ┌───────────────────────────────────────────────────┐
        │  Step 1: Validate                                 │
        │  • User B exists? ✓                               │
        │  • Course not purchased? ✓                        │
        │  • hasPurchased = true (already purchased)        │
        └───────────────────┬───────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────────────────┐
        │  Step 2: Create Purchase Record                   │
        │  purchases collection:                            │
        │  {                                                │
        │    clerkUserId: "user_xyz789",                    │
        │    courseId: "2",                                 │
        │    courseTitle: "JavaScript Course",              │
        │    coursePrice: 79,                               │
        │    creditsEarned: 0,  ← NO CREDITS                │
        │    purchaseDate: now()                            │
        │  }                                                │
        └───────────────────┬───────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────────────────┐
        │  Step 3: No Credit Updates                        │
        │  • User B credits unchanged (still 4)             │
        │  • User A credits unchanged (still 2)             │
        │  • No referral credits (not first purchase)       │
        └───────────────────┬───────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────────────────┐
        │         TRANSACTION COMMITS                       │
        └───────────────────┬───────────────────────────────┘
                            ↓
                        ┌───────────────────────┐
                        │  Success Response     │
                        │  {                    │
                        │    success: true,     │
                        │    message: "Purchase │
                        │      successful!"     │
                        │    creditsEarned: 0   │
                        │  }                    │
                        └───────────┬───────────┘
                                    ↓
        ┌─────────────────────────────────────────────────────┐
        │              USER B DASHBOARD NOW                    │
        ├─────────────────────────────────────────────────────┤
        │  ┌─────────────────────────────────────────────┐  │
        │  │  Total Credits: 4 (unchanged)               │  │
        │  └─────────────────────────────────────────────┘  │
        │                                                     │
        │  ┌─────────────────────────────────────────────┐  │
        │  │  MY PURCHASED COURSES (2)                   │  │
        │  │                                             │  │
        │  │  🎓 React Bootcamp                          │  │
        │  │     Jan 15, 2024 • $99                      │  │
        │  │                        +4 Credits  [View]   │  │
        │  │                                             │  │
        │  │  🎓 JavaScript Course                       │  │
        │  │     Jan 16, 2024 • $79            [View]    │  │
        │  └─────────────────────────────────────────────┘  │
        └─────────────────────────────────────────────────────┘
```

## 📊 Credit Calculation Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CREDIT AWARD SCENARIOS                                │
└─────────────────────────────────────────────────────────────────────────────┘

Scenario 1: Direct Signup + First Purchase
├─ User signs up without referral link
├─ Makes first purchase
└─ Result: User gets 2 credits

Scenario 2: Referred Signup + First Purchase
├─ User signs up with referral link
├─ Makes first purchase
├─ Result: 
│  ├─ Referred user gets 4 credits (2 + 2 bonus)
│  └─ Referrer gets 2 credits

Scenario 3: Any User + Subsequent Purchase
├─ User already made first purchase
├─ Purchases another course
└─ Result: No credits awarded (purchase recorded)

Scenario 4: Invalid Referral Code
├─ User signs up with invalid/expired code
├─ Makes first purchase
└─ Result: User gets 2 credits (treated as direct signup)


┌─────────────────────────────────────────────────────────────────────────────┐
│                          CREDIT FLOW TABLE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┬─────────────┬──────────────┬──────────────┬──────────────┐
│   Action     │  Referred?  │  First Buy?  │ User Credits │ Referrer Cr. │
├──────────────┼─────────────┼──────────────┼──────────────┼──────────────┤
│ Sign Up      │     No      │      -       │      0       │      -       │
│ Sign Up      │     Yes     │      -       │      0       │      0       │
│ First Buy    │     No      │     Yes      │     +2       │      -       │
│ First Buy    │     Yes     │     Yes      │     +4       │     +2       │
│ Second Buy   │     No      │     No       │      0       │      -       │
│ Second Buy   │     Yes     │     No       │      0       │      0       │
└──────────────┴─────────────┴──────────────┴──────────────┴──────────────┘
```

## 🔐 Security & Data Integrity

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SECURITY MEASURES                                     │
└─────────────────────────────────────────────────────────────────────────────┘

1. Authentication
   ├─ Clerk JWT tokens for all protected routes
   ├─ Token verification on every request
   └─ Automatic token refresh

2. Authorization
   ├─ Users can only access their own data
   ├─ clerkUserId extracted from verified token
   └─ No user ID in request body (prevents spoofing)

3. Data Validation
   ├─ Required fields checked
   ├─ Mongoose schema validation
   └─ Type checking with TypeScript

4. Transaction Safety
   ├─ MongoDB ACID transactions
   ├─ All-or-nothing updates
   ├─ Automatic rollback on error
   └─ Prevents partial credit awards

5. Duplicate Prevention
   ├─ Unique indexes on database
   ├─ Check before purchase
   └─ Proper error messages

6. Race Condition Prevention
   ├─ Atomic operations
   ├─ Database-level locking
   └─ Transaction isolation
```

## 📈 Analytics & Tracking

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TRACKABLE METRICS                                       │
└─────────────────────────────────────────────────────────────────────────────┘

User Level:
├─ Total credits earned
├─ Number of referrals
├─ Conversion rate
├─ Courses purchased
├─ Total spent
└─ Credits per referral

System Level:
├─ Total users
├─ Total purchases
├─ Total revenue
├─ Average credits per user
├─ Conversion rate
├─ Popular courses
├─ Referral effectiveness
└─ Revenue per user

Course Level:
├─ Total purchases
├─ Revenue generated
├─ Average rating
├─ Purchase frequency
└─ Credits awarded
```

This comprehensive flowchart shows the complete journey from user signup through multiple purchases, including all database operations, credit calculations, and dashboard updates!
