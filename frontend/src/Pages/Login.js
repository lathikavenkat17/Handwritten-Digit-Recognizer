import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: "url(/login.jpg)" }}
    >
      <div className="auth-left">
        <form onSubmit={handleLogin} className="auth-form">
          <h2>Login</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <p>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
