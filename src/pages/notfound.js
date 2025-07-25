import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export function NotFound() {
    return (
      <div className="container text-center mt-5">
        <h1 className="display-4">404</h1>
        <p className="lead">Oops! Page not found.</p>
        <Link className="btn btn-primary" to="/">Back to Home</Link>
      </div>
    );
}