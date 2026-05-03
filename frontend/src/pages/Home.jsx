import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '../api/recipes';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';

const CUISINES = ['', 'Italian', 'Mexican', 'Asian', 'American', 'Mediterranean', 'Indian', 'French', 'Moroccan'];
const DIETS = [
  { value: '', label: 'All Diets' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'none', label: 'No restriction' },
];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({ cuisine: '', diet: '', sort: 'newest' });

  useEffect(() => {
    loadRecipes();
  }, [page, filters]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await getRecipes({ page, limit: 12, ...filters });
      setRecipes(data.recipes);
      setPages(data.pages);
    } catch {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const displayed = searchResults !== null ? searchResults : recipes;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 px-4">
        <div className="text-7xl mb-6">🍳</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to RecipeShare</h1>
        <p className="text-lg text-gray-500 mb-8 max-w-md">
          Discover, create and share amazing recipes from around the world. Join our community of food lovers.
        </p>
        <div className="flex gap-4">
          <Link to="/register" className="btn-primary px-8 py-3 text-base">
            Create an Account
          </Link>
          <Link to="/login" className="btn-secondary px-8 py-3 text-base">
            Sign In
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-8 text-center max-w-lg">
          <div>
            <p className="text-3xl font-bold text-brand-500">8+</p>
            <p className="text-sm text-gray-500 mt-1">Recipes</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-brand-500">3+</p>
            <p className="text-sm text-gray-500 mt-1">Cuisines</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-brand-500">Free</p>
            <p className="text-sm text-gray-500 mt-1">Forever</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Recipes</h1>
        <p className="text-gray-500">Find and share your favorite dishes</p>
      </div>

      <div className="mb-6">
        <SearchBar onResults={setSearchResults} />
      </div>

      {searchResults === null && (
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filters.cuisine}
            onChange={(e) => handleFilterChange('cuisine', e.target.value)}
            className="input w-auto"
          >
            <option value="">All Cuisines</option>
            {CUISINES.filter(Boolean).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filters.diet}
            onChange={(e) => handleFilterChange('diet', e.target.value)}
            className="input w-auto"
          >
            {DIETS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>

          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="input w-auto"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      )}

      {searchResults !== null && (
        <p className="text-sm text-gray-500 mb-4">{searchResults.length} search results</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">🍽️</p>
          <p className="text-lg font-medium">No recipes found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayed.map((r) => (
            <RecipeCard key={r._id} recipe={r} />
          ))}
        </div>
      )}

      {searchResults === null && pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="flex items-center text-sm text-gray-600 px-3">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="btn-secondary px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
