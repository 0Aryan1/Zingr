# 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR PROJECT                             │
│  ┌────────────────────┐              ┌────────────────────┐     │
│  │     FRONTEND       │              │      BACKEND       │     │
│  │   (React + Vite)   │              │  (Node + Express)  │     │
│  │                    │              │                    │     │
│  │  - User Interface  │◄────────────►│  - REST API        │     │
│  │  - React Router    │   API Calls  │  - Authentication  │     │
│  │  - Axios           │              │  - File Upload     │     │
│  └────────────────────┘              └────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                │                                  │
                │                                  │
                ▼                                  ▼
┌───────────────────────────┐      ┌───────────────────────────┐
│    VERCEL (Frontend)      │      │    VERCEL (Backend)       │
│                           │      │                           │
│  URL: your-app.vercel.app │      │  URL: your-api.vercel.app │
│                           │      │                           │
│  Environment Variables:   │      │  Environment Variables:   │
│  - VITE_API_URL ────────────────►│  - MONGODB_URI            │
│                           │      │  - JWT_SECRET             │
│                           │      │  - IMAGEKIT_*             │
│                           │      │  - FRONTEND_URL ◄─────────┼───┐
│                           │      │  - NODE_ENV               │   │
└───────────────────────────┘      └───────────────────────────┘   │
                                                   │                │
                                                   │                │
                                    ┌──────────────┴───────┬────────┘
                                    ▼                      ▼
                        ┌───────────────────┐  ┌───────────────────┐
                        │  MongoDB Atlas    │  │   ImageKit.io     │
                        │                   │  │                   │
                        │  - User Data      │  │  - Video Storage  │
                        │  - Food Partners  │  │  - Video URLs     │
                        │  - Food Items     │  │                   │
                        │  - Saved Videos   │  │                   │
                        └───────────────────┘  └───────────────────┘
```

## 🔄 Request Flow

### 1. User Visits App
```
User Browser → https://your-app.vercel.app (Frontend)
```

### 2. User Logs In
```
Frontend → POST /api/auth/user/login → Backend
Backend → Verify credentials → MongoDB
Backend → Generate JWT token → Frontend
Frontend → Store token in cookies
```

### 3. User Uploads Video
```
Frontend → POST /api/food (with video file) → Backend
Backend → Upload to ImageKit
ImageKit → Returns video URL
Backend → Save video URL to MongoDB
Backend → Return success → Frontend
```

### 4. User Views Feed
```
Frontend → GET /api/food → Backend
Backend → Fetch from MongoDB
MongoDB → Returns food items with video URLs
Backend → Returns data → Frontend
Frontend → Display videos
```

## 🌐 Domain Structure (After Deployment)

```
Production:
├── Frontend: https://your-app-name.vercel.app
│   └── Handles: All UI, routing, user interactions
│
└── Backend:  https://your-app-name-api.vercel.app
    └── Handles: /api/auth/*, /api/food/*, /api/food-partner/*
```

## 🔐 Security Flow

```
┌──────────┐                                    ┌──────────┐
│  User    │                                    │  Backend │
└────┬─────┘                                    └────┬─────┘
     │                                                │
     │  1. POST /api/auth/login                      │
     │  { email, password }                          │
     ├──────────────────────────────────────────────►│
     │                                                │
     │                        2. Verify credentials  │
     │                           Check MongoDB       │
     │                                                │
     │  3. Set-Cookie: token=JWT                     │
     │◄──────────────────────────────────────────────┤
     │                                                │
     │  4. GET /api/food                             │
     │  Cookie: token=JWT                            │
     ├──────────────────────────────────────────────►│
     │                                                │
     │                        5. Verify JWT          │
     │                           Validate user       │
     │                                                │
     │  6. Return protected data                     │
     │◄──────────────────────────────────────────────┤
     │                                                │
```

## 📊 Data Flow

```
┌────────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────┐
│   React    │────►│   Axios     │────►│   Express    │────►│ MongoDB  │
│ Components │     │  HTTP Layer │     │ Controllers  │     │ Database │
└────────────┘     └─────────────┘     └──────────────┘     └──────────┘
     ▲                                         │
     │                                         ▼
     │                                  ┌──────────────┐
     │                                  │  ImageKit    │
     └──────────────────────────────────┤ Video Storage│
                  Response              └──────────────┘
```

## 🎯 Deployment Targets

| Component | Platform | Purpose |
|-----------|----------|---------|
| Frontend | Vercel | Serve React app, handle routing |
| Backend | Vercel | API endpoints, authentication |
| Database | MongoDB Atlas | Store user/food data |
| Storage | ImageKit | Host video files |

## 🔧 Configuration Files

```
Backend/
├── vercel.json          ← Tells Vercel how to deploy backend
├── .env                 ← Environment variables (not committed)
└── .env.example         ← Template for required env vars

Frontend/
├── .env                 ← Environment variables (not committed)
├── .env.example         ← Template for required env vars
└── src/config/api.js    ← API configuration
```

---

This architecture ensures:
- ✅ Scalability (Vercel handles scaling)
- ✅ Security (JWT tokens, CORS protection)
- ✅ Performance (CDN for frontend, optimized API)
- ✅ Reliability (MongoDB Atlas clusters)
- ✅ Easy updates (Git push = auto deploy)
