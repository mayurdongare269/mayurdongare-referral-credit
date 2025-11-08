# 🎓 ReferralHub - Online Course Platform with Referral Credits

A full-stack referral and credit system for a digital course platform. Users can register, share referral links, and earn credits when their referrals make purchases.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Business Logic](#business-logic)
- [Deployment](#deployment)

## ✨ Features

### User Features
- 🔐 Secure authentication with Clerk
- 🔗 Unique referral link for each user
- 💰 Earn 2 credits on first purchase
- 🎁 Earn 2 credits when referrals make their first purchase
- 📊 Real-time dashboard with statistics
- 🛒 Browse and purchase courses
- 📱 Fully responsive design

### Technical Features
- ⚡ Server-side rendering with Next.js 14
- 🎨 Beautiful UI with Tailwind CSS and Framer Motion
- 🔄 Global state management with Zustand
- 🛡️ Type-safe with TypeScript
- 🔒 Secure API with JWT authentication
- 💾 MongoDB with Mongoose ODM
- 🚀 Atomic transactions to prevent double-crediting
- 📈 Efficient database queries with indexes

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Authentication:** Clerk
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Atlas)
- **ODM:** Mongoose
- **Authentication:** Clerk SDK

## 🏗️ System Architecture

### Data Flow

```
User Signs Up → Clerk Auth → Create Profile → Generate Referral Code
                                                      ↓
User A Shares Link → User B Signs Up (with ?r=CODE) → Store referredBy
                                                      ↓
User B Makes Purchase → Award 2 Credits to User B
                     → Award 2 Credits to User A
                     → Update Dashboard Stats
```

### Database Schema

#### User Model
```typescript
{
  clerkUserId: String (unique, indexed)
  email: String (indexed)
  name: String
  referralCode: String (unique, indexed)
  referredBy: String | null (indexed)
  credits: Number (default: 0)
  hasPurchased: Boolean (default: false, indexed)
  createdAt: Date
  updatedAt: Date
}
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/profile` | No | Create/update user profile |
| POST | `/api/purchase` | Yes | Process course purchase |
| GET | `/api/dashboard` | Yes | Get user dashboard data |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Clerk account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd referral-credit-system
```

2. **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Set up environment variables**

Create `.env` files in both `server` and `client` directories (see [Environment Variables](#environment-variables))

4. **Start MongoDB**

Ensure your MongoDB Atlas cluster is running and accessible.

5. **Run the development servers**

```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

6. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 🔐 Environment Variables

### Server (.env)

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/referral-system?retryWrites=true&w=majority

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Server Configuration
PORT=4000
NODE_ENV=development
```

### Client (.env.local)

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 📚 API Documentation

### POST /api/profile

Create or update user profile after Clerk signup.

**Request Body:**
```json
{
  "clerkUserId": "user_xxxxx",
  "email": "user@example.com",
  "name": "John Doe",
  "referralParam": "RABC123" // optional
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "clerkUserId": "user_xxxxx",
    "email": "user@example.com",
    "name": "John Doe",
    "referralCode": "RXXXXX",
    "referredBy": "RABC123",
    "credits": 0,
    "hasPurchased": false
  }
}
```

### POST /api/purchase

Process a course purchase and award credits.

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Purchase successful! You earned 2 credits!",
  "user": {
    "credits": 2,
    "hasPurchased": true
  }
}
```

### GET /api/dashboard

Get user dashboard statistics.

**Headers:**
```
Authorization: Bearer <clerk_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "referralCode": "RXXXXX",
    "credits": 4,
    "referredUsers": 5,
    "convertedUsers": 2,
    "hasPurchased": true,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## 💼 Business Logic

### Referral Flow

1. **User A** signs up and receives referral code `RABC123`
2. **User A** shares link: `https://app.com/?r=RABC123`
3. **User B** clicks link and signs up (referredBy = `RABC123`)
4. **User B** makes first purchase:
   - User B earns **+2 credits**
   - User A earns **+2 credits**
