import React, { useState } from "react";
import axios from "axios";
import "./index.css";

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);

  const possibleObjects = [
    "Person",
    "Hardhat",
    "Mask",
    "Safety Vest",
    "NO-Hardhat",
    "NO-Mask",
    "NO-Safety Vest",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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
      setSelectedObjects(
        selectedObjects.filter((obj) => obj !== e.target.value),
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    let objectsToSend =
      selectedObjects.length > 0 ? selectedObjects : possibleObjects;
    objectsToSend.forEach((obj) => formData.append("selected_objects", obj));

    const response = await axios.post(
      "http://localhost:8000/predict",
      formData,
      {
        responseType: "blob",
      },
    );    

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(response.data);
  };

  return (
    <div className="App bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex flex-col items-center justify-center">
      <form className="card w-96 bg-base-100 shadow-xl" onSubmit={handleSubmit}>
        <div className="card-body items-center text-center">
          <h2 className="card-title font-bold">ESD Detection</h2>
          <label
            className="block text-gray-700 text-sm font-bold mt-6 mb-2"
            htmlFor="image-upload"
          >
            Upload an image:
          </label>
          <input
            type="file"
            className="file-input file-input-bordered file-input-sm file-input-primary w-full max-w-xs"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <figure className="px-6 ">
          {previewImage && (
            <img src={previewImage} alt="Preview" className="rounded-xl" />
          )}
        </figure>
        <div className="card-body ">
          <div className="mb-4">
            <label className="block text-gray-700 text-m font-bold mb-2">
              Select objects to detect:
            </label>
            {possibleObjects.map((obj) => (
              <div key={obj} className="pl-2">
                <input
                  type="checkbox"
                  id={obj}
                  value={obj}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 checkbox checkbox-primary"
                />
                <label htmlFor={obj} className="ml-2 text-sm text-gray-500">
                  {obj}
                </label>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end">
            <button
              className="btn bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:bg-gradient-to-r hover:to-indigo-500  hover:via-purple-500 hover:from-pink-500 hover:text-white transition duration-300 ease-in-out"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default App;