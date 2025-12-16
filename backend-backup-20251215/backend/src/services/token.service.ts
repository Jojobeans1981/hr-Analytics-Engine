export class TokenService {
  static generateToken(payload: any): string {
    return 'mock-token';
  }

  static verifyToken(token: string): any {
    return { userId: '123' };
  }

  static decodeToken(token: string): any {
    return { userId: '123' };
  }
}
