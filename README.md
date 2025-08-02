# Favourite Tv & Movie Shows

A simple web application where users can manage their favourite movies and TV shows. I built this project to learn full-stack development using modern technologies.

## 🌟 Live Demo

**Frontend**: [https://movies-tv-shows-flame.vercel.app/](https://movies-tv-shows-flame.vercel.app/)  
**Backend API**: [https://movies-tv-shows-production.up.railway.app/](https://movies-tv-shows-production.up.railway.app/)

## ✨ Features

- **User Authentication**: Create accounts and login securely
- **Personal Collection**: Add movies and TV shows to your own collection
- **Search & Filter**: Find movies by title, director, location, year, rating
- **CRUD Operations**: Create, read, update, and delete your movies
- **User Privacy**: Each user only sees their own movies
- **Responsive Design**: Works on mobile and desktop

## 🛠️ Technologies Used

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn UI** for beautiful components
- **React Icons** for icons

### Backend
- **Node.js** with Express framework
- **MySQL** database (Railway)
- **JWT** for secure authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- MySQL database (or use Railway's free tier)

### Backend Setup
1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file with:
DATABASE_URL=your_mysql_connection_string
JWT_SECRET=your_secret_key
```

4. Start the server:
```bash
npm start
```

Server runs on: http://localhost:3000

### Frontend Setup
1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file with:
VITE_API_BASE_URL=http://localhost:3000
```

4. Start development server:
```bash
npm run dev
```

Frontend runs on: http://localhost:5173

## 🗄️ Database Setup

The app automatically creates tables on first run. For manual setup:

```bash
cd backend
npm run setup-db
```

This creates:
- ✅ Users table for authentication
- ✅ Movies table with user relationships
- ✅ Demo user account

## 📁 Project Structure

```
movie-app/
├── backend/                 # Node.js server
│   ├── src/
│   │   ├── controllers/    # API business logic
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Authentication middleware
│   │   └── config/         # Database configuration
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service calls
│   │   ├── contexts/       # React context (auth)
│   │   ├── hooks/          # Custom hooks
│   │   └── types/          # TypeScript types
│   └── package.json
└── README.md
```

## 🌐 Deployment

I deployed this project using:

- **Backend**: [Railway](https://railway.app/) - Node.js hosting with MySQL
- **Frontend**: [Vercel](https://vercel.com/) - React hosting
- **Database**: Railway MySQL (free tier)

### Environment Variables for Deployment

**Backend (.env)**:
```
DATABASE_URL=mysql://username:password@host:port/database
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

**Frontend (.env)**:
```
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

## 🧪 Testing the App

### Demo Account
- **Email**: demo@example.com
- **Password**: password

### API Endpoints
- `GET /` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/movies` - Get user's movies
- `POST /api/movies` - Add new movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie
- `GET /api/movies/search` - Search movies
- `GET /api/movies/filter` - Filter movies

## 📚 What I Learned

- **Full-Stack Development**: Building complete web applications
- **Authentication**: JWT tokens and secure user management
- **Database Design**: MySQL with foreign key relationships
- **API Development**: RESTful APIs with Express.js
- **Frontend State Management**: React Context and hooks
- **Responsive Design**: Mobile-first approach with Tailwind
- **Cloud Deployment**: Railway and Vercel platforms
- **Error Handling**: Proper error messages and validation

## 🔧 Recent Fixes

- ✅ Fixed filter pagination issues
- ✅ Resolved 500 errors when creating movies
- ✅ Improved search functionality with accurate counts
- ✅ Added duplicate movie prevention
- ✅ Enhanced error messages for better UX
- ✅ Updated CORS configuration for production

## 🎯 Future Improvements

- [ ] Add movie ratings and reviews
- [ ] Implement movie recommendations
- [ ] Add image upload for movie posters
- [ ] Create user profiles and preferences
- [ ] Add movie categories and tags
- [ ] Implement real-time notifications

---

**Note**: This is a learning project. I'm continuously improving my skills and adding new features!

*Built with ❤️ by a student developer*
