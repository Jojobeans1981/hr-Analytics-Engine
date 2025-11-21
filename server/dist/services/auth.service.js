"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const mongodb_1 = require("mongodb");
const connect_1 = require("../db/connect");
const apiError_1 = require("../errors/apiError");
const auth_1 = require("../utils/auth"); // Fixed import path
class AuthService {
    static async login(email, password) {
        const db = await (0, connect_1.getDb)();
        const collection = db.collection('users');
        const user = await collection.findOne({ email });
        if (!user) {
            throw new apiError_1.ApiError('Invalid credentials', 401);
        }
        const isMatch = await (0, auth_1.comparePassword)(password, user.password);
        if (!isMatch) {
            throw new apiError_1.ApiError('Invalid credentials', 401);
        }
        // In a real implementation, generate JWT token here
        const token = 'generated-jwt-token';
        return { token, user };
    }
    static async register(userData) {
        const db = await (0, connect_1.getDb)();
        const collection = db.collection('users');
        const existingUser = await collection.findOne({ email: userData.email });
        if (existingUser) {
            throw new apiError_1.ApiError('User already exists', 400);
        }
        const hashedPassword = await (0, auth_1.hashPassword)(userData.password);
        const newUser = {
            ...userData,
            password: hashedPassword,
            _id: new mongodb_1.ObjectId()
        };
        const result = await collection.insertOne(newUser);
        const inserted = await collection.findOne({ _id: result.insertedId });
        if (!inserted) {
            throw new apiError_1.ApiError('Failed to create user', 500);
        }
        return inserted;
    }
}
exports.AuthService = AuthService;
