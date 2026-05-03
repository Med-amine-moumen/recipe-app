import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../api/recipes';
import ImageUpload from '../components/ImageUpload';

const DIETS = ['none', 'vegetarian', 'vegan'];
const CUISINES = ['', 'Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Indian', 'French', 'Moroccan', 'Other'];

const emptyIngredient = () => ({ name: '', amount: '', unit: '' });
const emptyStep = () => ({ order: 1, instruction: '' });

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    prepTime: '',
    cookTime: '',
    cuisine: '',
    diet: 'none',
  });
  const [ingredients, setIngredients] = useState([emptyIngredient()]);
  const [steps, setSteps] = useState([{ ...emptyStep(), order: 1 }]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const updateIngredient = (i, field, value) =>
    setIngredients((prev) => prev.map((ing, idx) => (idx === i ? { ...ing, [field]: value } : ing)));

  const addIngredient = () => setIngredients((prev) => [...prev, emptyIngredient()]);

  const removeIngredient = (i) =>
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));

  const updateStep = (i, value) =>
    setSteps((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, instruction: value } : s))
    );

  const addStep = () =>
    setSteps((prev) => [...prev, { order: prev.length + 1, instruction: '' }]);

  const removeStep = (i) =>
    setSteps((prev) =>
      prev.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, order: idx + 1 }))
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description) return setError('Title and description are required');
    if (ingredients.some((ing) => !ing.name || !ing.amount))
      return setError('Each ingredient needs a name and amount');
    if (steps.some((s) => !s.instruction))
      return setError('Each step needs an instruction');

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('ingredients', JSON.stringify(ingredients));
      fd.append('steps', JSON.stringify(steps));
      if (imageFile) fd.append('image', imageFile);

      const recipe = await createRecipe(fd);
      navigate(`/recipes/${recipe._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Basic Info</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input name="title" value={form.title} onChange={handleFormChange} className="input" placeholder="Recipe name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleFormChange}
              rows={3} className="input resize-none" placeholder="Describe your recipe..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
              <input name="prepTime" type="number" min="0" value={form.prepTime} onChange={handleFormChange} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (min)</label>
              <input name="cookTime" type="number" min="0" value={form.cookTime} onChange={handleFormChange} className="input" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
              <select name="cuisine" value={form.cuisine} onChange={handleFormChange} className="input">
                {CUISINES.map((c) => <option key={c} value={c}>{c || 'Select cuisine'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diet</label>
              <select name="diet" value={form.diet} onChange={handleFormChange} className="input">
                {DIETS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Recipe Image</h2>
          <ImageUpload onFileSelect={setImageFile} />
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Ingredients</h2>
            <button type="button" onClick={addIngredient} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              + Add
            </button>
          </div>
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={ing.amount}
                onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                className="input w-20"
                placeholder="Qty"
              />
              <input
                value={ing.unit}
                onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
                className="input w-20"
                placeholder="Unit"
              />
              <input
                value={ing.name}
                onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                className="input flex-1"
                placeholder="Ingredient name"
              />
              {ingredients.length > 1 && (
                <button type="button" onClick={() => removeIngredient(i)}
                  className="text-red-400 hover:text-red-600 text-lg">✕</button>
              )}
            </div>
          ))}
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Steps</h2>
            <button type="button" onClick={addStep} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              + Add Step
            </button>
          </div>
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="shrink-0 w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm mt-2">
                {step.order}
              </span>
              <textarea
                value={step.instruction}
                onChange={(e) => updateStep(i, e.target.value)}
                rows={2}
                className="input flex-1 resize-none"
                placeholder={`Step ${step.order} instruction...`}
              />
              {steps.length > 1 && (
                <button type="button" onClick={() => removeStep(i)}
                  className="text-red-400 hover:text-red-600 text-lg mt-2">✕</button>
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
            {loading ? 'Creating...' : 'Publish Recipe'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-6 py-3">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
