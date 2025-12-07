# Prometheus Talent Risk Analytics Engine

A sophisticated AI-powered talent risk assessment system that identifies, predicts, and mitigates employee attrition risks using machine learning patterns and real-time analytics.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB database
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd talent-risk-ai/server

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB credentials

# Build the project
npm run build

# Start development server
npm run dev
First-Time Setup
bash
# Seed the database with sample employees
npm run seed

# Access the API at http://localhost:5000
# Health check: http://localhost:5000/api/health
# Employees endpoint: http://localhost:5000/api/employees
📁 Project Structure
text
talent-risk-ai/
├── server/                           # Backend API Server (TypeScript/Express)
│   ├── src/
│   │   ├── config/                  # Configuration files
│   │   ├── controllers/             # Request handlers
│   │   ├── models/                  # MongoDB Schemas
│   │   ├── routes/                  # Express routes
│   │   ├── services/                # Business logic
│   │   ├── types/                   # TypeScript interfaces
│   │   └── middleware/              # Express middleware
│   ├── server.tsx                   # Main server entry point
│   ├── seed-main.ts                 # Database seeding
│   ├── package.json
│   └── tsconfig.json
└── dashboard-new/                   # Frontend dashboard (Vercel)
🔧 API Endpoints
Core Endpoints
GET /api/health - System health check

GET /api/employees - Get all employees with risk analysis

GET /api/employees/:id - Get specific employee details

GET /api/risk - Risk assessment data

GET /api/dashboard - Dashboard metrics

GET /api/websocket/clients - WebSocket connection info

WebSocket Server
Real-time connection: ws://localhost:5000

Live employee risk updates

Instant notifications

🛠️ Development Commands
bash
# Development
npm run dev              # Start dev server with hot reload

# Database Operations
npm run seed             # Seed database with sample data
npm run seed:clear       # Clear and reseed database
npm run seed:50          # Seed 50 employees
npm run seed:100         # Seed 100 employees

# Build & Production
npm run build           # Compile TypeScript to JavaScript
npm run start           # Start production server

# Clean
npm run clean           # Clean build artifacts
⚙️ Environment Configuration
Create a .env file in the server/ directory:

env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
NODE_ENV=development

# CORS Configuration (for your frontend)
CORS_ORIGIN=https://dashboard-new-eta-blond.vercel.app
🧠 Features
Real-time Risk Monitoring
Live WebSocket connections for instant updates

Continuous risk scoring based on multiple factors

Automatic alerts for high-risk employees

Department-level risk dashboards

Multi-factor Risk Assessment
Factor Weight Description
Performance 40% Recent performance ratings
Tenure 20% Time at company
Engagement 20% Employee engagement scores
Compensation 10%Compensation ratio analysis
Skills 10% Skill gaps and development
Risk Levels
Score RangeLevel monitoring
31-60% Medium Development plan
61-80% High Intervention needed
81-100% Critical Immediate action
🚀 Deployment
Backend (Railway)
Connect your GitHub repository to Railway

Add environment variables in Railway dashboard:

MONGODB_URI

PORT

CORS_ORIGIN

Railway will automatically:

Detect package.json scripts

Run npm run build

Start with npm run start

Frontend (Vercel)
Import project from GitHub

Configure build settings

Add environment variables:

NEXT_PUBLIC_API_BASE_URL (your Railway backend URL)

Connect to backend API

📊 Data Model
Employee Schema
typescript
{
  employeeId: string,
  name: string,
  email: string,
  department: string,
  role: string,
  riskScore: number,
  riskLevel: 'low' | 'medium' | 'high',
  performanceRating: number,
  tenureMonths: number,
  engagementScore: number,
  criticalSkills: string[],
  skillGaps: string[]
}
🔌 Integration
Frontend Connection
javascript
// API Base URL for development
const API_URL = 'http://localhost:5000/api'

// API Base URL for production (Railway)
const API_URL = 'https://your-backend.railway.app/api'

// WebSocket Connection
const ws = new WebSocket('wss://your-backend.railway.app')
🐛 Troubleshooting
Common Issues
Database Connection Failed

bash
# Verify MongoDB URI in .env
# Check network connectivity to MongoDB Atlas
# Ensure IP is whitelisted in Atlas
TypeScript Compilation Errors

bash
npm run build
# Fix any TypeScript errors shown
CORS Errors

Update CORS_ORIGIN in .env

Check frontend URL configuration

Server Won't Start

bash
# Check if port 5000 is available
# Verify all environment variables are set
# Check MongoDB connection
Testing Endpoints
bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test employees endpoint
curl http://localhost:5000/api/employees

# Test with specific ID
curl http://localhost:5000/api/employees/EMP1001
📈 Monitoring
Health Checks
API: GET /api/health

Database: MongoDB connection status

WebSocket: Active connections count

Logs
Application logs in console

Error logs in logs/ directory

Railway dashboard for production logs

Vercel dashboard for frontend logs

🤝 Contributing
Fork the repository

Create a feature branch

Commit changes

Push to the branch

Open a Pull Request

📄 License
MIT License

🙏 Acknowledgments
Built with Node.js, Express, TypeScript, and MongoDB

Real-time features powered by WebSocket

Deployed on Railway and Vercel

