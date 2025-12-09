# MongoDB Collections Schema

## Existing Collections in Your Database:

### 1. employees (Main Collection)
- Contains 50+ employee records with risk assessments
- Schema matches `employee.model.ts`

### 2. assessments (Risk Assessments)
- Employee risk assessments with detailed factors
- Example: `EMP-1001` assessment with 28% attrition probability

### 3. skills (Employee Skills)
- Technical and soft skills for employees
- Example: Sarah Chen has JavaScript, Node.js, React skills

### 4. performance_reviews
- Performance review data with scores and feedback
- Example: `PERF-2023-1001` for EMP-1001

### 5. Other miscellaneous collections
- Various assessment and review data

## Recommended Unified Schema:

### Employee Collection (Current: employees)
```javascript
{
  _id: ObjectId,
  employeeId: string,          // "EMP1001"
  name: string,                // "Employee 1"
  email: string,               // "employee1@company.com"
  department: string,          // "Sales"
  role: string,                // "Sales Representative"
  location: string,            // "San Francisco"
  tenureMonths: number,        // 0
  performanceRating: number,   // 1.73 (1-5 scale)
  engagementScore: number,     // 0.24 (0-1 scale)
  compRatio: number,          // 0.68
  criticalSkills: string[],    // ["Communication", "Teamwork"]
  skillGaps: string[],         // ["Communication", "Teamwork"]
  riskScore: number,           // 78 (0-100)
  riskLevel: string,           // "high" (low/medium/high/critical)
  status: string,              // "Active"
  lastAssessmentDate: Date,
  hireDate: Date,
  createdAt: Date,
  updatedAt: Date
}
