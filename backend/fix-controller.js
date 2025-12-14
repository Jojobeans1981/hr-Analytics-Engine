const fs = require('fs');
const content = fs.readFileSync('controllers/employeeController.js', 'utf8');

// Remove the status filter line completely
const lines = content.split('\n');
const newLines = lines.map((line, index) => {
  if (index === 40) { // Line 41 (0-indexed) is "if (status) query.status = status;"
    return ''; // Remove this line
  }
  if (index === 41) { // Line 42 is the riskLevel line
    return line.replace('.toLowerCase()', ''); // Remove .toLowerCase()
  }
  return line;
}).filter(line => line !== ''); // Remove empty lines

fs.writeFileSync('controllers/employeeController.js', newLines.join('\n'));
console.log('Fixed controller file');
