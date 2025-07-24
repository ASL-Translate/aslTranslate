import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar.js';
import '../App.css';

const BACKEND = process.env.REACT_APP_BACKEND_TARGET;

export function AslCardView() {
  const [theme, setTheme] = useState("dark"); // Theme state

  const [word, setWord] = useState('');
  const [gifFile, setGifFile] = useState('');
  const [handShape, setHandShape] = useState([]);
  const [location, setLocation] = useState([]);
  const [palmDir, setPalmDir] = useState([]);
  const [handMovem, setHandMovem] = useState([]);
  const [faceExpress, setFaceExpress] = useState([]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  useEffect(() => {
    async function GetCard() {
      try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        const response = await fetch(`${BACKEND}/asl/get_card`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id })
        });

        const data = await response.json();

        if (data) {
          try {
            setWord(data.word);
            setGifFile(data.path);
            setHandShape(data.hand_shape);
            setLocation(data.location);
            setPalmDir(data.palm_dir);
            setHandMovem(data.hand_movement);
            setFaceExpress(data.face_expression);
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
      <Navbar />

      <header className="py-5">
        <div className="container">

          {/* Theme Toggle */}
          <div className="d-flex justify-content-end mb-3">
            <button className={`btn ${theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light'}`} onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Night Mode' : '☀️ Day Mode'}
            </button>
          </div>

          <h1 className="text-center mb-4">{word}</h1>

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
                    {/* GIF Preview */}
                    <div className="text-center mb-4">
                      <img
                        src={`${BACKEND}/uploads/${gifFile}`}
                        alt={`${word} gif`}
                        style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.5rem' }}
                      />
                    </div>

                    {/* Word */}
                    <h3 className="text-center mb-3">{word}</h3>

                    {/* Attributes */}
                    <ul className="list-group list-group-flush">

                      {/* Hand Shape */}
                      <li className="list-group-item bg-transparent text-center">
                        <strong className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                          Hand Shape:
                        </strong>
                        <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
                          {handShape.map((item, idx) => (
                            <span
                              key={idx}
                              className={`badge rounded-pill px-3 py-2 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-light text-dark border'
                                }`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </li>

                      {/* Location */}
                      <li className="list-group-item bg-transparent text-center">
                        <strong className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                          Location:
                        </strong>
                        <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
                          {location.map((item, idx) => (
                            <span
                              key={idx}
                              className={`badge rounded-pill px-3 py-2 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-light text-dark border'
                                }`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </li>

                      {/* Palm Direction */}
                      <li className="list-group-item bg-transparent text-center">
                        <strong className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                          Palm Direction:
                        </strong>
                        <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
                          {palmDir.map((item, idx) => (
                            <span
                              key={idx}
                              className={`badge rounded-pill px-3 py-2 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-light text-dark border'
                                }`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </li>

                      {/* Hand Movement */}
                      <li className="list-group-item bg-transparent text-center">
                        <strong className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                          Hand Movement:
                        </strong>
                        <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
                          {handMovem.map((item, idx) => (
                            <span
                              key={idx}
                              className={`badge rounded-pill px-3 py-2 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-light text-dark border'
                                }`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </li>

                      {/* Facial Expression */}
                      <li className="list-group-item bg-transparent text-center">
                        <strong className={theme === 'dark' ? 'text-light' : 'text-dark'}>
                          Facial Expression:
                        </strong>
                        <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
                          {faceExpress.map((item, idx) => (
                            <span
                              key={idx}
                              className={`badge rounded-pill px-3 py-2 ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-light text-dark border'
                                }`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </li>
                    </ul>

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