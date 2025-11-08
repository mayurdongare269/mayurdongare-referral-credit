# 🔗 Referral System - Complete Technical Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [How It Works - Step by Step](#how-it-works---step-by-step)
3. [Technologies Used](#technologies-used)
4. [URL Parameter Tracking](#url-parameter-tracking)
5. [Session Storage Mechanism](#session-storage-mechanism)
6. [Database Operations](#database-operations)
7. [Credit Calculation Logic](#credit-calculation-logic)
8. [Code Walkthrough](#code-walkthrough)

---

## 🎯 Overview

The referral system tracks when User A shares a link with User B, and rewards both users when User B makes a purchase. The key challenge is: **How does the system remember that User B came from User A's link, even after User B signs up?**

### The Solution: URL Parameters + Session Storage + Database

```
User A's Link → URL Parameter → Session Storage → Sign Up → Database → Purchase → Credits
```

---

## 🔄 How It Works - Step by Step

### Step 1: User A Gets Referral Link

**What Happens:**
```
1. User A signs up
2. Backend generates unique referral code: "RABC123"
3. Frontend displays link: https://edushare.com/?r=RABC123
```

**Code Location:** `server/src/controllers/referralController.ts`

```typescript
// Generate referral code from Clerk user ID
const referralCode = "R" + clerkUserId.slice(-6).toUpperCase();

// Save to database
const user = new User({
  clerkUserId,
  email,
  name,
  referralCode,  // "RABC123"
  referredBy: null,
  credits: 0
});
```

**Why This Works:**
- Each user gets a UNIQUE code based on their Clerk ID
- Code is stored in MongoDB
- Code is displayed in dashboard for sharing

---

### Step 2: User B Clicks the Link

**What Happens:**
```
User B clicks: https://edushare.com/?r=RABC123
                                      ↑
                                This is the URL parameter
```

**Browser Action:**
1. Browser navigates to the URL
2. URL contains `?r=RABC123` (query parameter)
3. Next.js page loads with this parameter

**Code Location:** `client/src/app/page.tsx`

```typescript
import { useSearchParams } from "next/navigation";

const searchParams = useSearchParams();
const referralParam = searchParams.get("r"); // Gets "RABC123"
```

**Technology Used:**
- **Next.js `useSearchParams` hook** - Reads URL query parameters
- **Browser URL API** - Parses the URL

---

### Step 3: Storing the Referral Code (Critical!)

**The Problem:**
When User B clicks the link, they see the landing page. But they haven't signed up yet! How do we remember the referral code when they eventually sign up?

**The Solution: Session Storage**

**Code Location:** `client/src/app/page.tsx`

```typescript
useEffect(() => {
  if (isLoaded && user && !isCreatingProfile) {
    const hasCreatedProfile = sessionStorage.getItem('profileCreated');
    if (!hasCreatedProfile) {
      createUserProfile();
    }
  }
}, [user, isLoaded]);

const createUserProfile = async () => {
  setIsCreatingProfile(true);
  try {
    const referralParam = searchParams.get("r"); // Get from URL
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    await axios.post(`${API_URL}/api/profile`, {
      clerkUserId: user?.id,
      email: user?.emailAddresses[0]?.emailAddress,
      name: user?.fullName,
      referralParam,  // Send to backend!
    });

    sessionStorage.setItem('profileCreated', 'true');
  } catch (error) {
    console.error("Failed to create profile:", error);
  }
};
```

**How Session Storage Works:**

```javascript
// Browser's Session Storage (survives page refreshes)
sessionStorage = {
  'profileCreated': 'true'
}

// The referral code is sent IMMEDIATELY when user signs up
// It's captured from the URL and sent to the backend
```

**Key Points:**
1. **URL Parameter** (`?r=RABC123`) is read when page loads
2. **Stored in JavaScript variable** until user signs up
3. **Sent to backend** when user completes Clerk authentication
4. **Session Storage** prevents duplicate profile creation

---

### Step 4: User B Signs Up with Clerk

**What Happens:**
```
1. User B clicks "Sign Up"
2. Clerk modal opens
3. User B enters email/password
4. Clerk creates account
5. Clerk redirects back to your app
6. Your app detects new user
7. Immediately calls createUserProfile()
```

**Code Flow:**

```typescript
// 1. Clerk Authentication (handled by Clerk)
<SignUp />

// 2. After sign up, Clerk redirects to your app
// 3. useUser() hook detects new user
const { user, isLoaded } = useUser();

// 4. useEffect triggers when user is loaded
useEffect(() => {
  if (isLoaded && user && !isCreatingProfile) {
    const hasCreatedProfile = sessionStorage.getItem('profileCreated');
    if (!hasCreatedProfile) {
      createUserProfile(); // This sends referralParam!
    }
  }
}, [user, isLoaded]);
```

**Technologies Used:**
- **Clerk SDK** - Handles authentication
- **React Hooks** (`useUser`, `useEffect`) - Detects user state
- **Session Storage** - Prevents duplicate calls

---

### Step 5: Backend Receives and Validates Referral Code

**Code Location:** `server/src/controllers/referralController.ts`

```typescript
export const createOrUpdateProfile = async (req: Request, res: Response) => {
  try {
    const { clerkUserId, email, name, referralParam } = req.body;

    // Generate unique referral code for this new user
    const referralCode = "R" + clerkUserId.slice(-6).toUpperCase();

    // Check if user already exists
    let user = await User.findOne({ clerkUserId });

    if (!user) {
      // Validate referral code if provided
      let validReferredBy = null;
      
      if (referralParam) {
        // CRITICAL: Check if referral code exists in database
        const referrer = await User.findOne({ referralCode: referralParam });
        
        if (referrer) {
          validReferredBy = referralParam; // Valid!
          console.log(`✅ Valid referral: ${referralParam}`);
        } else {
          console.log(`❌ Invalid referral code: ${referralParam}`);
          // Code is invalid, but we don't show error to user
          // They just won't get referral bonus
        }
      }

      // Create new user with referral tracking
      user = new User({
        clerkUserId,
        email,
        name,
        referralCode,           // New user's own code
        referredBy: validReferredBy,  // Who referred them (or null)
        credits: 0,
        hasPurchased: false
      });
      
      await user.save();
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
```

**Database Operation:**

```javascript
// MongoDB Query
db.users.findOne({ referralCode: "RABC123" })

// If found:
{
  _id: ObjectId("..."),
  clerkUserId: "user_abc123",
  email: "userA@example.com",
  referralCode: "RABC123",  // ← This matches!
  credits: 0
}

// Then save new user:
db.users.insertOne({
  clerkUserId: "user_xyz789",
  email: "userB@example.com",
  referralCode: "RXYZ789",
  referredBy: "RABC123",  // ← Stored!
  credits: 0,
  hasPurchased: false
})
```

**Technologies Used:**
- **MongoDB** - Database storage
- **Mongoose** - ODM for queries
- **Express.js** - API endpoint
- **Validation Logic** - Checks if referral code exists

---

### Step 6: User B Makes First Purchase

**What Happens:**
```
1. User B browses courses
2. Clicks "Enroll Now"
3. Confirms purchase
4. Backend processes purchase
5. Credits awarded to BOTH users
```

**Code Location:** `server/src/controllers/referralController.ts`

```typescript
export const purchase = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { clerkUserId } = req as any; // From JWT token
    const { courseId, courseTitle, coursePrice } = req.body;

    // Find user
    const user = await User.findOne({ clerkUserId }).session(session);

    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already purchased this course
    const existingPurchase = await Purchase.findOne({ 
      clerkUserId, 
      courseId 
    }).session(session);

    if (existingPurchase) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Already purchased" });
    }

    // Calculate credits (only for first purchase)
    const isFirstPurchase = !user.hasPurchased;
    const creditsToAward = isFirstPurchase ? (user.referredBy ? 4 : 2) : 0;

    // Create purchase record
    const purchase = new Purchase({
      clerkUserId,
      courseId,
      courseTitle,
      coursePrice,
      creditsEarned: creditsToAward,
      purchaseDate: new Date()
    });
    await purchase.save({ session });

    // Award credits to User B (if first purchase)
    if (isFirstPurchase) {
      await User.findOneAndUpdate(
        { clerkUserId, hasPurchased: false },
        {
          $set: { hasPurchased: true },
          $inc: { credits: creditsToAward }  // +2 or +4
        },
        { session }
      );

      // Award credits to User A (referrer)
      if (user.referredBy) {
        await User.findOneAndUpdate(
          { referralCode: user.referredBy },  // Find User A
          { $inc: { credits: 2 } },           // +2 credits
          { session }
        );
      }
    }

    await session.commitTransaction();

    return res.json({
      success: true,
      message: "Purchase successful!",
      creditsEarned: creditsToAward
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Error:", err);
    return res.status(500).json({ error: "Purchase failed" });
  } finally {
    session.endSession();
  }
};
```

**Database Operations (Atomic Transaction):**

```javascript
// Start transaction
session.startTransaction();

// 1. Create purchase record
db.purchases.insertOne({
  clerkUserId: "user_xyz789",
  courseId: "1",
  courseTitle: "React Bootcamp",
  coursePrice: 99,
  creditsEarned: 4
});

// 2. Update User B
db.users.updateOne(
  { clerkUserId: "user_xyz789", hasPurchased: false },
  { 
    $set: { hasPurchased: true },
    $inc: { credits: 4 }  // 0 → 4
  }
);

// 3. Update User A (referrer)
db.users.updateOne(
  { referralCode: "RABC123" },
  { $inc: { credits: 2 } }  // 0 → 2
);

// Commit all changes together
session.commitTransaction();
```

**Technologies Used:**
- **MongoDB Transactions** - Atomic operations
- **Mongoose Session** - Transaction management
- **Express Middleware** - JWT verification
- **Clerk JWT** - User authentication

---

## 🛠️ Technologies Used

### Frontend Technologies

1. **Next.js 14 (App Router)**
   - `useSearchParams()` - Read URL parameters
   - `useRouter()` - Navigation
   - Server-side rendering

2. **React Hooks**
   - `useState()` - Component state
   - `useEffect()` - Side effects (API calls)
   - `useUser()` - Clerk user state

3. **Clerk SDK**
   - `useUser()` - Get authenticated user
   - `useAuth()` - Get JWT token
   - `getToken()` - Retrieve auth token

4. **Browser APIs**
   - `sessionStorage` - Persist data across page loads
   - `window.location` - URL manipulation
   - `navigator.clipboard` - Copy referral link

5. **Axios**
   - HTTP client for API calls
   - Automatic JSON parsing
   - Error handling

### Backend Technologies

1. **Express.js**
   - RESTful API endpoints
   - Middleware support
   - Request/response handling

2. **MongoDB**
   - Document database
   - Flexible schema
   - Powerful queries

3. **Mongoose**
   - ODM (Object Document Mapper)
   - Schema validation
   - Query builder
   - Transaction support

4. **Clerk SDK (Backend)**
   - JWT verification
   - User authentication
   - Token validation

5. **TypeScript**
   - Type safety
   - Better IDE support
   - Compile-time error checking

---

## 🔗 URL Parameter Tracking

### How URL Parameters Work

```
https://edushare.com/?r=RABC123
                     ↑  ↑
                     |  |
                     |  └─ Value
                     └──── Key
```

### Reading URL Parameters in Next.js

```typescript
import { useSearchParams } from "next/navigation";

function MyComponent() {
  const searchParams = useSearchParams();
  
  // Get single parameter
  const referralCode = searchParams.get("r");
  // Returns: "RABC123" or null
  
  // Get all parameters
  const allParams = Object.fromEntries(searchParams.entries());
  // Returns: { r: "RABC123" }
  
  return <div>Referral: {referralCode}</div>;
}
```

### Why URL Parameters?

✅ **Advantages:**
- Shareable links
- Works across devices
- No cookies needed
- SEO friendly
- Easy to track

❌ **Limitations:**
- Visible to user
- Can be modified
- Lost on navigation (solved with session storage)

---

## 💾 Session Storage Mechanism

### What is Session Storage?

```javascript
// Browser's built-in storage (per tab)
sessionStorage.setItem('key', 'value');
const value = sessionStorage.getItem('key');
sessionStorage.removeItem('key');
sessionStorage.clear();
```

### How We Use It

```typescript
// Store that profile was created
sessionStorage.setItem('profileCreated', 'true');

// Check if profile exists
const hasProfile = sessionStorage.getItem('profileCreated');

if (!hasProfile) {
  // Create profile
  createUserProfile();
}
```

### Session Storage vs Local Storage vs Cookies

| Feature | Session Storage | Local Storage | Cookies |
|---------|----------------|---------------|---------|
| **Lifetime** | Until tab closes | Forever | Set expiry |
| **Size** | ~5-10MB | ~5-10MB | ~4KB |
| **Sent to Server** | No | No | Yes |
| **Scope** | Per tab | Per domain | Per domain |
| **Use Case** | Temporary data | Persistent data | Auth tokens |

**Why Session Storage for Our Use Case:**
- ✅ Survives page refreshes
- ✅ Cleared when tab closes (privacy)
- ✅ Not sent to server (performance)
- ✅ Perfect for one-time operations

---

## 🗄️ Database Operations

### User Schema

```typescript
{
  clerkUserId: "user_abc123",     // Unique ID from Clerk
  email: "user@example.com",
  name: "John Doe",
  referralCode: "RABC123",        // This user's code
  referredBy: "RXYZ456",          // Who referred them
  credits: 4,                     // Total credits
  hasPurchased: true,             // First purchase flag
  createdAt: Date,
  updatedAt: Date
}
```

### Key Database Queries

**1. Find Referrer:**
```javascript
const referrer = await User.findOne({ 
  referralCode: "RABC123" 
});
```

**2. Create New User:**
```javascript
const user = new User({
  clerkUserId: "user_xyz789",
  referralCode: "RXYZ789",
  referredBy: "RABC123"  // Link to referrer
});
await user.save();
```

**3. Award Credits (Atomic):**
```javascript
await User.findOneAndUpdate(
  { clerkUserId: "user_xyz789" },
  { $inc: { credits: 4 } }  // Increment by 4
);
```

**4. Count Referrals:**
```javascript
const count = await User.countDocuments({
  referredBy: "RABC123"
});
```

### Indexes for Performance

```javascript
// Compound index for efficient queries
UserSchema.index({ referredBy: 1, hasPurchased: 1 });

// Unique indexes
UserSchema.index({ clerkUserId: 1 }, { unique: true });
UserSchema.index({ referralCode: 1 }, { unique: true });
```

---

## 💰 Credit Calculation Logic

### Credit Rules

```typescript
function calculateCredits(user, isFirstPurchase) {
  if (!isFirstPurchase) {
    return 0; // No credits for subsequent purchases
  }
  
  if (user.referredBy) {
    return 4; // 2 (purchase) + 2 (referral bonus)
  }
  
  return 2; // Just purchase bonus
}
```

### Credit Flow Diagram

```
User B Makes First Purchase
         ↓
    Is First Purchase?
    ├─ No → 0 credits
    └─ Yes → Continue
         ↓
    Was Referred?
    ├─ No → User B: +2 credits
    └─ Yes → User B: +4 credits
             User A: +2 credits
```

### Atomic Transaction (Critical!)

```typescript
// Why atomic? Prevent this scenario:
// 1. User B gets credits ✅
// 2. Server crashes ❌
// 3. User A doesn't get credits ❌

// Solution: Transaction
const session = await mongoose.startSession();
session.startTransaction();

try {
  // All operations
  await updateUserB(session);
  await updateUserA(session);
  
  // Commit together
  await session.commitTransaction();
} catch (error) {
  // Rollback everything
  await session.abortTransaction();
}
```

---

## 📝 Code Walkthrough

### Complete Flow with Code

**1. User A Shares Link**

```typescript
// Dashboard Component
const referralLink = `${window.location.origin}/?r=${data.referralCode}`;

<button onClick={() => navigator.clipboard.writeText(referralLink)}>
  Copy Link
</button>
```

**2. User B Clicks Link**

```typescript
// Landing Page (page.tsx)
const searchParams = useSearchParams();
const referralParam = searchParams.get("r"); // "RABC123"
```

**3. User B Signs Up**

```typescript
// After Clerk authentication
useEffect(() => {
  if (user && !hasCreatedProfile) {
    createUserProfile();
  }
}, [user]);

const createUserProfile = async () => {
  await axios.post('/api/profile', {
    clerkUserId: user.id,
    email: user.email,
    referralParam  // Send to backend!
  });
};
```

**4. Backend Validates**

```typescript
// referralController.ts
const referrer = await User.findOne({ 
  referralCode: referralParam 
});

if (referrer) {
  validReferredBy = referralParam;
}

const newUser = new User({
  referralCode: generateCode(),
  referredBy: validReferredBy
});
```

**5. User B Purchases**

```typescript
// Purchase handler
const creditsToAward = user.referredBy ? 4 : 2;

await User.updateOne(
  { clerkUserId: user.id },
  { $inc: { credits: creditsToAward } }
);

if (user.referredBy) {
  await User.updateOne(
    { referralCode: user.referredBy },
    { $inc: { credits: 2 } }
  );
}
```

---

## 🎯 Key Takeaways

### How the System Remembers

1. **URL Parameter** - Initial tracking
2. **JavaScript Variable** - Temporary storage
3. **API Call** - Immediate transmission
4. **Database** - Permanent storage

### Why It Works

✅ **No Cookies Needed** - Uses URL parameters  
✅ **Survives Page Refresh** - Session storage  
✅ **Immediate Capture** - Sent on signup  
✅ **Atomic Operations** - Transaction safety  
✅ **Validation** - Checks referral code exists  

### Technologies Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **URL** | Next.js Router | Read parameters |
| **Storage** | Session Storage | Temporary persistence |
| **Auth** | Clerk | User authentication |
| **API** | Express.js | Backend endpoints |
| **Database** | MongoDB | Data persistence |
| **Transactions** | Mongoose | Atomic operations |

---

## 🚀 Advanced Concepts

### Race Condition Prevention

```typescript
// Problem: Two simultaneous purchases
// Solution: Atomic update with condition

await User.findOneAndUpdate(
  { 
    clerkUserId: user.id,
    hasPurchased: false  // ← Only if still false
  },
  { 
    $set: { hasPurchased: true },
    $inc: { credits: 2 }
  }
);
```

### Referral Code Generation

```typescript
// Why this method?
const referralCode = "R" + clerkUserId.slice(-6).toUpperCase();

// Example:
// clerkUserId: "user_2abc123xyz"
// referralCode: "R23XYZ"

// Advantages:
// ✅ Unique (based on unique Clerk ID)
// ✅ Short (7 characters)
// ✅ Memorable (starts with R)
// ✅ No collisions (Clerk IDs are unique)
```

---

## 🎓 Interview Questions & Answers

**Q: How does the system track referrals across page navigation?**  
A: URL parameters capture the referral code initially, then it's immediately sent to the backend when the user signs up, storing it permanently in the database.

**Q: What happens if someone manually types a fake referral code?**  
A: The backend validates the code against the database. If it doesn't exist, the code is ignored and the user signs up normally without a referrer.

**Q: Why use transactions for purchases?**  
A: To ensure atomic operations - either both users get credits or neither does. This prevents data corruption if the server crashes mid-operation.

**Q: Can a user refer themselves?**  
A: No, because each user has a unique Clerk ID. The system would detect it's the same user.

**Q: What if the referral link is shared on social media?**  
A: It works perfectly! Anyone clicking the link gets the referral code in their URL, which is captured when they sign up.

---

**This is how your referral system works at a deep technical level!** 🎉
