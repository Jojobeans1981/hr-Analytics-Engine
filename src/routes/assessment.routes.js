const express = require('express');
const router = express.Router();
const mockAssessments = require('../data/mockAssessments');
const mockEmployees = require('../data/mockEmployees');

// GET all assessments
router.get('/', (req, res) => {
  const { employeeId, type, status, fromDate, toDate } = req.query;
  
  let filteredAssessments = [...mockAssessments];
  
  if (employeeId) {
    filteredAssessments = filteredAssessments.filter(assessment => 
      assessment.employeeId === employeeId
    );
  }
  
  if (type) {
    filteredAssessments = filteredAssessments.filter(assessment => 
      assessment.type === type
    );
  }
  
  if (status) {
    filteredAssessments = filteredAssessments.filter(assessment => 
      assessment.status === status
    );
  }
  
  if (fromDate) {
    filteredAssessments = filteredAssessments.filter(assessment => 
      new Date(assessment.assessmentDate) >= new Date(fromDate)
    );
  }
  
  if (toDate) {
    filteredAssessments = filteredAssessments.filter(assessment => 
      new Date(assessment.assessmentDate) <= new Date(toDate)
    );
  }
  
  // Add employee details to each assessment
  const assessmentsWithEmployeeInfo = filteredAssessments.map(assessment => {
    const employee = mockEmployees.find(emp => emp.id === assessment.employeeId);
    return {
      ...assessment,
      employee: employee ? {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        department: employee.department,
        position: employee.position
      } : null
    };
  });
  
  res.json({
    success: true,
    count: assessmentsWithEmployeeInfo.length,
    data: assessmentsWithEmployeeInfo
  });
});

// GET assessment by ID
router.get('/:id', (req, res) => {
  const assessment = mockAssessments.find(a => a.id === req.params.id);
  
  if (!assessment) {
    return res.status(404).json({
      success: false,
      message: 'Assessment not found'
    });
  }
  
  // Add employee details
  const employee = mockEmployees.find(emp => emp.id === assessment.employeeId);
  const assessmentWithDetails = {
    ...assessment,
    employee: employee ? {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
      position: employee.position,
      email: employee.email
    } : null
  };
  
  res.json({
    success: true,
    data: assessmentWithDetails
  });
});

// GET assessments for a specific employee
router.get('/employee/:employeeId', (req, res) => {
  const employeeAssessments = mockAssessments.filter(
    assessment => assessment.employeeId === req.params.employeeId
  );
  
  const employee = mockEmployees.find(emp => emp.id === req.params.employeeId);
  
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found'
    });
  }
  
  res.json({
    success: true,
    count: employeeAssessments.length,
    employee: {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
      position: employee.position
    },
    data: employeeAssessments.sort((a, b) => 
      new Date(b.assessmentDate) - new Date(a.assessmentDate)
    )
  });
});

// POST create new assessment
router.post('/', (req, res) => {
  const { employeeId, type = 'quarterly', riskCategories, recommendations, notes } = req.body;
  
  // Validate employee exists
  const employee = mockEmployees.find(emp => emp.id === employeeId);
  
  if (!employee) {
    return res.status(400).json({
      success: false,
      message: 'Invalid employee ID'
    });
  }
  
  // Calculate overall risk score from categories
  const calculateOverallRisk = (categories) => {
    const scores = Object.values(categories).map(cat => cat.score);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };
  
  const newAssessment = {
    id: `assess${String(mockAssessments.length + 1).padStart(3, '0')}`,
    employeeId,
    assessmentDate: new Date().toISOString().split('T')[0],
    assessorId: req.body.assessorId || 'current-user', // In real app, get from auth
    type,
    overallRiskScore: calculateOverallRisk(riskCategories),
    riskCategories,
    recommendations: recommendations || [],
    notes: notes || '',
    followUpDate: req.body.followUpDate || null,
    status: 'completed',
    createdAt: new Date().toISOString()
  };
  
  // In a real app, save to database
  mockAssessments.push(newAssessment);
  
  // Update employee's risk score and last assessment date
  const employeeIndex = mockEmployees.findIndex(emp => emp.id === employeeId);
  if (employeeIndex !== -1) {
    mockEmployees[employeeIndex].riskScore = newAssessment.overallRiskScore;
    mockEmployees[employeeIndex].lastAssessmentDate = newAssessment.assessmentDate;
  }
  
  res.status(201).json({
    success: true,
    message: 'Assessment created successfully',
    data: newAssessment
  });
});

// PUT update assessment
router.put('/:id', (req, res) => {
  const assessmentIndex = mockAssessments.findIndex(a => a.id === req.params.id);
  
  if (assessmentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Assessment not found'
    });
  }
  
  const updatedAssessment = {
    ...mockAssessments[assessmentIndex],
    ...req.body,
    id: req.params.id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };
  
  // Recalculate overall risk score if risk categories were updated
  if (req.body.riskCategories) {
    const scores = Object.values(req.body.riskCategories).map(cat => cat.score);
    updatedAssessment.overallRiskScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
  
  mockAssessments[assessmentIndex] = updatedAssessment;
  
  res.json({
    success: true,
    message: 'Assessment updated successfully',
    data: updatedAssessment
  });
});

// DELETE assessment
router.delete('/:id', (req, res) => {
  const assessmentIndex = mockAssessments.findIndex(a => a.id === req.params.id);
  
  if (assessmentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Assessment not found'
    });
  }
  
  mockAssessments.splice(assessmentIndex, 1);
  
  res.json({
    success: true,
    message: 'Assessment deleted successfully'
  });
});

// GET assessment statistics
router.get('/stats/summary', (req, res) => {
  const totalAssessments = mockAssessments.length;
  const completedAssessments = mockAssessments.filter(a => a.status === 'completed').length;
  const inProgressAssessments = mockAssessments.filter(a => a.status === 'in-progress').length;
  
  const riskDistribution = {
    high: mockAssessments.filter(a => a.overallRiskScore >= 7).length,
    medium: mockAssessments.filter(a => a.overallRiskScore >= 4 && a.overallRiskScore < 7).length,
    low: mockAssessments.filter(a => a.overallRiskScore < 4).length
  };
  
  const avgRiskScore = mockAssessments.reduce((sum, a) => sum + a.overallRiskScore, 0) / totalAssessments || 0;
  
  res.json({
    success: true,
    data: {
      totalAssessments,
      completedAssessments,
      inProgressAssessments,
      riskDistribution,
      averageRiskScore: avgRiskScore.toFixed(2),
      assessmentTypes: {
        quarterly: mockAssessments.filter(a => a.type === 'quarterly').length,
        annual: mockAssessments.filter(a => a.type === 'annual').length,
        probation: mockAssessments.filter(a => a.type === 'probation').length,
        urgent: mockAssessments.filter(a => a.type === 'urgent').length
      }
    }
  });
});

module.exports = router;