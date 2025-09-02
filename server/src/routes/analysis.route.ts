import express from 'express';
import Employee from '../models/Employee.model';
import sentimentService from '../services/sentiment-analyzer.service';
import RiskPredictorService, { type EmployeeData } from '../services/risk-predictor.service';
import { createLogger } from '../utils/logger';

const router = express.Router();
const logger = createLogger('AnalysisRoute');
const riskPredictor = new RiskPredictorService();

function transformToEmployeeData(employeeDoc: any): EmployeeData {
  return {
    id: employeeDoc._id.toString(),
    name: `${employeeDoc.firstName} ${employeeDoc.lastName}`,
    role: employeeDoc.position || 'Unknown',
    experience: employeeDoc.experienceYears || 0,
    performance: employeeDoc.performanceRating || 'average',
    feedback: employeeDoc.feedback || '',
    skillsText: employeeDoc.skills?.join(', ') || ''
  };
}

router.get('/:id', async (req, res) => {
  try {
    logger.info(`Starting analysis for employee ${req.params.id}`);
    const employeeDoc = await Employee.findById(req.params.id);
    
    if (!employeeDoc) {
      logger.info('Employee not found', { employeeId: req.params.id });
         return res.status(404).json({ error: 'Employee not found' });
    }

    // Initialize services in parallel
    await Promise.all([
      !sentimentService.isInitialized() && sentimentService.initialize(),
      !riskPredictor.isInitialized() && riskPredictor.initialize()
    ]);

    const employeeData = transformToEmployeeData(employeeDoc);
    logger.debug('Employee data transformed', { employeeId: employeeData.id });

    const [sentiment, risk] = await Promise.all([
      sentimentService.analyzeSentiment(employeeData.feedback),
      riskPredictor.predictRisk(employeeData)
    ]);

    // Update employee record
   employeeDoc.sentimentHistory.push({
  date: new Date(),  // Add current date
  score: sentiment.score,
  magnitude: sentiment.magnitude,
  source: 'system'
});

    if (risk.riskLevel === 'high' && !employeeDoc.riskFlags.includes('high_risk')) {
      employeeDoc.riskFlags.push('high_risk');
    }

    employeeDoc.lastAnalyzed = new Date();
    await employeeDoc.save();

    logger.info('Analysis completed successfully', { employeeId: employeeData.id });
    
    res.json({
      employee: {
        id: employeeData.id,
        name: employeeData.name
      },
      sentiment,
      risk
    });

  } catch (error) {
    logger.error('Analysis failed', {
      employeeId: req.params.id,
      error: error instanceof Error ? error.message : String(error)
    });
    res.status(500).json({ 
      error: 'Analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Batch processing endpoint
router.post('/batch', async (req, res) => {
  try {
    logger.info('Starting batch analysis');
    const employees = await Employee.find({
      $or: [
        { lastAnalyzed: { $exists: false } },
        { lastAnalyzed: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
      ]
    }).limit(100);

    if (employees.length === 0) {
      logger.info('No employees need analysis');
      return res.json({ message: 'No employees require analysis at this time' });
    }

    // Initialize services
    await Promise.all([
      !sentimentService.isInitialized() && sentimentService.initialize(),
      !riskPredictor.isInitialized() && riskPredictor.initialize()
    ]);

    const results = [];
    for (const employee of employees) {
      try {
        const employeeData = transformToEmployeeData(employee);
        const risk = await riskPredictor.predictRisk(employeeData);
        
        // Update employee
        employee.sentimentHistory.push({
          score: (await sentimentService.analyzeSentiment(employeeData.feedback)).score,
          magnitude: 0, // Simplified for batch
          date: new Date(), 
          source: 'batch'
        });

        if (risk.riskLevel === 'high') {
          employee.riskFlags = [...new Set([...employee.riskFlags, 'high_risk'])];
        }

        employee.lastAnalyzed = new Date();
        await employee.save();

        results.push({
          employeeId: employee._id,
          name: employeeData.name,
          riskLevel: risk.riskLevel
        });
      } catch (error) {
        logger.error('Failed to analyze employee', {
          employeeId: employee._id,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    logger.info('Batch analysis completed', { analyzed: results.length });
    res.json({
      analyzed: results.length,
      results
    });

  } catch (error) {
    logger.error('Batch analysis failed', {
      error: error instanceof Error ? error.message : String(error)
    });
    res.status(500).json({ error: 'Batch processing failed' });
  }
});

export default router;