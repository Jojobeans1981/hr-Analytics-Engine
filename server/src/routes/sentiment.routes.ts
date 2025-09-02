// sentiment.routes.ts
import { Router } from 'express';
import sentimentController from '../controllers/sentiment.controller';

const router = Router();

router.post('/analyze', sentimentController.analyzeText);
router.get('/history', sentimentController.getHistory);

export default router;