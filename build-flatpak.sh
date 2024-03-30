#!/bin/sh
set -e

# Remove any existing node_modules directories
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Install dependencies
npm install --frozen-lockfile

# Build the app
npm run build

# Copy the app to /app/opt/wordle
mkdir -p /app/opt/wordle
cp package.json /app/opt/wordle/
cp -r dist/* /app/opt/wordle/

# Copy the icon and desktop file to /app/share
# mkdir -p /app/share/applications
# mkdir -p /app/share/icons/hicolor/96x96/apps
# cp data/com.example.Example.desktop /app/share/applications/
# cp data/com.example.Example.png /app/share/icons/hicolor/96x96/apps/

# Create a symlink to the app in /app/bin
mkdir -p /app/bin

# Copy the node command
cp "$(command -v node)" /app/bin/node

(
    echo '#!/bin/sh'
    echo 'exec /app/bin/node /app/opt/wordle/index.js'
) >/app/bin/wordle

chmod +x /app/bin/wordle
