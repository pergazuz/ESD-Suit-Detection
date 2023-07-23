import requests

url = 'http://localhost:8000/predict'
file_path = 'C:/Users/User/Downloads/portrait-of-asian-worker-man-wearing-safety-jacket-hard-hat-and-leather-J68TY8.jpg'
selected_objects = ['cat', 'dog']

with open(file_path, 'rb') as f:
    response = requests.post(
        url, 
        files={'request': f},
        data={'selected_objects': selected_objects}
    )

print(response.status_code)
print(response.json())
