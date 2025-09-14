import React from 'react';
import { BookOpen, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">CineReview</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your ultimate destination for movie reviews, ratings, and recommendations. 
              Join our community of film enthusiasts and share your passion for cinema.
            </p>
            <div className="flex items-center text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" />
              <span>for movie lovers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/movies" className="hover:text-white transition-colors">
                  Browse Movies
                </a>
              </li>
              <li>
                <a href="/movies?featured=true" className="hover:text-white transition-colors">
                  Featured Films
                </a>
              </li>
              <li>
                <a href="/movies?trending=true" className="hover:text-white transition-colors">
                  Trending Now
                </a>
              </li>
              <li>
                <a href="/movies?sort=-averageRating" className="hover:text-white transition-colors">
                  Top Rated
                </a>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Genres</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/movies?genre=Action" className="hover:text-white transition-colors">
                  Action
                </a>
              </li>
              <li>
                <a href="/movies?genre=Drama" className="hover:text-white transition-colors">
                  Drama
                </a>
              </li>
              <li>
                <a href="/movies?genre=Comedy" className="hover:text-white transition-colors">
                  Comedy
                </a>
              </li>
              <li>
                <a href="/movies?genre=Thriller" className="hover:text-white transition-colors">
                  Thriller
                </a>
              </li>
              <li>
                <a href="/movies?genre=Horror" className="hover:text-white transition-colors">
                  Horror
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 CineReview. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;