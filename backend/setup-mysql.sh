#!/bin/bash

echo "🎬 Setting up MySQL for Movie App"
echo "=================================="

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first:"
    echo "   - macOS: brew install mysql"
    echo "   - Ubuntu: sudo apt-get install mysql-server"
    echo "   - Windows: Download from https://dev.mysql.com/downloads/"
    exit 1
fi

echo "✅ MySQL is installed"

# Start MySQL service
echo "🚀 Starting MySQL service..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    brew services start mysql
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    sudo systemctl start mysql
fi

echo "✅ MySQL service started"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Dependencies installed"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your MySQL credentials in .env file"
echo "2. Run the SQL setup script: mysql -u root -p < setup-mysql.sql"
echo "3. Start the server: npm run dev"
echo ""
echo "Note: If you don't have a MySQL password, leave DB_PASSWORD empty in .env" 