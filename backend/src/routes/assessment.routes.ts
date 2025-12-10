import { Router } from 'express';
import { assessEmployee, assessTeam, getEmployeeHistory, getLatestTeamAssessment, getDashboardStats } from '../controllers/assessment.controller';
import { validateAssessmentRequest } from '../validations/assessment.validation';

const router = Router();

router.post('/', (req, res, next) => {
  const error = validateAssessmentRequest(req);
  if (error) {
    res.status(400).json({ success: false, error });
    return;
  }
  next();
});

router.get('/', getDashboardStats);
router.get('/:id', getEmployeeHistory);
router.put('/:id', assessEmployee);
router.delete('/:id', assessTeam);

export default router;
