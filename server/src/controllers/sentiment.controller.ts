import { Request, Response } from 'express';
import sentimentService from '../server/src/services/sentiment-analyzer.service';

class SentimentController {
  async analyzeText(req: Request, res: Response) {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: 'Text is required' });

      const result = await sentimentService.analyze(text);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Analysis failed' });
    }
  }

  async getHistory(req: Request, res: Response) {
    // Implement history retrieval
  }
}

export default new SentimentController();