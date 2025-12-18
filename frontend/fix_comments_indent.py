import re

with open('src/components/EnhancedTalentRiskDashboard.tsx', 'r') as f:
    lines = f.readlines()

# Fix duplicate comments and indentation
cleaned_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # Fix duplicate "// Fetch employees" comments (lines 43-44)
    if i == 43 or i == 44:  # Adjust based on actual line numbers
        if '// Fetch employees' in line:
            if i == 43:
                cleaned_lines.append(line)  # Keep first one
            # Skip the second one (i == 44)
            i += 1
            continue
    
    # Fix indentation for line 47 (const apiUrl = ...)
    if 'const apiUrl = process.env.REACT_APP_API_URL;' in line:
        # Add proper indentation (6 spaces for inside try block)
        cleaned_lines.append('      ' + line.lstrip())
    else:
        cleaned_lines.append(line)
    
    i += 1

# Write cleaned file
with open('src/components/EnhancedTalentRiskDashboard.tsx', 'w') as f:
    f.writelines(cleaned_lines)

print("Fixed duplicate comments and indentation")
