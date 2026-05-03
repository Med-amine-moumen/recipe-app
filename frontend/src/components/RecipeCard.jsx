import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';

const DIET_BADGE = {
  vegan: { label: 'Vegan', className: 'bg-green-100 text-green-700' },
  vegetarian: { label: 'Vegetarian', className: 'bg-emerald-100 text-emerald-700' },
  none: null,
  '': null,
};

export default function RecipeCard({ recipe }) {
  const badge = DIET_BADGE[recipe.diet];
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <Link to={`/recipes/${recipe._id}`} className="card group flex flex-col hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
            🍽️
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
            {recipe.title}
          </h3>
          {badge && (
            <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${badge.className}`}>
              {badge.label}
            </span>
          )}
        </div>

        {recipe.authorId && (
          <p className="text-xs text-gray-500 mb-2">by {recipe.authorId.name}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
          <RatingStars rating={recipe.avgRating} readonly size="sm" />
          {totalTime > 0 && (
            <span className="text-xs text-gray-500">{totalTime} min</span>
          )}
        </div>
      </div>
    </Link>
  );
}
