#!/bin/bash

# Navigate to the frontend directory
cd "Demo yolo"

# Install npm dependencies and run the dev server in the background

npm run dev &

# Start the backend server in a new terminal window
osascript -e 'tell app "Terminal" to do script "python ../YoloAPI.py"'
