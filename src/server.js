const { connectToServer, getDb } = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 3001;

connectToServer()
  .then(() => {
    // Make DB available to routes
    app.locals.db = getDb();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB connected to: ${process.env.MONGODB_URI.split('@')[1]}`);
    });
  })
  .catch(err => {
    console.error("Failed to start:", err);
    process.exit(1);
  });