export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}