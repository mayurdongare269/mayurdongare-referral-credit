# 💰 Credit System Explained

## How Credits Work

### Credit Rules

1. **First Purchase Bonus:** Everyone gets **2 credits** for their first course purchase
2. **Referral Bonus:** If you signed up using a referral link, you get **+2 additional credits** (total 4)
3. **Referrer Reward:** When someone you referred makes their first purchase, you get **2 credits**

---

## Scenarios

### Scenario 1: Direct Sign-Up (No Referral)

**User A signs up directly (no referral link)**

1. User A signs up → Gets referral code
2. User A purchases first course → **Earns 2 credits**
3. Total: **2 credits**

```
User A: 2 credits (first purchase bonus)
```

---

### Scenario 2: Referred Sign-Up

**User B signs up using User A's referral link**

1. User A shares referral link
2. User B signs up using the link → Tracked as referred by User A
3. User B purchases first course → **Earns 4 credits**
   - 2 credits: First purchase bonus
   - 2 credits: Referral bonus
4. User A automatically gets **2 credits** (referrer reward)

```
User A: 2 credits (referrer reward)
User B: 4 credits (2 first purchase + 2 referral bonus)
```

---

## Complete Example Flow

### Step 1: User A Signs Up
```
User A:
- Signs up directly
- Gets referral code: RH5IA99
- Credits: 0
```

### Step 2: User A Makes First Purchase
```
User A:
- Purchases "Full Stack Web Development"
- Earns: 2 credits (first purchase bonus)
- Total Credits: 2
```

### Step 3: User A Shares Referral Link
```
User A shares: http://localhost:3000/?r=RH5IA99
```

### Step 4: User B Signs Up with Referral
```
User B:
- Clicks User A's referral link
- Signs up with referral code: RH5IA99
- Gets own referral code: RABC123
- Credits: 0
- Referred by: RH5IA99 (User A)
```

### Step 5: User B Makes First Purchase
```
User B:
- Purchases "UI/UX Design Course"
- Earns: 4 credits
  ✓ 2 credits: First purchase bonus
  ✓ 2 credits: Referral bonus (because signed up via referral)
- Total Credits: 4

User A (automatically):
- Earns: 2 credits (referrer reward)
- Total Credits: 4 (2 from own purchase + 2 from User B)
```

### Step 6: User C Signs Up with User B's Referral
```
User C:
- Uses User B's link: http://localhost:3000/?r=RABC123
- Signs up
- Purchases course
- Earns: 4 credits (2 first purchase + 2 referral bonus)

User B (automatically):
- Earns: 2 more credits (referrer reward)
- Total Credits: 6 (4 from own purchase + 2 from User C)
```

---

## Credit Breakdown Table

| User | Signed Up Via | First Purchase | Referral Bonus | Referrer Reward | Total Credits |
|------|---------------|----------------|----------------|-----------------|---------------|
| User A | Direct | ✅ 2 credits | ❌ 0 | ✅ 2 (from B) | **4 credits** |
| User B | User A's link | ✅ 2 credits | ✅ 2 credits | ✅ 2 (from C) | **6 credits** |
| User C | User B's link | ✅ 2 credits | ✅ 2 credits | ❌ 0 | **4 credits** |

---

## Important Notes

### ✅ Credits ARE Awarded For:
- Your first course purchase (2 credits)
- Being referred by someone (2 additional credits)
- When someone you referred makes their first purchase (2 credits)

### ❌ Credits ARE NOT Awarded For:
- Second or subsequent purchases
- Referring yourself
- Invalid referral codes

### 🔒 Security Features:
- Atomic transactions prevent double-crediting
- Can only earn credits once per purchase
- Referral relationship locked at sign-up
- Cannot change referrer after registration

---

## Testing the System

### Test 1: Direct Purchase (No Referral)
```
1. Sign up as alice@example.com
2. Purchase any course
3. Check dashboard: Should show 2 credits ✅
```

### Test 2: Referred Purchase
```
1. Sign up as alice@example.com
2. Copy Alice's referral link
3. Open incognito window
4. Use Alice's referral link
5. Sign up as bob@example.com
6. Purchase any course
7. Check Bob's dashboard: Should show 4 credits ✅
8. Check Alice's dashboard: Should show 2 credits ✅
```

### Test 3: Chain Referrals
```
1. Alice refers Bob → Bob purchases → Alice: 2, Bob: 4
2. Bob refers Charlie → Charlie purchases → Bob: 6, Charlie: 4
3. Charlie refers Diana → Diana purchases → Charlie: 6, Diana: 4
```

---

## Dashboard Display

### Your Dashboard Shows:
- **Total Credits:** All credits you've earned
- **Referred Users:** How many people signed up with your link
- **Converted Users:** How many of your referrals made a purchase
- **Conversion Rate:** (Converted / Referred) × 100%

### Example Dashboard:
```
Total Credits: 6
Referred Users: 3
Converted Users: 2
Conversion Rate: 67%

Breakdown:
- Your first purchase: 2 credits
- Referral bonus (if applicable): 2 credits
- Referrer rewards: 2 credits (from 2 converted referrals)
```

---

## Credit Calculation Formula

```javascript
// For the purchaser
if (isFirstPurchase) {
  credits = 2; // Base first purchase bonus
  
  if (wasReferred) {
    credits += 2; // Referral bonus
  }
  
  totalCredits = credits; // 2 or 4
}

// For the referrer (if purchaser was referred)
if (purchaserWasReferred) {
  referrerCredits += 2; // Referrer reward
}
```

---

## FAQ

### Q: Why did I only get 2 credits when I was referred?
**A:** Make sure you signed up using the referral link BEFORE making your first purchase. The referral relationship is set at sign-up.

### Q: Can I get more credits from the same person?
**A:** No, credits are only awarded for the FIRST purchase. Subsequent purchases don't earn credits.

### Q: What if my referral link doesn't work?
**A:** Make sure:
- The link includes `?r=YOUR_CODE`
- The person uses it BEFORE signing up
- They sign up with a different email
- They're in an incognito window or different browser

### Q: Can I refer multiple people?
**A:** Yes! You can refer unlimited people. Each one who makes a purchase earns you 2 credits.

### Q: Do credits expire?
**A:** No, credits never expire. They stay in your account forever.

---

## Summary

**Simple Version:**
- Buy your first course → Get 2 credits
- Sign up with a referral link → Get 4 credits on first purchase (2 + 2 bonus)
- Someone uses your referral link and buys → You get 2 credits

**Everyone wins! 🎉**
