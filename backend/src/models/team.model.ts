import { ObjectId } from 'mongodb';
import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  department: string;
  managerId: ObjectId;
  memberIds: ObjectId[];
  avgRiskScore?: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    managerId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
    avgRiskScore: { type: Number },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITeam>('Team', teamSchema);
