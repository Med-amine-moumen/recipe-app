import { useState, useEffect } from 'react';
import { getBookmarks, removeBookmark } from '../api/bookmarks';
import RecipeCard from '../components/RecipeCard';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookmarks()
      .then((data) => setBookmarks(data))
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (recipeId) => {
    try {
      await removeBookmark(recipeId);
      setBookmarks((prev) => prev.filter((b) => b.recipeId?._id !== recipeId));
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">🔖</p>
          <p className="text-lg font-medium">No bookmarks yet</p>
          <p className="text-sm mt-1">Save recipes you love to find them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((b) =>
            b.recipeId ? (
              <div key={b._id} className="relative">
                <RecipeCard recipe={b.recipeId} />
                <button
                  onClick={() => handleRemove(b.recipeId._id)}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur text-red-400 hover:text-red-600 rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-sm"
                  title="Remove bookmark"
                >
                  ✕
                </button>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
