# 🔧 Update API URLs for Production

## ⚠️ IMPORTANT: Before Deployment

All hardcoded `http://localhost:3000` URLs need to be replaced with the API configuration.

## Files to Update

### ✅ Already Created:
- `Frontend/src/config/api.js` - Centralized API configuration

### 📝 Files That Need Updates:

1. **Frontend/src/pages/general/Home.jsx** (3 instances)
2. **Frontend/src/pages/general/Saved.jsx** (2 instances)
3. **Frontend/src/pages/auth/UserLogin.jsx** (1 instance)
4. **Frontend/src/pages/auth/UserRegister.jsx** (1 instance)
5. **Frontend/src/pages/auth/FoodPartnerLogin.jsx** (1 instance)
6. **Frontend/src/pages/auth/FoodPartnerRegister.jsx** (1 instance)
7. **Frontend/src/pages/food-partner/PartnerProfile.jsx** (1 instance)
8. **Frontend/src/pages/food-partner/User-PartnerProfile.jsx** (1 instance)
9. **Frontend/src/pages/food-partner/CreateFood.jsx** (1 instance)
10. **Frontend/src/components/BottomNav.jsx** (1 instance)
11. **Frontend/src/components/PartnerBottomNav.jsx** (1 instance)
12. **Frontend/src/components/PublicRoute.jsx** (1 instance)
13. **Frontend/src/components/ProtectedRoute.jsx** (1 instance)

---

## 🔄 How to Update

### Step 1: Import API_URL

At the top of each file, add:
```javascript
import API_URL from '../../config/api'; // Adjust path based on file location
```

### Step 2: Replace URLs

**Before:**
```javascript
axios.get("http://localhost:3000/api/food", ...)
```

**After:**
```javascript
axios.get(`${API_URL}/api/food`, ...)
```

---

## 📋 Specific Examples

### Home.jsx
```javascript
// Add import at top
import API_URL from '../../config/api';

// Change line 16:
axios.get(`${API_URL}/api/food`, { withCredentials: true })

// Change line 94:
const response = await axios.post(`${API_URL}/api/food/like`, ...)

// Change line 107:
const response = await axios.post(`${API_URL}/api/food/save`, ...)
```

### UserLogin.jsx
```javascript
// Add import at top
import API_URL from '../../config/api';

// Change line 17:
const response = await axios.post(`${API_URL}/api/auth/user/login`, ...)
```

### ProtectedRoute.jsx
```javascript
// Add import at top
import API_URL from '../config/api';

// Change line 17:
const response = await axios.get(`${API_URL}/api/auth/check`, ...)
```

---

## ⚡ Quick Find & Replace Pattern

Search for: `"http://localhost:3000`
Replace with: `` `${API_URL} ``

Then manually:
1. Add the import statement
2. Ensure quotes are changed from `"..."` to `` `...` `` (template literals)

---

## ✅ Verification

After updating, your API calls should look like:
```javascript
axios.get(`${API_URL}/api/food`, ...)
axios.post(`${API_URL}/api/auth/login`, ...)
```

NOT like:
```javascript
axios.get("http://localhost:3000/api/food", ...)  // ❌ Wrong
```

---

## 🧪 Testing

### Local Testing (should still work):
```bash
cd Frontend
npm run dev
# Should connect to http://localhost:3000
```

### Production Testing (after deployment):
```bash
# Set environment variable
VITE_API_URL=https://your-backend.vercel.app

# Or create .env file:
echo "VITE_API_URL=https://your-backend.vercel.app" > .env

# Build and preview
npm run build
npm run preview
```

---

## 📖 Reference

`Frontend/src/config/api.js` handles:
- ✅ Development: Uses `http://localhost:3000`
- ✅ Production: Uses `process.env.VITE_API_URL` or default
- ✅ Automatic switching based on environment

---

**Note:** This step is CRUCIAL for deployment to work properly!
