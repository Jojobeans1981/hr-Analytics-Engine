const fs = require('fs');
const filePath = 'src/components/TalentRiskDashboard.tsx';

let content;
try {
  content = fs.readFileSync(filePath, 'utf8');
} catch (error) {
  console.error(`Error reading file: ${error.message}`);
  process.exit(1);
}

// Split by lines
const lineEnding = content.includes('\r\n') ? '\r\n' : '\n';
const lines = content.split(lineEnding);
// Fix line 253 (approx) - employees.data.length should be (employees?.data || []).length
const fixedLines = lines.map((line, index) => {
  if (line.includes('employees?.data || []).length') && !line.includes('employees?.data')) {
    return line.replace('employees.data.length', '(employees?.data || []).length');
  }
  return line;
});
try {
  fs.writeFileSync(filePath, fixedLines.join(lineEnding));
} catch (error) {
  console.error(`Error writing file: ${error.message}`);
  process.exit(1);
}
console.log('Fixed employees.data.length error');
