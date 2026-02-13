#!/bin/bash

echo "=========================================="
echo "Accounting & Advisory Platform Setup"
echo "=========================================="
echo ""

# Check if MongoDB is running
echo "Checking MongoDB connection..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH"
    echo "Please install MongoDB from: https://www.mongodb.com/try/download/community"
    echo ""
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Seed admin user
echo ""
echo "Creating admin user..."
node seeders/seedAdmin.js
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "=========================================="
echo "Setup Complete! 🎉"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "Option 1 - Run both servers:"
echo "  npm run dev"
echo ""
echo "Option 2 - Run separately:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Admin Login Credentials:"
echo "  Email: admin@accounting.com"
echo "  Password: admin123"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:5000"
echo ""
echo "=========================================="
