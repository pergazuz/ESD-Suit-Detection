from flask import Flask, request, send_file
from flask_cors import CORS
from ultralytics import YOLO
import os
import io
import cv2
import numpy as np
from ultralytics.yolo.utils.plotting import Annotator

app = Flask(__name__)
CORS(app, origins="*")

model = YOLO('YOLO_8_M_Ori.pt')

colors = [
    (255, 0, 0),    # Red
    (0, 255, 0),    # Green
    (0, 0, 255),    # Blue
    (255, 255, 0),  # Yellow
    (255, 0, 255),  # Magenta
    (0, 255, 255),  # Cyan
    (128, 128, 128),  # Gray
    (255, 165, 0),  # Orange
    (0, 128, 0),    # Dark Green
    (139, 69, 19)   # Brown
]

def predict(image, user_selected_objects,model):
    results = model.predict(image)
    for r in results:
        annotator = Annotator(image)
        boxes = r.boxes
        for box in boxes:
            b = box.xyxy[0]  # get box coordinates in (top, left, bottom, right) format
            c = box.cls
            if model.names[int(c)] in user_selected_objects:  # use user_selected_objects here
                label = f"{model.names[int(c)]} {box.conf.item():.2f}"  # here the confidence score is added to the label
                color = colors[user_selected_objects.index(model.names[int(c)])]  # assign color based on object type
                annotator.box_label(b, label, color=color)  # draw the box with the specified color

    return annotator.result()

@app.route('/predict', methods=['POST'])
def handle_predict():
    file = request.files['file']
    user_selected_objects = request.form.getlist('selected_objects')  # Extract the selected_objects from form data
    print(user_selected_objects)
    frame = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = predict(image, user_selected_objects, model)  # Pass the model to the predict function
    result = cv2.cvtColor(result, cv2.COLOR_RGB2BGR)  # Convert the color back to BGR before encoding
    _, img_encoded = cv2.imencode('.png', result)

    img_bytes = io.BytesIO(img_encoded.tostring())
  
    return send_file(
        img_bytes,
        mimetype='image/png',
        as_attachment=True,
        download_name='result.png'
    )


@app.route('/')
def home():
    return "Welcome to the YOLO predictor!"

if __name__ == "__main__":
    app.run(debug=True)
