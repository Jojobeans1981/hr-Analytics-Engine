---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary

A comprehensive HR Analytics Engine for talent risk assessment and employee retention management. This multi-project repository contains a Node.js/Express backend with MongoDB integration and multiple React frontends for real-time analytics dashboards. The project uses TypeScript across all components with Docker containerization support.

## Repository Structure

### Main Repository Components
- **Root Backend**: Core Express.js server with API endpoints for employees, assessments, and teams
- **Server Package**: Dedicated Node.js/Express backend service for API functionality
- **Dashboard Projects**: Multiple React frontends (3 variations) for visualization and analytics
- **Configuration & Scripts**: Docker setup, testing framework, linting, and deployment utilities
- **Documentation**: API reference and setup guides

## Projects

### Root Project (Core Backend)
**Configuration File**: package.json (v1.0.0)

#### Language & Runtime
**Language**: TypeScript, JavaScript  
**Runtime**: Node.js  
**Version**: TypeScript ^5.9.3  
**Build System**: Node.js with tsx/nodemon  
**Package Manager**: npm  

#### Dependencies
**Main Dependencies**:
- express ^5.1.0, cors 2.8.5
- mongoose ^8.16.5 (MongoDB ODM)
- redis ^5.6.1, ioredis ^5.6.1 (Caching)
- jsonwebtoken ^9.0.2, bcryptjs ^3.0.2 (Authentication)
- axios ^1.11.0 (HTTP client)
- react ^19.1.8, react-dom ^19.1.8
- @mui/material ^7.2.0 (UI Framework)
- recharts ^2.8.0 (Charting)

**Development Dependencies**:
- jest ^30.0.5 (Testing)
- typescript ^5.9.3, ts-node ^10.9.2
- eslint ^9.32.0, prettier ^3.6.2
- nodemon ^3.1.10 (Development server)
- supertest ^7.1.4 (API testing)
- @faker-js/faker ^9.9.0 (Test data)

#### Build & Installation
```bash
npm install
npm run dev          # Development with tsx watch
npm run build        # Compile TypeScript
npm start            # Start production server
npm test             # Run Jest tests
npm run test:watch   # Watch mode testing
npm run lint         # ESLint check
npm run format       # Prettier formatting
```

#### Docker
**Configuration**: docker-compose.yml  
**Services**:
- Main app on port 3000
- MongoDB 5 on port 27017
- Redis 7 on port 6379
**Setup**: Multi-container with volume mounting for development

#### Testing
**Framework**: Jest  
**Configuration**: jest.config.json  
**Test Match Pattern**: `**/test/**/*.test.js`  
**Coverage Directory**: ./coverage  
**Run Command**:
```bash
npm test
npm run test:watch
npm run test:coverage
```

---

### Server Project
**Configuration File**: server/package.json (v1.0.0)

#### Language & Runtime
**Language**: TypeScript  
**Runtime**: Node.js  
**Version**: TypeScript ^5.3.3  
**Build System**: tsc (TypeScript compiler)  
**Package Manager**: npm  

#### Dependencies
**Main Dependencies**:
- express ^4.18.2, cors 2.8.5
- mongoose ^8.0.3 (MongoDB)
- ws ^8.18.3 (WebSocket)
- helmet ^8.1.0 (Security headers)
- joi ^18.0.1 (Validation)
- express-rate-limit ^8.0.1 (Rate limiting)
- morgan ^1.10.1 (Logging)

**Development Dependencies**:
- typescript ^5.3.3, tsx ^4.0.0
- nodemon ^3.1.10
- @types/express, @types/node, @types/mongoose

#### Build & Installation
```bash
npm install
npm run dev          # Development with tsx watch
npm run build        # Compile to dist/
npm start            # Run compiled dist/index.js
npm run seed         # Database seeding
```

#### Main Entry Point
**File**: server/src/index.ts  
**Port**: Default 5000 (configurable via PORT env var)  
**Features**: Express app with CORS, MongoDB connection, employee routes

---

### Dashboard-new Project
**Configuration File**: dashboard-new/package.json (v0.1.0)

#### Language & Runtime
**Language**: TypeScript, React  
**Version**: React 18.2.0, TypeScript ^4.9.5  
**Build System**: Create React App  
**Package Manager**: npm  

#### Dependencies
**Main**: react 18.2.0, react-dom 18.2.0, react-router-dom 6.8.0  
**UI/Styling**: @mui/material ^5.15.0, @emotion/react ^11.11.1  
**API**: axios ^1.13.2, ws ^8.14.2  
**Charting**: recharts ^2.8.0, lucide-react ^0.553.0  

#### Build & Installation
```bash
npm install
npm start            # Development server (localhost:3000)
npm run build        # Production build
npm test             # React testing
npm run eject        # Eject from CRA (one-way operation)
```

#### Testing
**Framework**: React Testing Library, Jest  
**Configuration**: CRA default  

---

### Talent-dashboard Project
**Configuration File**: talent-dashboard/package.json (v0.1.0)

#### Language & Runtime
**Language**: TypeScript, React  
**Version**: React 18.2.0, TypeScript ^4.9.5  
**Build System**: Vite  
**Package Manager**: npm  

#### Dependencies
**Main**: react 18.2.0, react-router-dom ^6.18.0  
**UI/Styling**: @mui/material ^7.2.0, @emotion/react ^11.11.1  
**Utilities**: axios ^1.6.2, mongodb ^6.3.0, cors 2.8.5  
**Charting**: chart.js ^4.4.0, recharts ^2.8.0  

#### Build & Installation
```bash
npm install
npm start            # Vite dev server
npm run build        # Production build
npm test             # Testing
```

#### Build Configuration
**Vite Config**: vite.config.ts  
**Path Alias**: @/ → ./src/

---

### Talent-dashboard-new Project
**Configuration File**: talent-dashboard-new/package.json (v0.1.0)

#### Language & Runtime
**Language**: TypeScript, React  
**Version**: React 19.2.0, TypeScript ^4.9.5  
**Build System**: Create React App  
**Package Manager**: npm  

#### Dependencies
**Main**: react ^19.2.0, react-dom ^19.2.0  
**Testing**: @testing-library/react ^16.3.0, @testing-library/jest-dom ^6.9.1  
**Support**: web-vitals ^2.1.4  

#### Build & Installation
```bash
npm install
npm start            # Development server
npm run build        # Production build
npm test             # React testing
```

---

## Configuration & Infrastructure

### Testing Framework
**Global Configuration**: jest.config.json  
- **Environment**: Node.js
- **Test Pattern**: `**/test/**/*.test.js`
- **Coverage Directory**: ./coverage
- **Ignore**: /node_modules/

### Code Quality
**ESLint**: .eslintrc.json  
- Extends eslint:recommended
- Environment: Node.js, ES2021, Jest
- ECMAVersion: 12

**Prettier**: .prettierrc  
- Code formatting configuration

### Deployment
**Docker Compose**: docker-compose.yml  
**Services**: Main app, MongoDB, Redis  
**Development**: Volume mounting for hot-reload

## Project Structure Summary

```
talent-risk-ai/
├── src/                    # Root backend source
├── server/                 # Dedicated API backend
├── dashboard-new/          # React dashboard (CRA)
├── talent-dashboard/       # React dashboard (Vite)
├── talent-dashboard-new/   # React dashboard v2 (CRA)
├── test/                   # Test fixtures & integration tests
├── public/                 # Static assets
├── scripts/                # Build & deployment scripts
├── docs/                   # Documentation
└── Configuration files     # package.json, tsconfig, docker-compose
```
