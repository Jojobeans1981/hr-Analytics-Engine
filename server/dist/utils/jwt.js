"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt = void 0;
exports.jwt = {
    sign: (payload, secret, options) => {
        return 'jwt-token-mock';
    },
    verify: (token, secret) => {
        return { userId: '123', email: 'user@example.com', role: 'user' };
    },
    decode: (token) => {
        return { userId: '123', email: 'user@example.com', role: 'user' };
    }
};
