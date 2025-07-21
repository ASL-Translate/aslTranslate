import React, { useState, useEffect } from 'react';
import AdminNavbar, { VerifyAdminSession } from '../components/admin_navbar.js';
import '../App.css';

export function AdminPanel() {
  const [msgContent, setMsgContent] = useState("");
  const [theme, setTheme] = useState("dark"); // Theme state

  useEffect(() => {
    async function Verify() {
      const authenticated = await VerifyAdminSession();
      if (authenticated === false) {
        window.location.href = "/admin"
      }
    }
    Verify();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const [admins, setAdmins] = useState([]);
  async function getAdmins() {
    try {
      const response = await fetch("http://localhost:4000/admin/fetch_admins", {
        method: "GET",
        credentials: 'include'
      });

      const data = await response.json();
      if (data) setAdmins(data);
      console.log(data);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  }

  const [username, SetUsername] = useState("");
  const [password, SetPassword] = useState("");

  const HandleRegisteration = async (event) => {
    event.preventDefault();
    let msgArea = document.getElementById('msg_popup');

    try {
      const response = await fetch("http://localhost:4000/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.text();

      if (data === "Admin Added Successfully!") {
        if (msgArea) {
          setMsgContent("<p style='color: green;'>Registration Successful!</p>");
        }
        SetUsername("")
        SetPassword("")
        getAdmins()
      } else {
        if (msgArea) {
          setMsgContent("<p style='color: green;'>Registration Failed!</p>");
        }
      }
    } catch (error) {
      console.error("Error sending request:", error);
      if (msgArea) {
        setMsgContent("<p style='color: red;'> Error Occurred! </p>");
      }
    }
  }

  const [activeTab, setActiveTab] = useState("asl");
  async function ChangeTab(tab_name) {
    setMsgContent("");
    setActiveTab(tab_name);
    if (tab_name === "admins") getAdmins();
  }

  async function removeAdmin(username) {
    let msgArea = document.getElementById('msg_popup');

    try {
      const response = await fetch("http://localhost:4000/admin/remove_admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            "username": username,
          }
        ),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data && data.acknowledge) {
        if (msgArea) {
          setMsgContent("<p style='color: green;'>" + data.message + "</p>");
        }
        getAdmins()
      } else {
        if (msgArea) {
          setMsgContent("<p style='color: red;'>" + data.message + "</p>");
        }
      }
    } catch (error) {
      console.error("Error sending request:", error);
      if (msgArea) {
        setMsgContent("<p style='color: red;'> Error Occured! </p>");
      }
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className={`App min-vh-100 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <AdminNavbar />

      <header className="py-5">
        <div className="container">

          {/* Theme Toggle */}
          <div className="d-flex justify-content-end mb-3">
            <button className={`btn ${theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light'}`} onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Night Mode' : '☀️ Day Mode'}
            </button>
          </div>

          <h1 className="text-center mb-4">Admin Panel</h1>

          {msgContent !== "" && (
            <div
              id="msg_popup"
              className={`alert ${theme === 'dark' ? 'alert-secondary' : 'alert-info'} text-center`}
              style={{ padding: '8px' }}
              dangerouslySetInnerHTML={{ __html: msgContent }}
            ></div>
          )}

          <ul className="nav nav-tabs justify-content-center mb-4">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "asl" ? "active" : ""}`} onClick={() => ChangeTab("asl")}>
                ASL
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "admins" ? "active" : ""}`} onClick={() => ChangeTab("admins")}>
                Admins
              </button>
            </li>
          </ul>

          <div className="tab-content mt-4">
            {activeTab === "asl" && (
              <div className="mb-5">
                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search Sign by Word..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="row">{/* ASL content */}</div>
              </div>
            )}

            {activeTab === "admins" && (
              <>
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div
                      className={`card shadow-sm border-0 ${theme === 'dark' ? 'text-light' : ''}`}
                      style={{
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        backgroundColor: theme === 'dark' ? '#2f363d' : '#d9d9d9'
                      }}
                    >
                      <div className="card-body">
                        <h3 className="card-title text-center mb-3">Register Admin</h3>
                        <div id="msg_popup" className="text-center mb-3"></div>

                        <form onSubmit={HandleRegisteration}>
                          <div className="mb-3">
                            <input
                              type="text"
                              className="form-control"
                              id="username"
                              placeholder="Enter username"
                              value={username}
                              onChange={(e) => SetUsername(e.target.value)}
                            />
                          </div>

                          <div className="mb-3">
                            <input
                              type="password"
                              className="form-control"
                              id="password"
                              placeholder="Enter password"
                              value={password}
                              onChange={(e) => SetPassword(e.target.value)}
                            />
                          </div>

                          <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                              Register
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container mt-4 d-flex justify-content-center align-items-center">
                  <div className="row w-100 justify-content-center">
                    <h4>Current Admins</h4>
                    <ul className="list-group w-auto">
                      {admins.map((admin, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center px-3 py-2"
                          style={{ fontSize: '0.9rem', minWidth: '250px', maxWidth: '400px' }}
                        >
                          <span className="text-muted">{admin.username}</span>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeAdmin(admin.username)}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}