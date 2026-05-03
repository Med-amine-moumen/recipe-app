import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchRecipes } from '../api/recipes';
import RecipeCard from './RecipeCard';

export default function SearchBar({ onResults }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim()) {
      onResults && onResults(null);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchRecipes(query);
        onResults && onResults(data.recipes);
      } catch {
        onResults && onResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timerRef.current);
  }, [query]);

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-brand-400 focus-within:border-transparent overflow-hidden">
        <span className="pl-3 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes, ingredients..."
          className="flex-1 px-3 py-3 text-sm bg-transparent outline-none"
        />
        {loading && (
          <div className="pr-3">
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {query && !loading && (
          <button
            onClick={() => setQuery('')}
            className="pr-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
