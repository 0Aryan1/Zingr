# 🍜 Reel - Food Video Sharing Platform

A TikTok-style food video sharing platform built with React and Node.js.

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- ImageKit account

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd reel
```

2. **Setup Backend**
```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

3. **Setup Frontend**
```bash
cd Frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 📦 Deploy to Production

### 🎯 Quick Deploy (15 minutes)

**See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for step-by-step instructions!**

### 📚 Complete Documentation

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Fast deployment guide (START HERE!)
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Detailed deployment steps
- **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)** - Complete overview
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture diagrams
- **[UPDATE_API_URLS.md](./UPDATE_API_URLS.md)** - Fix hardcoded URLs (REQUIRED!)

### ⚠️ Before Deployment

**IMPORTANT:** Update hardcoded API URLs in frontend files!
See [UPDATE_API_URLS.md](./UPDATE_API_URLS.md) for instructions.

---

## 🏗️ Project Structure

```
reel/
├── Backend/                 # Express API Server
│   ├── server.js           # Entry point
│   ├── vercel.json         # Vercel config (for deployment)
│   ├── .env.example        # Environment variables template
│   └── src/
│       ├── app.js          # Express app configuration
│       ├── controllers/    # Route handlers
│       ├── models/         # MongoDB schemas
│       ├── routes/         # API routes
│       ├── middlewares/    # Auth & validation
│       └── services/       # Business logic
│
├── Frontend/               # React + Vite
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example        # Environment variables template
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── config/
│       │   └── api.js      # API configuration
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       ├── routes/         # Route configuration
│       └── styles/         # CSS files
│
└── Documentation/          # Deployment guides
    ├── QUICK_DEPLOY.md
    ├── DEPLOYMENT_GUIDE.md
    ├── DEPLOYMENT_SUMMARY.md
    ├── ARCHITECTURE.md
    └── UPDATE_API_URLS.md
```

---

## ✨ Features

### For Users
- 📱 Vertical video feed (TikTok-style)
- ❤️ Like and save videos
- 🔖 Saved videos collection
- 🏪 Visit food partner stores
- 👤 User authentication

### For Food Partners
- 📹 Upload food videos
- 📊 View profile statistics
- 🍽️ Manage food items
- 🔐 Separate authentication

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS** - Styling with custom properties

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File upload
- **ImageKit** - Video storage
- **CORS** - Cross-origin requests

---

## 🔐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/reel
JWT_SECRET=your_secret_key
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/user/register` - Register user
- `POST /api/auth/user/login` - Login user
- `GET /api/auth/user/logout` - Logout user
- `POST /api/auth/food-partner/register` - Register food partner
- `POST /api/auth/food-partner/login` - Login food partner
- `GET /api/auth/food-partner/logout` - Logout food partner
- `GET /api/auth/check` - Check authentication status

### Food Items
- `GET /api/food` - Get all food items
- `POST /api/food` - Create food item (partner only)
- `POST /api/food/like` - Like a food item
- `POST /api/food/save` - Save a food item
- `GET /api/food/save` - Get saved food items

### Food Partners
- `GET /api/food-partner/:id` - Get partner profile

---

## 🚦 Getting Started with Development

### 1. Install Dependencies
```bash
# Backend
cd Backend && npm install

# Frontend
cd Frontend && npm install
```

### 2. Setup Environment Variables
```bash
# Backend
cp Backend/.env.example Backend/.env
# Edit Backend/.env with your credentials

# Frontend (optional for local dev)
cp Frontend/.env.example Frontend/.env
```

### 3. Start Development Servers
```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🧪 Testing

### Test User Registration
```bash
curl -X POST http://localhost:3000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env file exists and has correct values
- Check if port 3000 is available

### Frontend won't start
- Check if Node.js 16+ is installed
- Delete node_modules and run `npm install` again
- Check if port 5173 is available

### CORS errors
- Verify FRONTEND_URL in backend .env
- Check CORS configuration in Backend/src/app.js

### Database connection errors
- Verify MongoDB is running
- Check MONGODB_URI in .env

---

## 📝 Development Guidelines

### Code Style
- Use ES6+ features
- Follow React hooks best practices
- Use async/await for asynchronous code
- Keep components small and focused

### Git Workflow
```bash
git checkout -b feature/your-feature
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature
```

---

## 🚀 Ready to Deploy?

**Start here:** [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

Need help? Check the complete [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

If you encounter any issues, please check the documentation:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [UPDATE_API_URLS.md](./UPDATE_API_URLS.md)

---

**Built with ❤️ by Aryan**
