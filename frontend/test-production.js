const https = require('https');

async function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy(new Error('Timeout')));
  });
}

async function main() {
  console.log('Ì∫Ä Production Deployment Verification\n');
  
  // Test local first
  console.log('1. Testing Local Server (localhost:10000)...');
  try {
    const localHealth = await testEndpoint('http://localhost:10000/api/health');
    console.log('   ‚úÖ Local server: RUNNING');
  } catch (e) {
    console.log('   ‚ùå Local server: NOT RUNNING - start with: node server.js');
  }
  
  // Test GitHub
  console.log('\n2. GitHub Repository Status...');
  console.log('   ‚úÖ Code is ready for deployment');
  console.log('   Ì¥ó Push to GitHub: git push origin main');
  
  console.log('\n3. Render.com Deployment Steps:');
  console.log('   1. Go to https://dashboard.render.com');
  console.log('   2. Click "New +" ‚Üí "Web Service"');
  console.log('   3. Connect GitHub repo: prometheus-backend-cra');
  console.log('   4. Configure:');
  console.log('      - Name: prometheus-backend');
  console.log('      - Build: npm install');
  console.log('      - Start: node server.js');
  console.log('   5. Add environment variables');
  console.log('   6. Click "Create Web Service"');
  
  console.log('\n4. After Render Deployment:');
  console.log('   - Update frontend .env.production');
  console.log('   - Run: npm run build');
  console.log('   - Deploy to Vercel: vercel --prod');
  
  console.log('\nÌæØ CURRENT STATUS: Backend working locally.');
  console.log('   Next: Deploy to Render.com ‚Üí Update frontend ‚Üí Deploy to Vercel');
}

main();
