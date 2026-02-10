import React from 'react';
import ResultCard from './ResultCard';
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
    <div className="results-container">
      <div className="results-header">
        <h2 className="results-count">
          <span className="count-number">{results.length}</span> résultats trouvés
        </h2>
      </div>
      <div className="results-list">
        {results.map((book) => (
          <ResultCard 
            key={book.id} 
            book={book} 
            onGetSimilar={onGetSimilar} 
          />
        ))}
      </div>
    </div>
  );
}

export default ResultsList;
