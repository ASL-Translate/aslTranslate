import { useState } from "react";

const words = [
  "hello",
  "help",
  "happy",
  "house",
  "hat",
  "hand",
  "hope",
  "hungry"
];

export default function SearchDictionary() {
  const [query, setQuery] = useState("");

  const filteredWords = words.filter(word =>
    word.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="Search ASL word..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="mt-2">
        {filteredWords.map((word, index) => (
          <li key={index} className="p-2 border-b">{word}</li>
        ))}
      </ul>
    </div>
  );
}