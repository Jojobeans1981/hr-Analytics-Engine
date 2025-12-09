import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'manager';
  createdAt: Date;
  updatedAt: Date;
}