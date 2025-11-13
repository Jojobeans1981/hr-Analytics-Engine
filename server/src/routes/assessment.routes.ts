import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { validateAssessmentRequest } from '../validations/assessment.validation';

const router = Router();

router.post('/', (req, res, next) => {
  const error = validateAssessmentRequest(req);
  if (error) {
    res.status(400).json({ success: false, error });
    return;
  }
  next();
}, AssessmentController.createAssessment);

router.get('/', AssessmentController.getAllAssessments);
router.get('/:id', AssessmentController.getAssessment);
router.put('/:id', AssessmentController.updateAssessment);
router.delete('/:id', AssessmentController.deleteAssessment);

export default router;
