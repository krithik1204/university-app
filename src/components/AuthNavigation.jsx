import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import './styles/AuthNavigation.css';

/**
 * AuthNavigation component
 * Renders login/register links for unauthenticated users and
 * dashboard/logout controls for authenticated users.
 */
export const AuthNavigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, fullName } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <span className="text-sm text-slate-200">
            Welcome, <strong>{fullName || 'User'}</strong>
          </span>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-slate-100 hover:text-white ${isActive ? 'font-semibold' : 'font-medium'}`
            }
          >
            Dashboard
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-100 hover:text-white hover:bg-slate-700/70'}`
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-100 hover:text-white hover:bg-slate-700/70'}`
            }
          >
            Register
          </NavLink>
        </>
      )}
    </nav>
  );
};
