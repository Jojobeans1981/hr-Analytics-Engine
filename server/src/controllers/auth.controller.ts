import { Request, Response } from 'express';
import { AuthService } from '../server/src/services/auth.service';
import { LoginDto, RegisterDto } from '../server/src/dtos/auth';
import { validateRequest } from '../server/src/middleware/validation.middleware';
import { ApiResponse } from '../server/src/utils/apiResponse';
import { TokenService } from '../server/src/services/token.service';
import { UserService } from '../server/src/services/user.service';

export class AuthController {
  public static async login(request: Request, response: Response): Promise<Response> {
    try {
      await validateRequest(LoginDto, request.body);
      
      const { email, password } = request.body;
      const { accessToken, refreshToken, user } = await AuthService.login(email, password);
      
      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return ApiResponse.success({
        accessToken: accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }, response);
    } catch (error) {
      return ApiResponse.handleError(error, response);
    }
  }

  public static async register(request: Request, response: Response): Promise<Response> {
    try {
      await validateRequest(RegisterDto, request.body);
      
      const { email, password, ...userData } = request.body;
      const { accessToken, refreshToken, user } = await AuthService.register(email, password, userData);
      
      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return ApiResponse.success({
        accessToken: accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }, response, 201);
    } catch (error) {
      return ApiResponse.handleError(error, response);
    }
  }

  public static async refreshToken(request: Request, response: Response): Promise<Response> {
    try {
      const refreshToken = request.cookies.refreshToken || request.body.refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token provided');
      }
      
      const { accessToken, newRefreshToken } = await AuthService.refreshToken(refreshToken);
      
      response.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return ApiResponse.success({ 
        accessToken: accessToken 
      }, response);
    } catch (error) {
      return ApiResponse.handleError(error, response);
    }
  }

  public static async logout(request: Request, response: Response): Promise<Response> {
    try {
      const refreshToken = request.cookies.refreshToken;
      if (refreshToken) {
        await TokenService.blacklistToken(refreshToken);
      }

      response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return ApiResponse.success(null, response, 204);
    } catch (error) {
      return ApiResponse.handleError(error, response);
    }
  }

  public static async getCurrentUser(request: Request, response: Response): Promise<Response> {
    try {
      const userId = request.user?.id;
      if (!userId) {
        throw new Error('Not authenticated');
      }
      
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      return ApiResponse.success({
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }, response);
    } catch (error) {
      return ApiResponse.handleError(error, response);
    }
  }
}