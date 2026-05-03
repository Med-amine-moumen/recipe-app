import { useState } from 'react';
import RatingStars from './RatingStars';
import { addReview } from '../api/reviews';

export default function ReviewForm({ recipeId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return setError('Please select a rating');
    setError('');
    setLoading(true);
    try {
      const review = await addReview(recipeId, { rating, comment });
      onReviewAdded && onReviewAdded(review);
      setRating(0);
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">Write a Review</h3>

      <div>
        <p className="text-sm text-gray-600 mb-1">Your rating *</p>
        <RatingStars rating={rating} onChange={setRating} size="lg" />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this recipe..."
        rows={3}
        className="input resize-none"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
