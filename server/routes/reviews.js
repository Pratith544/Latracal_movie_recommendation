import express from 'express';
import Review from '../models/Review.js';
import Movie from '../models/Movie.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { validateReview } from '../middleware/validation.js';

const router = express.Router();

// Get reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate('user', 'username profilePicture')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ movie: req.params.movieId });

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

// Add review
router.post('/movie/:movieId', authenticate, validateReview, async (req, res) => {
  try {
    const { rating, title, content, spoiler = false } = req.body;

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      user: req.user._id,
      movie: req.params.movieId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this movie'
      });
    }

    // Check if movie exists
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const review = new Review({
      user: req.user._id,
      movie: req.params.movieId,
      rating,
      title,
      content,
      spoiler
    });

    await review.save();

    // Update movie average rating
    const reviews = await Review.find({ movie: req.params.movieId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Movie.findByIdAndUpdate(req.params.movieId, {
      averageRating: Math.round(averageRating * 10) / 10,
      ratingCount: reviews.length
    });

    // Update user review count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { reviewCount: 1 }
    });

    await review.populate('user', 'username profilePicture');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Update review
router.put('/:reviewId', authenticate, validateReview, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const { rating, title, content, spoiler } = req.body;
    const oldRating = review.rating;

    review.rating = rating;
    review.title = title;
    review.content = content;
    review.spoiler = spoiler;

    await review.save();

    // Update movie average rating if rating changed
    if (oldRating !== rating) {
      const reviews = await Review.find({ movie: review.movie });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / reviews.length;

      await Movie.findByIdAndUpdate(review.movie, {
        averageRating: Math.round(averageRating * 10) / 10
      });
    }

    await review.populate('user', 'username profilePicture');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Delete review
router.delete('/:reviewId', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    // Update movie average rating
    const reviews = await Review.find({ movie: review.movie });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / reviews.length;

      await Movie.findByIdAndUpdate(review.movie, {
        averageRating: Math.round(averageRating * 10) / 10,
        ratingCount: reviews.length
      });
    } else {
      await Movie.findByIdAndUpdate(review.movie, {
        averageRating: 0,
        ratingCount: 0
      });
    }

    // Update user review count
    await User.findByIdAndUpdate(review.user, {
      $inc: { reviewCount: -1 }
    });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Mark review as helpful
router.post('/:reviewId/helpful', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.helpfulUsers.includes(req.user._id)) {
      // Remove helpful vote
      review.helpfulUsers.pull(req.user._id);
      review.helpful = Math.max(0, review.helpful - 1);
    } else {
      // Add helpful vote
      review.helpfulUsers.push(req.user._id);
      review.helpful += 1;
    }

    await review.save();

    res.json({
      success: true,
      message: 'Review helpful status updated',
      data: {
        helpful: review.helpful,
        isHelpful: review.helpfulUsers.includes(req.user._id)
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