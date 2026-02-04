import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PageNotFound from './lib/PageNotFound';
import { Toaster } from './components/ui/toaster';
import { queryClientInstance } from './lib/query-client';
import { AuthProvider, useAuth } from './lib/AuthContext';
import UserNotRegisteredError from './components/UserNotRegisteredError';
import { pagesConfig } from './pages.config';
import NavigationTracker from './lib/NavigationTracker';

// --------------------
// Pages config typing (minimal & safe)
// --------------------

type LayoutWrapperProps = {
  children: ReactNode;
  currentPageName?: string;
};

const { Pages, Layout, mainPage } = pagesConfig as {
  Pages: Record<string, React.ComponentType>;
  Layout?: React.ComponentType<{ currentPageName?: string; children: ReactNode }>;
  mainPage?: string;
};

const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : () => null;

// --------------------
// Layout wrapper
// --------------------

const LayoutWrapper = ({ children, currentPageName }: LayoutWrapperProps) => {
  if (!Layout) return <>{children}</>;

  return (
    <Layout currentPageName={currentPageName}>
      {children}
    </Layout>
  );
};

// --------------------
// Authenticated App
// --------------------

const AuthenticatedApp = () => {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin,
  } = useAuth();

  // Loading state
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // Auth errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }

    if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  // App routes
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LayoutWrapper currentPageName={mainPageKey}>
            <MainPage />
          </LayoutWrapper>
        }
      />

      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

// --------------------
// App root
// --------------------

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
