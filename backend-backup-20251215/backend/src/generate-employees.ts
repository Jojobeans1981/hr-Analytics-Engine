import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/talent-analytics';

// === CONFIGURATION - ADJUST THESE VALUES ===
const CONFIG = {
  // Total number of employees to generate
  TOTAL_EMPLOYEES: 100,
  
  // Risk level distribution (must sum to 1.0)
  RISK_DISTRIBUTION: {
    HIGH: 0.30,    // 30% high risk
    MEDIUM: 0.40,  // 40% medium risk  
    LOW: 0.30      // 30% low risk
  },
  
  // Department distribution
  DEPARTMENTS: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Product', 'Support'],
  DEPARTMENT_WEIGHTS: [0.25, 0.15, 0.12, 0.10, 0.10, 0.10, 0.10, 0.08],
  
  // Location options
  LOCATIONS: ['San Francisco', 'New York', 'London', 'Chicago', 'Remote', 'Austin', 'Boston', 'Seattle'],
  
  // Tenure ranges by risk level (in months)
  TENURE_RANGES: {
    HIGH: { min: 0, max: 12 },      // New hires more likely high risk
    MEDIUM: { min: 13, max: 36 },   // 1-3 years
    LOW: { min: 37, max: 120 }      // 3+ years
  },
  
  // Performance rating ranges (1-5 scale)
  PERFORMANCE_RANGES: {
    HIGH: { min: 1.0, max: 2.5 },   // Poor performers -> high risk
    MEDIUM: { min: 2.6, max: 3.5 }, // Average performers
    LOW: { min: 3.6, max: 5.0 }     // Top performers -> low risk
  },
  
  // Engagement score ranges (0-1 scale)
  ENGAGEMENT_RANGES: {
    HIGH: { min: 0.1, max: 0.4 },   // Low engagement -> high risk
    MEDIUM: { min: 0.41, max: 0.7 }, // Moderate engagement
    LOW: { min: 0.71, max: 0.95 }   // High engagement -> low risk
  },
  
  // Compensation ratio ranges (market comparison)
  COMP_RATIO_RANGES: {
    HIGH: { min: 0.6, max: 0.85 },   // Underpaid -> higher risk
    MEDIUM: { min: 0.86, max: 1.05 }, // Market rate
    LOW: { min: 1.06, max: 1.3 }     // Well paid -> lower risk
  }
};

// Skill definitions
const SKILLS = {
  TECHNICAL: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'SQL', 'Docker'],
  BUSINESS: ['Project Management', 'Sales', 'Marketing', 'Financial Analysis', 'HR Management'],
  SOFT: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Adaptability']
};

// Risk factor explanations
const RISK_FACTORS = {
  HIGH: [
    'Performance concerns',
    'Tenure risk (new hire)',
    'Engagement issues',
    'Compensation below market',
    'Critical skill gaps'
  ],
  MEDIUM: [
    'Moderate performance',
    'Moderate tenure risk',
    'Average engagement',
    'Market-rate compensation',
    'Some skill gaps'
  ],
  LOW: [
    'Strong performance',
    'Established tenure',
    'High engagement',
    'Above-market compensation',
    'Minimal skill gaps'
  ]
};

// Employee model (simplified - adjust to match your actual schema)
interface IEmployee {
  name: string;
  email: string;
  employeeId: string;
  department: string;
  role: string;
  location: string;
  tenureMonths: number;
  performanceRating: number;
  engagementScore: number;
  compRatio: number;
  criticalSkills: string[];
  skillGaps: string[];
  riskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  status: 'Active' | 'On Leave' | 'Terminated';
  hireDate: Date;
  lastAssessmentDate: Date;
  riskAssessment?: any;
}

// Helper functions
function getRandomInRange(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getWeightedRandomElement<T>(array: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < array.length; i++) {
    if (random < weights[i]) return array[i];
    random -= weights[i];
  }
  return array[array.length - 1];
}

function generateSkills(): { criticalSkills: string[]; skillGaps: string[] } {
  const skillTypes = Object.values(SKILLS).flat();
  const criticalSkills: string[] = [];
  const skillGaps: string[] = [];
  
  // Pick 3-5 critical skills
  const numSkills = Math.floor(Math.random() * 3) + 3;
  for (let i = 0; i < numSkills; i++) {
    const skill = getRandomElement(skillTypes.filter(s => !criticalSkills.includes(s)));
    if (skill) criticalSkills.push(skill);
  }
  
  // Pick 1-2 skill gaps (from different categories)
  const numGaps = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < numGaps; i++) {
    const gap = getRandomElement(skillTypes.filter(s => !criticalSkills.includes(s) && !skillGaps.includes(s)));
    if (gap) skillGaps.push(gap);
  }
  
  return { criticalSkills, skillGaps };
}

function determineRiskLevel(): 'high' | 'medium' | 'low' {
  const random = Math.random();
  if (random < CONFIG.RISK_DISTRIBUTION.HIGH) return 'high';
  if (random < CONFIG.RISK_DISTRIBUTION.HIGH + CONFIG.RISK_DISTRIBUTION.MEDIUM) return 'medium';
  return 'low';
}

