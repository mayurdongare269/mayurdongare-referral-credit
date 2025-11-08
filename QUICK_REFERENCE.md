# Quick Reference Guide - Purchased Courses Feature

## 🚀 Quick Start

### Test the Feature (5 minutes)

1. **Start the servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

2. **Create User A (Referrer)**
   - Visit http://localhost:3000
   - Click "Sign Up"
   - Complete registration
   - Go to Dashboard
   - Copy referral link

3. **Create User B (Referred)**
   - Open incognito/private window
   - Paste referral link
   - Click "Sign Up"
   - Complete registration

4. **Make First Purchase (User B)**
   - Go to Courses page
   - Click "Buy Now" on any course
   - Confirm purchase
   - Check dashboard → See 4 credits + purchased course

5. **Check Referrer (User A)**
   - Go to User A's dashboard
   - See 2 credits
   - See 1 referred user, 1 converted

6. **Make Second Purchase (User B)**
   - Go to Courses page
   - Buy another course
   - Check dashboard → Still 4 credits, but 2 courses shown

## 📡 API Quick Reference

### Create Profile
```bash
POST /api/profile
Body: { clerkUserId, email, name, referralParam }
Auth: None
```

### Purchase Course
```bash
POST /api/purchase
Body: { courseId, courseTitle, coursePrice }
Auth: Bearer token
```

### Get Dashboard
```bash
GET /api/dashboard
Auth: Bearer token
```

### Get Purchases
```bash
GET /api/purchases
Auth: Bearer token
```

## 💰 Credit Rules

| Scenario | User Credits | Referrer Credits |
|----------|--------------|------------------|
| Direct signup + first buy | +2 | - |
| Referred signup + first buy | +4 | +2 |
| Any subsequent purchase | 0 | 0 |

## 🗄️ Database Collections

### users
```javascript
{
  clerkUserId: "user_abc123",
  email: "user@example.com",
  name: "John Doe",
  referralCode: "RABC123",
  referredBy: "RXYZ456" | null,
  credits: 4,
  hasPurchased: true
}
```

### purchases
```javascript
{
  clerkUserId: "user_abc123",
  courseId: "1",
  courseTitle: "React Bootcamp",
  coursePrice: 99,
  creditsEarned: 4,
  purchaseDate: "2024-01-15T10:35:00.000Z"
}
```

## 🔍 Common Issues & Solutions

### Issue: "User not found"
**Solution:** User profile not created. Call POST /api/profile first.

### Issue: "Already purchased this course"
**Solution:** User already owns this course. Choose a different course.

### Issue: No credits awarded
**Solution:** This is expected for subsequent purchases. Credits only on first purchase.

### Issue: Referrer didn't get credits
**Solution:** Check if:
- Referred user used the referral link during signup
- Referred user made their first purchase
- referredBy field is set correctly

## 📊 Dashboard Sections

1. **Stats Cards**
   - Total Credits
   - Referred Users
   - Converted Users
   - Conversion Rate

2. **Referral Link**
   - Copy button
   - Share button
   - How it works info

3. **Purchased Courses** (NEW)
   - Course title
   - Purchase date
   - Price paid
   - Credits earned
   - View button

4. **Referral Activity**
   - Total referrals
   - Converted count
   - Credits from referrals

5. **Action Cards**
   - Browse Courses
   - First Purchase status

## 🎯 Key Features

✅ Multiple course purchases
✅ Complete purchase history
✅ Credits only on first purchase
✅ Referral bonus tracking
✅ Duplicate prevention
✅ Atomic transactions
✅ Real-time updates

## 📝 File Locations

### Backend
- Model: `server/src/models/Purchase.ts`
- Controller: `server/src/controllers/referralController.ts`
- Routes: `server/src/routes/api.ts`

### Frontend
- Courses: `client/src/app/courses/page.tsx`
- Dashboard: `client/src/app/dashboard/page.tsx`

### Documentation
- System Design: `docs/system-design.md`
- API Docs: `docs/API.md`
- Feature Guide: `PURCHASED_COURSES_FEATURE.md`
- Flowchart: `REFERRAL_SYSTEM_FLOWCHART.md`

## 🧪 Testing Checklist

- [ ] User can sign up
- [ ] Referral code generated
- [ ] Referral link works
- [ ] First purchase awards credits
- [ ] Referrer receives credits
- [ ] Subsequent purchases work
- [ ] No credits on subsequent purchases
- [ ] Dashboard shows all purchases
- [ ] Purchase history sorted correctly
- [ ] Duplicate purchases prevented
- [ ] Error messages clear

## 🎨 UI Components

### Purchase Modal
- Shows course details
- Displays credit info
- Confirm/Cancel buttons

### Course Card
- Course information
- Price display
- Buy button

### Dashboard Card
- Stat display
- Icon
- Animated hover

### Purchased Course Item
- Course title
- Purchase date
- Price
- Credits earned badge
- View button

## 🔐 Security Notes

- All purchase endpoints require authentication
- JWT tokens verified by Clerk
- User ID extracted from token (not request body)
- Atomic transactions prevent race conditions
- Duplicate purchases blocked at database level

## 📈 Next Steps

1. **Add Course Content**
   - Create course detail pages
   - Add video lessons
   - Track progress

2. **Enhance Analytics**
   - Revenue charts
   - Purchase trends
   - Popular courses

3. **Add Features**
   - Course reviews
   - Wishlist
   - Gift courses
   - Bulk discounts

## 💡 Pro Tips

1. **Testing Referrals**
   - Use incognito windows for different users
   - Clear cookies between tests
   - Check both dashboards after purchase

2. **Debugging**
   - Check server console for transaction logs
   - Verify JWT token in browser DevTools
   - Use MongoDB Compass to inspect data

3. **Performance**
   - Dashboard makes parallel API calls
   - Purchases sorted at database level
   - Indexes optimize queries

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review system design docs
3. Check API documentation
4. Inspect browser console
5. Check server logs

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Users can purchase multiple courses
- ✅ Dashboard shows all purchases
- ✅ Credits awarded correctly
- ✅ Referrers receive credits
- ✅ No duplicate purchases
- ✅ Clear error messages
- ✅ Smooth user experience
