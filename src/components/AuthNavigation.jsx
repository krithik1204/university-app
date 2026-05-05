import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import './styles/AuthNavigation.css';

const normalizeRole = (role) => String(role || '').toUpperCase().replace(/^ROLE_/, '');

/**
 * AuthNavigation component
 * Renders login/register links for unauthenticated users and
 * dashboard/logout controls for authenticated users.
 */
export const AuthNavigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, fullName, roles } = useSelector(state => state.auth);

  const normalizedRoles = Array.isArray(roles)
    ? roles.map(normalizeRole).filter(Boolean)
    : [normalizeRole(roles)].filter(Boolean);
  const roleText = normalizedRoles.join(', ') || 'Student';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="auth-nav flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <span className="auth-welcome text-sm text-slate-200">
            Welcome, <strong>{fullName || 'User'}</strong>
          </span>
          <span className="auth-role-badge">{roleText}</span>
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
