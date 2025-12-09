import { ObjectId } from 'mongodb';
import mongoose, { Schema, Document } from 'mongoose';

export interface RiskCategory {
  score: number;
  [key: string]: any;
}

export interface IAssessment extends Document {
  employeeId: ObjectId;
  assessmentDate: string;
  assessorId: string;
  type: string;
  overallRiskScore: number;
  riskCategories: Record<string, RiskCategory>;
  recommendations: string[];
  notes: string;
  followUpDate?: string | null;
  status: 'pending' | 'completed' | 'archived';
  createdAt: Date;
}

const assessmentSchema = new Schema<IAssessment>(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    assessmentDate: { type: String, required: true },
    assessorId: { type: String, required: true },
    type: { type: String, required: true },
    overallRiskScore: { type: Number, required: true },
    riskCategories: { type: Map, of: Schema.Types.Mixed },
    recommendations: [{ type: String }],
    notes: { type: String },
    followUpDate: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'archived'], default: 'pending' }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IAssessment>('Assessment', assessmentSchema);
