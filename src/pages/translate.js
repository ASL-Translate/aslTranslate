import React, { useMemo, useEffect, useState } from 'react';
import Select from 'react-select';
import Navbar from '../components/navbar.js';
import '../App.css';

export function Translate() {
  const [translateMode, setTranslateMode] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [aslCards, setAslCards] = useState([]);

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

  const [handShape, setHandShape] = useState([]);
  const [location, setLocation] = useState([]);
  const [palmDir, setPalmDir] = useState([]);
  const [handMovem, setHandMovem] = useState([]);
  const [faceExpress, setFaceExpress] = useState([]);

  useEffect(() => {
    // Apply theme class to body
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSearchMode = () => {
    setTranslateMode(prev => (prev === 0 ? 1 : 0));
    setSearchTerm('');
  };

  async function getCards() {
    try {
      const response = await fetch("http://localhost:4000/asl/get_cards", {
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

  useEffect(() => {
    getCards();
  }, []);

  const filteredCards = useMemo(() => {
    if (translateMode === 0) {
      if (searchTerm === "" || !searchTerm.trim()) {
        return aslCards;
      }

      const lower = searchTerm.toLowerCase();
      return aslCards.filter(card =>
        typeof card.word === 'string' && card.word.toLowerCase().includes(lower)
      );
    } else {
      // parameter based filtering
      return aslCards.filter(card => {
        const matches = [
          { selected: handShape, cardField: card.hand_shape },
          { selected: location, cardField: card.location },
          { selected: palmDir, cardField: card.palm_dir },
          { selected: handMovem, cardField: card.hand_movement },
          { selected: faceExpress, cardField: card.face_expression },
        ];
    
        // Keep card if all selected filters match
        return matches.every(({ selected, cardField }) => {
          if (!selected.length) return true;
          if (!Array.isArray(cardField)) return false;
        
          // Extract selected values (if selected is an array of { value, label })
          const selectedValues = selected.map(s => s.value || s); // fallback to raw string
        
          return selectedValues.some(val => cardField.includes(val));
        });
      });
    }
  }, [translateMode, searchTerm, aslCards, handShape, location, palmDir, handMovem, faceExpress]);

  return (
    <div className="App">
      <Navbar />

      {/* Header with theme + mode toggle */}
      <header className="mb-4 text-center">
        <h1 className="mb-3">ASL Translator</h1>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-secondary" onClick={toggleSearchMode}>
            {translateMode === 0 ? 'Switch to ASL to English' : 'Switch to English to ASL'}
          </button>
          <button
            className={`btn ${theme === 'light' ? 'btn-dark' : 'btn-light'}`}
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🌙 Night Mode' : '☀️ Day Mode'}
          </button>
        </div>
      </header>

      {/* Search Field */}
      {translateMode === 0 && (
        <div className="mb-4 p-5">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search signs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Filter Form */}
      {translateMode === 1 && (
        <div className="row g-3 mb-4 p-5">
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
        </div>
      )}

      {/* ASL content */}
      <div className="m-3">
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
                      onClick={() => window.location.href = `/translate/card_view?id=${card.id}`}
                    >
                      <i className="bi bi-trash"></i> View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}