#!/bin/bash

# Navigate to the frontend directory
cd "Demo yolo"

# Install npm dependencies and run the dev server in a new terminal
npm install
osascript -e 'tell app "Terminal" to do script "npm run dev"' 

# Navigate back to the root directory
cd ..

# Start the backend server
python YoloAPI.py
