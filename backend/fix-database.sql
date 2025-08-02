-- Fix Database Schema for Railway
-- Run this in Railway MySQL console

-- 1. Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Add user_id column to movies table
ALTER TABLE movies ADD COLUMN user_id INT NOT NULL DEFAULT 1;

-- 3. Add foreign key constraint
ALTER TABLE movies ADD CONSTRAINT fk_movies_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 4. Create demo user
INSERT INTO users (username, email, password) VALUES 
('demo_user', 'demo@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE username = username;

-- 5. Update existing movies to belong to demo user
UPDATE movies SET user_id = 1 WHERE user_id = 0 OR user_id IS NULL;

-- 6. Add sample movies if none exist
INSERT INTO movies (user_id, title, type, director, budget, location, duration, year_time, description, rating, poster_url) 
SELECT 1, 'Inception', 'Movie', 'Christopher Nolan', '$160M', 'LA, Paris', '148 min', '2010', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 8.8, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Inception');

INSERT INTO movies (user_id, title, type, director, budget, location, duration, year_time, description, rating, poster_url) 
SELECT 1, 'Breaking Bad', 'TV Show', 'Vince Gilligan', '$3M/ep', 'Albuquerque', '49 min/ep', '2008-2013', 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family\'s financial future as a terminal illness puts his life in jeopardy.', 9.5, 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacMizPGv.png'
WHERE NOT EXISTS (SELECT 1 FROM movies WHERE title = 'Breaking Bad');

-- 7. Show results
SELECT 'Users:' as info, COUNT(*) as count FROM users;
SELECT 'Movies:' as info, COUNT(*) as count FROM movies; 