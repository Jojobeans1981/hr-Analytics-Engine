import { Router } from 'express';
import { SentimentController } from '../controllers/sentiment.controller';

const router = Router();

router.post('/analyze', SentimentController.analyzeText);
router.get('/teams/:teamId', SentimentController.analyzeTeamSentiment);

export default router;
