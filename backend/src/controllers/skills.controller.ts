import { Request, Response } from 'express';

export class SkillsController {
  static async extractSkills(req: Request, res: Response): Promise<void> {
    try {
      const { text } = req.body;

      if (!text || typeof text !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Valid text is required for skills extraction'
        });
        return;
      }

      // Common skills database
      const commonSkills = [
        'javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'go', 'rust',
        'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
        'mongodb', 'postgresql', 'mysql', 'redis', 'aws', 'azure', 'gcp',
        'docker', 'kubernetes', 'jenkins', 'git', 'rest api', 'graphql',
        'machine learning', 'ai', 'data analysis', 'cybersecurity',
        'project management', 'agile', 'scrum', 'leadership', 'communication',
        'problem solving', 'teamwork', 'creativity'
      ];

      const words = text.toLowerCase().split(/\s+/);
      const foundSkills: string[] = [];

      commonSkills.forEach(skill => {
        if (text.toLowerCase().includes(skill.toLowerCase())) {
          foundSkills.push(skill);
        }
      });

      // Also look for skill patterns
      const skillPatterns = [
        /\b(js|javascript)\b/i,
        /\b(ts|typescript)\b/i,
        /\b(py|python)\b/i,
        /\b(java)\b/i,
        /\b(react)\b/i,
        /\b(angular)\b/i,
        /\b(vue)\b/i,
        /\b(node)\b/i
      ];

      skillPatterns.forEach((pattern, index) => {
        if (pattern.test(text)) {
          const skillName = commonSkills[index] || pattern.toString();
          if (!foundSkills.includes(skillName)) {
            foundSkills.push(skillName);
          }
        }
      });

      const result = {
        skills: foundSkills,
        totalSkills: foundSkills.length,
        confidence: Math.min(0.7 + (foundSkills.length * 0.05), 0.95),
        categories: {
          technical: foundSkills.filter(skill => 
            !['communication', 'problem solving', 'teamwork', 'creativity', 'leadership', 'project management', 'agile', 'scrum'].includes(skill)
          ),
          soft: foundSkills.filter(skill => 
            ['communication', 'problem solving', 'teamwork', 'creativity', 'leadership', 'project management', 'agile', 'scrum'].includes(skill)
          )
        }
      };

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Skills extraction error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to extract skills'
      });
    }
  }

  static async analyzeTeamSkills(req: Request, res: Response): Promise<void> {
    try {
      const { teamId } = req.params;

      // Temporary implementation for team skills analysis
      const teamSkills = {
        teamId,
        skillsInventory: [
          { skill: 'JavaScript', level: 'advanced', count: 5 },
          { skill: 'Python', level: 'intermediate', count: 3 },
          { skill: 'React', level: 'advanced', count: 4 },
          { skill: 'Node.js', level: 'intermediate', count: 3 }
        ],
        skillsGap: [
          { skill: 'Machine Learning', priority: 'high' },
          { skill: 'DevOps', priority: 'medium' },
          { skill: 'Cloud Architecture', priority: 'medium' }
        ],
        recommendations: [
          'Provide training on Machine Learning fundamentals',
          'Hire or develop DevOps expertise',
          'Cross-train team members on cloud technologies'
        ]
      };

      res.json({
        success: true,
        data: teamSkills
      });
    } catch (error) {
      console.error('Team skills analysis error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze team skills'
      });
    }
  }
}