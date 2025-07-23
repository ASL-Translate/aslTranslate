import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import AdminNavbar, { VerifyAdminSession } from '../components/admin_navbar.js';
import '../App.css';

export function AslCardEdit() {
  const [msgContent, setMsgContent] = useState("");
  const [theme, setTheme] = useState("dark"); // Theme state

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
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

    { value: 'bent_v', label: 'Bent V' },
    { value: 'bent_hand', label: 'Bent Hand' },
    { value: 'claw_hand', label: 'Claw Hand' },
    { value: 'closed_hand', label: 'Closed Hand' },
    { value: 'curved_hand', label: 'Curved Hand' },
    { value: 'horns', label: 'Horns' },
    { value: 'index_finger', label: 'Index Finger' },
    { value: 'cocked_index', label: 'Cocked Index' },
    { value: 'open_hand', label: 'Open Hand' },
  ];

  const locations = [
    { value: 'abdomen', label: 'Abdomen' },
    { value: 'region', label: 'Region' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'head', label: 'Head' },
    { value: 'neck', label: 'Neck' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'chest', label: 'Chest' },
    { value: 'torso', label: 'Torso' },
    { value: 'arms/elbows', label: 'Arms/Elbows' },
    { value: 'hands', label: 'Hands' },
    { value: 'wrists', label: 'Wrists' },
    { value: 'hips/waist', label: 'Hips/Waist' }
  ];

  const palmDirs = [
    { value: 'in', label: 'In' },
    { value: 'out', label: 'Out' },
    { value: 'up', label: 'Up' },
    { value: 'down', label: 'Down' },
    { value: 'left/right', label: 'Left/Right' },
    { value: 'back', label: 'Back' },
  ];

  const handMovements = [
    { value: 'opening/closing', label: 'Opening/Closing' },
    { value: 'wiggling', label: 'Wiggling' },
    { value: 'flexing/straightening', label: 'Flexing/Straightening' },
    { value: 'twisting', label: 'Twisting' },
    { value: 'tapping', label: 'Tapping' },
    { value: 'flicking', label: 'Flicking' },
  ];

  const facialExpressions = [
    { value: 'yes/no', label: 'Yes/No' },
    { value: 'wh_question', label: 'Wh Question' },
    { value: 'negative', label: 'Negative' },
    { value: 'conditional', label: 'Conditional' },
    { value: 'emotional', label: 'Emotional' },
    { value: 'role_shift', label: 'Role_Shift' },
    { value: 'intense', label: 'Intense' },
    { value: 'mouthing', label: 'Mouthing' },
  ];

  const [word, setWord] = useState('');
  const [gifFile, setGifFile] = useState(null);
  const [handShape, setHandShape] = useState([]);
  const [location, setLocation] = useState([]);
  const [palmDir, setPalmDir] = useState([]);
  const [handMovem, setHandMovem] = useState([]);
  const [faceExpress, setFaceExpress] = useState([]);

  const UpdateAslCard = async (event) => {
    event.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const formData = new FormData();
    formData.append('word', word);
    formData.append('file', gifFile);
    formData.append('hand_shape', handShape.map(h => h.value).join(','));
    formData.append('location', location.map(l => l.value).join(','));
    formData.append('palm_dir', palmDir.map(p => p.value).join(','));
    formData.append('hand_movement', handMovem.map(m => m.value).join(','));
    formData.append('face_expression', faceExpress.map(f => f.value).join(','));

    try {
      const response = await fetch("http://localhost:4000/admin/asl/edit_card", {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      const data = await response.text();

      if (data === "Successfully Edited asl card") {
        window.location.href = `${window.location.pathname}?msg=success&id=${id}`;
      } else {
        window.location.href = `${window.location.pathname}?msg=fail&id=${id}`;
      }
    } catch (error) {
      console.error("Error sending request:", error);
      window.location.href = `${window.location.pathname}?msg=error&id=${id}`;
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

    
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');

    if (msg === 'success') {
      setMsgContent("<p style='color: green;'>Updated Successful!</p>");
    } else if (msg === 'fail') {
      setMsgContent("<p style='color: red;'>Update Failed!</p>");
    } else if (msg === 'error') {
      setMsgContent("<p style='color: red;'>Error Occurred!</p>");
    }

    async function GetCard() {
      try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        const response = await fetch("http://localhost:4000/asl/get_card", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
          credentials: 'include',
        });

        const data = await response.json();

        if (data) {
          // Populate Form Values
          
          const mapToOptions = (values, options) =>
            Array.isArray(values)
          ? values.map(val => options.find(o => o.value === val)).filter(Boolean)
          : [];
          
          try {
            setWord(data.word);
            setHandShape(mapToOptions(data.hand_shape, handShapes));
            setLocation(mapToOptions(data.location, locations));
            setPalmDir(mapToOptions(data.palm_dir, palmDirs));
            setHandMovem(mapToOptions(data.hand_movement, handMovements));
            setFaceExpress(mapToOptions(data.face_expression, facialExpressions));
          } catch (error) {
            console.error('Error:', error);
          }
        }
      } catch (error) {
        console.error("Error sending request:", error);
      }
    }
    GetCard();
  }, []);

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

          <div className="tab-content mt-4">
            <div className="mb-5">
              <div className="mb-4">
                <div
                  className={`card shadow-sm border-0 ${theme === 'dark' ? 'text-light' : ''}`}
                  style={{
                    borderRadius: '1rem',
                    backgroundColor: theme === 'dark' ? '#2f363d' : '#d9d9d9'
                  }}
                >
                  <div className="card-body">
                    <h3 className="card-title text-center mb-3">Edit ASL Card</h3>

                    <form id="asl_card_form" onSubmit={UpdateAslCard}>
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
                          <Select options={handShapes} value={handShape} isMulti onChange={setHandShape} />
                        </div>
                      </div>

                      <div className="mb-3 row align-items-center">
                        <label className="col-md-4 col-form-label">Location</label>
                        <div className="col-md-8 text-dark">
                          <Select options={locations} value={location} isMulti onChange={setLocation} />
                        </div>
                      </div>

                      <div className="mb-3 row align-items-center">
                        <label className="col-md-4 col-form-label">Palm Direction</label>
                        <div className="col-md-8 text-dark">
                          <Select options={palmDirs} value={palmDir} isMulti onChange={setPalmDir} />
                        </div>
                      </div>

                      <div className="mb-3 row align-items-center">
                        <label className="col-md-4 col-form-label">Hand Movement</label>
                        <div className="col-md-8 text-dark">
                          <Select options={handMovements} value={handMovem} isMulti onChange={setHandMovem} />
                        </div>
                      </div>

                      <div className="mb-3 row align-items-center">
                        <label className="col-md-4 col-form-label">Facial Expression</label>
                        <div className="col-md-8 text-dark">
                          <Select options={facialExpressions} value={faceExpress} isMulti onChange={setFaceExpress} />
                        </div>
                      </div>

                      <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Update Card</button>
                      </div>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}