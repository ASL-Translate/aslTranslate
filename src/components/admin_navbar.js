import React from 'react';
import { Link } from 'react-router-dom'; // needed to interact with the React App BrowserRouter

async function VerifyAdminSession() {
  try {
    const response = await fetch("/api/admin/verify", {
      method: "GET",
      credentials: 'include'
    });

    const data = await response.json();
    return (data && data.authenticated === true);
  } catch (error) {
    console.error("Error sending request:", error);
    return false;
  }
}

async function handleLogout() {
  try {
    const response = await fetch("/api/logout", {
      method: "GET",
      credentials: 'include'
    });

    await response.text();
    window.location.href = "/admin";
  } catch (error) {
    console.error("Error sending request:", error);
  }
}

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">ASL Translate</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                to="#"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                Logout
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/panel">Admin Panel</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
export { VerifyAdminSession };