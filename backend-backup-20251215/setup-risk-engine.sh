#!/bin/bash

echo "Setting up Talent Risk Scoring Engine..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Install ML dependencies (optional)
echo "Installing optional ML dependencies..."
npm install tensorflow @tensorflow/tfjs-node --save-optional

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file from template"
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install chart.js react-chartjs-2

echo ""
echo "í¾‰ Risk Scoring Engine setup complete!"
echo ""
echo "íº€ Available Algorithms:"
echo "   1. Basic Algorithm - Simple tenure/performance based"
echo "   2. Advanced Predictive - Behavioral & market intelligence"
echo "   3. Machine Learning - AI-powered predictions"
echo "   4. Engineering Specific - Tech skills focused"
echo "   5. Sales Specific - Quota & client focused"
echo "   6. Leadership Specific - Team & succession focused"
echo "   7. Custom Algorithms - Build your own"
echo ""
echo "í³Š Features:"
echo "   - Real-time risk scoring"
echo "   - Custom algorithm builder"
echo "   - Batch processing"
echo "   - Organization analytics"
echo "   - Risk trend analysis"
echo "   - Automated recommendations"
echo ""
echo "í²¡ Usage Examples:"
echo "   - Calculate risk for single employee: POST /api/risk/calculate/:id"
echo "   - Batch calculate: POST /api/risk/batch-calculate"
echo "   - Build custom algorithm: POST /api/risk/algorithms/custom"
echo "   - Get analytics: POST /api/risk/analytics/organization"
echo ""
echo "To start:"
echo "   1. Start MongoDB"
echo "   2. Start backend: cd backend && npm run dev"
echo "   3. Start frontend: cd frontend && npm start"
