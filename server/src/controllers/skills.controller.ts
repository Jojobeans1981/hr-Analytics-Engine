import { Request, Response } from 'express';
import skillsService from '../server/src/services/skills-analyzer.service';

class SkillsController {
  async analyzeText(req: Request, res: Response) {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: 'Text is required' });

      const result = await skillsService.extractSkills(text);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Analysis failed' });
    }
  }
}

export default new SkillsController();