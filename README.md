# Favourite Tv & Movie Shows

This is a simple web application where users can manage their favourite movies and TV shows. I made this project to learn about full-stack development using React, Node.js, and MySQL.

## What this project does

- Users can create accounts and login
- Add movies and TV shows to their personal collection
- Search and filter their movies
- Edit or delete movies from their list
- Each user can only see their own movies

## Technologies I used

### Frontend
- React with TypeScript
- Vite for building
- Tailwind CSS for styling
- Shadcn UI components

### Backend
- Node.js with Express
- MySQL database
- JWT for authentication
- bcrypt for password hashing

## How to run this project

### Prerequisites
- Node.js (version 18 or higher)
- MySQL database

### Backend Setup
1. Go to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file with your database details:
```
DATABASE_URL=your_mysql_connection_string
JWT_SECRET=your_secret_key
```

4. Start the server:
```bash
npm start
```

The backend will run on http://localhost:3000

### Frontend Setup
1. Go to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```
VITE_API_BASE_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Database Setup

The application will automatically create the necessary tables when you first run it. You can also manually run the database setup:

```bash
cd backend
npm run setup-db
```

This will create:
- Users table for authentication
- Movies table with user relationships
- Demo user (email: demo@example.com, password: password)

## Features

- User registration and login
- Add new movies and TV shows
- Search movies by title, director, or location
- Filter movies by type, year, rating, etc.
- Edit and delete movies
- Responsive design for mobile and desktop

## Project Structure

```
movie-app/
├── backend/          # Node.js server
│   ├── src/
│   │   ├── controllers/  # API logic
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Authentication
│   └── package.json
├── frontend/         # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API calls
│   │   └── contexts/     # State management
│   └── package.json
└── README.md
```

## Deployment

I deployed this project using:
- Backend: Railway (Node.js hosting)
- Frontend: Vercel (React hosting)
- Database: Railway MySQL

## What I learned

- How to build a full-stack application
- User authentication with JWT tokens
- Database relationships and foreign keys
- API development with Express
- React state management
- Responsive web design
- Deployment to cloud platforms

## Demo Account

You can test the application with:
- Email: demo@example.com
- Password: password

This project helped me understand how to build a complete web application from frontend to backend. I'm still learning and improving my skills!
