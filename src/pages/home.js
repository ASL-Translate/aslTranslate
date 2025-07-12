import React from 'react';
import { Navbar } from '../components/navbar.js';
import '../App.css';
import '../head.css';

export function Home() {
    return (
       <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="./head.css" />
  <link rel="icon" href="./favicon.ico" type="image/x-icon" />
  <title>ASL Translator</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\n        .form-group {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            margin-bottom: 10px;\n        }\n\n        .form-group label {\n            flex: 1;\n            text-align: left;\n            padding: 0;\n        }\n\n        .form-group select {\n            flex: 1;\n            text-align: left;\n        }\n\n        /* Media query for mobile devices */\n        @media (max-width: 600px) {\n\n            .panel {\n                width: 80%;\n            }\n\n            .header h1 {\n                font-size: 3em;\n            }\n\n            .search-button h2{\n                font-size: 1em;\n            }\n\n            .search-button button {\n                top: 23%;\n                width: 50%;\n            }\n\n            .searchOne input[type="text"] {\n                font-size: 1.4em;\n            }\n\n            .searchOne form {\n                position: relative;\n                left: 1.5%;\n            }\n\n            .results_area {\n                width: 70%;\n                left: 15%;\n            }\n        }\n    '
    }}
  />
  <div className="header">
    <center>
      <h1>ASL Translator</h1>
    </center>
  </div>
  <center>
    <div className="panel">
      <h1> </h1>
    </div>
  </center>
  <center>
    <div className="search-button" style={{ marginBottom: 20 }}>
      <h2>Click to change translation mode</h2>
      <button type="button" id="toggleButton" onclick="toggleSearchMode()">
        English to ASL
      </button>
    </div>
  </center>
  <br />
  <br />
  <div className="searchOne" style={{ textAlign: "center" }}>
    {/* English to ASL Form */}
    <form id="englishInput" method="GET">
      <input
        id="searchBar"
        type="text"
        placeholder="Search Signs"
        name="word"
        oninput="handleSearch(event)"
      />
    </form>
  </div>
  <div className="results_area" style={{ paddingTop: 20 }}>
    <div id="results" className="results-container" />
  </div>
  <div className="searchTwo" style={{ marginTop: 40 }}>
    <center>
      {/* ASL to English Form */}
      <form
        id="aslInputs"
        method="GET"
        style={{ display: "none", marginTop: 20, textAlign: "left" }}
      >
        <div className="form-group">
          <label htmlFor="handShape">Hand Shape:</label>
          <select name="handShape">
            <option value="">Any</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <select name="location">
            <option value="">Any</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="palmDir">Palm Direction:</label>
          <select name="palmDir">
            <option value="">Any</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="handMovem">Hand Movement:</label>
          <select name="handMovem">
            <option value="">Any</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="faceExpress">Facial Expression:</label>
          <select name="faceExpress">
            <option value="">Any</option>
          </select>
        </div>
      </form>
    </center>
  </div>
</>


      );
}