import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http'; // ← ADD THIS
import WebSocket from 'ws'; // ← ADD THIS

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Create HTTP server from Express app ← ADD THIS
const server = http.createServer(app);

// Create WebSocket server attached to the same server ← ADD THIS
const wss = new WebSocket.Server({ 
  server,
  // Optional: add CORS for WebSocket if needed
  perMessageDeflate: false
});

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000' // Your frontend URL
}));

// Add this before your routes
app.use(express.json()); // For parsing application/json

// Your existing API endpoint
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// WebSocket connection handler ← ADD THIS
wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket client connected');
  
  // Send welcome message when client connects
  ws.send(JSON.stringify({ 
    type: 'welcome',
    message: 'Connected to WebSocket server',
    timestamp: new Date().toISOString()
  }));
  
  // Handle messages from client
  ws.on('message', (data) => {
    try {
      const message = data.toString();
      console.log('📨 Received message:', message);
      
      // Echo back to client
      ws.send(JSON.stringify({
        type: 'echo',
        message: `Server received: ${message}`,
        timestamp: new Date().toISOString()
      }));
      
      // You can also broadcast to all connected clients
      // broadcastToAll(JSON.stringify({ type: 'broadcast', message, timestamp: new Date().toISOString() }));
      
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  // Handle client disconnect
  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
  });
  
  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Optional: Broadcast function to send to all clients ← ADD THIS
function broadcastToAll(message: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// CHANGE THIS: Use server.listen() instead of app.listen() ← IMPORTANT!
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🔌 WebSocket server available at ws://localhost:${port}`);
});