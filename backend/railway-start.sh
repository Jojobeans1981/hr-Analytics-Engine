#!/bin/bash
# Railway start script

# Build if dist directory doesn't exist
if [ ! -d "dist" ] || [ ! -f "dist/server.js" ]; then
  echo "Building TypeScript..."
  npm run build
fi

# Start the server
echo "Starting server..."
node dist/server.js
