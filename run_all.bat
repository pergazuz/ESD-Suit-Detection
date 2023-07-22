@echo off
cd Demo yolo
call npm install
start /b npm run dev
call python YoloAPI.py
