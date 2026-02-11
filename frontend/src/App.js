import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import SimilarBooks from './components/SimilarBooks';
import BookBackground from './components/BookBackground';
import './App.css';

const API_URL = "http://localhost:5000/api";

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [showSimilar, setShowSimilar] = useState(false);
  const [selectedBookTitle, setSelectedBookTitle] = useState('');

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setShowSimilar(false);
    
    try {
      const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Erreur serveur');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Erreur: Vérifie que le Backend Flask est bien lancé sur le port 5000.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetSimilar = async (bookId, bookTitle) => {
    try {
      const response = await fetch(`${API_URL}/similar/${bookId}`);
      if (!response.ok) throw new Error('Erreur serveur');
      const data = await response.json();
      setSimilarBooks(data);
      setSelectedBookTitle(bookTitle);
      setShowSimilar(true);
    } catch (err) {
      alert('Erreur lors de la récupération des recommandations.');
    }
  };

  const closeSimilarModal = () => {
    setShowSimilar(false);
    setSimilarBooks([]);
  };

  return (
    <div className="app">
      <BookBackground />
      <div className="container">
        <header className="header">
          <h1 className="title">
            <span className="icon">📚</span>
            Library of the jungle 
          </h1>
          <p className="subtitle">Explore our classic books</p>
          <div className="library-decoration">
            <span className="book-deco">📖</span>
            <span className="book-deco">📕</span>
            <span className="book-deco">📗</span>
            <span className="book-deco">📘</span>
            <span className="book-deco">📙</span>
          </div>
        </header>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Recherche en cours...</p>
          </div>
        )}

        {!loading && searchPerformed && (
          <ResultsList 
            results={results} 
            onGetSimilar={handleGetSimilar} 
          />
        )}

        {showSimilar && (
          <SimilarBooks 
            books={similarBooks} 
            bookTitle={selectedBookTitle}
            onClose={closeSimilarModal} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
