import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar.js';
import '../App.css';

export function Translate() {
  const [translateMode, setTranslateMode] = useState(0);
  const [signs, setSigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Sign class (same as before)
  class Sign {
    constructor(wordId, word, handShape, location, palmDir, handMovem, faceExpress) {
      this.wordId = wordId;
      this.word = word;
      this.handShape = handShape;
      this.location = location;
      this.palmDir = palmDir;
      this.handMovem = handMovem;
      this.faceExpress = faceExpress;
    }
  }

  const [filters, setFilters] = useState({
    handShape: '',
    location: '',
    palmDir: '',
    handMovem: '',
    faceExpress: '',
  });

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
    setSigns([]);
  };

  const fetchData = async () => {
    try {
      let url;
      if (translateMode === 0 && searchTerm) {
        const query = encodeURIComponent(searchTerm);
        url = `/api/?search=${query}`;
      } else {
        const params = new URLSearchParams(filters);
        url = `/api/?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const fetchedSigns = data.map(entry => new Sign(
        entry.WordId, entry.word, entry.handShape,
        entry.location, entry.palmDir, entry.handMovem, entry.faceExpress
      ));

      setSigns(fetchedSigns);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [translateMode, searchTerm, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredSigns = signs.filter(sign => {
    const regex = new RegExp(`^${searchTerm}`, 'i');
    const matchWord = !searchTerm || sign.word.match(regex);

    const matchFilters = Object.keys(filters).every(key => {
      const val = filters[key];
      if (!val) return true;
      if (val === 'none') return sign[key] === null;
      return sign[key] === val;
    });

    return matchWord && matchFilters;
  });

  const renderResults = () =>
    filteredSigns.sort((a, b) => a.word.localeCompare(b.word)).map(sign => {
      const wordLink = sign.word.toLowerCase().replace(/\s+/g, '-');
      return (
        <div key={sign.wordId} className="col-12 col-md-6 col-lg-4 mb-3">
          <button
            className="btn btn-outline-primary w-100"
            onClick={() => window.location.href = `./tutorial.html?word=${wordLink}`}
          >
            {sign.word}
          </button>
        </div>
      );
    });

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
        <div className="mb-4">
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
        <div className="row g-3 mb-4">
          {[
            ['handShape', 'Hand Shape'],
            ['location', 'Location'],
            ['palmDir', 'Palm Direction'],
            ['handMovem', 'Hand Movement'],
            ['faceExpress', 'Facial Expression'],
          ].map(([name, label]) => (
            <div className="col-md-6 col-lg-4" key={name}>
              <label htmlFor={name} className="form-label">{label}</label>
              <select
                className="form-select"
                name={name}
                value={filters[name]}
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="none">None</option>
                {[...new Set(signs.map(s => s[name]).filter(Boolean))].sort().map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="row">
        {renderResults()}
      </div>
    </div>
  );
}