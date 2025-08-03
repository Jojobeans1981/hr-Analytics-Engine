const mockEmployees = [
  {
    id: "emp001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    department: "Engineering",
    position: "Senior Software Engineer",
    teamId: "team001",
    startDate: "2021-03-15",
    location: "San Francisco",
    riskScore: 7.5,
    riskFactors: {
      flightRisk: "high",
      performanceRisk: "low",
      engagementRisk: "medium"
    },
    skills: ["JavaScript", "React", "Node.js", "MongoDB"],
    manager: "emp010",
    lastAssessmentDate: "2024-01-15",
    status: "active"
  },
  {
    id: "emp002",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@company.com",
    department: "Product",
    position: "Product Manager",
    teamId: "team002",
    startDate: "2020-06-01",
    location: "New York",
    riskScore: 3.2,
    riskFactors: {
      flightRisk: "low",
      performanceRisk: "low",
      engagementRisk: "low"
    },
    skills: ["Product Strategy", "Agile", "Data Analysis", "User Research"],
    manager: "emp011",
    lastAssessmentDate: "2024-01-10",
    status: "active"
  },
  {
    id: "emp003",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@company.com",
    department: "Engineering",
    position: "Junior Developer",
    teamId: "team001",
    startDate: "2023-01-10",
    location: "Remote",
    riskScore: 5.8,
    riskFactors: {
      flightRisk: "medium",
      performanceRisk: "medium",
      engagementRisk: "medium"
    },
    skills: ["Python", "Django", "PostgreSQL"],
    manager: "emp001",
    lastAssessmentDate: "2024-01-20",
    status: "active"
  },
  {
    id: "emp004",
    firstName: "David",
    lastName: "Kim",
    email: "david.kim@company.com",
    department: "Sales",
    position: "Sales Executive",
    teamId: "team003",
    startDate: "2022-09-01",
    location: "Chicago",
    riskScore: 8.1,
    riskFactors: {
      flightRisk: "high",
      performanceRisk: "medium",
      engagementRisk: "high"
    },
    skills: ["B2B Sales", "CRM", "Negotiation", "Account Management"],
    manager: "emp012",
    lastAssessmentDate: "2024-01-05",
    status: "active"
  },
  {
    id: "emp005",
    firstName: "Lisa",
    lastName: "Thompson",
    email: "lisa.thompson@company.com",
    department: "HR",
    position: "HR Manager",
    teamId: "team004",
    startDate: "2019-11-15",
    location: "Boston",
    riskScore: 2.1,
    riskFactors: {
      flightRisk: "low",
      performanceRisk: "low",
      engagementRisk: "low"
    },
    skills: ["Recruitment", "Employee Relations", "HRIS", "Compliance"],
    manager: "emp013",
    lastAssessmentDate: "2024-01-18",
    status: "active"
  }
];

module.exports = mockEmployees;