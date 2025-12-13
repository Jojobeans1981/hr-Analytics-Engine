const express = require('express');
const router = express.Router();
const riskScoringService = require('../backend/scoring/RiskScoringService');
const riskAnalyticsService = require('../backend/analytics/RiskAnalyticsService');

// Get risk score for an employee
router.post('/calculate/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { algorithm = 'auto', factors = {} } = req.body;
    
    // In production, you would fetch employee data from database
    const employeeData = {
      _id: employeeId,
      ...req.body.employeeData
    };
    
    const result = await riskScoringService.calculateRisk(
      employeeData,
      factors,
      algorithm
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error calculating risk:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Batch calculate risk scores
router.post('/batch-calculate', async (req, res) => {
  try {
    const { employees, algorithm = 'auto', factorsMap = {} } = req.body;
    
    if (!employees || !Array.isArray(employees)) {
      return res.status(400).json({
        success: false,
        error: 'Employees array is required'
      });
    }
    
    const results = await riskScoringService.batchCalculate(
      employees,
      factorsMap,
      algorithm
    );
    
    res.json({
      success: true,
      data: results,
      summary: {
        total: results.length,
        successful: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length
      }
    });
  } catch (error) {
    console.error('Error in batch calculation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Compare different algorithms
router.post('/compare-algorithms/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { factors = {} } = req.body;
    
    const employeeData = {
      _id: employeeId,
      ...req.body.employeeData
    };
    
    const comparison = await riskScoringService.compareAlgorithms(
      employeeData,
      factors
    );
    
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Error comparing algorithms:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate organization risk analytics
router.post('/analytics/organization', async (req, res) => {
  try {
    const { riskResults } = req.body;
    
    if (!riskResults || !Array.isArray(riskResults)) {
      return res.status(400).json({
        success: false,
        error: 'Risk results array is required'
      });
    }
    
    const analytics = riskAnalyticsService.analyzeOrganizationRisk(riskResults);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate comprehensive risk report
router.post('/report/generate', async (req, res) => {
  try {
    const { riskResults, options = {} } = req.body;
    
    if (!riskResults || !Array.isArray(riskResults)) {
      return res.status(400).json({
        success: false,
        error: 'Risk results array is required'
      });
    }
    
    const report = riskAnalyticsService.generateRiskReport(riskResults, options);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create custom algorithm
router.post('/algorithms/custom', async (req, res) => {
  try {
    const { name, factors, rules, modifiers } = req.body;
    
    if (!name || !factors) {
      return res.status(400).json({
        success: false,
        error: 'Algorithm name and factors are required'
      });
    }
    
    const customAlgorithm = riskScoringService.createCustomAlgorithm({
      name,
      factors,
      rules,
      modifiers
    });
    
    // Register the custom algorithm
    riskScoringService.registerAlgorithm(name.toLowerCase(), customAlgorithm);
    
    res.json({
      success: true,
      data: {
        name: customAlgorithm.algorithmName,
        factors: Object.keys(factors),
        registered: true
      }
    });
  } catch (error) {
    console.error('Error creating custom algorithm:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get available algorithms
router.get('/algorithms', (req, res) => {
  try {
    const algorithms = Array.from(riskScoringService.algorithms.keys()).map(name => ({
      name,
      description: getAlgorithmDescription(name),
      suitableFor: getAlgorithmSuitability(name)
    }));
    
    res.json({
      success: true,
      data: algorithms
    });
  } catch (error) {
    console.error('Error getting algorithms:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test algorithm with sample data
router.post('/algorithms/test', async (req, res) => {
  try {
    const { algorithmName, employeeData, factors } = req.body;
    
    if (!algorithmName || !employeeData) {
      return res.status(400).json({
        success: false,
        error: 'Algorithm name and employee data are required'
      });
    }
    
    const algorithm = riskScoringService.algorithms.get(algorithmName);
    
    if (!algorithm) {
      return res.status(404).json({
        success: false,
        error: `Algorithm '${algorithmName}' not found`
      });
    }
    
    const result = await algorithm.calculate(employeeData, factors || {});
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error testing algorithm:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get algorithm configuration
router.get('/algorithms/:name/config', (req, res) => {
  try {
    const { name } = req.params;
    const algorithm = riskScoringService.algorithms.get(name);
    
    if (!algorithm) {
      return res.status(404).json({
        success: false,
        error: `Algorithm '${name}' not found`
      });
    }
    
    let config = {};
    
    if (algorithm.weights) {
      config.weights = algorithm.weights;
    }
    
    if (algorithm.algorithmName) {
      config.name = algorithm.algorithmName;
    }
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error getting algorithm config:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper functions
function getAlgorithmDescription(name) {
  const descriptions = {
    basic: 'Basic risk scoring algorithm using tenure, performance, and engagement factors',
    advanced: 'Advanced predictive algorithm with behavioral and market intelligence factors',
    ml: 'Machine learning algorithm using historical patterns and predictions',
    engineering: 'Specialized algorithm for engineering roles focusing on skills and market demand',
    sales: 'Sales-specific algorithm considering quota performance and client relationships',
    leadership: 'Algorithm for leadership roles focusing on team performance and succession planning'
  };
  
  return descriptions[name] || 'Custom risk scoring algorithm';
}

function getAlgorithmSuitability(name) {
  const suitability = {
    basic: 'All employees, general risk assessment',
    advanced: 'High-risk employees, detailed analysis',
    ml: 'Organizations with historical attrition data',
    engineering: 'Engineering and technical roles',
    sales: 'Sales and business development roles',
    leadership: 'Managers and leadership positions'
  };
  
  return suitability[name] || 'Custom use cases';
}

module.exports = router;
