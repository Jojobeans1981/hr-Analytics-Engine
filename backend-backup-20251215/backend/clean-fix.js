const fs = require('fs');
const path = 'controllers/employeeController.js';
let content = fs.readFileSync(path, 'utf8');

// Find and replace the problematic section
const startMarker = '// Build query';
const endMarker = '// Build sort';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const before = content.substring(0, startIndex + startMarker.length);
  const after = content.substring(endIndex);
  
  // New query section without status filter
  const newQuerySection = `
    let query = {};
    if (department) query.department = department;
    if (riskLevel) query.riskLevel = riskLevel;
  `;
  
  content = before + newQuerySection + after;
  fs.writeFileSync(path, content);
  console.log('Successfully fixed controller');
} else {
  console.log('Could not find markers in file');
}
