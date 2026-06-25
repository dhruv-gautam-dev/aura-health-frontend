import { ReactNode, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PageNotFound from './lib/PageNotFound';
import { Toaster } from './components/ui/toaster';
import { queryClientInstance } from './lib/query-client';
import { Navigate } from 'react-router-dom';
import { pagesConfig } from './pages.config';
import { Toaster as SonnerToaster } from 'sonner';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './store';
import Login from './pages/Login';
import RoleSelectionPage from './pages/RoleSelectionPage';
import OnboardingPatient from './pages/OnboardingPatient';
import { OnboardingDoctor } from './pages/OnboardingDoctor';
import SignupPage from './pages/Signup';
// --------------------
// Calendar OAuth callback handler
// Runs on every page load. If this window was opened as a popup by the
// Medications page and Google redirected here with ?calendar_connected=true,
// post a message back to the opener and close the popup.
// --------------------
function CalendarCallbackHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('calendar_connected') === 'true') {
      // Write to localStorage — this fires a 'storage' event in every other
      // same-origin tab (including the Medications page that opened this popup).
      // We can't rely on window.opener.postMessage because browsers null out
      // window.opener after a cross-origin redirect chain (Google OAuth flow).
      localStorage.setItem('aura_calendar_connected', Date.now().toString());
      // Close the popup. This works because it was opened via window.open().
      window.close();
    }
  }, []);
  return null;
}

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
        <CalendarCallbackHandler />
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
      <SonnerToaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

export default App;
