import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import { authApi } from "../api/auth.api";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setLoading, setError } from '../store/authSlice';
import { RootState } from '../store';

interface AppUser {
  id: string;
  email: string;
  full_name?: string;
  user_type?: string;
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      dispatch(setLoading(true));

      if (!fbUser) {
        setFirebaseUser(null);
        dispatch(clearUser());
        dispatch(setLoading(false));
        return;
      }

      try {
        const backendUser = await authApi.authenticateUser(fbUser);

        setFirebaseUser(fbUser);
        dispatch(setUser(backendUser));
      } catch (error) {
        console.error("Auth sync failed:", error);
        dispatch(setError("Authentication failed"));
        dispatch(clearUser());
      } finally {
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const logout = async () => {
    try {
      await authApi.logout();
      setFirebaseUser(null);
      dispatch(clearUser());
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(setError("Logout failed"));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, firebaseUser, isAuthenticated, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used inside AuthProvider");
  return context;
};