const fs = require('fs');
const content = fs.readFileSync('src/components/EnhancedTalentRiskDashboard.tsx', 'utf8');

// Add debug after setEmployees
const newContent = content.replace(
  'setEmployees(mappedEmployees);',
  `setEmployees(mappedEmployees);
      console.log('Employees data:', mappedEmployees);
      console.log('First employee:', mappedEmployees[0]);`
);

fs.writeFileSync('src/components/EnhancedTalentRiskDashboard.tsx', newContent);
console.log('Added debug logs');
