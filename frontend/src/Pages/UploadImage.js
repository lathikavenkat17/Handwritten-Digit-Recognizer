import React, { useState } from "react";
import "./UploadPredict.css";

const UploadPredict = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setPrediction(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      // 🔥 Prevents "Unexpected token <"
      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server returned HTML instead of JSON.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed.");
      }

      setPrediction(data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload & Predict</h1>
      <p>Upload a handwritten digit image to predict the number</p>

      <div className="upload-box">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="preview-img"
            style={{ width: "200px", marginTop: "10px" }}
          />
        )}

        <button
          onClick={handlePredict}
          disabled={loading}
          style={{ marginTop: "15px" }}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "15px" }}>
            {error}
          </p>
        )}

        {prediction && prediction.digit !== undefined && (
          <div className="result" style={{ marginTop: "20px" }}>
            <h2>Prediction: {prediction.digit}</h2>

            {prediction.confidence !== undefined && (
              <p>
                Confidence: {(prediction.confidence * 100).toFixed(2)}%
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPredict;
