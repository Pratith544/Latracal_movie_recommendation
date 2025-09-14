import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  synopsis: {
    type: String,
    required: true,
    maxlength: 2000
  },
  genres: [{
    type: String,
    required: true
  }],
  releaseYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 5
  },
  director: {
    type: String,
    required: true
  },
  cast: [{
    name: String,
    character: String
  }],
  duration: {
    type: Number, // in minutes
    required: true
  },
  posterUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x450?text=No+Poster'
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  tmdbId: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

movieSchema.index({ title: 'text', synopsis: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ releaseYear: 1 });
movieSchema.index({ averageRating: -1 });

export default mongoose.model('Movie', movieSchema);