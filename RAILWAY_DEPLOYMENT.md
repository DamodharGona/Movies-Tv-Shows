# Railway Deployment Guide - Full Stack Movie App

This guide explains how to deploy both the backend and frontend of the Movie App to Railway.

## Backend Deployment

### 1. Backend Environment Variables

In your Railway backend project, set these environment variables:

```
# Server Configuration
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-railway-url.com

# MySQL Database Configuration
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=movie_app
DB_PORT=3306
```

### 2. Backend URL
Your backend is already deployed at: `https://movies-tv-shows-production.up.railway.app`

## Frontend Deployment

### 1. Frontend Environment Variables

In your Railway frontend project, set this environment variable:

```
VITE_API_BASE_URL=https://movies-tv-shows-production.up.railway.app
```

### 2. Frontend Configuration

The frontend is configured to use the Railway backend URL. Make sure to:

1. Set the `VITE_API_BASE_URL` environment variable in Railway
2. Update the backend's `FRONTEND_URL` to match your frontend Railway URL

## API Endpoints

Your backend API is available at:
- **Base URL**: `https://movies-tv-shows-production.up.railway.app`
- **Health Check**: `https://movies-tv-shows-production.up.railway.app/health`
- **Movies API**: `https://movies-tv-shows-production.up.railway.app/api/movies`
- **Auth API**: `https://movies-tv-shows-production.up.railway.app/api/auth`

## Testing the Connection

You can test if your backend is working by visiting:
`https://movies-tv-shows-production.up.railway.app/health`

This should return a JSON response indicating the server is running.

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (local development)
- The URL specified in `FRONTEND_URL` environment variable

Make sure to set the `FRONTEND_URL` in your backend Railway project to match your frontend Railway URL.

## Troubleshooting

### Backend Issues
1. **Database Connection**: Ensure MySQL credentials are correct
2. **CORS Errors**: Verify `FRONTEND_URL` is set correctly
3. **Port Issues**: Railway automatically sets the `PORT` environment variable

### Frontend Issues
1. **API Connection**: Verify `VITE_API_BASE_URL` is set correctly
2. **Build Failures**: Check Railway deployment logs
3. **Environment Variables**: Ensure they're set in Railway dashboard

## Local Development

For local development, create a `.env` file in the frontend directory:

```
VITE_API_BASE_URL=http://localhost:5001
```

And in the backend directory:

```
FRONTEND_URL=http://localhost:5173
```

## Support

For Railway-specific issues, refer to the [Railway documentation](https://docs.railway.app/). 