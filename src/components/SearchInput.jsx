import React, { useState } from 'react';
import "./SearchInput.css";
import { Link } from 'react-router-dom';
const SearchInput = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      const filteredSuggestions = users.filter(user => regex.test(user.username));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar usuarios..."
        value={searchTerm}
        onChange={handleChange}
        className="search-input"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <div key={index}>

            <Link to={`/user/${suggestion._id}`}>
            <div>
              <li  className="suggestion-item">
              <img src={suggestion.profilePicture || "https://source.unsplash.com/random"} alt={suggestion.username} className="suggestion-image" />
              <span className="suggestion-text">{suggestion.username}</span>
            </li>
            </div>
            </Link>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
