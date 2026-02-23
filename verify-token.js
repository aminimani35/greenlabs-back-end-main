const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlODQyMjYxZS01N2NhLTQ5YmEtODViNy1mYjQ5NzgzNTk1YmIiLCJlbWFpbCI6ImFtaW5pbWFuaTk1QHByb3Rvbi5tZSIsInJvbGVzIjpbImFkbWluIl0sInBlcm1pc3Npb25zIjpbImJsb2c6Y3JlYXRlIiwiYmxvZzpyZWFkIiwiYmxvZzp1cGRhdGUiLCJibG9nOmRlbGV0ZSIsImJsb2c6cHVibGlzaCIsInVzZXI6Y3JlYXRlIiwidXNlcjpyZWFkIiwidXNlcjp1cGRhdGUiLCJ1c2VyOmRlbGV0ZSIsInByb2R1Y3Q6Y3JlYXRlIiwicHJvZHVjdDpyZWFkIiwicHJvZHVjdDp1cGRhdGUiLCJwcm9kdWN0OmRlbGV0ZSJdLCJpYXQiOjE3NzE4NDUxMDQsImV4cCI6MTc3MTkzMTUwNH0.C8DKHJ2HZpcmaWv1UcQLrFdOmblV-5ZgL_elB1-96f8';

console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);
console.log('\nTrying to verify token...\n');

// Try with current secret
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✓ Token is VALID with current JWT_SECRET');
  console.log('\nDecoded payload:');
  console.log(JSON.stringify(decoded, null, 2));
} catch (error) {
  console.log('✗ Token is INVALID with current JWT_SECRET');
  console.log('Error:', error.message);
  
  // Try with fallback secret
  console.log('\nTrying with fallback secret "your-secret-key"...');
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    console.log('✓ Token is VALID with fallback secret "your-secret-key"');
    console.log('\nDecoded payload:');
    console.log(JSON.stringify(decoded, null, 2));
    console.log('\n⚠️  WARNING: Your application might be using the fallback secret instead of the .env JWT_SECRET!');
  } catch (error2) {
    console.log('✗ Token is also INVALID with fallback secret');
    console.log('Error:', error2.message);
  }
}

// Decode without verification to see payload
console.log('\n--- Token payload (without verification) ---');
const decoded = jwt.decode(token);
console.log(JSON.stringify(decoded, null, 2));
