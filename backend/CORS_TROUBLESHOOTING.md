# CORS Troubleshooting Guide

## 🚨 Problem: `OPTIONS /api/movies 499` Error

This error indicates a **CORS preflight request failure**. Here's how to fix it:

## ✅ What We've Fixed

### 1. **Improved CORS Configuration**
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin
    if (!origin) return callback(null, true);
    
    // Check allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Development mode - be more lenient
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin", "X-Requested-With", "Content-Type", "Accept",
    "Authorization", "Cache-Control", "Pragma", "X-API-Key"
  ],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400, // Cache preflight for 24 hours
};
```

### 2. **Explicit OPTIONS Handling**
```javascript
// Handle preflight requests explicitly for all routes
app.options("*", cors(corsOptions));
```

### 3. **Better Error Handling**
```javascript
// CORS error handling
if (error.message && error.message.includes("CORS")) {
  return res.status(403).json({
    success: false,
    message: "CORS policy violation",
    error: error.message,
    allowedOrigins: allowedOrigins,
  });
}
```

## 🧪 Testing Your CORS Configuration

### 1. **Run the Test Script**
```bash
cd backend
npm install
npm run test:cors
```

### 2. **Manual Testing with curl**
```bash
# Test OPTIONS request (preflight)
curl -X OPTIONS \
  -H "Origin: https://movies-tv-shows-flame.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v https://your-railway-app.up.railway.app/api/movies

# Test actual request
curl -X GET \
  -H "Origin: https://movies-tv-shows-flame.vercel.app" \
  -v https://your-railway-app.up.railway.app/api/movies
```

### 3. **Browser Testing**
Open browser DevTools → Network tab and check:
- ✅ OPTIONS request returns 200
- ✅ Response headers include `Access-Control-Allow-Origin`
- ✅ No CORS errors in console

## 🔧 Common Issues & Solutions

### Issue 1: **499 Client Closed Request**
**Cause**: Server doesn't respond to OPTIONS requests fast enough
**Solution**: 
- ✅ Added explicit `app.options("*", cors(corsOptions))`
- ✅ Set `optionsSuccessStatus: 200`
- ✅ Added `preflightContinue: false`

### Issue 2: **Origin Not Allowed**
**Cause**: Frontend origin not in allowed list
**Solution**: 
- ✅ Added your Vercel frontend URL to `allowedOrigins`
- ✅ Development mode allows all origins

### Issue 3: **Missing Headers**
**Cause**: Required headers not in `allowedHeaders`
**Solution**: 
- ✅ Added all common headers including `Authorization`
- ✅ Added `X-API-Key` for future use

### Issue 4: **Credentials Issues**
**Cause**: `credentials: true` not set
**Solution**: 
- ✅ Set `credentials: true` in CORS options

## 🚀 Deployment Checklist

### Before Deploying:
1. ✅ Update `allowedOrigins` with your actual frontend URL
2. ✅ Set `NODE_ENV=production` in Railway
3. ✅ Test locally with `npm run test:cors`

### After Deploying:
1. ✅ Test with browser DevTools
2. ✅ Check Railway logs for CORS errors
3. ✅ Verify frontend can make API calls

## 📝 Environment Variables

Make sure these are set in Railway:
```
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## 🐛 Debugging Steps

1. **Check Railway Logs**
   ```bash
   # Look for CORS-related logs
   grep -i "cors\|origin" railway-logs.txt
   ```

2. **Test with Postman**
   - Postman doesn't send CORS preflights
   - If it works in Postman but not browser = CORS issue

3. **Check Browser Console**
   - Look for CORS errors
   - Check Network tab for failed OPTIONS requests

4. **Verify URLs**
   - Frontend URL matches `allowedOrigins`
   - Backend URL is correct in frontend config

## 🎯 Quick Fix Commands

```bash
# Restart Railway deployment
railway up

# Check logs
railway logs

# Test CORS locally
cd backend && npm run test:cors
```

## 📞 Still Having Issues?

1. **Check Railway logs** for specific error messages
2. **Verify your frontend URL** is in `allowedOrigins`
3. **Test with curl** to isolate browser vs server issues
4. **Check browser DevTools** Network tab for failed requests 