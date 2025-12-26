#!/bin/bash

# Read the file
content=$(cat EnhancedTalentRiskDashboard.tsx)

# Split into parts
# Part 1: Everything before JSX
head -n $((JSX_START - 1)) EnhancedTalentRiskDashboard.tsx > part1.txt

# Add the return statement and conditional rendering
echo "  return (
    <div className=\"talent-risk-dashboard\">
      <PrometheusHeader />
      
      {loading ? (
        <div className=\"loading\">Loading predictive risk intelligence...</div>
      ) : error ? (
        <div className=\"error\">Error: {error}</div>
      ) : (
        <>
" >> part1.txt

# Part 2: The main JSX content
tail -n +$JSX_START EnhancedTalentRiskDashboard.tsx > part2.txt

# Part 3: Closing tags
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

echo "Fixed component created"
