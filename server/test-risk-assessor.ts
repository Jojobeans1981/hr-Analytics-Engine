import { TalentRiskAssessor } from './src/utils/TalentRiskAssessor';

const testEmployee = {
  id: 1,
  name: 'Test Employee',
  performanceRating: 3.5,
  tenure: 8,
  engagementScore: 0.6,
  compRatio: 0.85,
  criticalSkills: ['JavaScript', 'React'],
  skillGaps: ['TypeScript']
};

const assessor = new TalentRiskAssessor();
const risk = assessor.calculateAdvancedRisk(testEmployee);

console.log('🎯 Test Employee Risk Assessment:');
console.log(`Overall Score: ${risk.score}%`);
console.log('Factor Breakdown:');
console.log(`- Performance: ${Math.round(risk.factors.performance * 100)}%`);
console.log(`- Tenure: ${Math.round(risk.factors.tenure * 100)}%`);
console.log(`- Engagement: ${Math.round(risk.factors.engagement * 100)}%`);
console.log(`- Compensation: ${Math.round(risk.factors.compensation * 100)}%`);
console.log(`- Skills: ${Math.round(risk.factors.skills * 100)}%`);
console.log(`Trend: ${risk.trend}`);
console.log('\n✅ Algorithm test completed!');