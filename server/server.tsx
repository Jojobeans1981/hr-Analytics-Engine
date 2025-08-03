import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // Use different port than frontend

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000' // Your frontend URL
}));

// Add this before your routes
app.use(express.json()); // For parsing application/json

// Example API endpoint
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});