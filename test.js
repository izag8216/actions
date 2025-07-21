const { add, multiply } = require('./index.js');

function runTests() {
  console.log('Running tests...');
  
  // Test add function
  const addResult = add(2, 3);
  if (addResult === 5) {
    console.log('✓ Add test passed');
  } else {
    console.log('✗ Add test failed');
    process.exit(1);
  }
  
  // Test multiply function
  const multiplyResult = multiply(4, 5);
  if (multiplyResult === 20) {
    console.log('✓ Multiply test passed');
  } else {
    console.log('✗ Multiply test failed');
    process.exit(1);
  }
  
  console.log('All tests passed!');
}

runTests();
