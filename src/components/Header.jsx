import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { AuthNavigation } from './AuthNavigation';
import './Header.css';

const quotes = [
  {
    text: 'Arise, awake, and stop not till the goal is reached.',
    author: 'Swami Vivekananda',
  },
  {
    text: 'Talk to yourself once in a day, otherwise you may miss meeting an excellent person in this world.',
    author: 'Swami Vivekananda',
  },
  {
    text: 'Take risks in your life. If you win, you can lead. If you lose, you can guide.',
    author: 'Swami Vivekananda',
  },
  {
    text: 'You cannot believe in God until you believe in yourself.',
    author: 'Swami Vivekananda',
  },
];

/**
 * Header component
 * Displays the application title and renders the authentication navigation.
 */
const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quote = useMemo(() => quotes[quoteIndex], [quoteIndex]);

  useEffect(() => {
    if (!isAuthenticated) {
      setQuoteIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setQuoteIndex((current) => (current + 1) % quotes.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <p className="header-title">University App</p>
          {isAuthenticated ? (
            <div className="header-quote-box">
              <p className="header-quote-text">"{quote.text}"</p>
              <p className="header-quote-author">— {quote.author}</p>
            </div>
          ) : (
            <>
              <h1 className="header-welcome-title">Learn, Connect & Grow</h1>
              <p className="header-welcome-text">
                A colorful student portal for login, registration, and personalized study dashboards.
              </p>
            </>
          )}
        </div>
        <AuthNavigation />
      </div>
    </header>
  );
};

export default Header;
