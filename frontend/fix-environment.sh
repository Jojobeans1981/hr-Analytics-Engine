#!/bin/bash

echo "��� Fixing Environment Variables"
echo "==============================="

cd ~/Desktop/talent-risk-ai/frontend || { echo "Error: Failed to navigate to frontend directory"; exit 1; }

echo "1. Cleaning up old env files..."
rm -f .env .env.local .env.development .env.production.local 2>/dev/null

echo "2. Setting production environment..."
cat > .env.production << 'ENVEOF'
REACT_APP_API_URL=https://hr-analytics-engine.onrender.com
ENVEOF

echo "3. Setting development environment..."
cat > .env.development.local << 'ENVEOF'
REACT_APP_API_URL=http://localhost:10000
ENVEOF

echo "4. Verifying files..."
echo ""
echo "=== PRODUCTION (.env.production) ==="
cat .env.production
echo ""
echo "=== DEVELOPMENT (.env.development.local) ==="
cat .env.development.local

echo ""
echo "5. Testing API endpoints..."
echo "Testing production URL..."
curl -s https://hr-analytics-engine.onrender.com/api/health | grep -o '"status":"[^"]*"'
echo ""
echo "Testing local URL (if backend running)..."
curl -s http://localhost:10000/api/health 2>/dev/null | grep -o '"status":"[^"]*"' || echo "Local backend not running"

echo ""
echo "��� NEXT: Run: npm run build && vercel --prod"
