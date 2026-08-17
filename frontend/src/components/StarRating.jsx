import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 5, reviewCount = null, size = 16, interactive = false, onRatingChange = null }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const currentVal = hoverRating || rating;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= currentVal;
          return (
            <span
              key={star}
              style={{
                cursor: interactive ? 'pointer' : 'default',
                display: 'inline-flex',
                color: isFilled ? '#eab308' : '#cbd5e1',
                transition: 'transform 0.1s ease',
              }}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
            >
              <Star
                size={size}
                fill={isFilled ? '#eab308' : 'none'}
                strokeWidth={1.75}
              />
            </span>
          );
        })}
      </div>
      {!interactive && (
        <span style={{ fontSize: `${size * 0.85}px`, fontWeight: 700, color: 'var(--text-main)', marginLeft: '0.2rem' }}>
          {Number(rating).toFixed(1)}
          {reviewCount !== null && (
            <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
              ({reviewCount})
            </span>
          )}
        </span>
      )}
    </div>
  );
};
