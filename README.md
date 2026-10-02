# SkillX — Peer-to-Peer Skill Exchange Platform

SkillX is a production-ready full-stack **MERN (MongoDB, Express.js, React, Node.js)** application designed for students and learners to trade skills directly with one another without paying for courses. 

Users offer a skill they can teach (e.g., React, Java, UI Design) in exchange for one they want to learn, connect via exchange requests, track learning sessions, and earn verifiable certificates of exchange.

---

## 🏗️ Architecture & Tech Stack

```text
USER (Browser)
      │
  [React 18 + Vite]  (Frontend: http://localhost:5173)
      │
   REST APIs (JWT Bearer Token Authentication)
      │
[Express.js + Node.js] (Backend: http://localhost:5001)
      │
   Controllers / Middleware (Bcrypt, JWT, Error Handlers)
      │
   Mongoose ODM
      │
   [MongoDB] (Database: mongodb://127.0.0.1:27017/skillx)
```

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM (v6)
- **State Management**: React Context (`AuthContext`)
- **Styling**: Vanilla CSS with modern custom design system ("Trade Ledger" ticket theme, Fraunces serif typography, IBM Plex Mono, and Inter)
- **API Client**: Centralized Fetch client with automatic JWT token attachment

### Backend
- **Runtime**: Node.js (ES Modules)
- **Server Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
- **Security**: CORS headers, environment isolation, input validation, role & ownership verification

---

## 📁 Project Structure

```text
SkillX/
│
├── frontend/
│   ├── src/
│   │   ├── api/                  # Centralized API client & domain services
│   │   │   ├── client.js         # Base HTTP client with JWT interceptor
│   │   │   ├── authService.js    # Login, register, profile, and skill management
│   │   │   ├── skillService.js   # Skill listings CRUD & search
│   │   │   ├── requestService.js # Exchange requests (accept, decline, complete)
│   │   │   ├── sessionService.js # Session tracking & status toggle
│   │   │   └── certificateService.js # Certificate issuance & retrieval
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.jsx        # Navigation bar with reactive auth state
│   │   │   ├── Footer.jsx        # App footer
│   │   │   ├── ProtectedRoute.jsx# Auth route guard
│   │   │   └── SkillTicket.jsx   # Signature trade ticket card
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global user & auth provider
│   │   ├── pages/                # Views & routes
│   │   │   ├── Landing.jsx       # Hero, explanation, and featured skills
│   │   │   ├── Dashboard.jsx     # Browse & search skills, post exchange, request trade
│   │   │   ├── Login.jsx         # User login form
│   │   │   ├── Register.jsx      # User registration form
│   │   │   ├── Profile.jsx       # Manage user skills offered & wanted (persists to DB)
│   │   │   ├── Requests.jsx      # Incoming & outgoing exchange requests manager
│   │   │   ├── Sessions.jsx      # Interactive session tracker timeline
│   │   │   ├── Certificate.jsx   # Official certificate of skill exchange
│   │   │   └── NotFound.jsx      # 404 page
│   │   ├── App.jsx               # Route definitions & layout wrappers
│   │   ├── index.css             # Design tokens & global stylesheet
│   │   └── main.jsx              # React DOM entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── .env.example
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/              # Request handling & business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── skillController.js
│   │   ├── requestController.js
│   │   ├── sessionController.js
│   │   └── certificateController.js
│   ├── middleware/               # Middleware functions
│   │   ├── auth.js               # JWT verification & route protection
│   │   └── errorHandler.js       # Centralized 404 & error handlers
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js               # User accounts & skills
│   │   ├── Skill.js              # Skill marketplace listings
│   │   ├── Request.js            # Peer-to-peer exchange requests
│   │   ├── Session.js            # Learning sessions
│   │   └── Certificate.js        # Completed trade certificates
│   ├── routes/                   # Express endpoint routers
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── certificateRoutes.js
│   ├── utils/
│   │   └── seed.js               # Automatic & manual database seeder
│   ├── package.json
│   ├── server.js                 # Server entry point
│   ├── .env
│   └── .env.example
│
├── .gitignore
├── package.json                  # Root runner script
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/skillx
JWT_SECRET=skillx_jwt_secret_dev_key_2026_super_secure
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended, tested on v22)
- **MongoDB** running locally on port 27017 (or a MongoDB Atlas URI)

### 2. Installation
Install dependencies for both frontend and backend:

```bash
# In backend directory
cd backend
npm install

