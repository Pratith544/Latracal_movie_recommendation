import express from 'express';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Watchlist from '../models/Watchlist.js';
import { authenticate } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -email');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's recent reviews
    const reviews = await Review.find({ user: req.params.userId })
      .populate('movie', 'title posterUrl')
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        recentReviews: reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticate, [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('favoriteGenres')
    .optional()
    .isArray()
    .withMessage('Favorite genres must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, bio, favoriteGenres, profilePicture } = req.body;
    const updates = {};

    if (username) {
      // Check if username is already taken
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
      updates.username = username;
    }

    if (bio !== undefined) updates.bio = bio;
    if (favoriteGenres) updates.favoriteGenres = favoriteGenres;
    if (profilePicture) updates.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get user's reviews
router.get('/:userId/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: req.params.userId })
      .populate('movie', 'title posterUrl')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ user: req.params.userId });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get user stats
router.get('/:userId/stats', async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId });
    const watchlistCount = await Watchlist.countDocuments({ user: req.params.userId });

    const stats = {
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 ? 
        Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 : 0,
      watchlistCount,
      genreBreakdown: {}
    };

    // Calculate genre breakdown from reviews
    const genreCounts = {};
    for (const review of reviews) {
      const movie = await review.populate('movie');
      if (movie.movie && movie.movie.genres) {
        movie.movie.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    }

    stats.genreBreakdown = genreCounts;

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;