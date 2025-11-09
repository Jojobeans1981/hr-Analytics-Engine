class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    try {
      this.socket = new WebSocket('ws://localhost:3001');
      
      this.socket.onopen = () => {
        console.log('✅ Connected to WebSocket server');
        this.reconnectAttempts = 0;
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received:', data);
          // Handle different message types
          this.handleMessage(data);
        } catch (error) {
          console.log('Raw message:', event.data);
        }
      };
      
      this.socket.onclose = () => {
        console.log('❌ Disconnected from WebSocket server');
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), 3000);
    }
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'welcome':
        console.log('Server says:', data.message);
        break;
      case 'echo':
        console.log('Echo from server:', data.message);
        break;
      default:
        console.log('Unknown message type:', data);
    }
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn('WebSocket not connected');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const websocketService = new WebSocketService();