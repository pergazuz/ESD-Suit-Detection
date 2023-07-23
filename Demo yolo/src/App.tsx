import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Image from './Image';
import Realtime from './Realtime';

const App: React.FC = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Image />} />
          <Route path="/realtime" element={<Realtime />} />
        </Routes>
    </Router>
  );
};

export default App;
