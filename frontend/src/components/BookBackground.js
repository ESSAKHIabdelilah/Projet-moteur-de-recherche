import React from 'react';
import './BookBackground.css';

const bookImages = [
  '/images/Capture_decran_2026-02-05_111635.webp',
  '/images/Capture_decran_2026-02-05_112334.webp',
  '/images/Capture_decran_2026-02-05_112350.webp',
  '/images/Capture_decran_2026-02-05_112404.webp',
  '/images/Capture_decran_2026-02-05_112422.webp',
  '/images/Capture_decran_2026-02-05_112437.webp',
  '/images/Capture_decran_2026-02-05_112456.webp',
  '/images/Capture_decran_2026-02-05_112510.webp',
  '/images/Capture_decran_2026-02-05_112523.webp',
  '/images/Capture_decran_2026-02-05_112547.webp',
];

function BookBackground() {
  // Créer les images pour chaque ligne (dupliquer pour un scroll infini)
  const row1Images = [...bookImages, ...bookImages, ...bookImages];
  const row2Images = [...bookImages.reverse(), ...bookImages, ...bookImages];
  const row3Images = [...bookImages, ...bookImages, ...bookImages];

  return (
    <div className="book-background">
      <div className="book-row row-1">
        <div className="book-track track-left">
          {row1Images.map((img, index) => (
            <div key={`row1-${index}`} className="book-card">
              <img src={img} alt={`Book ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="book-row row-2">
        <div className="book-track track-right">
          {row2Images.map((img, index) => (
            <div key={`row2-${index}`} className="book-card">
              <img src={img} alt={`Book ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="book-row row-3">
        <div className="book-track track-left">
          {row3Images.map((img, index) => (
            <div key={`row3-${index}`} className="book-card">
              <img src={img} alt={`Book ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Overlay gradient */}
      <div className="book-overlay"></div>
    </div>
  );
}

export default BookBackground;
