import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  interactive = false,
  onRatingChange,
  size = 'md',
  showNumber = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const starRating = index + 1;
          const isActive = starRating <= rating;
          const isHalf = rating > index && rating < starRating;

          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => handleStarClick(starRating)}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} 
                         ${interactive ? 'transition-transform' : ''}`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isActive
                    ? 'text-yellow-400 fill-current'
                    : isHalf
                    ? 'text-yellow-400 fill-current opacity-50'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {rating.toFixed(1)}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;