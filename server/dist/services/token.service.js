"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
class TokenService {
    static generateToken(payload) {
        return 'mock-token';
    }
    static verifyToken(token) {
        return { userId: '123' };
    }
    static decodeToken(token) {
        return { userId: '123' };
    }
}
exports.TokenService = TokenService;
