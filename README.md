# My Favorite Movies & TV Shows Web Application

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

### Separate Frontend & Backend Deployment

This project is configured for separate deployment of frontend and backend, each with their own `vercel.json` configuration.

**Project Structure:**

```
├── frontend/
│   ├── vercel.json        # Frontend Vercel config
│   └── ...               # React app files
├── backend/
│   ├── vercel.json        # Backend Vercel config
│   ├── package.json       # Backend dependencies
│   └── src/              # Express.js server
└── README.md
```

### Backend Deployment (Vercel)

**Express.js Deployment Steps:**

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy backend:**
   ```bash
   vercel
   ```

5. **Follow the prompts:**
   - Set up and deploy? → `Y`
   - Which scope? → Select your account
   - Link to existing project? → `N`
   - What's your project's name? → `movies-backend`
   - In which directory is your code located? → `./`
   - Want to override the settings? → `N`

6. **Set Environment Variables in Vercel Dashboard:**
   ```
   DB_HOST=your-mysql-host
   DB_USER=your-mysql-user
   DB_PASSWORD=your-mysql-password
   DB_NAME=movie_app
   DB_PORT=3306
   JWT_SECRET=your-jwt-secret-key
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

7. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

**Important Notes:**
- Uses `@vercel/node` builder (not a framework option)
- Functions have 30-second timeout
- Requires cloud MySQL service (PlanetScale, Railway, AWS RDS)
- Database connections optimized for serverless

### Frontend Deployment (Vercel)

**Steps to Deploy Frontend:**

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Deploy frontend:**
   ```bash
   vercel
   ```

3. **For production deployment:**
   ```bash
   vercel --prod
   ```

**Environment Variables for Frontend:**
```
VITE_API_URL=https://your-backend-url.vercel.app
```

## How to Run This Project

### Step 1: Install Dependencies

Install backend dependencies:

```bash
cd backend && npm install
```

Install frontend dependencies:

```bash
cd frontend && npm install
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
cd backend && npm run dev
```

In a new terminal, start the frontend:

```bash
cd frontend && npm run dev
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
