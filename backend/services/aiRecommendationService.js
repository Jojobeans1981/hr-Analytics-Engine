const axios = require('axios');

class AIRecommendationService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.apiUrl =
      process.env.DEEPSEEK_API_URL ||
      'https://api.deepseek.com/v1/chat/completions';
  }

  async generateRecommendations(employeeData) {
    try {
      const prompt = this.buildRecommendationPrompt(employeeData);

      const response = await axios.post(
        this.apiUrl,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert HR consultant specializing in talent retention and risk mitigation.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return this.parseAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('AI Recommendation Error:', error.message);
      return this.getFallbackRecommendations(employeeData);
    }
  }

  buildRecommendationPrompt(employee) {
    return `
        Generate HR intervention recommendations for a high-risk employee with these details:
        
        Employee Profile:
        - Name: ${employee.name}
        - Department: ${employee.department}
        - Position: ${employee.position}
        - Risk Score: ${employee.riskScore}/100
        - Risk Factors: ${employee.riskFactors ? employee.riskFactors.join(', ') : 'Not specified'}
        - Tenure: ${employee.tenureMonths || 'Unknown'} months
        - Engagement Score: ${employee.engagementScore || 'Not specified'}/100
        
        Generate 3-5 specific, actionable recommendations in this format:
        
        1. [RECOMMENDATION TITLE]
           Type: [training/mentorship/retention/wellness/development]
           Action: [Specific action to take]
           Timeline: [When to implement]
           Expected Impact: [Expected outcome]
        
        Focus on preventive measures that address the specific risk factors mentioned.
        `;
  }

  parseAIResponse(aiText) {
    const recommendations = [];
    const lines = aiText.split('\n');

    let currentRec = null;
    for (const line of lines) {
      if (line.match(/^\d+\.\s+\[?[A-Z\s]+\]?/i)) {
        if (currentRec) recommendations.push(currentRec);
        currentRec = {
          title: line.replace(/^\d+\.\s+\[?(.+?)\]?\s*$/i, '$1').trim(),
          type: '',
          action: '',
          timeline: '',
          expectedImpact: '',
        };
      } else if (line.includes('Type:')) {
        if (currentRec)
          currentRec.type = line.split('Type:')[1].trim().toLowerCase();
      } else if (line.includes('Action:')) {
        if (currentRec) currentRec.action = line.split('Action:')[1].trim();
      } else if (line.includes('Timeline:')) {
        if (currentRec) currentRec.timeline = line.split('Timeline:')[1].trim();
      } else if (line.includes('Expected Impact:')) {
        if (currentRec)
          currentRec.expectedImpact = line.split('Expected Impact:')[1].trim();
      }
    }

    if (currentRec) recommendations.push(currentRec);
    return recommendations;
  }

  getFallbackRecommendations() {
    return [
      {
        title: 'Manager Check-in Meeting',
        type: 'retention',
        action: 'Schedule bi-weekly 1:1 meetings with direct manager',
        timeline: 'Within 1 week',
        expectedImpact: 'Improve communication and address concerns early',
      },
      {
        title: 'Skills Development Plan',
        type: 'development',
        action: 'Create personalized learning path for career growth',
        timeline: 'Within 2 weeks',
        expectedImpact: 'Increase engagement and reduce flight risk',
      },
    ];
  }
}

module.exports = new AIRecommendationService();
