import { WebSocketServer } from 'ws';
import { createServer } from 'http';

// Create HTTP server for handling upgrade requests
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running. Connect via WebSocket protocol.');
});

const wss = new WebSocketServer({ 
  server, // Attach to HTTP server instead of port
  path: '/', // Explicit path
  perMessageDeflate: false
});

console.log('🚀 WebSocket server starting...');

wss.on('connection', (ws, request) => {
  console.log('✅ New WebSocket connection from:', request.socket.remoteAddress);
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to Talent Risk AI WebSocket server',
    timestamp: new Date().toISOString(),
    connectionId: Math.random().toString(36).substr(2, 9)
  }));

  // Handle messages
  ws.on('message', (data) => {
    try {
      const message = data.toString();
      console.log('📨 Received message:', message);
      
      // Try to parse as JSON
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch {
        parsedMessage = { type: 'text', content: message };
      }

      // Handle different message types
      switch (parsedMessage.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
          break;
        case 'get_employees':
          // Simulate employee data
          ws.send(JSON.stringify({
            type: 'employees_data',
            data: [
              { id: 1, name: 'John Doe', riskScore: 25, riskLevel: 'Low' },
              { id: 2, name: 'Jane Smith', riskScore: 65, riskLevel: 'Medium' }
            ],
            timestamp: new Date().toISOString()
          }));
          break;
        default:
          // Echo back
          ws.send(JSON.stringify({
            type: 'echo',
            message: `Server received: ${message}`,
            timestamp: new Date().toISOString()
          }));
      }

    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message',
        timestamp: new Date().toISOString()
      }));
    }
  });

  // Handle client disconnect
  ws.on('close', (code, reason) => {
    console.log('❌ Client disconnected:', code, reason?.toString());
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  // Send periodic updates (simulate real-time data)
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: 'heartbeat',
        message: 'Server is alive',
        timestamp: new Date().toISOString(),
        activeConnections: wss.clients.size
      }));
    }
  }, 30000);

  // Cleanup on close
  ws.on('close', () => {
    clearInterval(interval);
  });
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🎯 HTTP server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready at ws://localhost:${PORT}`);
  console.log('📋 Test by visiting: http://localhost:3000 in your browser');
});