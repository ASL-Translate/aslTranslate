import React, { useState } from 'react';
import '../App.css';

export function Admin() {
    const [username, SetUsername] = useState("");
    const [password, SetPassword] = useState("");

    const HandleLogin = async (event) => {
        event.preventDefault();
        alert({
            "username": username,
            "password": password
        })
    }

    return (
        <div className="App">
          <header className="App-header">
            <div className="container mt-5">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="card shadow">
                    <div className="card-body">
                      <h3 className="card-title text-center mb-4">Admin Login</h3>
                      <div id='msg_popup'>
                      </div>
                      <form onSubmit={HandleLogin}>
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
                            Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>
      );
}