5. Future purchases by User B do **not** generate additional credits

### Credit Rules

- ✅ First purchase only earns credits
- ✅ Both referrer and referred user earn 2 credits each
- ✅ Invalid referral codes are ignored (no error)
- ✅ Self-referrals are prevented (different clerkUserId)
- ✅ Atomic transactions prevent double-crediting
- ✅ Concurrent purchases are handled safely

### Dashboard Metrics

| Metric | Description |
|--------|-------------|
| **Total Credits** | Sum of all credits earned |
| **Referred Users** | Count of users who signed up with your code |
| **Converted Users** | Count of referred users who made a purchase |
| **Conversion Rate** | (Converted / Referred) × 100% |

## 🎨 UI/UX Features

- **Modern Design:** Gradient backgrounds, rounded corners, smooth shadows
- **Animations:** Framer Motion for smooth transitions and hover effects
- **Responsive:** Mobile-first design, works on all screen sizes
- **Accessibility:** Semantic HTML, proper ARIA labels
- **Loading States:** Skeleton screens and spinners
- **Error Handling:** User-friendly error messages
- **Copy to Clipboard:** One-click referral link copying
- **Share API:** Native sharing on mobile devices

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Backend (Render/Railway)

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Database (MongoDB Atlas)

1. Create cluster
2. Add database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get connection string
5. Add to environment variables

## 📊 Project Structure

```
referral-credit-system/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   │   ├── page.tsx   # Landing page
│   │   │   ├── dashboard/ # Dashboard page
│   │   │   └── courses/   # Courses page
│   │   ├── components/    # React components
│   │   │   ├── Navbar.tsx
│   │   │   ├── CourseCard.tsx
│   │   │   ├── DashboardCard.tsx
│   │   │   └── PurchaseModal.tsx
│   │   └── store/         # Zustand store
│   │       └── userStore.ts
│   └── package.json
│
├── server/                # Express backend
│   ├── src/
│   │   ├── config/       # Configuration
│   │   │   └── db.ts     # MongoDB connection
│   │   ├── models/       # Mongoose models
│   │   │   ├── User.ts
│   │   │   └── ReferralActivity.ts
│   │   ├── controllers/  # Route controllers
│   │   │   └── referralController.ts
│   │   ├── middlewares/  # Express middlewares
│   │   │   └── clerkAuth.ts
│   │   ├── routes/       # API routes
│   │   │   └── api.ts
│   │   └── app.ts        # Express app
│   └── package.json
│
├── docs/                 # Documentation
│   ├── system-design.md
│   └── UML-diagram.png
│
└── README.md
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can sign up with Clerk
- [ ] User receives unique referral code
- [ ] Referral link can be copied
- [ ] New user can sign up with referral link
- [ ] First purchase awards 2 credits to buyer
- [ ] First purchase awards 2 credits to referrer
- [ ] Second purchase does not award credits
- [ ] Dashboard shows correct statistics
- [ ] All pages are responsive
- [ ] Error handling works correctly

## 🔒 Security Features

- JWT token verification on protected routes
- Environment variables for sensitive data
- Input validation on all endpoints
- MongoDB injection prevention with Mongoose
- CORS configuration
- Atomic transactions for data integrity
- Password hashing (handled by Clerk)

## 🐛 Troubleshooting

### Common Issues

**Issue:** MongoDB connection fails
- **Solution:** Check MONGODB_URI, whitelist IP, verify credentials

**Issue:** Clerk authentication not working
- **Solution:** Verify API keys, check Clerk dashboard settings

**Issue:** Credits not awarded
- **Solution:** Check server logs, verify transaction completion

**Issue:** Frontend can't connect to backend
- **Solution:** Verify NEXT_PUBLIC_API_URL, check CORS settings

## 📝 License

This project is created for educational purposes as part of the FileSure internship assignment.

## 👨‍💻 Author

Built with ❤️ for the FileSure Full Stack Developer Internship

---

**Note:** This is a demonstration project. For production use, add comprehensive testing, monitoring, and additional security measures.
