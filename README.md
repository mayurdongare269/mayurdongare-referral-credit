# 🎓 EduShare - Referral-Based Learning Platform

A modern, full-stack online learning platform with an integrated referral rewards system. Users can purchase courses, share referral links, and earn credits when their referrals make purchases. Built with Next.js, React, TypeScript, Node.js, Express, and MongoDB.

**Developed by:** Mayur Dongare  
**Project:** FileSure Internship Assignment  
**Year:** 2024

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

### Database

The application uses MongoDB with optimized schemas and indexes for efficient querying. Database models include user profiles, purchases, and referral tracking.

### API Endpoints

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | `/api/profile` | No | User management |
| POST | `/api/purchase` | Yes | Purchase processing |
| GET | `/api/dashboard` | Yes | Analytics data |
| GET | `/api/purchases` | Yes | Purchase history |

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

## 👨‍💻 Author

**Mayur Dongare**
- Project: FileSure Full Stack Developer Internship Assesment
- Year: 2025
- Built with: ❤️ and lots of ☕

## 🙏 Acknowledgments

- FileSure for the internship assesment
- Clerk for authentication services
- MongoDB Atlas for database hosting
- Vercel for deployment platform
- The open-source community

## 📞 Contact

For questions or feedback about this project:
- Create an issue in this repository
- Check the documentation in `/docs`

---

**Note:** This is a demonstration project created for educational purposes. For production deployment, additional security measures, comprehensive testing, and monitoring should be implemented.

## ⭐ Star This Repository

If you found this project helpful or interesting, please consider giving it a star! It helps others discover the project and motivates further development.

**Happy Learning! 🚀**
