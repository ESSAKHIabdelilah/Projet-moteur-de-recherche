import React from 'react';
import './SimilarBooks.css';

function SimilarBooks({ books, bookTitle, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>📚 Livres Similaires</h2>
          <p className="reference-book">Pour : <strong>{bookTitle}</strong></p>
        </div>
        
        <div className="similar-list">
          {books.length === 0 ? (
            <div className="no-similar">
              <span className="no-similar-icon">😕</span>
              <p>Aucune recommandation trouvée pour ce livre.</p>
            </div>
          ) : (
            books.map((book, index) => (
              <div key={index} className="similar-item">
                <div className="similar-rank">#{index + 1}</div>
                <div className="similar-info">
                  <h4 className="similar-title">{book.titre}</h4>
                  <div className="similarity-score">
                    <span className="score-label">Similarité:</span>
                    <span className="score-value">
                      {(book.indice_similarite * 100).toFixed(1)}%
                    </span>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${book.indice_similarite * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SimilarBooks;
