import jwt from 'jsonwebtoken';
import config from 'config';

interface TokenPayload {
  userId: string;
  role?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || config.get('jwt.secret'),
    { expiresIn: config.get('jwt.expiresIn') }
  );
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || config.get('jwt.secret')
  ) as TokenPayload;
};