import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css"; // Make sure this CSS file contains the light-violet styles



const Register = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:5000/register", {
        username,
        email,
        password,
      });

      // Save token to localStorage
      localStorage.setItem("token", res.data.access_token);

      // Update App state so Navbar re-renders
      setToken(res.data.access_token);

      // Redirect to home page
      navigate("/");
    } catch (err) {
      console.log(err.response);
      if (err.response) {
        alert(err.response.data.message || "Registration failed");
      } else {
        alert("Network error, please try again.");
      }
    }
  };

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: "url(/login.jpg)" }}
    >
      {/* LEFT wrapper */}
      <div className="auth-left">
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Register</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Register</button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
