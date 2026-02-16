import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./NavBar";
import Home from "./Home";
import UploadPredict from "./Pages/UploadImage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} token={token} setToken={setToken} />

      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register setToken={setToken} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadPredict />} />
            <Route path="/draw" element={<h1>Drawing Board</h1>} />
            <Route path="/realtime" element={<h1>Predict RealTime</h1>} />
            <Route path="/about" element={<h1>About</h1>} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
