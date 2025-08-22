import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function setupDatabase() {
  try {
    console.log("🔧 Setting up database...");

    // 1. Create users table
    console.log("Creating users table...");
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created");

    // 2. Check if movies table has user_id column
    console.log("Checking movies table structure...");
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'movies' AND COLUMN_NAME = 'user_id'
    `);

    if (columns.length === 0) {
      console.log("Adding user_id column to movies table...");
      await pool.execute(`
        ALTER TABLE movies 
        ADD COLUMN user_id INT NOT NULL DEFAULT 1
      `);
      console.log("Added user_id column to movies table");
      
      // Add foreign key constraint
      try {
        await pool.execute(`
          ALTER TABLE movies 
          ADD CONSTRAINT fk_movies_user 
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        `);
        console.log("Added foreign key constraint");
      } catch (error) {
        console.log("Foreign key constraint already exists or failed:", error.message);
      }
    } else {
      console.log("Movies table already has user_id column");
    }

    // 3. Create demo user
    console.log("Creating demo user...");
    const [users] = await pool.execute("SELECT * FROM users WHERE email = 'demo@example.com'");
    
    if (users.length === 0) {
      await pool.execute(`
        INSERT INTO users (username, email, password) VALUES 
        ('demo_user', 'demo@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
      `);
      console.log("Demo user created (email: demo@example.com, password: password)");
    } else {
      console.log("Demo user already exists");
    }

    // 4. Update existing movies to belong to demo user
    console.log("Updating existing movies to belong to demo user...");
    const [movies] = await pool.execute("SELECT COUNT(*) as count FROM movies");
    
    if (movies[0].count > 0) {
      await pool.execute("UPDATE movies SET user_id = 1 WHERE user_id = 0 OR user_id IS NULL");
      console.log("Updated existing movies to belong to demo user");
    } else {
      console.log("No existing movies to update");
    }

    // 5. Add sample movies if none exist
    const [movieCount] = await pool.execute("SELECT COUNT(*) as count FROM movies");
    
    if (movieCount[0].count === 0) {
      console.log("Adding sample movies...");
      await pool.execute(`
        INSERT INTO movies (user_id, title, type, director, budget, location, duration, year_time, description, rating, poster_url) VALUES
        (1, 'Inception', 'Movie', 'Christopher Nolan', '$160M', 'LA, Paris', '148 min', '2010', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 8.8, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'),
        (1, 'Breaking Bad', 'TV Show', 'Vince Gilligan', '$3M/ep', 'Albuquerque', '49 min/ep', '2008-2013', 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family\\'s financial future as a terminal illness puts his life in jeopardy.', 9.5, 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacMizPGv.png'),
        (1, 'The Shawshank Redemption', 'Movie', 'Frank Darabont', '$25M', 'Mansfield, Ohio', '142 min', '1994', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 9.3, 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'),
        (1, 'Game of Thrones', 'TV Show', 'David Benioff', '$6M/ep', 'Northern Ireland', '57 min/ep', '2011-2019', 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.', 9.3, 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg'),
        (1, 'The Dark Knight', 'Movie', 'Christopher Nolan', '$185M', 'Chicago, London', '152 min', '2008', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 9.0, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg')
      `);
      console.log("Sample movies added");
    } else {
      console.log("Movies already exist");
    }

    // 6. Show final status
    const [finalUsers] = await pool.execute("SELECT COUNT(*) as count FROM users");
    const [finalMovies] = await pool.execute("SELECT COUNT(*) as count FROM movies");
    
    console.log("\n Database Setup Complete!");
    console.log(`Users: ${finalUsers[0].count}`);
    console.log(`Movies: ${finalMovies[0].count}`);
    console.log("\n Demo Login:");
    console.log("Email: demo@example.com");
    console.log("Password: password");

  } catch (error) {
    console.error("Database setup failed:", error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log("Database setup completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database setup failed:", error);
    process.exit(1);
  }); 
