const mockAssessments = [
  {
    id: "assess001",
    employeeId: "emp001",
    assessmentDate: "2024-01-15",
    assessorId: "emp010",
    type: "quarterly",
    overallRiskScore: 7.5,
    riskCategories: {
      flightRisk: {
        score: 8.5,
        factors: [
          { factor: "No promotion in 2 years", weight: 0.3, score: 9 },
          { factor: "High market demand for skills", weight: 0.4, score: 8.5 },
          { factor: "Recent team conflicts", weight: 0.3, score: 7.5 }
        ]
      },
      performanceRisk: {
        score: 3.5,
        factors: [
          { factor: "Consistently meets targets", weight: 0.5, score: 3 },
          { factor: "Strong technical skills", weight: 0.5, score: 4 }
        ]
      },
      engagementRisk: {
        score: 6.0,
        factors: [
          { factor: "Decreased participation in team events", weight: 0.4, score: 7 },
          { factor: "Fewer contributions in meetings", weight: 0.6, score: 5.5 }
        ]
      }
    },
    recommendations: [
      "Schedule career development discussion",
      "Consider promotion opportunities",
      "Increase involvement in strategic projects"
    ],
    notes: "Sarah has expressed interest in leadership roles. Skills are in high demand in the market.",
    followUpDate: "2024-02-15",
    status: "completed"
  },
  {
    id: "assess002",
    employeeId: "emp002",
    assessmentDate: "2024-01-10",
    assessorId: "emp011",
    type: "quarterly",
    overallRiskScore: 3.2,
    riskCategories: {
      flightRisk: {
        score: 3.0,
        factors: [
          { factor: "Recent promotion", weight: 0.5, score: 2 },
          { factor: "Strong team relationships", weight: 0.5, score: 4 }
        ]
      },
      performanceRisk: {
        score: 2.5,
        factors: [
          { factor: "Exceeds expectations", weight: 0.6, score: 2 },
          { factor: "Successful product launches", weight: 0.4, score: 3 }
        ]
      },
      engagementRisk: {
        score: 4.0,
        factors: [
          { factor: "Active in company initiatives", weight: 0.5, score: 4 },
          { factor: "Mentoring junior staff", weight: 0.5, score: 4 }
        ]
      }
    },
    recommendations: [
      "Continue leadership development",
      "Expand cross-functional responsibilities"
    ],
    notes: "Michael is a key contributor with low risk. Continue to challenge with new opportunities.",
    followUpDate: "2024-04-10",
    status: "completed"
  },
  {
    id: "assess003",
    employeeId: "emp003",
    assessmentDate: "2024-01-20",
    assessorId: "emp001",
    type: "probation",
    overallRiskScore: 5.8,
    riskCategories: {
      flightRisk: {
        score: 5.5,
        factors: [
          { factor: "New to company", weight: 0.3, score: 6 },
          { factor: "Learning curve challenges", weight: 0.7, score: 5 }
        ]
      },
      performanceRisk: {
        score: 6.0,
        factors: [
          { factor: "Still ramping up", weight: 0.6, score: 6 },
          { factor: "Good technical foundation", weight: 0.4, score: 6 }
        ]
      },
      engagementRisk: {
        score: 6.0,
        factors: [
          { factor: "Remote work isolation", weight: 0.5, score: 7 },
          { factor: "Eager to learn", weight: 0.5, score: 5 }
        ]
      }
    },
    recommendations: [
      "Increase mentoring sessions",
      "Set up regular check-ins",
      "Consider on-site visits quarterly"
    ],
    notes: "Emily shows promise but needs more support as a remote junior developer.",
    followUpDate: "2024-02-20",
    status: "completed"
  },
  {
    id: "assess004",
    employeeId: "emp004",
    assessmentDate: "2024-01-05",
    assessorId: "emp012",
    type: "urgent",
    overallRiskScore: 8.1,
    riskCategories: {
      flightRisk: {
        score: 8.5,
        factors: [
          { factor: "Declined compensation discussion", weight: 0.4, score: 9 },
          { factor: "LinkedIn activity increased", weight: 0.3, score: 8.5 },
          { factor: "Missed sales targets", weight: 0.3, score: 8 }
        ]
      },
      performanceRisk: {
        score: 7.0,
        factors: [
          { factor: "Below quota for 2 quarters", weight: 0.7, score: 7.5 },
          { factor: "Client relationship issues", weight: 0.3, score: 6 }
        ]
      },
      engagementRisk: {
        score: 8.5,
        factors: [
          { factor: "Minimal team interaction", weight: 0.5, score: 9 },
          { factor: "Declined team building events", weight: 0.5, score: 8 }
        ]
      }
    },
    recommendations: [
      "Immediate manager intervention",
      "Review compensation package",
      "Performance improvement plan",
      "Consider territory reassignment"
    ],
    notes: "High risk of departure. David has been struggling with current territory and may be actively looking.",
    followUpDate: "2024-01-20",
    status: "in-progress"
  }
];

module.exports = mockAssessments;