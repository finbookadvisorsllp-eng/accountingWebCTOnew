#!/bin/bash

echo "🏗️  Multi-Level Hierarchical Accountant Management Platform Setup"
echo "============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    print_warning "MongoDB doesn't appear to be running. Please start MongoDB first."
    print_status "You can install and start MongoDB with: brew services start mongodb-community"
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
if npm install; then
    print_success "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file..."
    cp .env.example .env
    print_success ".env file created. Please update MONGODB_URI if needed."
fi

# Seed database
print_status "Seeding database with initial data..."
if npm run seed; then
    print_success "Database seeded successfully"
else
    print_error "Failed to seed database"
    exit 1
fi

cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
if npm install; then
    print_success "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

print_success "Setup completed successfully!"
echo ""
echo "🎉 Your Multi-Level Hierarchical Accountant Management Platform is ready!"
echo ""
echo "📋 Default Login Credentials:"
echo "CA: admin@ca.com / Admin@123"
echo "Senior Accountant: senior@ca.com / Senior@123" 
echo "Junior Accountant: junior@ca.com / Junior@123"
echo "Client: client1@example.com / Client@123"
echo ""
echo "🚀 To start the application:"
echo "1. Terminal 1 (Backend): cd backend && npm run dev"
echo "2. Terminal 2 (Frontend): cd frontend && npm run dev"
echo ""
echo "🌐 Access the application:"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:5000"
echo ""
echo "📚 For more information, check the README.md file"