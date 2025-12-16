import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  role: string;
  department: string;
  email: string;
  riskScore: number;
  riskLevel?: string;
  latestAssessment?: Schema.Types.ObjectId;

}

const employeeSchema = new Schema<IEmployee>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    riskScore: { type: Number, required: true },
    latestAssessment: { type: Schema.Types.ObjectId, ref: 'Assessment' },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },   // <‑‑ important: include virtuals in .toJSON()
    toObject: { virtuals: true }  // <‑‑ same for .toObject()
  }
);

// Virtual field: riskLevel derived from riskScore
employeeSchema.virtual("riskLevel").get(function (this: IEmployee) {
  if (this.riskScore < 0.4) return "Low";
  if (this.riskScore < 0.7) return "Medium";
  return "High";
});
export const Employee = mongoose.model<IEmployee>("Employee", employeeSchema);
