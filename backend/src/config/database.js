import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get database configuration from environment variables
const getDatabaseConfig = () => {
  // Check if DATABASE_URL is available (Railway provides this)
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      useConnectionString: true,
    };
  }

  // Check for Railway MySQL variables
  if (process.env.MYSQLHOST) {
    return {
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT,
      useConnectionString: false,
    };
  }

  // Fallback to individual environment variables
  return {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "movie_app",
    useConnectionString: false,
  };
};

// Create connection pool
const createPool = () => {
  const config = getDatabaseConfig();

  if (config.useConnectionString) {
    // Use connection string (Railway)
    return mysql.createPool(config.connectionString);
  } else {
    // Use individual parameters
    return mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      port: config.port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
};

// Create connection for initial setup
const createConnection = async () => {
  const config = getDatabaseConfig();

  if (config.useConnectionString) {
    // Use connection string (Railway)
    return await mysql.createConnection(config.connectionString);
  } else {
    // Use individual parameters
    return await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
    });
  }
};

// Create the connection pool
const pool = createPool();

// Function to create database and tables
const createTables = async () => {
  try {
    const connection = await createConnection();

    if (!getDatabaseConfig().useConnectionString) {
      // Only create database if not using connection string
      await connection.query("CREATE DATABASE IF NOT EXISTS movie_app");
      await connection.query("USE movie_app");
    }

    // Create movies table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type ENUM('Movie', 'TV Show') NOT NULL,
        director VARCHAR(255) NOT NULL,
        budget VARCHAR(100),
        location VARCHAR(255) NOT NULL,
        duration VARCHAR(100) NOT NULL,
        year_time VARCHAR(100) NOT NULL,
        description TEXT,
        rating DECIMAL(3,1),
        poster_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createTableQuery);
    console.log("Movies table created successfully");

    await connection.end();
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
};

// Function to insert sample data
const insertSampleData = async () => {
  try {

    // Sample movies to add
    const sampleMovies = [
      {
        title: "The Shawshank Redemption",
        type: "Movie",
        director: "Frank Darabont",
        budget: "$25 million",
        location: "Maine State Prison",
        duration: "2h 22m",
        year_time: "1994",
        description:
          "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        rating: 9.3,
        poster_url: "https://example.com/shawshank.jpg",
      },
      {
        title: "Breaking Bad",
        type: "TV Show",
        director: "Vince Gilligan",
        budget: "$3 million per episode",
        location: "Albuquerque, New Mexico",
        duration: "5 seasons",
        year_time: "2008-2013",
        description:
          "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's financial future.",
        rating: 9.5,
        poster_url: "https://example.com/breaking-bad.jpg",
      },
      {
        title: "Inception",
        type: "Movie",
        director: "Christopher Nolan",
        budget: "$160 million",
        location: "Various locations",
        duration: "2h 28m",
        year_time: "2010",
        description:
          "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        rating: 8.8,
        poster_url: "https://example.com/inception.jpg",
      },
    ];

    // Insert sample movies
    for (const movie of sampleMovies) {
      const checkQuery =
        "SELECT id FROM movies WHERE title = ?";
      const [existing] = await pool.execute(checkQuery, [movie.title]);

      if (existing.length === 0) {
        const insertQuery = `
          INSERT INTO movies (title, type, director, budget, location, duration, year_time, description, rating, poster_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.execute(insertQuery, [
          movie.title,
          movie.type,
          movie.director,
          movie.budget,
          movie.location,
          movie.duration,
          movie.year_time,
          movie.description,
          movie.rating,
          movie.poster_url,
        ]);
      }
    }

    console.log("Sample data inserted successfully");
  } catch (error) {
    console.error("Error inserting sample data:", error);
    throw error;
  }
};

// Initialize database
const initDatabase = async () => {
  try {
    await createTables();
    await insertSampleData();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

export { pool, initDatabase };
