import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import './AuthNavigation.css';

const normalizeRole = (role) => String(role || '').toUpperCase().replace(/^ROLE_/, '');

/**
 * AuthNavigation component
 * Renders login/register links for unauthenticated users and
 * dashboard/logout controls for authenticated users.
 */
export const AuthNavigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, name, roles } = useSelector(state => state.auth);

  const normalizedRoles = Array.isArray(roles)
    ? roles.map(normalizeRole).filter(Boolean)
    : [normalizeRole(roles)].filter(Boolean);
  const roleText = normalizedRoles.join(', ') || 'Student';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="auth-nav">
      {isAuthenticated ? (
        <>
          <span className="auth-welcome">
            Welcome, <strong>{name || 'User'}</strong>
          </span>
          <span className="auth-role">
            {roleText}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="auth-logout"
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
              isActive ? 'auth-link auth-link-active' : 'auth-link auth-link-inactive'
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            end
            className={({ isActive }) =>
              isActive ? 'auth-link auth-link-active' : 'auth-link auth-link-inactive'
            }
          >
            Register
          </NavLink>
        </>
      )}
    </nav>
  );
};
