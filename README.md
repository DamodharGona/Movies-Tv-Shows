# My Favorite Movies & TV Shows Web Application

<!-- Updated for Railway deployment with CORS fixes - Force new deployment -->
<!-- Trigger new Vercel deployment with Railway backend URL -->
<!-- Force fresh deployment with environment variable -->

A full-stack web application for managing your personal collection of favorite movies and TV shows.

## What This App Does

- **Personal Collections**: Each user has their own private collection of favorites
- **User Authentication**: Sign up and login to access your personal movies
- **Add New Movies**: Add movies and TV shows with details like title, director, budget, etc.
- **View Your Collection**: See all your entries in a table that loads more as you scroll
- **Edit & Delete**: Edit any movie details or delete entries with confirmation
- **Search & Filter**: Search through your collection and filter by type, director, year, etc.

## Technologies I Used

### Frontend

- React with TypeScript (for type safety)
- Vite (for fast development)
- Tailwind CSS (for styling)
- Shadcn UI (for nice-looking components)

### Backend

- Node.js with Express (for the server)
- MySQL (for storing data)
- JWT (for user authentication)
- bcryptjs (for password security)

## Deployment

### Backend Deployment Options

#### Option 1: Railway (Recommended)

Railway is the easiest option for deploying the backend with MySQL support.

**Steps:**
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the backend configuration
3. Set up environment variables in Railway dashboard
4. Deploy!

**Environment Variables for Railway:**
```
PORT=5001
NODE_ENV=production
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=movie_app
DB_PORT=3306
JWT_SECRET=your-jwt-secret-key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

#### Option 2: Vercel (Serverless)

Vercel can deploy the backend as serverless functions, but has limitations with MySQL.

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root
3. Configure environment variables in Vercel dashboard

**Note:** For Vercel, you'll need to use a cloud MySQL service like PlanetScale or Railway's MySQL.

### Frontend Deployment (Vercel/Netlify)

The frontend can be deployed to Vercel or Netlify.

**Environment Variables:**
```
VITE_API_URL=https://your-backend-url.railway.app
```

## How to Run This Project

### Step 1: Install Dependencies

First, install the frontend dependencies:

```bash
npm install
```

Then install backend dependencies:

```bash
cd backend
npm install
cd ..
```

### Step 2: Set Up MySQL Database

You need MySQL installed on your computer. Then run:

```bash
cd backend
chmod +x setup-mysql.sh
./setup-mysql.sh
```

This will create the database and add some sample movies for a demo user.

### Step 3: Start the Servers

Start the backend server:

```bash
cd backend
node src/index.js
```

In a new terminal, start the frontend:

```bash
npm run dev
```

### Step 4: Open the App

Go to http://localhost:5173 in your browser.

## How to Use the App

1. **Sign Up/Login**: Create an account or login to access your personal collection
2. **Load Your Movies**: Click "Load My Movies" to see your collection
3. **Add New**: Click "Add New Movie" to add a new entry to your favorites
4. **Search**: Use the search box to find specific movies in your collection
5. **Filter**: Click "Filter My Movies" to filter by type, director, etc.
6. **Edit**: Click the "Edit" button on any movie to change details
7. **Delete**: Click "Delete" to remove a movie from your favorites (it will ask for confirmation)

## Demo Account

For testing, you can use this demo account:

- **Email**: demo@example.com
- **Password**: password

## Project Structure

```
movie-app/
├── src/                    # Frontend code
│   ├── components/        # React components
│   ├── services/         # API calls
│   └── types/            # TypeScript types
├── backend/              # Backend code
│   ├── src/
│   │   ├── controllers/ # API logic
│   │   ├── models/      # Database queries
│   │   ├── routes/      # API endpoints
│   │   └── middleware/  # Authentication middleware
│   └── setup-mysql.sh   # Database setup
```

## Database Schema

The movies table stores:

- id (auto-generated)
- title (movie/show name)
- type (Movie or TV Show)
- director
- budget
- location
- duration
- year_time
- description (optional)
- rating (optional)
- poster_url (optional)

## API Endpoints

- `GET /api/movies` - Get all movies
- `POST /api/movies` - Add new movie
- `PUT /api/movies/:id` - Update movie
- `DELETE /api/movies/:id` - Delete movie
- `GET /api/movies/search` - Search movies
- `GET /api/movies/filter` - Filter movies

## What I Learned

Building this project helped me understand:

- How to connect React frontend with Node.js backend
- Database operations with MySQL
- API design and RESTful endpoints
- TypeScript for better code quality
- Responsive design with Tailwind CSS
- State management in React
- Form handling and validation

## Troubleshooting

**Database connection error**: Make sure MySQL is running
**Port already in use**: The app will automatically try different ports
**CORS errors**: Check that both frontend and backend are running

## Future Improvements

- Add user authentication
- Add movie posters/images
- Add more filter options
- Add sorting functionality
- Add movie ratings and reviews

## License

This is a learning project. Feel free to use and modify as needed.

# Favorite-Movies-TV-Shows
