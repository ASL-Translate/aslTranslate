import React, { useMemo, useState, useEffect } from 'react';
import Select from 'react-select';
import AdminNavbar, { VerifyAdminSession } from '../components/admin_navbar.js';
import '../App.css';

export function AdminPanel() {
  const [msgContent, setMsgContent] = useState("");
  const [theme, setTheme] = useState("dark"); // Theme state

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const [admins, setAdmins] = useState([]);
  async function getAdmins() {
    try {
      const response = await fetch("/api/admin/fetch_admins", {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [aslCards, setAslCards] = useState([]);

  async function getCards() {
    try {
      const response = await fetch("/api/asl/get_cards", {
        method: "GET",
        credentials: 'include'
      });

      const data = await response.json();
      if (data) setAslCards(data);
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
      const response = await fetch("/api/admin/register", {
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
          setMsgContent("<p style='color: red;'>Registration Failed!</p>");
        }
      }
    } catch (error) {
      console.error("Error sending request:", error);
      if (msgArea) {
        setMsgContent("<p style='color: red;'> Error Occurred! </p>");
      }
    }
  }

  const [ori_password, SetOriPassword] = useState("");
  const [new_password, SetNewPassword] = useState("");

  const ResetAdminPassword = async (event) => {
    event.preventDefault();
    let msgArea = document.getElementById('msg_popup');

    try {
      const response = await fetch("/api/admin/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "original":ori_password, "new":new_password }),
        credentials: 'include',
      });

      const data = await response.text();

      if (data === "Password Reset Successfully!") {
        if (msgArea) {
          setMsgContent("<p style='color: green;'>Reset Successful!</p>");
        }
        SetOriPassword("")
        SetNewPassword("")
      } else {
        if (msgArea) {
          setMsgContent("<p style='color: red;'>Reset Failed!</p>");
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
    if (tab_name === "asl") getCards();
  }
  
  const [adminTab, setAdminTab] = useState("register");
  async function ChangeAdminTab(tab_name) {
    setAdminTab(tab_name);
  }

  async function removeAdmin(username) {
    let msgArea = document.getElementById('msg_popup');

    try {
      const response = await fetch("/api/admin/remove_admin", {
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

  const handShapes = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' },
    { value: 'd', label: 'D' },
    { value: 'e', label: 'E' },
    { value: 'f', label: 'F' },
    { value: 'g', label: 'G' },
    { value: 'h', label: 'H' },
    { value: 'i', label: 'I' },
    { value: 'j', label: 'J' },
    { value: 'k', label: 'K' },
    { value: 'l', label: 'L' },
    { value: 'm', label: 'M' },
    { value: 'n', label: 'N' },
    { value: 'o', label: 'O' },
    { value: 'p', label: 'P' },
    { value: 'q', label: 'Q' },
    { value: 'r', label: 'R' },
    { value: 's', label: 'S' },
    { value: 't', label: 'T' },
    { value: 'u', label: 'U' },
    { value: 'v', label: 'V' },
    { value: 'w', label: 'W' },
    { value: 'x', label: 'X' },
    { value: 'y', label: 'Y' },
    { value: 'z', label: 'Z' },

    { value: 'bent_v',        label: 'Bent V' },
    { value: 'bent_hand',     label: 'Bent Hand' },
    { value: 'claw_hand',     label: 'Claw Hand' },
    { value: 'closed_hand',   label: 'Closed Hand' },
    { value: 'curved_hand',   label: 'Curved Hand' },
    { value: 'horns',         label: 'Horns' },
    { value: 'index_finger',  label: 'Index Finger' },
    { value: 'cocked_index',  label: 'Cocked Index' },
    { value: 'open_hand',     label: 'Open Hand' },
  ];
  
  const locations = [
    { value: 'abdomen',     label: 'Abdomen' },
    { value: 'region',      label: 'Region' },
    { value: 'neutral',     label: 'Neutral' },
    { value: 'head',        label: 'Head' },
    { value: 'neck',        label: 'Neck' },
    { value: 'shoulders',   label: 'Shoulders' },
    { value: 'chest',       label: 'Chest' },
    { value: 'torso',       label: 'Torso' },
    { value: 'arms/elbows', label: 'Arms/Elbows' },
    { value: 'hands',       label: 'Hands' },
    { value: 'wrists',      label: 'Wrists' },
    { value: 'hips/waist',  label: 'Hips/Waist' }
  ];

  const palmDirs = [
    { value: 'in',          label: 'In' },
    { value: 'out',         label: 'Out' },
    { value: 'up',          label: 'Up' },
    { value: 'down',        label: 'Down' },
    { value: 'left/right',  label: 'Left/Right' },
    { value: 'back',        label: 'Back' },
  ];

  const handMovements = [
    { value: 'opening/closing',       label: 'Opening/Closing' },
    { value: 'wiggling',              label: 'Wiggling' },
    { value: 'flexing/straightening', label: 'Flexing/Straightening' },
    { value: 'twisting',              label: 'Twisting' },
    { value: 'tapping',               label: 'Tapping' },
    { value: 'flicking',              label: 'Flicking' },
  ];

  const facialExpressions = [
    { value: 'yes/no',      label: 'Yes/No' },
    { value: 'wh_question', label: 'Wh Question' },
    { value: 'negative',    label: 'Negative' },
    { value: 'conditional', label: 'Conditional' },
    { value: 'emotional',   label: 'Emotional' },
    { value: 'role_shift',  label: 'Role_Shift' },
    { value: 'intense',     label: 'Intense' },
    { value: 'mouthing',    label: 'Mouthing' },
  ];

  const [word, setWord] = useState('');
  const [gifFile, setGifFile] = useState(null);
  const [handShape, setHandShape] = useState([]);
  const [location, setLocation] = useState([]);
  const [palmDir, setPalmDir] = useState([]);
  const [handMovem, setHandMovem] = useState([]);
  const [faceExpress, setFaceExpress] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
  
    if (msg === 'success') {
      setMsgContent("<p style='color: green;'>Creation Successful!</p>");
    } else if (msg === 'fail') {
      setMsgContent("<p style='color: red;'>Creation Failed!</p>");
    } else if (msg === 'error') {
      setMsgContent("<p style='color: red;'>Error Occurred!</p>");
    }
  }, []);

  const CreateAslCard = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('word', word);
    formData.append('file', gifFile);
    formData.append('hand_shape', handShape.map(h => h.value).join(','));
    formData.append('location', location.map(l => l.value).join(','));
    formData.append('palm_dir', palmDir.map(p => p.value).join(','));
    formData.append('hand_movement', handMovem.map(m => m.value).join(','));
    formData.append('face_expression', faceExpress.map(f => f.value).join(','));

    try {
      const response = await fetch("/api/admin/asl/create_card", {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      const data = await response.text();

      if (data === "Successfully added asl card") {
        window.location.href = `${window.location.pathname}?msg=success`;
      } else {
        window.location.href = `${window.location.pathname}?msg=fail`;
      }
    } catch (error) {
      console.error("Error sending request:", error);
      window.location.href = `${window.location.pathname}?msg=error`;
    }
  }

  const DeleteAslCard = async (word) => {
    try {
      const response = await fetch("/api/admin/asl/delete_card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: word
        }),
        credentials: 'include',
      });

      await response.text();
      window.location.href = "/admin/panel";
    } catch (error) {
      console.error("Error sending request:", error);
    }
  }

  useEffect(() => {
    async function Verify() {
      const authenticated = await VerifyAdminSession();
      if (authenticated === false) {
        window.location.href = "/admin"
      }
    }
    Verify();

    getCards();
  }, []);

  const filteredCards = useMemo(() => {
    if (searchTerm === "" || !searchTerm.trim()) {
      return aslCards;
    }

    const lower = searchTerm.toLowerCase();
    return aslCards.filter(card =>
      typeof card.word === 'string' && card.word.toLowerCase().includes(lower)
    );
  }, [searchTerm, aslCards]);

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
                <div className="mb-4 p-5">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search signs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <div
                    className={`card shadow-sm border-0 ${theme === 'dark' ? 'text-light' : ''}`}
                    style={{
                      borderRadius: '1rem',
                      backgroundColor: theme === 'dark' ? '#2f363d' : '#d9d9d9'
                    }}
                  >
                    <div className="card-body">
                      <h3 className="card-title text-center mb-3">Create ASL Card</h3>

                      <form id="asl_card_form" onSubmit={CreateAslCard}>
                        <div className="mb-3 row align-items-center">
                          <label className="col-md-4 col-form-label">Word</label>
                          <div className="col-md-8">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter word"
                              value={word}
                              onChange={(e) => setWord(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="mb-3 row align-items-center">
                          <label className="col-md-4 col-form-label">ASL Sign GIF</label>
                          <div className="col-md-8">
                            <input
                              type="file"
                              accept=".gif"
                              className="form-control"
                              onChange={(e) => setGifFile(e.target.files[0])}
                            />
                          </div>
                        </div>

                        <div className="mb-3 row align-items-center">
                          <label className="col-md-4 col-form-label">Hand Shape</label>
                          <div className="col-md-8 text-dark">
                            <Select options={handShapes} isMulti onChange={setHandShape} />
                          </div>
                        </div>

                        <div className="mb-3 row align-items-center">
                          <label className="col-md-4 col-form-label">Location</label>
                          <div className="col-md-8 text-dark">
                            <Select options={locations} isMulti onChange={setLocation} />
                          </div>
                        </div>

                        <div className="mb-3 row align-items-center">
                          <label className="col-md-4 col-form-label">Palm Direction</label>
                          <div className="col-md-8 text-dark">
                            <Select options={palmDirs} isMulti onChange={setPalmDir} />
                          </div>
                        </div>

                        <div className="mb-3 row align-items-center">
                          <label className="col-md-4 col-form-label">Hand Movement</label>
                          <div className="col-md-8 text-dark">
                            <Select options={handMovements} isMulti onChange={setHandMovem} />
                          </div>
                        </div>

                        <div className="mb-3 row align-items-center">
                          <label className="col-md-4 col-form-label">Facial Expression</label>
                          <div className="col-md-8 text-dark">
                            <Select options={facialExpressions} isMulti onChange={setFaceExpress} />
                          </div>
                        </div>

                        <div className="d-grid">
                          <button type="submit" className="btn btn-primary">Create Card</button>
                        </div>
                      </form>

                    </div>
                  </div>
                </div>

                {/* ASL content */}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                  {filteredCards.map((card, index) => (
                    <div className="col" key={card.id || index}>
                      <div className={`card shadow-sm border-4 ${theme === 'dark' ? 'text-light' : ''}`}>
                        <div
                          className="card-body"
                          style={{
                            backgroundColor: theme === 'dark' ? '#2f363d' : '#d9d9d9'
                          }}>
                          <h5 className="card-title text-capitalize">{card.word}</h5>

                          <div style={{ fontSize: '0.85rem' }}>
                            <p className="mb-1"><strong>Hand Shape:</strong> {card.hand_shape.join(', ')}</p>
                            <p className="mb-1"><strong>Location:</strong> {card.location.join(', ')}</p>
                            <p className="mb-1"><strong>Palm Direction:</strong> {card.palm_dir.join(', ')}</p>
                            <p className="mb-1"><strong>Movement:</strong> {card.hand_movement.join(', ')}</p>
                            <p className="mb-1"><strong>Expression:</strong> {card.face_expression.join(', ')}</p>
                          </div>

                          <div className="mt-3 gap-2 d-flex justify-content-end">
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => window.location.href = `/admin/panel/card_edit?id=${card.id}`}
                            >
                              <i className="bi bi-trash"></i> Edit
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => DeleteAslCard(card.word)}
                            >
                              <i className="bi bi-trash"></i> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

                        <ul className="nav nav-tabs justify-content-center mb-4">
                          <li className="nav-item">
                            <button
                              className={`nav-link ${adminTab === "register" ? "active" : ""}`}
                              onClick={() => ChangeAdminTab("register")}>
                              Register
                            </button>
                          </li>
                          <li className="nav-item">
                            <button
                              className={`nav-link ${adminTab === "reset" ? "active" : ""}`} 
                              onClick={() => ChangeAdminTab("reset")}>
                              Password Reset
                            </button>
                          </li>
                        </ul>

                        {adminTab === "register" && (
                          <>
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
                          </>
                        )}

                        {adminTab === "reset" && (
                          <>
                            <h3 className="card-title text-center mb-3">Reset Password</h3>
                            <div id="msg_popup" className="text-center mb-3"></div>

                            <form onSubmit={ResetAdminPassword}>
                              <div className="mb-3">
                                <input
                                  type="password"
                                  className="form-control"
                                  id="ori_password"
                                  placeholder="Enter original password"
                                  value={ori_password}
                                  onChange={(e) => SetOriPassword(e.target.value)}
                                />
                              </div>

                              <div className="mb-3">
                                <input
                                  type="password"
                                  className="form-control"
                                  id="new_password"
                                  placeholder="Enter new password"
                                  value={new_password}
                                  onChange={(e) => SetNewPassword(e.target.value)}
                                />
                              </div>

                              <div className="d-grid">
                                <button type="submit" className="btn btn-primary">
                                  Reset
                                </button>
                              </div>
                            </form>
                          </>
                        )}
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