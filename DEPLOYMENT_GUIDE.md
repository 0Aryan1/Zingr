# 🚀 Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- MongoDB Atlas account (for production database)
- ImageKit account (for video storage)

---

## 📦 PHASE 1: PREPARE YOUR PROJECT

### 1.1 Commit Your Changes
```bash
cd /Users/aryanagrawal/Downloads/reel
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Create Production Environment Files

**Backend `.env`** (Keep this secret, don't commit!):
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_random_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend `.env`**:
```env
VITE_API_URL=https://your-backend.vercel.app
```

---

## 🗄️ PHASE 2: SETUP MONGODB ATLAS (Production Database)

### 2.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new FREE cluster (M0)

### 2.2 Setup Database Access
1. Go to "Database Access" → "Add New Database User"
2. Create a username and strong password (save these!)
3. Grant "Read and write to any database" permission

### 2.3 Setup Network Access
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. This allows Vercel to connect

### 2.4 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with your database name (e.g., "reel")

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/reel?retryWrites=true&w=majority
```

---

## 🖼️ PHASE 3: SETUP IMAGEKIT (If not already done)

1. Go to https://imagekit.io
2. Sign up for free account
3. Get your credentials from Dashboard:
   - Public Key
   - Private Key
   - URL Endpoint
4. Save these for Vercel environment variables

---

## 🔧 PHASE 4: DEPLOY BACKEND TO VERCEL

### 4.1 Import Backend Project to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New Project"**
3. **Import from GitHub**: Connect your GitHub account and select your repository
4. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `Backend`
   - **Build Command**: Leave empty (Express doesn't need build)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### 4.2 Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
MONGODB_URI = your_mongodb_atlas_connection_string
JWT_SECRET = your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY = your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY = your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT = your_imagekit_url_endpoint
NODE_ENV = production
FRONTEND_URL = (leave empty for now, will add after frontend deployment)
```

### 4.3 Deploy Backend
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://your-backend.vercel.app`)
4. Test it by visiting `https://your-backend.vercel.app/` (should see "Hello Aryan")

---

## 🎨 PHASE 5: DEPLOY FRONTEND TO VERCEL

### 5.1 Import Frontend Project to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New Project"** (again, for frontend)
3. **Import from GitHub**: Select the same repository
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 5.2 Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
VITE_API_URL = https://your-backend.vercel.app
```

(Use the backend URL you got in step 4.3)

### 5.3 Deploy Frontend
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Copy your frontend URL (e.g., `https://your-frontend.vercel.app`)

---

## 🔄 PHASE 6: UPDATE BACKEND WITH FRONTEND URL

### 6.1 Add Frontend URL to Backend
1. Go to your **Backend project** in Vercel
2. Go to **Settings** → **Environment Variables**
3. Add or update:
   ```
   FRONTEND_URL = https://your-frontend.vercel.app
   ```
4. **Redeploy** the backend (Vercel will automatically redeploy)

---

## ✅ PHASE 7: TEST YOUR DEPLOYMENT

### 7.1 Test Backend
1. Visit `https://your-backend.vercel.app/`
2. Should see "Hello Aryan"

### 7.2 Test Frontend
1. Visit `https://your-frontend.vercel.app/`
2. Try to register a new user
3. Try to login
4. Check if videos load
5. Test all features

### 7.3 Common Issues & Solutions

**Issue**: CORS errors
- **Solution**: Make sure `FRONTEND_URL` is correctly set in backend environment variables

**Issue**: "Cannot connect to database"
- **Solution**: Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- **Solution**: Verify connection string in `MONGODB_URI`

**Issue**: 500 errors on API calls
- **Solution**: Check Vercel backend logs (Deployments → click deployment → Runtime Logs)

**Issue**: Videos not uploading
- **Solution**: Verify ImageKit credentials in environment variables

**Issue**: "Failed to fetch" errors
- **Solution**: Update `VITE_API_URL` in frontend to point to correct backend URL

---

## 🔧 PHASE 8: CONFIGURE CUSTOM DOMAIN (Optional)

### 8.1 Add Custom Domain to Frontend
1. Go to Vercel Dashboard → Your Frontend Project
2. Click **"Settings"** → **"Domains"**
3. Add your domain (e.g., `myapp.com`)
4. Follow Vercel's DNS configuration instructions

### 8.2 Add Custom Domain to Backend
1. Go to Vercel Dashboard → Your Backend Project
2. Click **"Settings"** → **"Domains"**
3. Add your API subdomain (e.g., `api.myapp.com`)

### 8.3 Update Environment Variables
1. Update `FRONTEND_URL` in backend to your custom domain
2. Update `VITE_API_URL` in frontend to your custom API domain
3. Redeploy both projects

---

## 📝 PHASE 9: CONTINUOUS DEPLOYMENT

Once set up, Vercel automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main

# Vercel will automatically deploy!
```

---

## 🎯 Quick Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access set to 0.0.0.0/0
- [ ] MongoDB connection string obtained
- [ ] ImageKit credentials obtained
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Backend URL copied
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable (VITE_API_URL) set
- [ ] Frontend URL copied
- [ ] Backend FRONTEND_URL updated
- [ ] Backend redeployed
- [ ] Tested registration
- [ ] Tested login
- [ ] Tested video upload
- [ ] Tested all features

---

## 📱 URLs After Deployment

- **Backend API**: `https://your-backend.vercel.app`
- **Frontend App**: `https://your-frontend.vercel.app`
- **Backend Vercel Dashboard**: `https://vercel.com/your-username/your-backend-project`
- **Frontend Vercel Dashboard**: `https://vercel.com/your-username/your-frontend-project`

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **ImageKit Docs**: https://docs.imagekit.io/

---

## 🔐 Security Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use strong JWT_SECRET** - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. **Keep database passwords secure**
4. **Don't share ImageKit private keys**
5. **Regularly rotate secrets**

---

Good luck with your deployment! 🚀
