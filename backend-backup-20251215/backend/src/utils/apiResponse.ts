import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, message?: string): void {
    res.json({ success: true, data, message });
  }

  static error(res: Response, error: string, code: number = 500): void {
    res.status(code).json({ success: false, error });
  }

  static created(res: Response, data: any): void {
    res.status(201).json({ success: true, data });
  }

  static notFound(res: Response, message: string = 'Resource not found'): void {
    res.status(404).json({ success: false, error: message });
  }

  static badRequest(res: Response, message: string): void {
    res.status(400).json({ success: false, error: message });
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): void {
    res.status(401).json({ success: false, error: message });
  }
}
