import Header from './components/Header';
import { AppRoutes } from './routes/AppRoutes';
import './App.css';

/**
 * Main App component
 * Renders the shared header, page routes, and footer.
 */
function App() {
  return (
    <div className="app">
      <Header />

      <main className="app-main">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
