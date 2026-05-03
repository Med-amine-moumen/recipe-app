const express = require('express');
const Review = require('../models/Review');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/authMiddleware');

// Mounted at /api/recipes/:recipeId/reviews (mergeParams: true)
const nestedRouter = express.Router({ mergeParams: true });

nestedRouter.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [reviews, total] = await Promise.all([
      Review.find({ recipeId: req.params.recipeId })
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('userId', 'name avatarUrl'),
      Review.countDocuments({ recipeId: req.params.recipeId }),
    ]);
    res.json({ reviews, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
});

nestedRouter.post('/', protect, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const recipeId = req.params.recipeId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const existing = await Review.findOne({ recipeId, userId: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this recipe' });

    const review = await Review.create({
      recipeId,
      userId: req.user._id,
      rating: Number(rating),
      comment: comment || '',
    });

    const stats = await Review.aggregate([
      { $match: { recipeId: review.recipeId } },
      { $group: { _id: '$recipeId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats.length > 0) {
      await Recipe.findByIdAndUpdate(recipeId, {
        avgRating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      });
    }

    await review.populate('userId', 'name avatarUrl');
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

// Mounted at /api/reviews
const topRouter = express.Router();

topRouter.delete('/:id', protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const recipeId = review.recipeId;
    await review.deleteOne();

    const stats = await Review.aggregate([
      { $match: { recipeId } },
      { $group: { _id: '$recipeId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await Recipe.findByIdAndUpdate(recipeId, {
      avgRating: stats.length > 0 ? Math.round(stats[0].avg * 10) / 10 : 0,
      reviewCount: stats.length > 0 ? stats[0].count : 0,
    });

    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = { nestedRouter, topRouter };
