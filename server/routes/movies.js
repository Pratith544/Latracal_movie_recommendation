import express from 'express';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';
import { validateMovie } from '../middleware/validation.js';

const router = express.Router();

// Get all movies with pagination and filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      genre,
      year,
      minRating,
      maxRating,
      search,
      sort = '-createdAt',
      featured,
      trending
    } = req.query;

    const query = {};

    if (genre) query.genres = { $in: genre.split(',') };
    if (year) query.releaseYear = parseInt(year);
    if (minRating || maxRating) {
      query.averageRating = {};
      if (minRating) query.averageRating.$gte = parseFloat(minRating);
      if (maxRating) query.averageRating.$lte = parseFloat(maxRating);
    }
    if (search) {
      query.$text = { $search: search };
    }
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.trending = true;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    };

    const movies = await Movie.find(query)
      .sort(options.sort)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const total = await Movie.countDocuments(query);

    res.json({
      success: true,
      data: movies,
      pagination: {
        currentPage: options.page,
        totalPages: Math.ceil(total / options.limit),
        totalMovies: total,
        hasNext: options.page < Math.ceil(total / options.limit),
        hasPrev: options.page > 1
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

// Get single movie with reviews
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const reviews = await Review.find({ movie: req.params.id })
      .populate('user', 'username profilePicture')
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      data: {
        ...movie.toObject(),
        reviews
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

// Add new movie (admin only)
router.post('/', authenticate, requireAdmin, validateMovie, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json({
      success: true,
      message: 'Movie added successfully',
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update movie (admin only)
router.put('/:id', authenticate, requireAdmin, validateMovie, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete movie (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Delete associated reviews
    await Review.deleteMany({ movie: req.params.id });

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get genres
router.get('/data/genres', async (req, res) => {
  try {
    const genres = await Movie.distinct('genres');
    res.json({
      success: true,
      data: genres.sort()
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