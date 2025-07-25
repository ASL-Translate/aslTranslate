import React from 'react';
import Navbar from '../components/navbar.js';
import '../App.css';

export function Home() {
    return (
        <div className="App">
          <Navbar />
          <header className="App-header">
          <div className="container py-5">
            <div className="card shadow-lg p-4">
              <h1 className="mb-3 text-center">ASL Translate</h1>
              <p className="text-muted small">
                This project allows the translation of English into an ASL sign by giving
                the user a GIF file showing the live signing of an ASL term.
              </p>
              <p className="text-muted small">
                It also allows a user to use filters to search for ASL signs that can be
                translated back to English using the five parameters:
              </p>
              <ul className="list-group list-group-flush small">
                <li className="list-group-item">Handshape</li>
                <li className="list-group-item">Location</li>
                <li className="list-group-item">Movement</li>
                <li className="list-group-item">Orientation</li>
                <li className="list-group-item">Facial Expression</li>
              </ul>
            </div>
          </div>
          </header>
        </div>
      );
}