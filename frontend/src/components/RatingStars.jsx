import { useState } from 'react';

export default function RatingStars({ rating = 0, onChange, readonly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);

  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readonly ? star <= Math.round(rating) : star <= (hovered || rating);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-colors ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'
            } ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        );
      })}
      {readonly && rating > 0 && (
        <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
      )}
    </div>
  );
}
