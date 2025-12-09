# 🚀 **Prometheus Talent Risk Analytics Engine**

![Dashboard Preview](https://img.shields.io/badge/Preview-Interactive-blueviolet?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Powered-ff6b6b?style=for-the-badge)
![Real-time](https://img.shields.io/badge/Real--time-WebSocket-4ecdc4?style=for-the-badge)

## ⚡ **Sophisticated AI-powered Talent Risk Assessment**

**Identifies · Predicts · Mitigates** employee attrition risks using machine learning patterns and real-time analytics

---

## 🎯 **Quick Start**

### 📋 **Prerequisites**

```bash
✅ Node.js 18+
✅ MongoDB database
✅ Git installed
✅ Modern browser
🛠️ Installation
bash
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
🚀 First-Time Setup
bash
# Seed the database with sample employees
npm run seed

# Access the API
🌐 http://localhost:5000

# Test endpoints
🔍 Health: http://localhost:5000/api/health
👥 Employees: http://localhost:5000/api/employees
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
🔌 API Endpoints
Endpoint Method Description Returns
/api/health GET System health check {"status":"healthy","timestamp":"2024-01-15T10:30:00Z"}
/api/employees GET Get all employees with risk analysis Employee[] with risk scores
/api/employees/:id GET Get specific employee details Detailed employee profile
/api/risk GET Risk assessment data Risk metrics and trends
/api/dashboard GET Dashboard metrics Aggregate statistics
⚡ WebSocket Server
Real-time connection: ws://localhost:5000

Features:

📡 Live employee risk updates

🔔 Instant notifications

📊 Real-time dashboard updates

⚙️ Development Commands
bash
# 🛠️ Development
npm run dev              # Start dev server with hot reload
npm run dev:debug       # Start with debugging enabled

# 🌱 Database Operations
npm run seed            # Seed database with sample data
npm run seed:clear      # Clear and reseed database
npm run seed:50         # Seed 50 employees
npm run seed:100        # Seed 100 employees

# 🚀 Build & Production
npm run build           # Compile TypeScript to JavaScript
npm run start           # Start production server

# 🧹 Clean
npm run clean           # Clean build artifacts

# 🔍 Testing
npm run test            # Run test suite
npm run lint            # Lint codebase
🧠 Multi-factor Risk Assessment
⚖️ Risk Factor Weight Distribution
Factor Weight Icon Description
Performance 40% 📊 Recent performance ratings
Tenure 20 ⏳ Time at company
Engagement 20% 💡 Employee engagement scores
Compensation 10% 💰 Compensation ratio analysis
Skills 10% 🎯 Skill gaps and development
🎚️ Risk Levels
Score Range Level Color Action Required
0-30% Low 🟢 Routine monitoring
31-60% Medium 🟡 Development plan
61-80% High 🟠 Intervention needed
81-100% Critical 🔴 Immediate action
🚀 Deployment
🚂 Backend (Railway)
Connect GitHub repository to Railway

Add environment variables:

env
MONGODB_URI=your_connection_string
PORT=5000
CORS_ORIGIN=your_frontend_url
Railway automatically:

Detects package.json scripts

Runs npm run build

Starts with npm run start

⚡ Frontend (Vercel)
Import project from GitHub

Configure build settings

Add environment variables:

env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app
Connect to backend API

📊 Data Model
typescript
interface Employee {
  employeeId: string;           // "EMP1001"
  name: string;                 // "John Doe"
  email: string;                // "john.doe@company.com"
  department: string;           // "Engineering"
  role: string;                 // "Senior Developer"
  
  // Risk Assessment
  riskScore: number;            // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Assessment Factors
  performanceRating: number;    // 1-5
  tenureMonths: number;         // Months at company
  engagementScore: number;      // 0-100
  lastPromotionMonths: number;  // Months since promotion
  
  // Skills Analysis
  criticalSkills: string[];     // ["React", "Node.js", "TypeScript"]
  skillGaps: string[];          // ["AWS", "Docker"]
  trainingNeeds: string[];      // ["Leadership", "Cloud"]
  
  // Compensation
  compensationRatio: number;    // 0.8-1.2 (vs market)
  
  // Timeline
  createdAt: Date;
  updatedAt: Date;
  lastRiskAssessment: Date;
}
🐛 Troubleshooting
🗄️ Database Connection Failed
bash
# Verify MongoDB URI in .env
# Check network connectivity to MongoDB Atlas
# Ensure IP is whitelisted in Atlas

# Test connection:
mongosh "your_connection_string"
📝 TypeScript Compilation Errors
bash
# Clean and rebuild
npm run clean
npm run build
🌐 CORS Errors
javascript
// Update CORS_ORIGIN in .env
CORS_ORIGIN=https://your-frontend.vercel.app
🚫 Server Won't Start
bash
# Check port availability
lsof -i :5000

# Verify environment variables
echo $MONGODB_URI
🧪 Testing Endpoints
bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test employees endpoint
curl http://localhost:5000/api/employees
🤝 Contributing
💖 Want to Contribute?
We welcome contributions from the community!

Fork the repository

Create feature branch

Commit changes

Open Pull Request

🛠️ Built with
Node.js - JavaScript runtime

TypeScript - Type safety

Express - Web framework

MongoDB - Database

WebSocket - Real-time communication

Deployed on 🚂 Railway & ⚡ Vercel

MIT License • © 2024 Prometheus Talent Risk Analytics