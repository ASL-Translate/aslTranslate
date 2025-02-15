import React, { useState } from "react";
import SearchBar from "./SearchBar";

export default function App() {
  const [results, setResults] = useState([]);

  const handleSearch = (query) => {
    // Perform the search logic here
    // For demonstration, we'll just filter a static list of signs
    const signs = ["Hello", "Thank you", "Please", "Yes", "No"];
    const filteredResults = signs.filter((sign) =>
      sign.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filteredResults);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className="results">
        {results.map((result, index) => (
          <div key={index}>{result}</div>
        ))}
      </div>
    </div>
  );
}