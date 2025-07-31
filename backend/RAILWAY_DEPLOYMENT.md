# Railway Deployment Guide

This guide explains how to deploy the Movie App backend to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Your project code pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Connect Your Repository

1. Log in to Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect the Node.js project

### 2. Configure Environment Variables

In your Railway project dashboard, go to the "Variables" tab and add the following environment variables:

```
# Server Configuration
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com

# MySQL Database Configuration
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=movie_app
DB_PORT=3306
```

### 3. Set Up Database

Railway provides MySQL databases. You can:

1. Add a MySQL plugin to your project
2. Railway will automatically provide the database connection details
3. Update your environment variables with the provided database credentials

### 4. Deploy

1. Railway will automatically deploy when you push changes to your repository
2. You can also manually trigger deployments from the Railway dashboard
3. Monitor the deployment logs in the "Deployments" tab

### 5. Get Your API URL

After deployment, Railway will provide you with a URL like:
`https://your-app-name.railway.app`

Your API endpoints will be available at:

- Health check: `https://your-app-name.railway.app/health`
- Movies API: `https://your-app-name.railway.app/api/movies`
- Auth API: `https://your-app-name.railway.app/api/auth`

## Environment Variables Reference

| Variable       | Description                          | Required | Default     |
| -------------- | ------------------------------------ | -------- | ----------- |
| `PORT`         | Server port                          | No       | 5001        |
| `NODE_ENV`     | Environment (development/production) | No       | development |
| `FRONTEND_URL` | Frontend URL for CORS                | Yes      | -           |
| `DB_HOST`      | MySQL host                           | Yes      | -           |
| `DB_USER`      | MySQL username                       | Yes      | -           |
| `DB_PASSWORD`  | MySQL password                       | Yes      | -           |
| `DB_NAME`      | MySQL database name                  | Yes      | -           |
| `DB_PORT`      | MySQL port                           | No       | 3306        |

## Health Check

The application includes a health check endpoint at `/health` that Railway uses to monitor the service status.

## Troubleshooting

1. **Build Failures**: Check the deployment logs in Railway dashboard
2. **Database Connection Issues**: Verify your database credentials in environment variables
3. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly
4. **Port Issues**: Railway automatically sets the `PORT` environment variable

## Support

For Railway-specific issues, refer to the [Railway documentation](https://docs.railway.app/).
