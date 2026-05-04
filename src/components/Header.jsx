import { AuthNavigation } from './AuthNavigation';
import './styles/Header.css';

/**
 * Header component
 * Displays the application title and renders the authentication navigation.
 */
const Header = () => {
  return (
    <header className="app-header">
      <div className="app-header-top">
        <div>
          <p className="eyebrow">University App</p>
          <h1 className="heading">Learn, Connect & Grow</h1>
          <p className="subheading">A colorful student portal for login, registration, and personalized study dashboards.</p>
        </div>
        <AuthNavigation />
      </div>
    </header>
  );
};

export default Header;
