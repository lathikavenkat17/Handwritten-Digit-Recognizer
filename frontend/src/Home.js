import React from "react";
import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Handwritten Digit Recognizer</h1>

      <p className="home-subtitle">
        Draw a digit and let AI recognize it instantly using deep learning.
      </p>

      <p className="home-description">
        This web application uses a trained neural network model to identify
        handwritten digits in real time with high accuracy.
      </p>
    </div>
  );
};

export default Home;
