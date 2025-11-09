# 🎓 EduShare - Referral-Based Learning Platform

> A modern full-stack learning platform where users earn credits by sharing knowledge. Built with passion for the FileSure Internship Project.

**Transform learning into a rewarding experience** - Purchase courses, share with friends, and earn credits together. EduShare combines education with a smart referral system that benefits everyone.

### 🔗 Live Links

- **Frontend (Vercel):** https://mayurdongare-referral-credit.vercel.app
- **Backend (Railway):** https://mayurdongare-referral-credit-production.up.railway.app
- **Database:** MongoDB Atlas

---

## 📋 What's Inside

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🎯 How It Works](#-how-it-works)
- [🚀 Getting Started](#-getting-started)
- [📸 Screenshots](#-screenshots)
- [🏗️ Architecture](#️-architecture)
- [🔐 Security](#-security)
- [📚 Documentation](#-documentation)

## ✨ Features

### 🎯 Core Features

**For Learners:**
- 📚 Browse 12+ expert-led courses across 6 categories
- 🎓 Enroll in courses with one click
- 📊 Track your learning journey on a beautiful dashboard
- 💰 Earn credits on your first purchase
- 🔗 Get your unique referral link instantly

**For Referrers:**
- 🎁 Earn 2 credits when friends make their first purchase
- 📈 Track referral performance with visual analytics
- 🔄 Unlimited referrals - share as much as you want
- 💯 100% transparent credit system

**User Experience:**
- 🔐 Secure authentication with Clerk
- 📱 Fully responsive - works on all devices
- ⚡ Lightning-fast performance
- 🎨 Beautiful circular progress charts
- 🌙 Clean, modern interface
- 📍 Mobile bottom navigation for easy access

### 🛠️ Technical Highlights

- ⚡ Server-side rendering with Next.js 14
- 🎨 Smooth animations with Framer Motion
- 🛡️ Type-safe with TypeScript throughout
- 🔒 JWT authentication on all protected routes
- 💾 MongoDB with atomic transactions
- 📈 Optimized database queries with indexes
- 🚀 CI/CD pipeline with GitHub Actions
- ☁️ Production-ready deployment

## 🛠️ Tech Stack

### Frontend
```
Next.js 14  •  React 19  •  TypeScript  •  Tailwind CSS
Framer Motion  •  Clerk Auth  •  Axios  •  Zustand
```

### Backend
```
Node.js  •  Express.js  •  TypeScript  •  MongoDB
Mongoose  •  Clerk SDK  •  JWT
```

### DevOps & Tools
```
Vercel  •  Railway  •  MongoDB Atlas  •  GitHub Actions
Git  •  npm  •  ESLint
```

## 🎯 How It Works

### The Referral Journey

```
1️⃣ Sign Up → Get your unique referral code
2️⃣ Share Link → Send to friends via social media, email, etc.
3️⃣ Friend Signs Up → Using your referral link
4️⃣ Friend Purchases → Makes their first course purchase
5️⃣ Both Earn Credits → You get 2, they get 4 credits!
```

### Credit System

| Action | User Credits | Referrer Credits |
|--------|--------------|------------------|
| Direct signup + first purchase | +2 | - |
| Referred signup + first purchase | +4 | +2 |
| Subsequent purchases | 0 | 0 |

**Simple Rule:** Credits are awarded only on the first purchase to keep things fair and transparent.

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

### Database

The application uses MongoDB with optimized schemas and indexes for efficient querying. Database models include user profiles, purchases, and referral tracking.

### API Endpoints

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | `/api/profile` | No | User management |
| POST | `/api/purchase` | Yes | Purchase processing |
| GET | `/api/dashboard` | Yes | Analytics data |
| GET | `/api/purchases` | Yes | Purchase history |

## 📸 Screenshots

### 🏠 Landing Page
Beautiful hero section with clear value proposition and call-to-action buttons.

### 📊 Dashboard
Stunning circular progress charts showing referral performance, credits earned, and conversion rates.

### 📚 Courses Page
Browse 12 courses with visual enrollment badges showing which courses you've already purchased.

### 🎯 Purchase Flow
Smooth purchase experience with clear credit information and confirmation modals.

### 📱 Mobile Experience
Fully responsive design with fixed bottom navigation for easy access on mobile devices.

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

Configure environment files in both `server` and `client` directories with your own credentials

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

Both `server` and `client` directories require environment configuration files.

### Required Services
- MongoDB Atlas account (Database)
- Clerk account (Authentication)

### Configuration Files
- Server: Create `.env` file in `/server` directory
- Client: Create `.env.local` file in `/client` directory

**Note:** Example configuration files (`.env.example`) are provided in respective directories. Configure them according to your service credentials.

## 📚 API Documentation

The platform includes a RESTful API with the following endpoints:

- **POST** `/api/profile` - User profile management
- **POST** `/api/purchase` - Course purchase processing
- **GET** `/api/dashboard` - User statistics and analytics
- **GET** `/api/purchases` - Purchase history

For detailed API documentation, see `/docs/API.md`

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
edushare/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # Reusable React components
│   │   └── store/         # State management
│   └── package.json
│
├── server/                # Express backend API
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API routes
│   │   └── middlewares/  # Custom middlewares
│   └── package.json
│
├── docs/                 # Project documentation
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

## 🎯 Project Highlights

### Key Achievements
- ✅ **Complete Referral System** - Fully functional referral tracking with credit rewards
- ✅ **Beautiful UI** - Modern design with circular progress charts and smooth animations
- ✅ **Multiple Purchases** - Users can purchase multiple courses with proper tracking
- ✅ **Real-time Analytics** - Dashboard with visual performance metrics
- ✅ **Secure & Scalable** - JWT authentication, atomic transactions, database indexes
- ✅ **Well Documented** - Comprehensive documentation and system design

### Technical Highlights
- Atomic MongoDB transactions for data integrity
- Circular progress charts with SVG and Framer Motion
- Responsive design (mobile, tablet, desktop)
- Type-safe with TypeScript throughout
- RESTful API with proper error handling
- Efficient database queries with compound indexes

## 📸 Screenshots

### Dashboard with Circular Charts
Beautiful circular progress indicators showing referral performance metrics.

### Courses Page with Enrollment Status
Visual badges showing which courses are already enrolled.

### Purchase Flow
Smooth purchase experience with clear credit information.

## 🎓 Learning Outcomes

This project demonstrates proficiency in:
- Full-stack web development
- Modern React patterns (hooks, context, state management)
- RESTful API design
- Database design and optimization
- Authentication and authorization
- UI/UX design principles
- Animation and micro-interactions
- Documentation and system design

## 📚 Documentation

Comprehensive documentation available in the `/docs` folder:
- `system-design.md` - Complete system architecture
- `API.md` - API endpoint documentation
- `REFERRAL_SYSTEM_FLOWCHART.md` - Visual flow diagrams
- `CIRCULAR_CHART_DESIGN.md` - UI design specifications

## 🤝 Contributing

This is an internship project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2024 Mayur Dongare

## 👨‍💻 Developed By

**Mayur Dongare**  
B.Tech CSE, KIT's College of Engineering  
📧 Email: mayurdongare269@gmail.com  
🔗 GitHub: [@mayurdongare269](https://github.com/mayurdongare269)  
💼 LinkedIn: [Mayur Dongare](https://www.linkedin.com/in/mayur-dongare-7b813a296)

*Built with dedication for the FileSure Full Stack Developer Internship - 2024*

---

## 🙏 Acknowledgments

Special thanks to:
- **FileSure** for the incredible internship opportunity
- **Clerk** for seamless authentication
- **MongoDB Atlas** for reliable database hosting
- **Vercel & Railway** for smooth deployment
- The **open-source community** for amazing tools

---

## 📞 Get in Touch

Have questions or feedback? I'd love to hear from you!

- 📧 Email: mayurdongare269@gmail.com
- 💼 LinkedIn: [Connect with me](https://www.linkedin.com/in/mayur-dongare-7b813a296)
- 🐙 GitHub: [Follow me](https://github.com/mayurdongare269)

---

## ⭐ Show Your Support

If you found this project interesting or helpful, please consider:
- ⭐ Starring this repository
- 🔄 Sharing it with others
- 💬 Providing feedback

**Thank you for checking out EduShare! Happy Learning! 🚀**
