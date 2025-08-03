import { ObjectId } from 'mongodb';

export interface Team {
  _id?: ObjectId;
  name: string;
  department: string;
  managerId: ObjectId;
  memberIds: ObjectId[];
  avgRiskScore?: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}