import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faBell,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const username = user?.name;

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);         // kosongkan user state
      navigate("/");         // redirect ke halaman login / landing
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav
      className="navbar py-3 shadow-sm"
      style={{ position: "sticky", top: 0, zIndex: 900, backgroundColor: "#a7b4a2", backgroundSize: "cover" }}
    >
      <div className="container-fluid mx-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center"></div>

        <ul className="navbar-nav flex-row align-items-center gap-3">
          <li className="nav-item">
            <FontAwesomeIcon icon={faEnvelope} role="button" style={{ color: "white" }} />
          </li>
          <li className="nav-item">
            <FontAwesomeIcon icon={faBell} role="button" style={{ color: "white" }} />
          </li>

          <li className="nav-item mx-3">
            <div style={{ height: "36px", borderLeft: "0.1px solid #ccc" }} />
          </li>

          <li className="nav-item dropdown">
            <div
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              role="button"
              tabIndex="0"
              className="d-flex align-items-center"
            >
              <div className="d-flex flex-column me-2">
                <span className="text-white fw-medium" style={{ fontSize: "12px" }}>
                  {username}
                </span>
              </div>

              <img
                src="/images/profile.svg"
                alt="User Profile"
                style={{ width: "2rem", height: "2rem", borderRadius: "50%" }}
              />
            </div>

            <ul
              className="dropdown-menu shadow"
              aria-labelledby="userDropdown"
              style={{
                border: "none",
                position: "absolute",
                width: "180px",           
                whiteSpace: "nowrap",     
                overflow: "hidden",       
                textOverflow: "ellipsis"  
              }}
            >
              <li>
                <Link to={`/${user.role}/profile`} className="dropdown-item d-flex align-items-center text-decoration-none text-dark">
                  <FontAwesomeIcon icon={faUser} className="me-2" style={{ width: "16px", color: "#DAD3E2" }} />
                  <span style={{ fontSize: "14px" }}>Profile</span>
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="dropdown-item d-flex align-items-center"
                  style={{ fontSize: "14px", paddingLeft: "25px" }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" style={{ color: "#DAD3E2" }} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
