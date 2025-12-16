import { ObjectId, Collection, Db, WithId } from 'mongodb';
import { getDb } from '../db/connect';
import { User } from '../models/user.model';
import { ApiError } from '../errors/apiError';
import { hashPassword, comparePassword } from '../utils/auth'; // Fixed import path

export class AuthService {
  static async login(email: string, password: string): Promise<{ token: string; user: WithId<User> }> {
    const db = await getDb();
    const collection = db.collection<User>('users');
    const user = await collection.findOne({ email });

    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new ApiError('Invalid credentials', 401);
    }

    // In a real implementation, generate JWT token here
    const token = 'generated-jwt-token';

    return { token, user };
  }

  static async register(userData: Omit<User, '_id'>): Promise<WithId<User>> {
    const db = await getDb();
    const collection = db.collection<User>('users');
    
    const existingUser = await collection.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError('User already exists', 400);
    }

    const hashedPassword = await hashPassword(userData.password);
    
    const newUser = {
      ...userData,
      password: hashedPassword,
      _id: new ObjectId()
    };

    const result = await collection.insertOne(newUser);
    const inserted = await collection.findOne({ _id: result.insertedId });
    
    if (!inserted) {
      throw new ApiError('Failed to create user', 500);
    }
    return inserted;
  }
}