#!/bin/bash

echo "================================"
echo "CA Accounting System - Startup"
echo "================================"
echo ""

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null
then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is NOT running!"
    echo ""
    echo "Please start MongoDB first using one of these methods:"
    echo ""
    echo "Option 1 - System MongoDB:"
    echo "  sudo systemctl start mongodb"
    echo ""
    echo "Option 2 - Docker MongoDB:"
    echo "  docker run -d -p 27017:27017 --name mongodb mongo:latest"
    echo ""
    echo "Option 3 - MongoDB Atlas (Cloud):"
    echo "  Update .env with your Atlas connection string"
    echo ""
    exit 1
fi

# Start Backend
echo ""
echo "🚀 Starting Backend..."
cd /home/engine/project/backend
npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null
then
    echo "✅ Backend started successfully"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start Frontend
echo ""
echo "🚀 Starting Frontend..."
cd /home/engine/project/frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
sleep 3

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null
then
    echo "✅ Frontend started successfully"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

echo ""
echo "================================"
echo "✅ System Started Successfully!"
echo "================================"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Handle Ctrl+C to stop both servers
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM

# Keep script running
wait
