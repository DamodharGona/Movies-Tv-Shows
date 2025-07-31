-- Create database
CREATE DATABASE IF NOT EXISTS movie_app;
USE movie_app;

-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('Movie', 'TV Show') NOT NULL,
  director VARCHAR(255) NOT NULL,
  budget VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  year_time VARCHAR(100) NOT NULL,
  description TEXT,
  rating DECIMAL(3,1),
  poster_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO movies (title, type, director, budget, location, duration, year_time, description, rating, poster_url) VALUES
('Inception', 'Movie', 'Christopher Nolan', '$160M', 'LA, Paris', '148 min', '2010', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 8.8, 'https://example.com/inception.jpg'),
('Breaking Bad', 'TV Show', 'Vince Gilligan', '$3M/ep', 'Albuquerque', '49 min/ep', '2008-2013', 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family''s financial future.', 9.5, 'https://example.com/breaking-bad.jpg'),
('The Dark Knight', 'Movie', 'Christopher Nolan', '$185M', 'Chicago, London', '152 min', '2008', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 9.0, 'https://example.com/dark-knight.jpg'); 