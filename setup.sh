#!/bin/bash

echo "Setting up Talent Risk Dashboard..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file from template"
fi

# Install frontend dependencies (if using React)
echo "Installing frontend dependencies..."
cd ../frontend
npm install axios

echo ""
echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start MongoDB: mongod"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm start"
echo ""
echo "API will be available at: http://localhost:3001"
echo "Frontend will be at: http://localhost:3000"
