import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppRoutes } from './AppRoutes';

/**
 * Main App component
 * Provides navigation and routing for the entire application
 */
function App() {
  // Get authentication state from Redux store
  const { isAuthenticated, fullName } = useSelector(state => state.auth);

  return (
    <div className="app">
      <header className="app-header">
        <h1>University App</h1>

        <nav className="app-navigation">
          {isAuthenticated ? (
            // Authenticated user navigation
            <>
              <span className="welcome-message">Welcome, {fullName}!</span>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </>
          ) : (
            // Unauthenticated user navigation
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
