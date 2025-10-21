# 🚀 YachtSummary Backend - Deployment Guide

Complete guide to deploy the YachtSummary backend for production with full push notifications support.

## Current Status

✅ **Local Development**: Backend running on `http://localhost:5000`
✅ **VAPID Keys**: Generated and configured
✅ **Frontend Integration**: Ready for connection

## 1️⃣ OPTION A: Deploy to Heroku (RECOMMENDED - FREE TIER AVAILABLE)

### Step 1: Create Heroku Account
1. Go to https://heroku.com
2. Sign up (free tier available)
3. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

### Step 2: Deploy Backend
```bash
# Login to Heroku
heroku login

# Create new app
heroku create yacht-summary-api

# Set environment variables
heroku config:set VAPID_PUBLIC_KEY=BOok22z0xn_0omE8yJUTXiLXnFb89_ZBTIz3X36J7IpNvKSrqD7JdlXfkm5kuvfkaU-dXmZOdkbRrVOpybl-0lc
heroku config:set VAPID_PRIVATE_KEY=TOFGg5hrMh0aRKg_8FCF-C8glbSeh-PjN9WLkcVstEE
heroku config:set PORT=5000

# Deploy
cd /Users/mo/DMA_APP2/yacht-summary-backend
git push heroku main
```

Your backend will be at: `https://yacht-summary-api.herokuapp.com`

### Step 3: Update Frontend
Update `src/App.tsx` to use your backend:
```typescript
const BACKEND_URL = 'https://yacht-summary-api.herokuapp.com'
```

---

## 2️⃣ OPTION B: Deploy to Railway.app (NEW - FAST & EASY)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Install Railway CLI (optional, can use web dashboard)

### Step 2: Deploy Backend
```bash
# Link project to Railway
cd /Users/mo/DMA_APP2/yacht-summary-backend
railway init

# Follow prompts, then deploy
railway up
```

Your backend URL will be shown in the Railway dashboard.

---

## 3️⃣ OPTION C: Deploy to Render.com (FREE)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up
3. Connect GitHub repo

### Step 2: Create New Web Service
1. Click "New +"
2. Select "Web Service"
3. Connect GitHub repo (yacht-summary-backend)
4. Fill in:
   - **Name**: yacht-summary-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variables:
   ```
   VAPID_PUBLIC_KEY=BOok22z0xn_0omE8yJUTXiLXnFb89_ZBTIz3X36J7IpNvKSrqD7JdlXfkm5kuvfkaU-dXmZOdkbRrVOpybl-0lc
   VAPID_PRIVATE_KEY=TOFGg5hrMh0aRKg_8FCF-C8glbSeh-PjN9WLkcVstEE
   ```
6. Click "Create Web Service"

---

## 4️⃣ OPTION D: Deploy to Replit (FASTEST)

### Step 1: Create Replit Account
1. Go to https://replit.com
2. Sign up
3. Click "Create" -> "Import from GitHub"
4. Paste: `https://github.com/your-username/yacht-summary-backend`

### Step 2: Configure & Run
1. Create `.env` file with VAPID keys
2. Click "Run"
3. Your backend is live!

---

## 5️⃣ OPTION E: Deploy Frontend + Backend Together on Vercel

### Frontend on Vercel

```bash
cd /Users/mo/DMA_APP2/yacht-brokerage-pwa

# Deploy with Vercel CLI
npm i -g vercel
vercel
```

**However**, the backend needs a persistent Node.js server, so Vercel's serverless functions aren't ideal. 

**Better approach**: 
- Deploy **Frontend** to Vercel
- Deploy **Backend** to Heroku/Railway
- Update frontend to point to your backend URL

---

## Complete Deployment Checklist

### Phase 1: Backend Deployment ✅
- [x] Backend running locally
- [x] VAPID keys generated
- [ ] Choose deployment platform (Heroku/Railway recommended)
- [ ] Deploy backend
- [ ] Test backend health: `curl https://your-backend-url/health`

### Phase 2: Frontend Deployment
- [ ] Update `BACKEND_URL` in `src/App.tsx`
- [ ] Update frontend `.env` for production
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Test notifications in production

### Phase 3: Testing
- [ ] Login to app
- [ ] Enable notifications
- [ ] Send test notification
- [ ] Receive notification on phone
- [ ] Test on iOS and Android

---

## Updated Architecture

After deployment, your app will be:

```
┌─────────────────────────────────────┐
│   User's Phone (iOS/Android)        │
│   ├─ Frontend App (Web)             │
│   └─ Installed PWA                  │
└──────────────┬──────────────────────┘
               │ HTTPS
        ┌──────▼─────────┐
        │   Frontend     │
        │ (Vercel/etc)   │
        └──────┬─────────┘
               │ HTTPS
        ┌──────▼──────────┐
        │    Backend      │
        │ (Heroku/Railway)│
        │ Push API Server │
        └─────────────────┘
```

---

## Environment Variables for Production

Create these in your deployment platform:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Web Push Keys (from earlier)
VAPID_PUBLIC_KEY=BOok22z0xn_0omE8yJUTXiLXnFb89_ZBTIz3X36J7IpNvKSrqD7JdlXfkm5kuvfkaU-dXmZOdkbRrVOpybl-0lc
VAPID_PRIVATE_KEY=TOFGg5hrMh0aRKg_8FCF-C8glbSeh-PjN9WLkcVstEE
```

---

## Testing After Deployment

### 1. Test Backend Health
```bash
curl https://your-backend-url/health
```

Should return:
```json
{"status":"Backend is running!","timestamp":"..."}
```

### 2. Get VAPID Key
```bash
curl https://your-backend-url/vapid-public-key
```

### 3. Update Frontend
Update `App.tsx`:
```typescript
const BACKEND_URL = 'https://your-backend-url'
```

### 4. Rebuild & Deploy Frontend
```bash
cd /Users/mo/DMA_APP2/yacht-brokerage-pwa
npm run build
vercel --prod
```

---

## Troubleshooting Deployment

### Backend not starting
- Check logs in deployment platform
- Verify VAPID keys are set
- Ensure PORT environment variable is set

### CORS errors
- Backend has CORS enabled by default
- If issues persist, add frontend URL to CORS whitelist in `server.js`

### Notifications not working
- Verify backend is reachable from frontend
- Check browser console for errors
- Test with `/test-notification` endpoint

### Database issues (future)
- Current setup uses in-memory storage (OK for MVP)
- For production scale, integrate MongoDB or PostgreSQL

---

## Next Steps

1. ✅ Choose deployment platform above
2. ✅ Deploy backend
3. ✅ Update frontend BACKEND_URL
4. ✅ Deploy frontend
5. ✅ Test end-to-end
6. ✅ Share public URLs with users

---

## Support

For deployment issues:
- Check platform-specific documentation
- Review backend logs
- Test endpoints with curl
- Open GitHub issues

**You're ready to deploy!** 🚀
