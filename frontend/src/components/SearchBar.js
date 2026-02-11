import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>🔍 Recherche par Mot-clé</h2>
        <p className="search-subtitle">Recherchez dans notre collection de livres classiques</p>
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-group">
          <label htmlFor="keyword">Mot-clé</label>
          <input
            type="text"
            id="keyword"
            className="search-input"
            placeholder="Ex: love, adventure, science"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" className="search-btn" disabled={loading || !query.trim()}>
          {loading ? '⏳ Recherche...' : '🔍 Rechercher'}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
