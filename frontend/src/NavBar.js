import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ token, setToken }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const underlineRef = useRef();

  useEffect(() => {
  const updateUnderline = () => {
    const activeLink = document.querySelector(".nav-links li a.active");
    if (activeLink && underlineRef.current) {
      underlineRef.current.style.width = `${activeLink.offsetWidth}px`;
      underlineRef.current.style.left = `${activeLink.offsetLeft}px`;
    }
  };

  // Update on location change
  updateUnderline();

  // Update on window resize
  window.addEventListener("resize", updateUnderline);
  return () => window.removeEventListener("resize", updateUnderline);
}, [location]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  if (!token) return null; // Hide navbar if not logged in

  return (
    <nav>
      <div className="nav-container">
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/upload" className={location.pathname === "/upload" ? "active" : ""}>
              Upload
            </Link>
          </li>
          <li>
            <Link to="/draw" className={location.pathname === "/draw" ? "active" : ""}>
              Draw
            </Link>
          </li>
          <li>
            <Link to="/realtime" className={location.pathname === "/realtime" ? "active" : ""}>
              Realtime
            </Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
              About
            </Link>
          </li>
          <div className="underline" ref={underlineRef}></div>
        </ul>

        <div className="nav-buttons">
          <button className="signout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
