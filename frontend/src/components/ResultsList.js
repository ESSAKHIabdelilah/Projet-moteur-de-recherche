import React from 'react';
import './ResultsList.css';

function ResultsList({ results, onGetSimilar }) {
  if (results.length === 0) {
    return (
      <div className="no-results">
        <span className="no-results-icon">📚</span>
        <p>Aucun résultat trouvé</p>
        <span className="no-results-hint">Essayez avec un autre mot-clé</span>
      </div>
    );
  }

  return (
    <div className="tfidf-results">
      <h3>📚 Résultats ({results.length} livres trouvés)</h3>
      <div className="results-grid">
        {results.map((book) => (
          <div key={book.id} className="tfidf-result-card">
            <h4>{book.titre}</h4>
            <div className="book-meta">
              <span>📊 Score: {book.tfidf_final?.toFixed(4)}</span>
              <span>👆 {book.clics || 0} clics</span>
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
    </div>
  );
}

export default ResultsList;
