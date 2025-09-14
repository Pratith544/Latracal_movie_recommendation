import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Star } from 'lucide-react';
import StarRating from './StarRating';

interface Movie {
  _id: string;
  title: string;
  synopsis: string;
  genres: string[];
  releaseYear: number;
  director: string;
  duration: number;
  posterUrl: string;
  averageRating: number;
  ratingCount: number;
  featured?: boolean;
  trending?: boolean;
}

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden ${className}`}>
      <div className="relative">
        <Link to={`/movies/${movie._id}`}>
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {movie.featured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </span>
          )}
          {movie.trending && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Trending
            </span>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded flex items-center space-x-1">
          <Star className="h-3 w-3 fill-current text-yellow-400" />
          <span className="text-sm font-semibold">{movie.averageRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-4">
        <Link
          to={`/movies/${movie._id}`}
          className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {movie.title}
          </h3>
        </Link>

        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{movie.releaseYear}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{movie.duration}min</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <StarRating rating={movie.averageRating} size="sm" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({movie.ratingCount} reviews)
          </span>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
          {movie.synopsis}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
            >
              {genre}
            </span>
          ))}
          {movie.genres.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
              +{movie.genres.length - 3} more
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Directed by {movie.director}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;