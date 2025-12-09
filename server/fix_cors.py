import re

with open('index.js', 'r') as f:
    content = f.read()

# Find and add Cache-Control to allowedHeaders
# Pattern for allowedHeaders array
pattern = r"(allowedHeaders:\s*\[)([^\]]*)(\])"

def replace_allowed_headers(match):
    opening = match.group(1)
    headers = match.group(2)
    closing = match.group(3)
    
    # Check if Cache-Control already exists
    if "'Cache-Control'" in headers or '"Cache-Control"' in headers:
        print("Cache-Control already in allowedHeaders")
        return match.group(0)
    
    # Add Cache-Control after Content-Type if present, otherwise at the end
    if "'Content-Type'" in headers:
        headers = headers.replace("'Content-Type',", "'Content-Type',\n    'Cache-Control',")
    else:
        headers = headers.rstrip() + "\n    'Cache-Control',"
    
    return opening + headers + closing

new_content = re.sub(pattern, replace_allowed_headers, content, flags=re.DOTALL)

if new_content != content:
    with open('index.js', 'w') as f:
        f.write(new_content)
    print("Updated index.js with Cache-Control in allowedHeaders")
else:
    print("No changes made - pattern not found or Cache-Control already present")

# Show the updated section
print("\nUpdated allowedHeaders section:")
updated_match = re.search(pattern, new_content, flags=re.DOTALL)
if updated_match:
    print(updated_match.group(0)[:500])
