import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getRecipe, deleteRecipe } from '../api/recipes';
import { getReviews, deleteReview } from '../api/reviews';
import { addBookmark, removeBookmark, getBookmarks } from '../api/bookmarks';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import ReviewForm from '../components/ReviewForm';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewPages, setReviewPages] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecipe();
  }, [id]);

  useEffect(() => {
    loadReviews();
  }, [id, reviewPage]);

  useEffect(() => {
    if (isAuthenticated) {
      getBookmarks().then((bms) => {
        setBookmarked(bms.some((b) => b.recipeId?._id === id || b.recipeId === id));
      });
    }
  }, [id, isAuthenticated]);

  const loadRecipe = async () => {
    setLoading(true);
    try {
      const data = await getRecipe(id);
      setRecipe(data);
    } catch {
      setError('Recipe not found');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await getReviews(id, { page: reviewPage, limit: 5 });
      setReviews(data.reviews);
      setReviewPages(data.pages);
    } catch {}
  };

  const handleDelete = async () => {
    if (!confirm('Delete this recipe?')) return;
    try {
      await deleteRecipe(id);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const toggleBookmark = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      if (bookmarked) {
        await removeBookmark(id);
        setBookmarked(false);
      } else {
        await addBookmark(id);
        setBookmarked(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update bookmark');
    }
  };

  const handleReviewAdded = (review) => {
    setReviews((prev) => [review, ...prev]);
    setRecipe((r) => ({
      ...r,
      reviewCount: r.reviewCount + 1,
    }));
    loadRecipe();
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Delete your review?')) return;
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      loadRecipe();
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !recipe) {
    return <div className="text-center py-16 text-gray-500">{error || 'Recipe not found'}</div>;
  }

  const isOwner = user && recipe.authorId?._id === user._id;
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const hasReviewed = reviews.some((r) => r.userId?._id === user?._id);

  return (
    <div className="max-w-4xl mx-auto">
      {recipe.imageUrl && (
        <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg border transition-colors ${
              bookmarked
                ? 'bg-brand-50 border-brand-300 text-brand-600'
                : 'border-gray-300 text-gray-500 hover:border-brand-300'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {bookmarked ? '🔖' : '📌'}
          </button>
          {isOwner && (
            <>
              <Link to={`/edit/${recipe._id}`} className="btn-secondary text-sm px-3 py-2">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn-secondary text-sm px-3 py-2 text-red-500 hover:border-red-300">
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
        {recipe.authorId && (
          <Link to={`/profile/${recipe.authorId._id}`} className="flex items-center gap-2 hover:text-brand-600">
            {recipe.authorId.avatarUrl ? (
              <img src={recipe.authorId.avatarUrl} className="w-6 h-6 rounded-full object-cover" alt="" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs">
                {recipe.authorId.name[0]}
              </div>
            )}
            {recipe.authorId.name}
          </Link>
        )}
        <RatingStars rating={recipe.avgRating} readonly />
        <span className="text-gray-400">·</span>
        <span>{recipe.reviewCount} reviews</span>
        {totalTime > 0 && (
          <>
            <span className="text-gray-400">·</span>
            <span>{totalTime} min total</span>
          </>
        )}
        {recipe.cuisine && (
          <span className="bg-gray-100 px-2 py-0.5 rounded-full">{recipe.cuisine}</span>
        )}
        {recipe.diet && recipe.diet !== 'none' && (
          <span className={`px-2 py-0.5 rounded-full ${
            recipe.diet === 'vegan' ? 'bg-green-100 text-green-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {recipe.diet}
          </span>
        )}
      </div>

      <p className="text-gray-700 leading-relaxed mb-8">{recipe.description}</p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                <span>
                  <strong>{ing.amount} {ing.unit}</strong> {ing.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          {recipe.prepTime > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span>Prep time</span><strong>{recipe.prepTime} min</strong>
            </div>
          )}
          {recipe.cookTime > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span>Cook time</span><strong>{recipe.cookTime} min</strong>
            </div>
          )}
          {totalTime > 0 && (
            <div className="flex justify-between py-2">
              <span>Total time</span><strong>{totalTime} min</strong>
            </div>
          )}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ol className="space-y-4">
          {recipe.steps.sort((a, b) => a.order - b.order).map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="shrink-0 w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold">
                {step.order}
              </span>
              <p className="text-gray-700 pt-0.5">{step.instruction}</p>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Reviews ({recipe.reviewCount})
        </h2>

        {isAuthenticated && !hasReviewed && (
          <div className="mb-6">
            <ReviewForm recipeId={id} onReviewAdded={handleReviewAdded} />
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                      {r.userId?.name?.[0] || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.userId?.name}</p>
                      <RatingStars rating={r.rating} readonly size="sm" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                    {user && r.userId?._id === user._id && (
                      <button
                        onClick={() => handleDeleteReview(r._id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}

        {reviewPages > 1 && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
              disabled={reviewPage === 1}
              className="btn-secondary text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setReviewPage((p) => Math.min(reviewPages, p + 1))}
              disabled={reviewPage === reviewPages}
              className="btn-secondary text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
