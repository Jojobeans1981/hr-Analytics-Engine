export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const jwt = {
  sign: (payload: JwtPayload, secret: string, options?: any): string => {
    return 'jwt-token-mock';
  },

  verify: (token: string, secret: string): JwtPayload => {
    return { userId: '123', email: 'user@example.com', role: 'user' };
  },

  decode: (token: string): JwtPayload | null => {
    return { userId: '123', email: 'user@example.com', role: 'user' };
  }
};
