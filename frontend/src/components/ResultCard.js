import React from 'react';
import './ResultCard.css';

function ResultCard({ book, onGetSimilar }) {
  const tfidfValue = book.tfidf_final ? book.tfidf_final.toFixed(4) : '0.0000';
  const clicsValue = book.clics || 0;

  const buttonStyle = {
    padding: '12px 20px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#1a1a2e',
    background: 'linear-gradient(135deg, #c9a227 0%, #f4d03f 50%, #c9a227 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '15px',
    display: 'block'
  };

  return (
    <div className="result-card">
      <div className="card-content">
        <div className="card-main">
          <h3 className="book-title">{book.titre}</h3>
          <div className="book-stats">
            <span className="stat tfidf">
              <span className="stat-label">TF-IDF:</span>
              <span className="stat-value">{tfidfValue}</span>
            </span>
            <span className="stat clicks">
              <span className="stat-label">Clics:</span>
              <span className="stat-value">{clicsValue}</span>
            </span>
          </div>
        </div>
        <button 
          style={buttonStyle}
          onClick={() => onGetSimilar(book.id, book.titre)}
        >
          📚 Livres Similaires
        </button>
      </div>
    </div>
  );
}

export default ResultCard;
