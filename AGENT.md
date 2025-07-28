# AGENT.md - HR Analytics Engine Development Guide

## Build & Test Commands
- **Development**: `npm run dev` (nodemon with src/server.js)
- **Production**: `npm start` (with path resolution fix)
- **Test all**: `npm test` (jest)
- **Test single file**: `jest path/to/test.test.js`
- **Test watch**: `npm run test:watch`
- **Test coverage**: `npm run test:coverage`
- **Lint**: `npm run lint` (eslint src/)
- **Format**: `npm run format` (prettier src/**/*.js)
- **Build**: `npm run build` (test + lint)

## Architecture
- **Backend**: Node.js + Express.js API server (port 3001/5000)
- **Database**: MongoDB with Mongoose ODM (transitioning from mock data)
- **Frontend**: React dashboard (talent-dashboard/ subproject, separate package.json)
- **Testing**: Jest with supertest for API integration tests
- **Auth**: JWT-based (in development)
- **Key directories**: src/{routes,controllers,models,services,middleware,data}

## Code Style & Conventions
- **Format**: Prettier (semi: true, singleQuote: true, tabWidth: 2)
- **Lint**: ESLint recommended rules (Node.js + ES2021)
- **Modules**: CommonJS (require/module.exports)
- **Imports**: Use relative paths, group by external/internal
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Error handling**: Express error middleware patterns
- **API**: RESTful routes under /api prefix with proper HTTP status codes
- **Tests**: Located in test/ directory, named *.test.js, use Jest + supertest
