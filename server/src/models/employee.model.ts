import { ObjectId } from 'mongodb';

export interface Employee {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  email?: string | null;  // Optional but unique when present
  status: 'active' | 'on_leave' | 'terminated';
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
  // Optional nested objects
  manager?: {
    id: ObjectId;
    name: string;
  };
  skills?: string[];
}