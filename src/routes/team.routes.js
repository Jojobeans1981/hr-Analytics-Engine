const express = require('express');
const router = express.Router();
const mockTeams = require('../data/mockTeams');
const mockEmployees = require('../data/mockEmployees');

// GET all teams
router.get('/', (req, res) => {
  const { department, status, minRisk, maxRisk } = req.query;
  
  let filteredTeams = [...mockTeams];
  
  if (department) {
    filteredTeams = filteredTeams.filter(team => 
      team.department.toLowerCase() === department.toLowerCase()
    );
  }
  
  if (status) {
    filteredTeams = filteredTeams.filter(team => 
      team.status === status
    );
  }
  
  if (minRisk) {
    filteredTeams = filteredTeams.filter(team => 
      team.avgRiskScore >= parseFloat(minRisk)
    );
  }
  
  if (maxRisk) {
    filteredTeams = filteredTeams.filter(team => 
      team.avgRiskScore <= parseFloat(maxRisk)
    );
  }
  
  res.json({
    success: true,
    count: filteredTeams.length,
    data: filteredTeams
  });
});

// GET team by ID with members
router.get('/:id', (req, res) => {
  const team = mockTeams.find(t => t.id === req.params.id);
  
  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }
  
  // Get team members
  const teamMembers = mockEmployees.filter(emp => emp.teamId === req.params.id);
  
  const teamWithDetails = {
    ...team,
    members: teamMembers.map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      position: emp.position,
      riskScore: emp.riskScore,
      email: emp.email
    }))
  };
  
  res.json({
    success: true,
    data: teamWithDetails
  });
});

// GET team risk analysis
router.get('/:id/risk-analysis', (req, res) => {
  const team = mockTeams.find(t => t.id === req.params.id);
  
  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }
  
  const teamMembers = mockEmployees.filter(emp => emp.teamId === req.params.id);
  
  const riskAnalysis = {
    teamId: team.id,
    teamName: team.name,
    memberCount: teamMembers.length,
    avgRiskScore: team.avgRiskScore,
    riskDistribution: {
      high: teamMembers.filter(emp => emp.riskScore >= 7).length,
      medium: teamMembers.filter(emp => emp.riskScore >= 4 && emp.riskScore < 7).length,
      low: teamMembers.filter(emp => emp.riskScore < 4).length
    },
    highRiskMembers: teamMembers
      .filter(emp => emp.riskScore >= 7)
      .map(emp => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        riskScore: emp.riskScore,
        riskFactors: emp.riskFactors
      }))
  };
  
  res.json({
    success: true,
    data: riskAnalysis
  });
});

// POST create new team
router.post('/', (req, res) => {
  const newTeam = {
    id: `team${String(mockTeams.length + 1).padStart(3, '0')}`,
    ...req.body,
    memberCount: 0,
    avgRiskScore: 0,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  
  mockTeams.push(newTeam);
  
  res.status(201).json({
    success: true,
    message: 'Team created successfully',
    data: newTeam
  });
});

// PUT update team
router.put('/:id', (req, res) => {
  const teamIndex = mockTeams.findIndex(t => t.id === req.params.id);
  
  if (teamIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }
  
  mockTeams[teamIndex] = {
    ...mockTeams[teamIndex],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Team updated successfully',
    data: mockTeams[teamIndex]
  });
});

module.exports = router;