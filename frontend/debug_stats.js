const fs = require('fs');
const content = fs.readFileSync('src/components/EnhancedTalentRiskDashboard.tsx', 'utf8');

// Add debug after highRiskCount calculation
const newContent = content.replace(
  'const highRiskCount = employees.filter(e => e.riskScore >= 60).length;',
  `const highRiskCount = employees.filter(e => e.riskScore >= 60).length;
  console.log('Total employees:', employees.length);
  console.log('High risk count (riskScore >= 60):', highRiskCount);
  console.log('High risk employees:', employees.filter(e => e.riskScore >= 60).map(e => ({name: e.name, riskScore: e.riskScore})));`
);

fs.writeFileSync('src/components/EnhancedTalentRiskDashboard.tsx', newContent);
console.log('Added stats debug logs');
