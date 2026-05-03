import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-600">
            <span className="text-2xl">🍳</span>
            RecipeShare
          </Link>

          <div className="flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Recipes
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/create"
                  className="btn-primary text-sm px-3 py-1.5"
                >
                  + New Recipe
                </NavLink>
                <NavLink
                  to="/bookmarks"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  Bookmarks
                </NavLink>
                <NavLink
                  to={`/profile/${user._id}`}
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs">
                      {user.name[0].toUpperCase()}
                    </div>
                  )}
                  {user.name}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Login
                </NavLink>
                <NavLink to="/register" className="btn-primary text-sm px-3 py-1.5">
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
