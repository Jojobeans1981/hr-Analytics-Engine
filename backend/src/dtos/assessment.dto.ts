export interface AssessmentCreateDto {
  employeeId: string;
  metrics: {
    engagement: number;
    performance: number;
    riskFactors: string[];
  };
  notes?: string;
}

export interface AssessmentUpdateDto extends Partial<AssessmentCreateDto> {
  overallRisk?: number;
}

export interface AssessmentResponseDto {
  id: string;
  employeeId: string;
  metrics: {
    engagement: number;
    performance: number;
    riskFactors: string[];
  };
  overallRisk: number;
  assessmentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}