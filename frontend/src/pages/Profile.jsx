import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, getUserRecipes, followUser, unfollowUser } from '../api/users';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  const isOwnProfile = currentUser?._id === id;

  useEffect(() => {
    setLoading(true);
    getUserProfile(id)
      .then((data) => {
        setProfile(data);
        if (currentUser) {
          setFollowing(data.followers.some((f) => f._id === currentUser._id));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    getUserRecipes(id, { page, limit: 12 }).then((data) => {
      setRecipes(data.recipes);
      setPages(data.pages);
    });
  }, [id, page]);

  const handleFollow = async () => {
    try {
      if (following) {
        await unfollowUser(id);
        setFollowing(false);
        setProfile((p) => ({
          ...p,
          followers: p.followers.filter((f) => f._id !== currentUser._id),
        }));
      } else {
        await followUser(id);
        setFollowing(true);
        setProfile((p) => ({
          ...p,
          followers: [...p.followers, { _id: currentUser._id, name: currentUser.name }],
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-16 text-gray-500">User not found</div>;
  }

  return (
    <div>
      <div className="card p-6 mb-8 flex items-start gap-6">
        <div className="shrink-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-3xl">
              {profile.name[0].toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              {profile.bio && <p className="text-gray-600 mt-1 text-sm">{profile.bio}</p>}
            </div>
            {isAuthenticated && !isOwnProfile && (
              <button
                onClick={handleFollow}
                className={following ? 'btn-secondary' : 'btn-primary'}
              >
                {following ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          <div className="flex gap-6 mt-4 text-sm text-gray-600">
            <span>
              <strong className="text-gray-900">{profile.followers.length}</strong> followers
            </span>
            <span>
              <strong className="text-gray-900">{profile.following.length}</strong> following
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recipes</h2>

      {recipes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">🍳</p>
          <p>{isOwnProfile ? "You haven't posted any recipes yet." : 'No recipes yet.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((r) => (
            <RecipeCard key={r._id} recipe={r} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="btn-secondary disabled:opacity-40">Previous</button>
          <span className="flex items-center text-sm text-gray-600 px-3">
            {page} / {pages}
          </span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
            className="btn-secondary disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