function generateEmployeeData(riskLevel: 'high' | 'medium' | 'low', existingIds: Set<string>): Partial<IEmployee> {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName, provider: 'company.com' });
  
  let employeeId: string;
  do {
    employeeId = `EMP${1000 + Math.floor(Math.random() * 9000)}`;
  } while (existingIds.has(employeeId));
  existingIds.add(employeeId);
  
  const { criticalSkills, skillGaps } = generateSkills();
  
  // Generate data based on risk level
  const tenureMonths = Math.floor(getRandomInRange(
    CONFIG.TENURE_RANGES[riskLevel].min,
    CONFIG.TENURE_RANGES[riskLevel].max
  ));
  
  const performanceRating = getRandomInRange(
    CONFIG.PERFORMANCE_RANGES[riskLevel].min,
    CONFIG.PERFORMANCE_RANGES[riskLevel].max
  );
  
  const engagementScore = getRandomInRange(
    CONFIG.ENGAGEMENT_RANGES[riskLevel].min,
    CONFIG.ENGAGEMENT_RANGES[riskLevel].max
  );
  
  const compRatio = getRandomInRange(
    CONFIG.COMP_RATIO_RANGES[riskLevel].min,
    CONFIG.COMP_RATIO_RANGES[riskLevel].max
  );
  
  // Calculate risk score based on factors (inverse of good metrics)
  let riskScore = 0;
  riskScore += ((5 - performanceRating) / 4) * 25; // Performance: 25% weight
  riskScore += (1 - engagementScore) * 25;         // Engagement: 25% weight
  riskScore += (1 - Math.min(compRatio, 1.2) / 1.2) * 20; // Compensation: 20% weight
  riskScore += (Math.min(tenureMonths, 24) / 24) * 20;    // Tenure: 20% weight
  riskScore += (skillGaps.length / 3) * 10;               // Skill gaps: 10% weight
  riskScore = Math.min(100, Math.max(0, riskScore));
  
  const hireDate = new Date();
  hireDate.setMonth(hireDate.getMonth() - tenureMonths);
  
  const lastAssessmentDate = new Date();
  lastAssessmentDate.setDate(lastAssessmentDate.getDate() - Math.floor(Math.random() * 30));
  
  return {
    name: `${firstName} ${lastName}`,
    email,
    employeeId,
    department: getWeightedRandomElement(CONFIG.DEPARTMENTS, CONFIG.DEPARTMENT_WEIGHTS),
    role: `${faker.person.jobTitle()}`,
    location: getRandomElement(CONFIG.LOCATIONS),
    tenureMonths,
    performanceRating,
    engagementScore,
    compRatio,
    criticalSkills,
    skillGaps,
    riskScore: parseFloat(riskScore.toFixed(1)),
    riskLevel,
    status: 'Active' as const,
    hireDate,
    lastAssessmentDate
  };
}

async function seedDatabase() {
  try {
    console.log('��� Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Import your actual Employee model
    const { Employee } = await import('./models/employee.model');
    
    // Clear existing data
    console.log('���️  Clearing existing employees...');
    await Employee.deleteMany({});
    console.log('✅ Cleared existing employees');
    
    // Generate employees based on configured distribution
    console.log(`��� Generating ${CONFIG.TOTAL_EMPLOYEES} employees with distribution:`);
    console.log(`   High Risk: ${CONFIG.RISK_DISTRIBUTION.HIGH * 100}%`);
    console.log(`   Medium Risk: ${CONFIG.RISK_DISTRIBUTION.MEDIUM * 100}%`);
    console.log(`   Low Risk: ${CONFIG.RISK_DISTRIBUTION.LOW * 100}%`);
    
    const employees: any[] = [];
    const riskCounts = { high: 0, medium: 0, low: 0 };
    const existingIds = new Set<string>();
    
    for (let i = 0; i < CONFIG.TOTAL_EMPLOYEES; i++) {
      const riskLevel = determineRiskLevel();
      riskCounts[riskLevel]++;
      
      const employeeData = generateEmployeeData(riskLevel, existingIds);
      employees.push(employeeData);
      
      // Show progress
      if ((i + 1) % 10 === 0 || i === CONFIG.TOTAL_EMPLOYEES - 1) {
        process.stdout.write(`\r   Generated ${i + 1}/${CONFIG.TOTAL_EMPLOYEES} employees...`);
      }
    }
    
    console.log('\n��� Risk distribution generated:');
    console.log(`   High Risk: ${riskCounts.high} employees`);
    console.log(`   Medium Risk: ${riskCounts.medium} employees`);
    console.log(`   Low Risk: ${riskCounts.low} employees`);
    
    // Insert in batches
    console.log('��� Saving to database...');
    const batchSize = 50;
    for (let i = 0; i < employees.length; i += batchSize) {
      const batch = employees.slice(i, i + batchSize);
      await Employee.insertMany(batch);
      process.stdout.write(`\r   Saved ${Math.min(i + batchSize, employees.length)}/${employees.length} employees...`);
    }
    
    console.log('\n✅ Database seeded successfully!');
    console.log(`\n��� Generated ${CONFIG.TOTAL_EMPLOYEES} employees with realistic risk profiles.`);
    console.log(`��� You can now test your Talent Risk AI dashboard with varied data.`);
    
    // Verify counts
    const totalCount = await Employee.countDocuments();
    const highRiskCount = await Employee.countDocuments({ riskLevel: 'high' });
    const mediumRiskCount = await Employee.countDocuments({ riskLevel: 'medium' });
    const lowRiskCount = await Employee.countDocuments({ riskLevel: 'low' });
    
    console.log('\n��� Final counts:');
    console.log(`   Total: ${totalCount}`);
    console.log(`   High Risk: ${highRiskCount} (${((highRiskCount/totalCount)*100).toFixed(1)}%)`);
    console.log(`   Medium Risk: ${mediumRiskCount} (${((mediumRiskCount/totalCount)*100).toFixed(1)}%)`);
    console.log(`   Low Risk: ${lowRiskCount} (${((lowRiskCount/totalCount)*100).toFixed(1)}%)`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();
