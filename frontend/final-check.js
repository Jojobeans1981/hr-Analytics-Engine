const https = require('https');

const BASE_URL = 'https://hr-analytics-engine.onrender.com';

console.log('��� FINAL DEPLOYMENT VERIFICATION\n');
console.log('Backend URL:', BASE_URL);
console.log('='.repeat(50));

const tests = [
  { path: '/', name: 'Root' },
  { path: '/api/health', name: 'Health' },
  { path: '/api/employees', name: 'Employees' }
];

let passed = 0;
let total = tests.length;
let completed = 0;

function maybePrintSummary() {
  if (completed !== total) return;
  console.log('\n' + '='.repeat(50));
  console.log(`RESULT: ${passed}/${total} tests passed`);
  if (passed === total) {
    console.log('BACKEND IS PRODUCTION READY!');
    console.log('\nNEXT: Update frontend with this URL and deploy to Vercel');
    console.log(`Frontend config: REACT_APP_API_URL=${BASE_URL}`);
  }
}

tests.forEach((test, index) => {
  const url = BASE_URL + test.path;
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log(`✅ ${test.name}: HTTP ${res.statusCode}`);
        
        if (test.path === '/api/employees') {
          console.log(`   Count: ${json.count} employees`);
          console.log(`   Data: ${json.data.length} records`);
        } else if (test.path === '/api/health') {
          console.log(`   Status: ${json.status}`);
          console.log(`   Database: ${json.db}`);
        }
        passed++;
      } catch (e) {
        console.log(`❌ ${test.name}: Failed to parse JSON`);
      } finally {
        completed++;
        maybePrintSummary();
                 
      }
    });
  }).on('error', (err) => {
    console.log(`❌ ${test.name}: ${err.message}`);
    completed++;
    maybePrintSummary();
  });
});
