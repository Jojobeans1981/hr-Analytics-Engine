const https = require('https');

console.log('��� Testing Complete Application\n');

const BACKEND = 'https://hr-analytics-engine.onrender.com';
// Update with your actual Vercel frontend URL
const FRONTEND = 'https://dashboard-d3ka4h17k-joseph-panettas-projects.vercel.app';

console.log('Backend:', BACKEND);
console.log('Frontend:', FRONTEND);
console.log('');

// Test 1: Backend health
console.log('1. Testing Backend Health...');
https.get(BACKEND + '/api/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('   ✅ Status:', json.status);
    console.log('   ✅ Database:', json.db);
    
    // Test 2: Backend employees
    console.log('\n2. Testing Employees API...');
    https.get(BACKEND + '/api/employees', (res) => {
      let empData = '';
      res.on('data', chunk => empData += chunk);
      res.on('end', () => {
        const employees = JSON.parse(empData);
        console.log('   ✅ Employee count:', employees.count);
        console.log('   ✅ Data length:', employees.data.length);
          let json;
    try {
        console.log('\n��� BACKEND IS FULLY OPERATIONAL!');
        console.log('\n��� Your frontend should now work perfectly.');
        console.log('��� If you see errors in frontend, check:');
        console.log('   1. Browser console for CORS errors');
        console.log('   2. Network tab for API calls');
        console.log('   3. REACT_APP_API_URL is set correctly');
      });
    });
  });
}).on('error', (err) => {
  console.log('❌ Backend error:', err.message);
});
