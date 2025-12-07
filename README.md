🚀 Prometheus Talent Risk Analytics Engine
<div align="center">
https://img.shields.io/badge/Preview-Interactive-blueviolet?style=for-the-badge
https://img.shields.io/badge/AI-Powered-ff6b6b?style=for-the-badge
https://img.shields.io/badge/Real--time-WebSocket-4ecdc4?style=for-the-badge

</div><div align="center" style="margin: 2rem 0; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; color: white;">
⚡ Sophisticated AI-powered Talent Risk Assessment
Identifies · Predicts · Mitigates employee attrition risks using machine learning patterns and real-time analytics

</div>
🎯 Quick Start
<div class="quick-start-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 2rem 0;"><div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #667eea;">
📋 Prerequisites
bash
✅ Node.js 18+
✅ MongoDB database
✅ Git installed
✅ Modern browser
</div><div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #4ecdc4;">
🛠️ Installation
<details> <summary><strong>Click to expand installation steps</strong></summary>
bash
# Clone the repository
git clone <your-repo-url>
cd talent-risk-ai/server

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env with your MongoDB credentials
# (Open in your preferred editor)

# Build the project
npm run build

# Start development server
npm run dev
</details></div><div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #ff6b6b;">
🚀 First-Time Setup
bash
# Seed the database with sample employees
npm run seed

# Access the API
🌐 http://localhost:5000