# In frontend directory
cd ../frontend
npm install
```

### 3. Run the Backend
```bash
cd backend
npm run dev
```
*The server will start on `http://localhost:5001`. On first run, it automatically connects to MongoDB and seeds initial demo users and listings.*

### 4. Run the Frontend
```bash
cd frontend
npm run dev
```
*The Vite development server will open on `http://localhost:5173`.*

### 5. Run Concurrently from Root (Optional)
```bash
# In the root SkillX directory
npm run dev
```

---

## 🔑 Demo Account Credentials

The database comes pre-seeded with sample users for immediate testing:

| Role / User | Email | Password |
|---|---|---|
| **Demo User** | `aditi.rao@student.edu` | `password123` |
| **Partner 1** | `rohan.mehta@student.edu` | `password123` |
| **Partner 2** | `kavya.nair@student.edu` | `password123` |
| **Partner 3** | `dev.patel@student.edu` | `password123` |

*You can also register a brand new account at `/register`.*

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student account (hashes password, issues JWT)
- `POST /api/auth/login` — Log in with email & password (returns JWT)
- `GET /api/auth/me` — Retrieve authenticated user profile (Protected)

### 👤 Users & Profile (`/api/users`)
- `GET /api/users/profile` — Get logged-in user profile details (Protected)
- `PUT /api/users/profile` — Update user name or profile information (Protected)
- `POST /api/users/skills` — Add a skill to `skillsOffered` or `skillsWanted` (Protected)
- `DELETE /api/users/skills` — Remove a skill from user profile (Protected)

### 💡 Skill Marketplace (`/api/skills`)
- `GET /api/skills` — Browse all listings (supports `?search=term` and `?limit=N`)
- `GET /api/skills/:id` — Get details for a single skill listing
- `POST /api/skills` — Publish a new skill exchange listing (Protected)
- `DELETE /api/skills/:id` — Delete user's own listing (Protected)

### 🔄 Exchange Requests (`/api/requests`)
- `GET /api/requests` — View all incoming & outgoing exchange requests (Protected)
- `POST /api/requests` — Send a trade request to another student (Protected)
- `PATCH /api/requests/:id` — Accept, decline, or complete a request (Protected)

### 📅 Learning Sessions (`/api/sessions`)
- `GET /api/sessions` — List learning sessions for active trades (Protected)
- `POST /api/sessions` — Schedule a new session (Protected)
- `PATCH /api/sessions/:id` — Toggle or update session status (upcoming/completed) (Protected)

### 📜 Certificates (`/api/certificates`)
- `GET /api/certificates` — View all earned certificates (Protected)
- `GET /api/certificates/:id` — Public certificate lookup & verification
- `POST /api/certificates` — Issue a new certificate upon completed exchange (Protected)

---

## 🔒 Security Practices Implemented
1. **Password Hashing**: Salts and hashes passwords via `bcryptjs` with 10 salt rounds before saving to MongoDB.
2. **JWT Authorization**: Authenticates requests using signed Bearer tokens with strict expiration.
3. **Protected Endpoints**: Verified via `protect` middleware attaching authenticated user info.
4. **Data Isolation**: Users can only modify/delete their own listings and accept their own requests.
5. **CORS Protected**: Express CORS configured to allow specific origins and methods.
6. **No Plain-text Leaks**: Passwords excluded from query projections and JSON responses.
