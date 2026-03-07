import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuthSession,
  fetchCurrentUser,
  getAuthToken,
  getStoredUser,
  loginRequest,
  setAuthSession,
  signupRequest,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken());
  const [user, setUser] = useState(getStoredUser());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      const currentToken = getAuthToken();
      if (!currentToken) {
        if (isMounted) {
          setIsAuthLoading(false);
        }
        return;
      }

      try {
        const response = await fetchCurrentUser(currentToken);
        if (!isMounted) return;

        const currentUser = response?.user;
        if (!currentUser) {
          clearAuthSession();
          setToken(null);
          setUser(null);
        } else {
          setAuthSession({ token: currentToken, user: currentUser });
          setToken(currentToken);
          setUser(currentUser);
        }
      } catch (error) {
        if (!isMounted) return;
        clearAuthSession();
        setToken(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    }

    initializeAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const signup = async (payload) => {
    const response = await signupRequest(payload);
    setAuthSession({ token: response.token, user: response.user });
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const login = async (payload) => {
    const response = await loginRequest(payload);
    setAuthSession({ token: response.token, user: response.user });
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    clearAuthSession();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isAuthLoading,
      signup,
      login,
      logout,
    }),
    [token, user, isAuthLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
