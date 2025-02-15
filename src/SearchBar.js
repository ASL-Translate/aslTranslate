import React, { useState } from "react";
import ".//styles/head.css"; // Import the CSS file

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="search">
      <div className="center">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search Signs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button>
            <i className="fa fa-search"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
