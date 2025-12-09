#!/bin/bash
cd ~/Desktop/talent-risk-ai/server

echo "Current line 72:"
awk 'NR==72' index.js

echo -e "\nChecking for problematic line 73:"
awk 'NR==73' index.js

echo -e "\nFixing..."
# Remove any stray Cache-Control lines
sed -i "/^[[:space:]]*'Cache-Control',$/d" index.js

# Update line 72 to include Cache-Control
sed -i '72s/\(allowedHeaders: \[.*\)\]/\1, \x27Cache-Control\x27]/' index.js

echo -e "\nUpdated line 72:"
awk 'NR==72' index.js

echo -e "\nTesting syntax..."
node -c index.js

if [ $? -eq 0 ]; then
    echo -e "\n✅ Success! Syntax is valid."
    
    echo -e "\nDeploying to Railway..."
    railway up
else
    echo -e "\n❌ Still has syntax errors. Showing lines 70-75:"
    sed -n '70,75p' index.js
fi
