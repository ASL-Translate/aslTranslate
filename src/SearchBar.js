import React, { useState } from "react";
import "./head.css"; // Import the CSS file
import 'font-awesome/css/font-awesome.min.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Call the onSearch function passed as a prop
  };

  return (
    <div className="search">
      <div className="center">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search Signs"
            value={query}
            onChange={handleInputChange}
          />
          <button>
            <i className="fa fa-search"></i>
          </button>
        </form>
      </div>
    </div>
  );
}