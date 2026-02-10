import React from 'react';
import './ResultCard.css';

function ResultCard({ book, onGetSimilar }) {
  return (
    <div className="result-card">
      <div className="card-content">
        <div className="card-main">
          <h3 className="book-title">{book.titre}</h3>
          <div className="book-stats">
            <span className="stat tfidf">
              <span className="stat-label">TF-IDF:</span>
              <span className="stat-value">{book.tfidf_final.toFixed(4)}</span>
            </span>
            <span className="stat clicks">
              <span className="stat-label">Clics:</span>
              <span className="stat-value">{book.clics}</span>
            </span>
          </div>
        </div>
        <button 
          className="similar-button"
          onClick={() => onGetSimilar(book.id, book.titre)}
        >
          <span className="button-icon">📖</span>
          Livres Similaires
        </button>
      </div>
    </div>
  );
}

export default ResultCard;
