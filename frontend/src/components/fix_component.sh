#!/bin/bash

# Create backup
cp EnhancedTalentRiskDashboard.tsx EnhancedTalentRiskDashboard.tsx.backup_fix

# Read the file
content=$(cat EnhancedTalentRiskDashboard.tsx)

# Find the line with PrometheusHeader
header_line=$(grep -n "PrometheusHeader" EnhancedTalentRiskDashboard.tsx | head -1 | cut -d: -f1)

# Create the fixed version
# We'll insert the conditional rendering after PrometheusHeader
# and close it before the end of the component

# First part: up to and including PrometheusHeader
head -n $((header_line)) EnhancedTalentRiskDashboard.tsx > part1.txt

# Insert the conditional rendering
echo "      
      {loading ? (
        <div className=\"loading\">Loading predictive risk intelligence...</div>
      ) : error ? (
        <div className=\"error\">Error: {error}</div>
      ) : (
        <>
" >> part1.txt

# Rest of the content (from after PrometheusHeader to before the closing div)
# We need to find where the closing </div> is for the talent-risk-dashboard
tail -n +$((header_line + 1)) EnhancedTalentRiskDashboard.tsx | head -n -3 > part2.txt

# Add the closing tags
echo "        </>
      )}
    </div>
  );
};

export default EnhancedTalentRiskDashboard;" > part3.txt

# Combine
cat part1.txt part2.txt part3.txt > EnhancedTalentRiskDashboard_fixed.tsx

# Clean up
rm -f part1.txt part2.txt part3.txt

echo "Fixed component created: EnhancedTalentRiskDashboard_fixed.tsx"
echo "Original backed up as: EnhancedTalentRiskDashboard.tsx.backup_fix"
