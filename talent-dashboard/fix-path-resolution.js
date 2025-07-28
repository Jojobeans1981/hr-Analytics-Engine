const { spawn } = require('child_process');
const path = require('path');

// Normalize paths to use forward slashes
process.env.NODE_PATH = path.normalize(__dirname + '/src').replace(/\\/g, '/');

const child = spawn('react-scripts', ['start'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: '--no-experimental-fetch'
  }
});

child.on('error', (err) => {
  console.error('Failed to start:', err);
});