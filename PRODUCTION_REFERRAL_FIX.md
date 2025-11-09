# 🔧 Production Referral Fix Guide

## 🐛 Problem

Referral links showing `undefined` in production:
- URL: `https://mayurdongare-referral-credit.vercel.app/?r=undefined`
- Dashboard not loading referral code properly
- Worked fine on localhost

## ✅ Fixes Applied

### 1. **Enhanced CORS Configuration** (`server/src/app.ts`)

**Before:**
```typescript
app.use(cors());
```

**After:**
```typescript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### 2. **Added Comprehensive Logging**

**Backend (`server/src/controllers/referralController.ts`):**
- ✅ Profile creation logging
- ✅ Dashboard data logging
- ✅ Referral code generation logging
- ✅ Error details logging

**Frontend (`client/src/app/dashboard/page.tsx`):**
- ✅ API URL logging
- ✅ Token verification logging
- ✅ Response data logging
- ✅ Error details logging

### 3. **Improved Error Handling**

- Better error messages
- Detailed console logs
- Response data validation

## 🚀 Deployment Steps

### Step 1: Commit and Push Changes

```bash
# Add all modified files
git add server/src/app.ts server/src/controllers/referralController.ts client/src/app/dashboard/page.tsx

# Commit
git commit -m "fix: enhance referral system for production

- Add proper CORS configuration
- Add comprehensive logging for debugging
- Improve error handling and messages
- Fix referral code undefined issue"

# Push
git push origin main
```

### Step 2: Verify Environment Variables

#### Railway (Backend)
```env
MONGODB_URI=mongodb+srv://...
CLERK_SECRET_KEY=sk_...
PORT=4000
CORS_ORIGIN=https://mayurdongare-referral-credit.vercel.app
NODE_ENV=production
```

#### Vercel (Frontend)
```env
NEXT_PUBLIC_API_URL=https://mayurdongare-referral-credit-production.up.railway.app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### Step 3: Check Logs

#### Railway Logs
1. Go to Railway dashboard
2. Click on your service
3. Go to "Deployments" tab
4. Click "View Logs"
5. Look for:
   ```
   ✅ MongoDB connected successfully
   🚀 Server listening on 4000
   🔒 CORS Origin: https://mayurdongare-referral-credit.vercel.app
   ```

#### Vercel Logs
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click on latest deployment
5. Click "Functions" tab to see logs

### Step 4: Test the Fix

1. **Open Browser Console** (F12)
2. **Navigate to Dashboard**
3. **Check Console Logs:**
   ```
   📊 Fetching dashboard data from: https://...
   ✅ Token obtained, making API calls...
   📥 Dashboard response: {...}
   ✅ Setting dashboard data: {referralCode: "RABC123", ...}
   ```

4. **Verify Referral Link:**
   - Should show: `https://mayurdongare-referral-credit.vercel.app/?r=RABC123`
   - NOT: `.../?r=undefined`

## 🔍 Debugging Guide

### If Referral Code is Still Undefined

#### Check 1: User Profile Created?

**Backend Logs Should Show:**
```
👤 Profile creation request: {clerkUserId: "user_...", email: "..."}
🔑 Generated referral code: RABC123
✅ New user created: user@example.com with referral code: RABC123
```

**If Not Seen:**
- Profile creation failed
- Check MongoDB connection
- Check Clerk authentication

#### Check 2: Dashboard API Response

**Frontend Console Should Show:**
```javascript
📥 Dashboard response: {
  success: true,
  data: {
    referralCode: "RABC123",  // ← Should NOT be undefined
    credits: 0,
    referredUsers: 0,
    convertedUsers: 0
  }
}
```

**If referralCode is undefined:**
- User not found in database
- Profile creation failed
- MongoDB query issue

#### Check 3: API URL Correct?

**Frontend Console Should Show:**
```
📊 Fetching dashboard data from: https://mayurdongare-referral-credit-production.up.railway.app
```

**If showing localhost:**
- `NEXT_PUBLIC_API_URL` not set in Vercel
- Need to redeploy frontend

### Common Issues & Solutions

#### Issue 1: CORS Error
**Symptom:** 
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Check `CORS_ORIGIN` in Railway
2. Should be: `https://mayurdongare-referral-credit.vercel.app`
3. NO trailing slash
4. Redeploy backend

#### Issue 2: 404 User Not Found
**Symptom:**
```
❌ User not found: user_abc123
```

**Solution:**
1. Profile not created on signup
2. Check `client/src/app/page.tsx` - profile creation logic
3. Ensure `createUserProfile()` is called after Clerk signup

#### Issue 3: Token Issues
**Symptom:**
```
❌ No authentication token available
```

**Solution:**
1. Clerk keys mismatch
2. Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in Vercel
3. Check `CLERK_SECRET_KEY` in both Vercel and Railway
4. Must be same Clerk account

#### Issue 4: MongoDB Connection
**Symptom:**
```
❌ Failed to connect to MongoDB
```

**Solution:**
1. Check `MONGODB_URI` in Railway
2. Verify MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
3. Check database user permissions

## 📊 Expected Flow

### Successful User Journey

```
1. User Signs Up with Clerk
   ↓
2. Frontend calls POST /api/profile
   Backend logs: 👤 Profile creation request
   Backend logs: 🔑 Generated referral code: RABC123
   Backend logs: ✅ New user created
   ↓
3. User Redirected to Dashboard
   ↓
4. Frontend calls GET /api/dashboard
   Backend logs: 📊 Dashboard request for user: user_abc123
   Backend logs: ✅ User found: user@example.com, Referral Code: RABC123
   Backend logs: 📤 Sending dashboard data
   ↓
5. Frontend receives data
   Console: 📥 Dashboard response: {success: true, data: {...}}
   Console: ✅ Setting dashboard data: {referralCode: "RABC123"}
   ↓
6. Referral Link Displayed
   https://mayurdongare-referral-credit.vercel.app/?r=RABC123
```

## 🧪 Testing Checklist

After deployment:

- [ ] Backend logs show MongoDB connected
- [ ] Backend logs show CORS origin set
- [ ] Frontend can reach backend API
- [ ] User profile created on signup
- [ ] Dashboard loads without errors
- [ ] Referral code is NOT undefined
- [ ] Referral link is complete and correct
- [ ] Copy link button works
- [ ] Referral link can be shared
- [ ] New user can sign up with referral link
- [ ] Credits awarded correctly

## 🎯 Success Criteria

✅ **Referral Link Format:**
```
https://mayurdongare-referral-credit.vercel.app/?r=RABC123
```

✅ **Dashboard Shows:**
- Referral Code: RABC123
- Credits: 0 (or earned amount)
- Referred Users: count
- Converted Users: count

✅ **Console Logs Show:**
- No errors
- Successful API calls
- Data loaded correctly

## 📞 Quick Fixes

### Force Profile Recreation

If user exists but has no referral code:

1. Delete user from MongoDB Atlas
2. Sign out from app
3. Sign in again
4. Profile will be recreated with referral code

### Clear Browser Cache

Sometimes old data is cached:

1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Redeploy Services

If changes not reflecting:

**Railway:**
```bash
# Trigger redeploy
git commit --allow-empty -m "Trigger Railway redeploy"
git push origin main
```

**Vercel:**
- Go to Vercel dashboard
- Click "Redeploy"
- Or push to main branch

## 🎉 Expected Result

After applying these fixes:

✅ Referral links work correctly in production
✅ No more `undefined` in URLs
✅ Credits system functions properly
✅ Comprehensive logging for debugging
✅ Better error handling

**Your referral system should now work perfectly in production!** 🚀
