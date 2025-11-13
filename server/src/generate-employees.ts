import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://beamers051681:Wookie2011@Prometheus.inv2hx4.mongodb.net/Prometheus?retryWrites=true&w=majority';

// Configuration - CHANGE THIS NUMBER
const NUMBER_OF_EMPLOYEES_TO_GENERATE = 100;

// Expanded data pools to avoid duplicates
const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Dorothy', 'Paul', 'Kimberly', 'Andrew', 'Emily', 'Joshua', 'Donna',
  'Kenneth', 'Michelle', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Jason', 'Rebecca', 'Edward', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna',
  'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Samantha',
  'Benjamin', 'Katherine', 'Samuel', 'Emma', 'Gregory', 'Ruth', 'Alexander', 'Christine'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson',
  'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes'
];

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Product', 'Design'];
const ROLES = {
  Engineering: ['Software Engineer', 'Senior Developer', 'DevOps Engineer', 'QA Engineer', 'Tech Lead', 'Architect'],
  Sales: ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development'],
  Marketing: ['Marketing Specialist', 'Content Writer', 'SEO Analyst', 'Social Media Manager'],
  HR: ['HR Specialist', 'Recruiter', 'HR Business Partner', 'Talent Manager'],
  Finance: ['Financial Analyst', 'Accountant', 'Finance Manager', 'Controller'],
  Operations: ['Operations Manager', 'Project Coordinator', 'Operations Analyst'],
  Product: ['Product Manager', 'Product Owner', 'Product Analyst'],
  Design: ['UX Designer', 'UI Designer', 'Product Designer']
};

const SKILLS = {
  Engineering: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB'],
  Sales: ['CRM', 'Negotiation', 'Presentation', 'Client Relations', 'Social Media', 'Analytics'],
  Marketing: ['SEO', 'Google Ads', 'Content Strategy', 'Analytics', 'Social Media', 'Email Marketing'],
  HR: ['Recruitment', 'Employee Relations', 'Compliance', 'Training', 'Analytics'],
  Finance: ['Financial Modeling', 'Excel', 'Data Analysis', 'Forecasting', 'Accounting'],
  Operations: ['Project Management', 'Process Improvement', 'Analytics', 'Coordination'],
  Product: ['Product Strategy', 'User Research', 'Analytics', 'Roadmapping'],
  Design: ['Figma', 'User Research', 'Prototyping', 'UI/UX Design']
};

function generateUniqueEmail(firstName: string, lastName: string, existingEmails: Set<string>) {
  const baseEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
  
  if (!existingEmails.has(baseEmail)) {
    return baseEmail;
  }
  
  // If duplicate, add a number
  let counter = 1;
  let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@company.com`;
  
  while (existingEmails.has(email)) {
    counter++;
    email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${counter}@company.com`;
  }
  
  return email;
}

function generateRandomEmployee(index: number, existingEmails: Set<string>) {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
  const role = ROLES[department][Math.floor(Math.random() * ROLES[department].length)];
  
  const email = generateUniqueEmail(firstName, lastName, existingEmails);
  existingEmails.add(email);
  
  // Generate realistic metrics
  const tenure = Math.random() * 8 + 0.5; // 0.5 to 8.5 years
  const performanceScore = Number((Math.random() * 2 + 3).toFixed(1)); // 3.0 to 5.0
  const engagementScore = Number((Math.random() * 2 + 3).toFixed(1)); // 3.0 to 5.0
  
  // Skills - 2-5 random skills from department
  const numSkills = Math.floor(Math.random() * 4) + 2;
  const skills = [];
  const departmentSkills = [...SKILLS[department]];
  for (let i = 0; i < numSkills; i++) {
    if (departmentSkills.length === 0) break;
    const skillIndex = Math.floor(Math.random() * departmentSkills.length);
    skills.push(departmentSkills.splice(skillIndex, 1)[0]);
  }
  
  // Promotion logic - more likely for longer tenure
  let lastPromotion = null;
  if (tenure > 2 && Math.random() > 0.3) {
    const monthsAgo = Math.floor(Math.random() * 24) + 1; // 1-24 months ago
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    lastPromotion = date.toISOString().split('T')[0];
  }
  
  // Calculate risk score based on factors
  let riskScore = 0;
  
  // Performance impact (30%)
  riskScore += (1 - (performanceScore / 5)) * 0.3;
  
  // Tenure impact (25%) - very new or very old employees have higher risk
  if (tenure < 1) riskScore += 0.25;
  else if (tenure > 7) riskScore += 0.15;
  
  // Engagement impact (25%)
  riskScore += (1 - (engagementScore / 5)) * 0.25;
  
  // Promotion impact (20%) - no promotion in long tenure = higher risk
  if (!lastPromotion && tenure > 3) riskScore += 0.2;
  
  riskScore = Number(Math.min(1, riskScore).toFixed(2));
  
  // Determine risk level
  let riskLevel = 'Low';
  if (riskScore > 0.6) riskLevel = 'High';
  else if (riskScore > 0.3) riskLevel = 'Medium';
  
  return {
    name: `${firstName} ${lastName}`,
    email,
    department,
    role,
    riskScore,
    riskLevel,
    skills,
    tenure: Number(tenure.toFixed(1)),
    performanceScore,
    engagementScore,
    lastPromotion,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

async function generateEmployees() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Get existing emails
    const existingEmails = new Set(
      await db.collection('employees')
        .find({}, { projection: { email: 1 } })
        .toArray()
        .then(employees => employees.map(emp => emp.email))
    );
    
    console.log(`📊 Existing employees: ${existingEmails.size}`);
    console.log(`🎲 Generating ${NUMBER_OF_EMPLOYEES_TO_GENERATE} random employees...`);
    
    const newEmployees = [];
    const usedEmails = new Set(existingEmails);
    
    for (let i = 0; i < NUMBER_OF_EMPLOYEES_TO_GENERATE; i++) {
      newEmployees.push(generateRandomEmployee(i, usedEmails));
    }
    
    if (newEmployees.length > 0) {
      const result = await db.collection('employees').insertMany(newEmployees, { ordered: false });
      console.log(`✅ Successfully added ${result.insertedCount} new employees`);
      
      // Show summary
      const departmentCount: {[key: string]: number} = {};
      const riskCount: {[key: string]: number} = { Low: 0, Medium: 0, High: 0 };
      
      newEmployees.forEach(emp => {
        departmentCount[emp.department] = (departmentCount[emp.department] || 0) + 1;
        riskCount[emp.riskLevel]++;
      });
      
      console.log('\n📊 New Employees Summary:');
      console.log('Departments:', departmentCount);
      console.log('Risk Levels:', riskCount);
    }

    const totalEmployees = await db.collection('employees').countDocuments();
    console.log(`\n📈 Total employees in database: ${totalEmployees}`);

    process.exit(0);
  } catch (error: any) {
    if (error.code === 11000) {
      console.log(`✅ Partial success - some employees added before duplicate error`);
      console.log(`📈 Total employees in database: ${await mongoose.connection.db.collection('employees').countDocuments()}`);
    } else {
      console.error('❌ Generation failed:', error);
    }
    process.exit(1);
  }
}

generateEmployees();