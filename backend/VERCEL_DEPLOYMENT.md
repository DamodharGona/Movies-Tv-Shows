# Deploying Express.js Backend to Vercel

## Overview
This guide explains how to deploy an Express.js application to Vercel using the `@vercel/node` builder.

## Prerequisites
- Node.js 18+ installed
- Vercel CLI installed: `npm i -g vercel`
- Vercel account

## Step-by-Step Deployment

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Login to Vercel
```bash
vercel login
```

### 4. Deploy to Vercel
```bash
vercel
```

### 5. Follow the Prompts
When prompted, answer the following:
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account
- **Link to existing project?** → `N`
- **What's your project's name?** → `movies-backend` (or your preferred name)
- **In which directory is your code located?** → `./` (current directory)
- **Want to override the settings?** → `N`

### 6. Set Environment Variables
After deployment, go to your Vercel dashboard and set these environment variables:

```
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=movie_app
DB_PORT=3306
JWT_SECRET=your-jwt-secret-key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 7. Redeploy with Environment Variables
```bash
vercel --prod
```

## Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/index.js"
    },
    {
      "src": "/health",
      "dest": "/src/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/src/index.js"
    }
  ],
  "functions": {
    "src/index.js": {
      "maxDuration": 30
    }
  }
}
```

### package.json Scripts
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "build": "echo 'No build step required for Express.js'",
    "vercel-build": "echo 'No build step required'"
  }
}
```

## Important Notes

1. **Database Connection**: Use a cloud MySQL service like PlanetScale, Railway, or AWS RDS
2. **Serverless Limitations**: 
   - Functions have a 30-second timeout
   - No persistent connections
   - Cold starts may occur
3. **Environment Variables**: Must be set in Vercel dashboard
4. **CORS**: Update CORS_ORIGIN to your frontend URL

## Testing Deployment

After deployment, test your endpoints:
- Health check: `https://your-app.vercel.app/health`
- API base: `https://your-app.vercel.app/api/movies`

## Troubleshooting

1. **Build Errors**: Check that all dependencies are in `package.json`
2. **Runtime Errors**: Check Vercel function logs in dashboard
3. **Database Connection**: Ensure your MySQL service allows external connections
4. **CORS Issues**: Verify CORS_ORIGIN environment variable is set correctly 