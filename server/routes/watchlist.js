import express from 'express';
import Watchlist from '../models/Watchlist.js';
import Movie from '../models/Movie.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user's watchlist
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { user: req.user._id };
    if (status) query.status = status;

    const watchlistItems = await Watchlist.find(query)
      .populate('movie')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Watchlist.countDocuments(query);

    res.json({
      success: true,
      data: watchlistItems,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
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

// Add movie to watchlist
router.post('/:movieId', authenticate, async (req, res) => {
  try {
    const { status = 'want_to_watch', priority = 'medium', notes = '' } = req.body;

    // Check if movie exists
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if already in watchlist
    const existingItem = await Watchlist.findOne({
      user: req.user._id,
      movie: req.params.movieId
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist'
      });
    }

    const watchlistItem = new Watchlist({
      user: req.user._id,
      movie: req.params.movieId,
      status,
      priority,
      notes
    });

    await watchlistItem.save();
    await watchlistItem.populate('movie');

    res.status(201).json({
      success: true,
      message: 'Movie added to watchlist',
      data: watchlistItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update watchlist item
router.put('/:movieId', authenticate, async (req, res) => {
  try {
    const { status, priority, notes } = req.body;

    const watchlistItem = await Watchlist.findOneAndUpdate(
      { user: req.user._id, movie: req.params.movieId },
      { status, priority, notes },
      { new: true, runValidators: true }
    ).populate('movie');

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Movie not in watchlist'
      });
    }

    res.json({
      success: true,
      message: 'Watchlist item updated',
      data: watchlistItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Remove movie from watchlist
router.delete('/:movieId', authenticate, async (req, res) => {
  try {
    const watchlistItem = await Watchlist.findOneAndDelete({
      user: req.user._id,
      movie: req.params.movieId
    });

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Movie not in watchlist'
      });
    }

    res.json({
      success: true,
      message: 'Movie removed from watchlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Check if movie is in watchlist
router.get('/check/:movieId', authenticate, async (req, res) => {
  try {
    const watchlistItem = await Watchlist.findOne({
      user: req.user._id,
      movie: req.params.movieId
    });

    res.json({
      success: true,
      data: {
        inWatchlist: !!watchlistItem,
        item: watchlistItem
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

export default router;