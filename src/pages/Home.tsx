import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Star, ArrowRight } from 'lucide-react';
import axios from 'axios';
import MovieCard from '../components/UI/MovieCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';

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

const Home: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredResponse, trendingResponse, topRatedResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/movies?featured=true&limit=6'),
          axios.get('http://localhost:5000/api/movies?trending=true&limit=8'),
          axios.get('http://localhost:5000/api/movies?sort=-averageRating&limit=8')
        ]);

        setFeaturedMovies(featuredResponse.data.data);
        setTrendingMovies(trendingResponse.data.data);
        setTopRatedMovies(topRatedResponse.data.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover Amazing
              <span className="text-yellow-400 block">Movies</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Join our community of movie enthusiasts. Read reviews, rate films, and discover your next favorite movie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/movies"
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Browse Movies</span>
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Star className="h-5 w-5" />
                <span>Join Community</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      {featuredMovies.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Movies</h2>
              <Link
                to="/movies?featured=true"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Movies */}
      {trendingMovies.length > 0 && (
        <section className="py-16 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-red-600" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
              </div>
              <Link
                to="/movies?trending=true"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Rated Movies */}
      {topRatedMovies.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Star className="h-8 w-8 text-yellow-400 fill-current" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Top Rated</h2>
              </div>
              <Link
                to="/movies?sort=-averageRating"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topRatedMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Share Your Movie Experience?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of movie lovers sharing their reviews and discovering new films.
          </p>
          <Link
            to="/register"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <span>Get Started Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;