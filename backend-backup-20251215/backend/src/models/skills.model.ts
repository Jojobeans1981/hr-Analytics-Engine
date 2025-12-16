import mongoose, { Document, Schema } from 'mongoose';

interface ISkill extends Document {
  text: string;
  skills: string[];
  analyzedAt: Date;
}

const SkillSchema = new Schema({
  text: { type: String, required: true },
  skills: { type: [String], required: true },
  analyzedAt: { type: Date, default: Date.now }
});

export default mongoose.model<ISkill>('Skill', SkillSchema);