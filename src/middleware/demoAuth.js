const basicAuth = require('express-basic-auth');

const demoAuth = basicAuth({
  users: { 
    'demo': 'prometheus2025',
    'viewer': 'letmein123' 
  },
  challenge: true,
  realm: 'Prometheus Analytics Demo',
  unauthorizedResponse: 'Unauthorized. Use demo/prometheus2025'
});

module.exports = demoAuth; v
