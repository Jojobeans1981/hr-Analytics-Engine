#!/bin/bash
echo "Current line 72:"
awk 'NR==72' index.js

echo -e "\nRemoving any stray Cache-Control lines..."
sed -i "/^[[:space:]]*'Cache-Control',$/d" index.js

echo -e "\nAdding Cache-Control to allowedHeaders..."
# Find line with allowedHeaders and add Cache-Control
awk 'NR==72 { 
  if (!/Cache-Control/) {
    gsub(/\]/, ", \x27Cache-Control\x27]")
  }
  print 
} 
NR!=72 { print }' index.js > index.js.fixed

mv index.js.fixed index.js

echo -e "\nUpdated line 72:"
awk 'NR==72' index.js

echo -e "\nTesting syntax..."
if node -c index.js >/dev/null 2>&1; then
  echo "✅ Syntax is valid!"
  echo -e "\nLines 70-75:"
  sed -n '70,75p' index.js
else
  echo "❌ Syntax error. Showing error:"
  node -c index.js 2>&1 | head -10
fi
