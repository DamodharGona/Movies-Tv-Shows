-- Create the database
CREATE DATABASE IF NOT EXISTS movie_app;
USE movie_app;

-- Create the movies table
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
  rating DECIMAL(3,1) DEFAULT 0.0,
  poster_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO movies (title, type, director, budget, location, duration, year_time, description, rating, poster_url) VALUES
('Inception', 'Movie', 'Christopher Nolan', '$160M', 'LA, Paris', '148 min', '2010', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 8.8, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'),
('Breaking Bad', 'TV Show', 'Vince Gilligan', '$3M/ep', 'Albuquerque', '49 min/ep', '2008-2013', 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family\'s financial future as a terminal illness puts his life in jeopardy.', 9.5, 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacMizPGv.png'),
('The Shawshank Redemption', 'Movie', 'Frank Darabont', '$25M', 'Mansfield, Ohio', '142 min', '1994', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 9.3, 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'),
('Game of Thrones', 'TV Show', 'David Benioff', '$6M/ep', 'Northern Ireland', '57 min/ep', '2011-2019', 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.', 9.3, 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg'),
('The Dark Knight', 'Movie', 'Christopher Nolan', '$185M', 'Chicago, London', '152 min', '2008', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 9.0, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),
('Stranger Things', 'TV Show', 'The Duffer Brothers', '$6M/ep', 'Atlanta, Georgia', '51 min/ep', '2016-2024', 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.', 8.7, 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg'),
('Pulp Fiction', 'Movie', 'Quentin Tarantino', '$8.5M', 'Los Angeles', '154 min', '1994', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 8.9, 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'),
('The Office', 'TV Show', 'Greg Daniels', '$2.5M/ep', 'Los Angeles', '22 min/ep', '2005-2013', 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.', 8.9, 'https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg'),
('Fight Club', 'Movie', 'David Fincher', '$63M', 'Los Angeles', '139 min', '1999', 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.', 8.8, 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'),
('Friends', 'TV Show', 'David Crane', '$1M/ep', 'Los Angeles', '22 min/ep', '1994-2004', 'Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.', 8.9, 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPWgVltW7gMKH.jpg');

-- Show the created data
SELECT * FROM movies ORDER BY created_at DESC; 