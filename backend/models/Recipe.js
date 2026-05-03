const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  unit: { type: String, default: '' },
});

const stepSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  instruction: { type: String, required: true },
});

const recipeSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    ingredients: [ingredientSchema],
    steps: [stepSchema],
    imageUrl: { type: String, default: '' },
    prepTime: { type: Number, default: 0 },
    cookTime: { type: Number, default: 0 },
    cuisine: { type: String, default: '' },
    diet: {
      type: String,
      enum: ['vegan', 'vegetarian', 'none', ''],
      default: 'none',
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

recipeSchema.index({ title: 'text', description: 'text', 'ingredients.name': 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
