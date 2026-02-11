import React, { useState } from 'react';
import './RegexSearch.css';

const API_URL = "http://localhost:5000/api";

function RegexSearch({ onGetSimilar }) {
  const [pattern, setPattern] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pattern.trim()) return;

    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const response = await fetch(`${API_URL}/search_regex?q=${encodeURIComponent(pattern)}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Erreur de connexion au serveur');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const examplePatterns = [
    { pattern: '^war', desc: 'Mots commençant par "war"' },
    { pattern: 'love$', desc: 'Mots finissant par "love"' },
    { pattern: '^[a-z]{4}$', desc: 'Mots de exactement 4 lettres' },
    { pattern: 'king|queen', desc: 'Contenant "king" ou "queen"' },
    { pattern: '^hero', desc: 'Mots commençant par "hero"' },
  ];

  return (
    <div className="regex-search">
      <div className="regex-header">
        <h2>🔤 Recherche par Expression Régulière</h2>
        <p className="regex-subtitle">Recherchez dans l'index inversé avec des patterns RegEx</p>
      </div>

      <form onSubmit={handleSearch} className="regex-form">
        <div className="input-group">
          <label htmlFor="pattern">Pattern RegEx</label>
          <input
            type="text"
            id="pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Ex: ^war, love$, king|queen"
            className="regex-input"
          />
        </div>

        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? '⏳ Recherche...' : '🔍 Rechercher'}
        </button>
      </form>

      <div className="examples-section">
        <h3>💡 Exemples de patterns</h3>
        <div className="examples-grid">
          {examplePatterns.map((ex, i) => (
            <button
              key={i}
              className="example-btn"
              onClick={() => setPattern(ex.pattern)}
            >
              <code>{ex.pattern}</code>
              <span>{ex.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="regex-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {loading && (
        <div className="regex-loading">
          <div className="spinner"></div>
          <p>Analyse du pattern en cours...</p>
        </div>
      )}

      {!loading && searchPerformed && (
        <div className="regex-results">
          <h3>📚 Résultats ({results.length} livres trouvés)</h3>
          {results.length === 0 ? (
            <p className="no-results">Aucun livre ne correspond à ce pattern.</p>
          ) : (
            <div className="results-list">
              {results.map((book) => (
                <div key={book.id} className="regex-result-card">
                  <h4>{book.titre}</h4>
                  <div className="book-meta">
                    <span>📊 Score: {book.score_total?.toFixed(4)}</span>
                    <span>👆 {book.clics} clics</span>
                  </div>
                  <button 
                    className="similar-btn"
                    onClick={() => onGetSimilar(book.id, book.titre)}
                  >
                    📖 Livres similaires
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="regex-help">
        <h3>📖 Guide RegEx</h3>
        <table className="help-table">
          <tbody>
            <tr><td><code>^</code></td><td>Début du mot</td></tr>
            <tr><td><code>$</code></td><td>Fin du mot</td></tr>
            <tr><td><code>.</code></td><td>N'importe quel caractère</td></tr>
            <tr><td><code>*</code></td><td>0 ou plusieurs occurrences</td></tr>
            <tr><td><code>+</code></td><td>1 ou plusieurs occurrences</td></tr>
            <tr><td><code>[abc]</code></td><td>Un caractère parmi a, b, c</td></tr>
            <tr><td><code>[a-z]</code></td><td>Une lettre minuscule</td></tr>
            <tr><td><code>a|b</code></td><td>a ou b</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RegexSearch;
