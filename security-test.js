/**
 * Frontend Security Test Script
 * Tests various security features implemented in the frontend
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Test 1: Check if DOMPurify is available and working
const testDOMPurify = () => {
  try {
    const DOMPurify = require('dompurify');
    const { JSDOM } = require('jsdom');
    
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    
    // Test XSS prevention
    const maliciousHTML = '<script>alert("XSS")</script><p>Safe content</p>';
    const cleaned = purify.sanitize(maliciousHTML);
    
    console.log('✅ DOMPurify Test:');
    console.log(`   Input: ${maliciousHTML}`);
    console.log(`   Output: ${cleaned}`);
    console.log(`   Safe: ${!cleaned.includes('<script>')}`);
    
    return !cleaned.includes('<script>');
  } catch (error) {
    console.log('❌ DOMPurify Test Failed:', error.message);
    return false;
  }
};

// Test 2: Check environment variables
const testEnvironmentVariables = () => {
  console.log('\n✅ Environment Variables Check:');
  
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_CSRF_PROTECTION',
    'VITE_XSS_PROTECTION'
  ];
  
  let allSet = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`   ${varName}: ${value ? '✅ Set' : '❌ Not Set'}`);
    if (!value) allSet = false;
  });
  
  return allSet;
};

// Test 3: Check package security
const testPackageSecurity = () => {
  try {
    const packageJson = require('./package.json');
    console.log('\n✅ Package Security Check:');
    
    // Check for security-related dependencies
    const securityDeps = ['axios', 'dompurify'];
    const missingDeps = [];
    
    securityDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        console.log(`   ${dep}: ✅ Installed (${packageJson.dependencies[dep]})`);
      } else {
        console.log(`   ${dep}: ❌ Missing`);
        missingDeps.push(dep);
      }
    });
    
    // Check for security scripts
    const securityScripts = ['security:audit'];
    securityScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        console.log(`   Script "${script}": ✅ Available`);
      } else {
        console.log(`   Script "${script}": ❌ Missing`);
      }
    });
    
    return missingDeps.length === 0;
  } catch (error) {
    console.log('❌ Package Security Test Failed:', error.message);
    return false;
  }
};

// Test 4: Check for common security files
const testSecurityFiles = () => {
  console.log('\n✅ Security Files Check:');
  
  const fs = require('fs');
  const path = require('path');
  
  const securityFiles = [
    '.env.example',
    'src/utils/security.js',
    'src/services/api.js'
  ];
  
  let allExist = true;
  
  securityFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    const exists = fs.existsSync(filePath);
    console.log(`   ${file}: ${exists ? '✅ Exists' : '❌ Missing'}`);
    if (!exists) allExist = false;
  });
  
  return allExist;
};

// Test 5: Validate HTML security headers
const testHTMLHeaders = () => {
  console.log('\n✅ HTML Security Headers Check:');
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    const htmlPath = path.join(process.cwd(), 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Content-Security-Policy'
    ];
    
    let allHeadersPresent = true;
    
    requiredHeaders.forEach(header => {
      const exists = htmlContent.includes(header);
      console.log(`   ${header}: ${exists ? '✅ Present' : '❌ Missing'}`);
      if (!exists) allHeadersPresent = false;
    });
    
    return allHeadersPresent;
  } catch (error) {
    console.log('❌ HTML Headers Test Failed:', error.message);
    return false;
  }
};

// Run all tests
const runSecurityTests = () => {
  console.log('🔐 Frontend Security Test Suite\n');
  console.log('==================================');
  
  const tests = [
    { name: 'DOMPurify XSS Protection', test: testDOMPurify },
    { name: 'Environment Variables', test: testEnvironmentVariables },
    { name: 'Package Security', test: testPackageSecurity },
    { name: 'Security Files', test: testSecurityFiles },
    { name: 'HTML Security Headers', test: testHTMLHeaders }
  ];
  
  const results = tests.map(({ name, test }) => {
    try {
      const result = test();
      return { name, passed: result };
    } catch (error) {
      console.log(`❌ ${name} failed with error:`, error.message);
      return { name, passed: false };
    }
  });
  
  console.log('\n==================================');
  console.log('📊 Test Summary:');
  console.log('==================================');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`);
  });
  
  console.log(`\n🎯 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All security tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some security tests failed. Please review the issues above.');
    process.exit(1);
  }
};

// Run the tests
runSecurityTests(); 