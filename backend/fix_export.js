const fs = require('fs');
const content = fs.readFileSync('aiRecommendationService.js', 'utf8');

// Find and fix the export section
const lines = content.split('\n');
let newLines = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export {') || lines[i].includes('module.exports = {')) {
    // Skip export lines, we'll add proper export at the end
    continue;
  }
  if (lines[i].trim() === '};' && i > 0 && lines[i-1].includes('generateFallbackRecommendations')) {
    // Skip the closing brace
    continue;
  }
  newLines.push(lines[i]);
}

// Add proper CommonJS export at the end
newLines.push('');
newLines.push('module.exports = {');
newLines.push('  generateAIRecommendations,');
newLines.push('  generateFallbackRecommendations');
newLines.push('};');

fs.writeFileSync('aiRecommendationService.js', newLines.join('\n'));
console.log('Fixed export syntax in aiRecommendationService.js');