# Test endpoints
🔍 Health: http://localhost:5000/api/health
👥 Employees: http://localhost:5000/api/employees
</div></div>
📁 Project Structure
<div style="background: #1a1a2e; color: #e2e8f0; padding: 1.5rem; border-radius: 10px; margin: 2rem 0; font-family: 'Monaco', 'Consolas', monospace;">
text
talent-risk-ai/
├── 📁 server/                           # Backend API Server (TypeScript/Express)
│   ├── 📁 src/
│   │   ├── 🔧 config/                  # Configuration files
│   │   ├── 🎮 controllers/             # Request handlers
│   │   ├── 🗄️ models/                  # MongoDB Schemas
│   │   ├── 🛣️ routes/                  # Express routes
│   │   ├── ⚙️ services/                # Business logic
│   │   ├── 📝 types/                   # TypeScript interfaces
│   │   └── 🛡️ middleware/              # Express middleware
│   ├── 🚀 server.tsx                   # Main server entry point
│   ├── 🌱 seed-main.ts                 # Database seeding
│   ├── package.json
│   └── tsconfig.json
└── 📁 dashboard-new/                   # Frontend dashboard (Vercel)
</div>
🔌 API Endpoints
<div class="api-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin: 2rem 0;"><div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.5rem; border-radius: 10px; color: white;"> <h3>✅ GET /api/health</h3> <p><strong>System health check</strong></p> <code style="background: rgba(255,255,255,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">Returns: {"status":"healthy","timestamp":"2024-01-15T10:30:00Z"}</code> </div><div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 1.5rem; border-radius: 10px; color: white;"> <h3>👥 GET /api/employees</h3> <p><strong>Get all employees with risk analysis</strong></p> <code style="background: rgba(255,255,255,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">Returns: Employee[] with risk scores</code> </div><div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 1.5rem; border-radius: 10px; color: white;"> <h3>🔍 GET /api/employees/:id</h3> <p><strong>Get specific employee details</strong></p> <code style="background: rgba(255,255,255,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">Returns: Detailed employee profile</code> </div><div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 1.5rem; border-radius: 10px; color: white;"> <h3>📊 GET /api/risk</h3> <p><strong>Risk assessment data</strong></p> <code style="background: rgba(255,255,255,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">Returns: Risk metrics and trends</code> </div><div style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); padding: 1.5rem; border-radius: 10px; color: white;"> <h3>📈 GET /api/dashboard</h3> <p><strong>Dashboard metrics</strong></p> <code style="background: rgba(255,255,255,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">Returns: Aggregate statistics</code> </div></div>
⚡ WebSocket Server
<div style="background: #2d3748; padding: 1.5rem; border-radius: 10px; margin: 1rem 0; border-left: 4px solid #ecc94b;"> <p><strong>Real-time connection:</strong> <code style="background: #4a5568; padding: 0.2rem 0.5rem; border-radius: 4px; color: #ecc94b;">ws://localhost:5000</code></p> <ul style="margin-top: 0.5rem;"> <li>📡 Live employee risk updates</li> <li>🔔 Instant notifications</li> <li>📊 Real-time dashboard updates</li> </ul> </div>
⚙️ Development Commands
<div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.5rem; margin: 2rem 0;">
bash
# 🛠️ Development
npm run dev              # Start dev server with hot reload
npm run dev:debug       # Start with debugging enabled

# 🌱 Database Operations
npm run seed            # Seed database with sample data
npm run seed:clear      # Clear and reseed database
npm run seed:50         # Seed 50 employees
npm run seed:100        # Seed 100 employees
npm run seed:custom     # Interactive seeding

# 🚀 Build & Production
npm run build           # Compile TypeScript to JavaScript
npm run start           # Start production server
npm run start:prod      # Production with optimizations

# 🧹 Clean
npm run clean           # Clean build artifacts
npm run clean:all       # Clean all generated files

# 🔍 Testing
npm run test            # Run test suite
npm run test:watch      # Run tests in watch mode
npm run lint            # Lint codebase
npm run lint:fix        # Fix linting issues
</div>
🧠 Multi-factor Risk Assessment
<div class="risk-factors" style="margin: 3rem 0;"><div class="risk-meter" style="margin: 2rem 0; padding: 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; color: white;"> <h3 style="text-align: center; margin-bottom: 1rem;">⚖️ Risk Factor Weight Distribution</h3> <div style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center;"> <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;"> <div style="font-size: 1.5rem; font-weight: bold; color: #ffd700;">40%</div> <div>📊 Performance</div> </div> <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;"> <div style="font-size: 1.5rem; font-weight: bold; color: #4ecdc4;">20%</div> <div>⏳ Tenure</div> </div> <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;"> <div style="font-size: 1.5rem; font-weight: bold; color: #ff6b6b;">20%</div> <div>💡 Engagement</div> </div> <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;"> <div style="font-size: 1.5rem; font-weight: bold; color: #95e1d3;">10%</div> <div>💰 Compensation</div> </div> <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;"> <div style="font-size: 1.5rem; font-weight: bold; color: #f08a5d;">10%</div> <div>🎯 Skills</div> </div> </div> </div>
🎚️ Risk Levels
<div class="risk-levels" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0;"><div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 1.5rem; border-radius: 10px; color: white; text-align: center;"> <div style="font-size: 2rem; font-weight: bold;">🟢 0-30%</div> <h3 style="margin: 0.5rem 0;">Low</h3> <p style="margin: 0;">Routine monitoring</p> </div><div style="background: linear-gradient(135deg, #fad961 0%, #f76b1c 100%); padding: 1.5rem; border-radius: 10px; color: white; text-align: center;"> <div style="font-size: 2rem; font-weight: bold;">🟡 31-60%</div> <h3 style="margin: 0.5rem 0;">Medium</h3> <p style="margin: 0;">Development plan</p> </div><div style="background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%); padding: 1.5rem; border-radius: 10px; color: white; text-align: center;"> <div style="font-size: 2rem; font-weight: bold;">🟠 61-80%</div> <h3 style="margin: 0.5rem 0;">High</h3> <p style="margin: 0;">Intervention needed</p> </div><div style="background: linear-gradient(135deg, #ff5858 0%, #f09819 100%); padding: 1.5rem; border-radius: 10px; color: white; text-align: center;"> <div style="font-size: 2rem; font-weight: bold;">🔴 81-100%</div> <h3 style="margin: 0.5rem 0;">Critical</h3> <p style="margin: 0;">Immediate action</p> </div></div></div>
🚀 Deployment
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 2rem 0;"><div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; border: 2px solid #667eea;"> <h3>🚂 Backend (Railway)</h3> <ol style="padding-left: 1.2rem;"> <li>Connect GitHub repository to Railway</li> <li>Add environment variables:</li> <pre style="background: #e9ecef; padding: 0.5rem; border-radius: 5px; margin: 0.5rem 0;"> MONGODB_URI=your_connection_string PORT=5000 CORS_ORIGIN=your_frontend_url </pre> <li>Railway automatically: <ul> <li>Detects package.json scripts</li> <li>Runs <code>npm run build</code></li> <li>Starts with <code>npm run start</code></li> </ul> </li> </ol> </div><div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; border: 2px solid #000000;"> <h3>⚡ Frontend (Vercel)</h3> <ol style="padding-left: 1.2rem;"> <li>Import project from GitHub</li> <li>Configure build settings</li> <li>Add environment variables:</li> <pre style="background: #e9ecef; padding: 0.5rem; border-radius: 5px; margin: 0.5rem 0;"> NEXT_PUBLIC_API_BASE_URL= https://your-backend.railway.app </pre> <li>Connect to backend API</li> </ol> </div></div>
📊 Data Model
<div style="background: #1a1a2e; color: #e2e8f0; padding: 1.5rem; border-radius: 10px; margin: 2rem 0; font-family: 'Monaco', 'Consolas', monospace; position: relative; overflow: hidden;">
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
</div>
🐛 Troubleshooting
<details> <summary style="background: #ff6b6b20; padding: 1rem; border-radius: 8px; cursor: pointer; border-left: 4px solid #ff6b6b;"> <strong>🔧 Common Issues & Solutions</strong> </summary> <div style="padding: 1.5rem; background: #f8f9fa; border-radius: 0 0 8px 8px; margin-top: -1rem;">
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

# Check for TypeScript errors
npx tsc --noEmit
🌐 CORS Errors
javascript
// Update CORS_ORIGIN in .env
CORS_ORIGIN=https://your-frontend.vercel.app

// Check frontend configuration
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
🚫 Server Won't Start
bash
# Check port availability
lsof -i :5000

# Verify environment variables
echo $MONGODB_URI

# Check logs
npm run dev 2>&1 | tail -50
🧪 Testing Endpoints
bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test employees endpoint
curl http://localhost:5000/api/employees | jq .

# Test with specific ID
curl http://localhost:5000/api/employees/EMP1001 | jq .
</div> </details>
🤝 Contributing
<div style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); padding: 2rem; border-radius: 15px; color: white; margin: 2rem 0; text-align: center;"><h2>💖 Want to Contribute?</h2> <p>We welcome contributions from the community!</p><div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;"> <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;"> <div style="font-size: 2rem;">1</div> <div>Fork the repository</div> </div> <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;"> <div style="font-size: 2rem;">2</div> <div>Create feature branch</div> </div> <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;"> <div style="font-size: 2rem;">3</div> <div>Commit changes</div> </div> <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; text-align: center;"> <div style="font-size: 2rem;">4</div> <div>Open Pull Request</div> </div> </div></div>
<div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 15px; margin-top: 2rem;">
Built with 💙 using
<div style="display: flex; justify-content: center; gap: 2rem; margin: 1rem 0; flex-wrap: wrap;"> <span style="background: #339933; color: white; padding: 0.5rem 1rem; border-radius: 20px;">Node.js</span> <span style="background: #3178c6; color: white; padding: 0.5rem 1rem; border-radius: 20px;">TypeScript</span> <span style="background: #000000; color: white; padding: 0.5rem 1rem; border-radius: 20px;">Express</span> <span style="background: #47a248; color: white; padding: 0.5rem 1rem; border-radius: 20px;">MongoDB</span> <span style="background: #ecc94b; color: black; padding: 0.5rem 1rem; border-radius: 20px;">WebSocket</span> </div>
Deployed on 🚂 Railway & ⚡ Vercel

MIT License • © 2024 Prometheus Talent Risk Analytics

</div><style> @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } } @keyframes glow { 0%, 100% { box-shadow: 0 0 5px #667eea; } 50% { box-shadow: 0 0 20px #667eea; } } * { animation: fadeIn 0.5s ease-out; } h1, h2, h3 { animation: fadeIn 0.7s ease-out; } .quick-start-grid > div:hover { transform: translateY(-5px); transition: transform 0.3s ease; animation: glow 2s infinite; } .api-grid > div:hover { animation: pulse 0.5s ease; } .risk-levels > div:hover { transform: scale(1.05); transition: transform 0.3s ease; cursor: pointer; } details[open] summary { border-radius: 8px 8px 0 0; } code { font-family: 'Monaco', 'Consolas', monospace; transition: background-color 0.3s ease; } code:hover { background-color: #e2e8f0 !important; } pre { position: relative; overflow-x: auto; } pre::before { content: '📋'; position: absolute; top: 10px; right: 10px; opacity: 0.5; } .risk-meter > div > div:hover { transform: scale(1.1); transition: transform 0.3s ease; } </style><script> // Add some interactive functionality document.addEventListener('DOMContentLoaded', function() { // Add click animation to code blocks const codeBlocks = document.querySelectorAll('code'); codeBlocks.forEach(code => { code.addEventListener('click', function() { this.style.backgroundColor = '#ffd700'; setTimeout(() => { this.style.backgroundColor = ''; }, 300); }); }); // Add hover effect to risk levels const riskLevels = document.querySelectorAll('.risk-levels > div'); riskLevels.forEach(level => { level.addEventListener('mouseenter', function() { this.style.filter = 'brightness(1.1)'; }); level.addEventListener('mouseleave', function() { this.style.filter = 'brightness(1)'; }); }); // Copy to clipboard for code snippets const copyButtons = document.querySelectorAll('pre'); copyButtons.forEach(pre => { pre.addEventListener('click', async function() { const code = this.querySelector('code'); if (code) { try { await navigator.clipboard.writeText(code.textContent); const originalColor = this.style.backgroundColor; this.style.backgroundColor = '#43e97b'; setTimeout(() => { this.style.backgroundColor = originalColor; }, 500); } catch (err) { console.error('Failed to copy:', err); } } }); }); }); </script>