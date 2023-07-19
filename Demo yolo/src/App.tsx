import React, { useState } from "react";
import axios from "axios";
import './index.css'


const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  
  const possibleObjects = ['Person', 'Hardhat', 'Mask','Safety Vest','NO-Hardhat', 'NO-Mask', 'NO-Safety Vest'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedObjects([...selectedObjects, e.target.value]);
    } else {
      setSelectedObjects(selectedObjects.filter(obj => obj !== e.target.value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    let objectsToSend = selectedObjects.length > 0 ? selectedObjects : possibleObjects;
    objectsToSend.forEach((obj) => formData.append("selected_objects", obj));

    const response = await axios.post("http://localhost:5000/predict", formData, {
      responseType: "blob"
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(response.data);
  };

  return (
    <div className="App bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex flex-col items-center justify-center">
      <form className="p-4 bg-white rounded-lg shadow-2xl" onSubmit={handleSubmit}>
        <div className="mb-4">
        <label className="block text-gray-700 text-2xl font-bold mb-6 mt-2 text-center" htmlFor="image-upload">
            ESD Detection
          </label>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-upload">
            Upload an image:
          </label>
          <input className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                 id="image-upload" type="file" accept="image/*" onChange={handleFileChange} required />
        </div>
        {previewImage && <img src={previewImage} alt="Preview" />}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
            Select objects to detect:
          </label>
          {possibleObjects.map(obj => (
            <div key={obj} className="pl-2">
              <input type="checkbox" id={obj} value={obj} onChange={handleCheckboxChange} className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
              <label htmlFor={obj} className="ml-2">{obj}</label>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end">
          <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-gradient-to-r hover:to-indigo-500  hover:via-purple-500 hover:from-pink-500 hover:text-white transition duration-300 ease-in-out" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  ); 
};

export default App;
