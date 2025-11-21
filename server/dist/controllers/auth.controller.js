"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
// Minimal AuthController with basic functionality
class AuthController {
    static async login(request, response) {
        try {
            const { email, password } = request.body;
            // Simple mock response
            return response.json({
                success: true,
                data: {
                    accessToken: 'mock-token',
                    user: {
                        id: '1',
                        email: email,
                        role: 'user'
                    }
                }
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                error: 'Login failed'
            });
        }
    }
    static async register(request, response) {
        try {
            const { email, password } = request.body;
            // Simple mock response
            return response.status(201).json({
                success: true,
                data: {
                    accessToken: 'mock-token',
                    user: {
                        id: '1',
                        email: email,
                        role: 'user'
                    }
                }
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                error: 'Registration failed'
            });
        }
    }
    static async refreshToken(request, response) {
        try {
            return response.json({
                success: true,
                data: {
                    accessToken: 'new-mock-token'
                }
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                error: 'Token refresh failed'
            });
        }
    }
    static async logout(request, response) {
        try {
            response.clearCookie('refreshToken');
            return response.status(204).send();
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                error: 'Logout failed'
            });
        }
    }
    static async getCurrentUser(request, response) {
        try {
            return response.json({
                success: true,
                data: {
                    user: {
                        id: '1',
                        email: 'user@example.com',
                        role: 'user'
                    }
                }
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                error: 'Failed to get user'
            });
        }
    }
}
exports.AuthController = AuthController;
