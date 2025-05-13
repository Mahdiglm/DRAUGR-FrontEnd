// A simple install script
const { execSync } = require('child_process');

try {
  console.log('Installing react-router-dom...');
  execSync('npm install react-router-dom --save', { stdio: 'inherit' });
  console.log('react-router-dom installed successfully!');
} catch (error) {
  console.error('Error installing react-router-dom:', error);
}