/**
 * WebSocket message types for real-time communication
 */

export interface WebSocketMessage {
  type: 'risk_update' | 'employee_update' | 'notification' | 'ping' | 'pong' | 'error';
  data?: any;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface RiskUpdateMessage extends WebSocketMessage {
  type: 'risk_update';
  data: {
    employeeId: string;
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    timestamp: Date;
  };
}

export interface EmployeeUpdateMessage extends WebSocketMessage {
  type: 'employee_update';
  data: {
    employeeId: string;
    status: 'active' | 'at_risk' | 'resigned' | 'terminated';
    changes: Record<string, any>;
  };
}

export interface NotificationMessage extends WebSocketMessage {
  type: 'notification';
  data: {
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high';
    category: 'risk' | 'system' | 'alert';
  };
}

export interface ClientInfo {
  id: string;
  connectedAt: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}

export type WebSocketData = string | Buffer | ArrayBuffer | Buffer[];
