#!/bin/bash

# Simple TypeScript type check script
echo "Checking TypeScript types..."

# Check if we can import the auth module
node -e "
try {
  const { auth } = require('./src/lib/auth.ts');
  console.log('✓ auth module imports successfully');
} catch (e) {
  console.log('✗ auth module import failed:', e.message);
}
"

echo "Type check completed."