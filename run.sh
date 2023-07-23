#!/bin/bash

# Navigate to the frontend directory, install npm dependencies and run the dev server in the background
cd "Demo yolo" && npm install && npm run dev &

# Start the backend server in a new terminal window
osascript -e 'tell app "Terminal" to do script "cd .. && uvicorn YoloAPI:app --reload "'
