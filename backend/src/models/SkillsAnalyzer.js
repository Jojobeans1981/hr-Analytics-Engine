const natural = require('natural');
const cosineSimilarity = require('cosine-similarity');

class SkillsAnalyzer {
  constructor() {
    this.tfidf = new natural.TfIdf();
    this.skillsDatabase = this.loadSkillsDatabase();
    this.industryTrends = this.loadIndustryTrends();
  }

  loadSkillsDatabase() {
    return {
      'software_engineer': {
        required: ['Programming', 'Problem Solving', 'Version Control', 'Testing'],
        preferred: ['Cloud Computing', 'DevOps', 'Agile', 'System Design'],
        emerging: ['AI/ML', 'Blockchain', 'IoT', 'Quantum Computing']
      },
      'data_scientist': {
        required: ['Statistics', 'Programming', 'Machine Learning', 'Data Visualization'],
        preferred: ['Deep Learning', 'Big Data', 'Cloud Platforms', 'Business Acumen'],
        emerging: ['AutoML', 'MLOps', 'Explainable AI', 'Edge Computing']
      },
      'product_manager': {
        required: ['Product Strategy', 'Analytics', 'Communication', 'Project Management'],
        preferred: ['Technical Knowledge', 'UX Design', 'Market Research', 'Leadership'],
        emerging: ['AI Product Management', 'Privacy Engineering', 'Sustainability']
      }
    };
  }

  loadIndustryTrends() {
    return {
      'technology': {
        growing: ['AI/ML', 'Cloud', 'Security', 'Data Engineering'],
        declining: ['Legacy Systems', 'Manual Testing', 'Waterfall PM'],
        stable: ['Web Development', 'Mobile Development', 'Databases']
      }
    };
  }

  analyzeEmployeeSkills(employee) {
    const roleRequirements = this.skillsDatabase[employee.role] || 
                           this.skillsDatabase['software_engineer'];
    
    const analysis = {
      currentSkills: employee.skills || [],
      requiredSkills: roleRequirements.required,
      gaps: [],
      strengths: [],
      recommendations: [],
      marketAlignment: 0
    };

    // Analyze gaps
    analysis.gaps = this.identifyGaps(
      employee.skills, 
      [...roleRequirements.required, ...roleRequirements.preferred]
    );

    // Identify strengths
    analysis.strengths = this.identifyStrengths(
      employee.skills, 
      roleRequirements
    );

    // Calculate market alignment
        // Calculate market alignment
    analysis.marketAlignment = this.calculateMarketAlignment(
      employee.skills,
      employee.industry || 'technology'
    );

    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(
      analysis.gaps,
      analysis.marketAlignment
    );

    analysis.score = this.calculateSkillScore(analysis);

    return analysis;
  }

  identifyGaps(employeeSkills, requiredSkills) {
    const gaps = [];
    
    requiredSkills.forEach(requiredSkill => {
      const hasSkill = employeeSkills.some(empSkill => 
        this.areSkillsSimilar(empSkill, requiredSkill)
      );
      
      if (!hasSkill) {
        gaps.push({
          skill: requiredSkill,
          importance: this.getSkillImportance(requiredSkill),
          difficulty: this.getLearningDifficulty(requiredSkill)
        });
      }
    });

    return gaps.sort((a, b) => b.importance - a.importance);
  }

  areSkillsSimilar(skill1, skill2) {
    const similarity = natural.JaroWinklerDistance(
      skill1.toLowerCase(), 
      skill2.toLowerCase()
    );
    return similarity > 0.85;
  }

  getSkillImportance(skill) {
    const importanceMap = {
      'Programming': 10,
      'Machine Learning': 9,
      'Cloud Computing': 9,
      'Problem Solving': 10,
      'Communication': 8,
      'Leadership': 7
    };
    return importanceMap[skill] || 5;
  }

  getLearningDifficulty(skill) {
    const difficultyMap = {
      'Machine Learning': 8,
      'Quantum Computing': 10,
      'Cloud Computing': 6,
      'Communication': 4,
      'Leadership': 5
    };
    return difficultyMap[skill] || 5;
  }

  identifyStrengths(employeeSkills, roleRequirements) {
    const strengths = [];
    const allRelevantSkills = [
      ...roleRequirements.required,
      ...roleRequirements.preferred,
      ...roleRequirements.emerging
    ];

    employeeSkills.forEach(skill => {
      if (allRelevantSkills.some(relSkill => 
        this.areSkillsSimilar(skill, relSkill))) {
        strengths.push({
          skill,
          relevance: this.getSkillRelevance(skill, roleRequirements)
        });
      }
    });

    return strengths.sort((a, b) => b.relevance - a.relevance);
  }

  getSkillRelevance(skill, roleRequirements) {
    if (roleRequirements.required.includes(skill)) return 10;
    if (roleRequirements.preferred.includes(skill)) return 7;
    if (roleRequirements.emerging.includes(skill)) return 5;
    return 3;
  }

  calculateMarketAlignment(skills, industry) {
    const trends = this.industryTrends[industry] || this.industryTrends['technology'];
    let alignmentScore = 0;
    let totalWeight = 0;

    skills.forEach(skill => {
      if (trends.growing.some(trend => this.areSkillsSimilar(skill, trend))) {
        alignmentScore += 10;
        totalWeight += 10;
      } else if (trends.stable.some(trend => this.areSkillsSimilar(skill, trend))) {
        alignmentScore += 5;
        totalWeight += 5;
      } else if (trends.declining.some(trend => this.areSkillsSimilar(skill, trend))) {
        alignmentScore += 1;
        totalWeight += 5;
      }
    });

    return totalWeight > 0 ? (alignmentScore / totalWeight) * 100 : 50;
  }

  generateRecommendations(gaps, marketAlignment) {
    const recommendations = [];

    // High priority gaps
    const highPriorityGaps = gaps.filter(g => g.importance >= 8);
    if (highPriorityGaps.length > 0) {
      recommendations.push({
        type: 'urgent',
        message: `Focus on developing: ${highPriorityGaps.map(g => g.skill).join(', ')}`,
        resources: this.getlearningResources(highPriorityGaps[0].skill)
      });
    }

    // Market alignment
    if (marketAlignment < 50) {
      recommendations.push({
        type: 'strategic',
        message: 'Consider upskilling in emerging technologies to improve market alignment',
        resources: ['Coursera', 'edX', 'Udacity free courses']
      });
    }

    return recommendations;
  }

  getlearningResources(skill) {
    const resources = {
      'Programming': ['freeCodeCamp', 'Codecademy', 'MDN Web Docs'],
      'Machine Learning': ['Fast.ai', 'Google ML Crash Course', 'Kaggle Learn'],
      'Cloud Computing': ['AWS Free Tier', 'Google Cloud Skills Boost', 'Azure Learn'],
      default: ['YouTube', 'Medium articles', 'Open source projects']
    };
    return resources[skill] || resources.default;
  }

  calculateSkillScore(analysis) {
    const gapPenalty = analysis.gaps.length * 5;
    const strengthBonus = analysis.strengths.length * 10;
    const alignmentBonus = analysis.marketAlignment * 0.5;
    
    return Math.max(0, Math.min(100, 
      100 - gapPenalty + strengthBonus + alignmentBonus
    ));
  }
}

module.exports = SkillsAnalyzer;