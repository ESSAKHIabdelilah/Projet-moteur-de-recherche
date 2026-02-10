import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <span className="search-icon">�</span>
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher un livre... (ex: adventure, love, science)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </div>
      <button 
        type="submit" 
        className="search-button"
        disabled={loading || !query.trim()}
      >
        {loading ? '📖 Recherche...' : '📚 Explorer'}
      </button>
    </form>
  );
}

export default SearchBar;
