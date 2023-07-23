import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

function Realtime() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    // Request access to the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Could not access the webcam', err);
      });
  }, []);

  useEffect(() => {
    if (isDetecting && videoRef.current) {
      // Capture a frame from the video every second
      const intervalId = setInterval(() => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context && videoRef.current) {
          context.drawImage(videoRef.current, 0, 0, 640, 480);
          canvas.toBlob(blob => {
            if (blob) {
              // Now you have a frame as a Blob, you can send it to your server
              // for processing with axios, like you did with the file upload.
              const formData = new FormData();
              formData.append('file', blob, 'webcam.png');

              axios.post('http://localhost:8000/predict', formData)
                .then(response => {
                  // handle the response
                  console.log(response);
                }).catch(error => {
                  console.error(error);
                });
            }
          });
        }
      }, 1000);

      // Clean up the interval on unmount
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isDetecting]);

  return (
<div className="App bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex flex-col items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl" >
        <div className="card-body items-center text-center">
          <h2 className="card-title font-bold">ESD Detection</h2>
        </div>
        <div className="card-body ">
          <div className="mb-4">
          <video ref={videoRef} autoPlay muted width="640" height="480" />
          </div>
          <div className="flex items-center justify-end">
            <button 
            className="btn bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:bg-gradient-to-r hover:to-indigo-500  hover:via-purple-500 hover:from-pink-500 hover:text-white transition duration-300 ease-in-out"
            onClick={() => setIsDetecting(prev => !prev)}>
                {isDetecting ? 'Stop Detection' : 'Start Detection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Realtime;
