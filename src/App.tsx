import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PageNotFound from './lib/PageNotFound';
import { Toaster } from './components/ui/toaster';
import { queryClientInstance } from './lib/query-client';
import { Navigate } from 'react-router-dom';
import { pagesConfig } from './pages.config';
import NavigationTracker from './lib/NavigationTracker';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './store';
import Login from './pages/Login';
import RoleSelectionPage from './pages/RoleSelectionPage';
import OnboardingPatient from './pages/OnboardingPatient';
import { OnboardingDoctor } from './pages/OnboardingDoctor';
import SignupPage from './pages/Signup';
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
  const user = useSelector((state: RootState) => state.auth.user);

  console.log("AuthenticatedApp: User state:", user);

  if (!user) {
    console.warn("User not authenticated. Redirecting to login page.");
    return <Navigate to="/login" replace />;
  }

  console.log("User authenticated. Rendering authenticated routes.");

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
          path={path}
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
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <Routes>
              
              {/* PUBLIC ROUTE */}
              <Route path="/login" element={<Login />} />
              <Route path="/RoleSelectionPage" element={<RoleSelectionPage />} />
              <Route path="/OnboardingPatient" element={<OnboardingPatient />} />
              <Route path="/OnboardingDoctor" element={<OnboardingDoctor />} />
              <Route path="/signup" element={<SignupPage />} />



              {/* PROTECTED ROUTES */}
              <Route path="/*" element={<AuthenticatedApp />} />

            </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
  );
}

export default App;
