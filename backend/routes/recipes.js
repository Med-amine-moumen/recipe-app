const express = require('express');
const Recipe = require('../models/Recipe');
const Review = require('../models/Review');
const Bookmark = require('../models/Bookmark');
const Tag = require('../models/Tag');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// GET /api/recipes
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 12, cuisine, diet, tag, sort = 'newest' } = req.query;
    const filter = {};
    if (cuisine) filter.cuisine = new RegExp(cuisine, 'i');
    if (diet) filter.diet = diet;
    if (tag) filter.tags = tag;

    const sortObj = sort === 'rating' ? { avgRating: -1 } : { createdAt: -1 };

    const [recipes, total] = await Promise.all([
      Recipe.find(filter)
        .sort(sortObj)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('authorId', 'name avatarUrl'),
      Recipe.countDocuments(filter),
    ]);

    res.json({
      recipes,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/recipes/search  (must be before /:id)
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) return res.json({ recipes: [] });
    const recipes = await Recipe.find({ $text: { $search: q } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .populate('authorId', 'name avatarUrl');
    res.json({ recipes });
  } catch (err) {
    next(err);
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('authorId', 'name avatarUrl bio')
      .populate('tags', 'name');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// POST /api/recipes
router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    const { title, description, ingredients, steps, prepTime, cookTime, cuisine, diet, tags } =
      req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const parsedIngredients =
      typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients || [];
    const parsedSteps = typeof steps === 'string' ? JSON.parse(steps) : steps || [];
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags || [];
    const imageUrl = req.file ? req.file.path : '';

    const recipe = await Recipe.create({
      authorId: req.user._id,
      title,
      description,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      imageUrl,
      prepTime: Number(prepTime) || 0,
      cookTime: Number(cookTime) || 0,
      cuisine: cuisine || '',
      diet: diet || 'none',
      tags: parsedTags,
    });

    if (parsedTags.length > 0) {
      await Tag.updateMany({ _id: { $in: parsedTags } }, { $inc: { recipeCount: 1 } });
    }

    await recipe.populate('authorId', 'name avatarUrl');
    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
});

// PUT /api/recipes/:id
router.put('/:id', protect, upload.single('image'), async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this recipe' });
    }

    const { title, description, ingredients, steps, prepTime, cookTime, cuisine, diet, tags } =
      req.body;

    if (title !== undefined) recipe.title = title;
    if (description !== undefined) recipe.description = description;
    if (ingredients !== undefined)
      recipe.ingredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    if (steps !== undefined)
      recipe.steps = typeof steps === 'string' ? JSON.parse(steps) : steps;
    if (prepTime !== undefined) recipe.prepTime = Number(prepTime);
    if (cookTime !== undefined) recipe.cookTime = Number(cookTime);
    if (cuisine !== undefined) recipe.cuisine = cuisine;
    if (diet !== undefined) recipe.diet = diet;
    if (req.file) recipe.imageUrl = req.file.path;
    if (tags !== undefined)
      recipe.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;

    const updated = await recipe.save();
    await updated.populate('authorId', 'name avatarUrl');
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/recipes/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await Promise.all([
      Review.deleteMany({ recipeId: recipe._id }),
      Bookmark.deleteMany({ recipeId: recipe._id }),
      recipe.deleteOne(),
    ]);

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
