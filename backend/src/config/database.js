import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize database with tables
export const initDatabase = async () => {
  try {
    console.log("🔧 Initializing database...");

    // Create users table
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
    console.log("✅ Users table created/verified");

    // Check if movies table has user_id column
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'movies' AND COLUMN_NAME = 'user_id'
    `);

    if (columns.length === 0) {
      // Add user_id column to existing movies table
      await pool.execute(`
        ALTER TABLE movies 
        ADD COLUMN user_id INT NOT NULL DEFAULT 1,
        ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      `);
      console.log("✅ Added user_id column to movies table");
    } else {
      console.log("✅ Movies table already has user_id column");
    }

    // Check if demo user exists
    const [users] = await pool.execute("SELECT * FROM users WHERE email = 'demo@example.com'");
    
    if (users.length === 0) {
      // Insert demo user
      await pool.execute(`
        INSERT INTO users (username, email, password) VALUES 
        ('demo_user', 'demo@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
      `);
      console.log("✅ Demo user created (password: 'password')");
    } else {
      console.log("✅ Demo user already exists");
    }

    // Check if movies exist
    const [movies] = await pool.execute("SELECT COUNT(*) as count FROM movies");
    
    if (movies[0].count === 0) {
      // Insert sample movies for demo user
      await pool.execute(`
        INSERT INTO movies (user_id, title, type, director, budget, location, duration, year_time, description, rating, poster_url) VALUES
        (1, 'Inception', 'Movie', 'Christopher Nolan', '$160M', 'LA, Paris', '148 min', '2010', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 8.8, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'),
        (1, 'Breaking Bad', 'TV Show', 'Vince Gilligan', '$3M/ep', 'Albuquerque', '49 min/ep', '2008-2013', 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family\\'s financial future as a terminal illness puts his life in jeopardy.', 9.5, 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacMizPGv.png'),
        (1, 'The Shawshank Redemption', 'Movie', 'Frank Darabont', '$25M', 'Mansfield, Ohio', '142 min', '1994', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 9.3, 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'),
        (1, 'Game of Thrones', 'TV Show', 'David Benioff', '$6M/ep', 'Northern Ireland', '57 min/ep', '2011-2019', 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.', 9.3, 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg'),
        (1, 'The Dark Knight', 'Movie', 'Christopher Nolan', '$185M', 'Chicago, London', '152 min', '2008', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 9.0, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),
        (1, 'Stranger Things', 'TV Show', 'The Duffer Brothers', '$6M/ep', 'Atlanta, Georgia', '51 min/ep', '2016-2024', 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.', 8.7, 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg'),
        (1, 'Pulp Fiction', 'Movie', 'Quentin Tarantino', '$8.5M', 'Los Angeles', '154 min', '1994', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 8.9, 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'),
        (1, 'The Office', 'TV Show', 'Greg Daniels', '$2.5M/ep', 'Los Angeles', '22 min/ep', '2005-2013', 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.', 8.9, 'https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg'),
        (1, 'Fight Club', 'Movie', 'David Fincher', '$63M', 'Los Angeles', '139 min', '1999', 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.', 8.8, 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'),
        (1, 'Friends', 'TV Show', 'David Crane', '$1M/ep', 'Los Angeles', '22 min/ep', '1994-2004', 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.', 8.9, 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPWgVltW7gMKH.jpg')
      `);
      console.log("✅ Sample movies created for demo user");
    } else {
      console.log("✅ Movies already exist");
    }

    console.log("✅ Database initialization completed successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    throw error;
  }
};

export { pool };
