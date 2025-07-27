const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  // Temporarily bypass auth for testing
  req.user = { id: 'test-user' };
  return next();
  
  /* Uncomment this when ready for real authentication
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
  */
};