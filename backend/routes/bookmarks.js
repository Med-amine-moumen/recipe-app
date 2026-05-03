const express = require('express');
const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/bookmarks
router.get('/', protect, async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .sort({ savedAt: -1 })
      .populate({
        path: 'recipeId',
        populate: { path: 'authorId', select: 'name avatarUrl' },
      });
    res.json(bookmarks);
  } catch (err) {
    next(err);
  }
});

// POST /api/bookmarks/:recipeId
router.post('/:recipeId', protect, async (req, res, next) => {
  try {
    const exists = await Bookmark.findOne({
      userId: req.user._id,
      recipeId: req.params.recipeId,
    });
    if (exists) return res.status(400).json({ message: 'Recipe already bookmarked' });

    const bookmark = await Bookmark.create({
      userId: req.user._id,
      recipeId: req.params.recipeId,
    });
    res.status(201).json(bookmark);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bookmarks/:recipeId
router.delete('/:recipeId', protect, async (req, res, next) => {
  try {
    await Bookmark.findOneAndDelete({
      userId: req.user._id,
      recipeId: req.params.recipeId,
    });
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
