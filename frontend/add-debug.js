import { UseEffect } from React;


const fs = require('fs');
const path = './src/components/TalentRiskDashboard.tsx';

let content = fs.readFileSync(path, 'utf8');

// Add debug at the beginning
content = content.replace(
  'const TalentRiskDashboard = () => {',
  `const TalentRiskDashboard = () => {
  console.log('��� Dashboard Component Loaded');
  console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Debug: Log the exact URL being used
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || '';
    console.log('��� Using API URL:', apiUrl);
    
    // Test connection immediately
    fetch(apiUrl + '/api/health')
      .then(res => {
        console.log('Health check status:', res.status);
        return res.text();
      })
      .then(text => {
        console.log('Health check response:', text.substring(0, 100));
      })
      .catch(err => {
        console.error('Health check failed:', err);
      });
  }, []);`
);

// Fix the fetch call
content = content.replace(
  /fetch\(`\${process\.env\.REACT_APP_API_URL \|\| ""\}\/api\/employees`\)/,
  `fetch(\`\${process.env.REACT_APP_API_URL || ""}/api/employees\`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })`
);

// Add error handling
content = content.replace(
  /const data = await response\.json\(\);/,
  `const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('❌ Server returned non-JSON:', text.substring(0, 200));
    throw new Error('Expected JSON but got: ' + contentType);
  }
  const data = await response.json();
  console.log('✅ API Response:', { success: data.success, count: data.count });`
);

fs.writeFileSync(path, content);
console.log('✅ Added debug logging to TalentRiskDashboard.tsx');
