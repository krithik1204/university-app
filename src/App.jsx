import Header from './components/Header';

import { AppRoutes } from './routes/AppRoutes';

/**
 * Main App component
 * Renders the shared header, page routes, and footer.
 */
function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 w-full">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
