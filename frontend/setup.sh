#!/bin/bash

echo "🎬 Setting up Favorite Movies & TV Shows Web Application"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL v8.0 or higher."
    exit 1
fi

echo "✅ MySQL is installed: $(mysql --version | head -n1)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create backend .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/env.example backend/.env
    echo "⚠️  Please update backend/.env with your database credentials"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your MySQL credentials"
echo "2. Create the database: mysql -u root -p < backend/setup-db.sql"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: npm run dev"
echo "5. Open http://localhost:5173 in your browser"
echo ""
echo "🚀 Happy coding!" 