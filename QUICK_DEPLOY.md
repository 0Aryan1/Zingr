# 🚀 Quick Deployment Steps

## TL;DR - Deploy in 15 Minutes

### Step 1: Setup MongoDB Atlas (5 min)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → Create FREE cluster
2. Create database user with password
3. Add IP: 0.0.0.0/0 (allow all)
4. Get connection string

### Step 2: Deploy Backend to Vercel (3 min)
1. Go to [Vercel](https://vercel.com/new)
2. Import your GitHub repo
3. **Root Directory**: `Backend`
4. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key
   IMAGEKIT_PUBLIC_KEY=your_key
   IMAGEKIT_PRIVATE_KEY=your_key
   IMAGEKIT_URL_ENDPOINT=your_endpoint
   NODE_ENV=production
   ```
5. Deploy → Copy backend URL

### Step 3: Deploy Frontend to Vercel (3 min)
1. Go to [Vercel](https://vercel.com/new) again
2. Import same GitHub repo
3. **Root Directory**: `Frontend`
4. Add environment variable:
   ```
   VITE_API_URL=your_backend_url_from_step2
   ```
5. Deploy → Copy frontend URL

### Step 4: Update Backend CORS (2 min)
1. Go to Backend project in Vercel
2. Add environment variable:
   ```
   FRONTEND_URL=your_frontend_url_from_step3
   ```
3. Redeploy (automatic)

### Step 5: Test! (2 min)
1. Visit your frontend URL
2. Register a user
3. Login
4. Upload a video
5. Done! 🎉

---

## 📖 Need Detailed Instructions?

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for complete step-by-step guide.

---

## 🔧 Project Structure

```
reel/
├── Backend/               # Express API
│   ├── vercel.json       # ✅ Already configured
│   └── .env.example      # Environment variables template
├── Frontend/             # React + Vite
│   └── .env.example      # Environment variables template
└── DEPLOYMENT_GUIDE.md   # Complete deployment guide
```

---

## 📝 Environment Variables Needed

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.vercel.app
```

---

## ⚡ Files Already Configured

- ✅ `Backend/vercel.json` - Vercel configuration
- ✅ `Backend/src/app.js` - CORS setup for production
- ✅ `Frontend/src/config/api.js` - API URL configuration
- ✅ `.gitignore` - Excludes sensitive files

---

## 🆘 Troubleshooting

**CORS Error?**
- Make sure `FRONTEND_URL` is set in backend

**Can't connect to database?**
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Verify connection string

**Videos not uploading?**
- Verify ImageKit credentials

**Check Logs:**
- Vercel Dashboard → Your Project → Deployments → Runtime Logs

---

## 🎯 After Deployment

Your app will be live at:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-api.vercel.app`

**Auto-deployment enabled!** Every push to `main` branch will automatically deploy.

---

## 💡 Pro Tips

1. **Generate strong JWT secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Test locally first**:
   ```bash
   # Backend
   cd Backend && npm install && npm start
   
   # Frontend
   cd Frontend && npm install && npm run dev
   ```

3. **Monitor deployments** in Vercel dashboard

---

**Happy Deploying! 🚀**
