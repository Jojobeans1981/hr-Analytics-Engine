import jwt from 'jsonwebtoken';
import { Token } from '../models/token.model.js';

export class TokenService {
  public static async blacklistToken(token: string): Promise<void> {
    try {
      await Token.create({ token });
    } catch (error) {
      console.error('Failed to blacklist token:', error);
      throw new Error('Failed to blacklist token');
    }
  }

  public static async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const foundToken = await Token.findOne({ token });
      return !!foundToken;
    } catch (error) {
      console.error('Failed to check token blacklist:', error);
      throw new Error('Failed to check token status');
    }
  }

  public static async clearExpiredTokens(): Promise<void> {
    try {
      await Token.deleteMany({
        createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });
    } catch (error) {
      console.error('Failed to clear expired tokens:', error);
      throw new Error('Failed to clear expired tokens');
    }
  }
}