const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash')
      .populate('followers', 'name avatarUrl')
      .populate('following', 'name avatarUrl');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id/recipes
router.get('/:id/recipes', async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const [recipes, total] = await Promise.all([
      Recipe.find({ authorId: req.params.id })
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('authorId', 'name avatarUrl'),
      Recipe.countDocuments({ authorId: req.params.id }),
    ]);
    res.json({ recipes, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/:id/follow
router.post('/:id/follow', protect, async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const alreadyFollowing = target.followers.includes(req.user._id);
    if (alreadyFollowing) return res.status(400).json({ message: 'Already following this user' });

    await Promise.all([
      User.findByIdAndUpdate(req.params.id, { $addToSet: { followers: req.user._id } }),
      User.findByIdAndUpdate(req.user._id, { $addToSet: { following: req.params.id } }),
    ]);

    res.json({ message: 'Followed successfully' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/users/:id/follow
router.delete('/:id/follow', protect, async (req, res, next) => {
  try {
    await Promise.all([
      User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } }),
      User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } }),
    ]);
    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
