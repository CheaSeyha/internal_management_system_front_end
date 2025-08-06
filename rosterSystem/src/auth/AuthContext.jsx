import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Load user from storage on initial render
  useEffect(() => {
    const loadUser = () => {
      const savedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const savedToken =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      if (savedUser && savedToken) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Failed to parse user:", error);
          // Clear invalid data
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
        }
      }
      setLoading(false); // Mark loading as complete
    };

    loadUser();
  }, []);

  const login = (user, access_token, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    // Always stringify before storing
    storage.setItem("user", JSON.stringify(user));
    storage.setItem("access_token", access_token);
    setUser(user);
  };

  const logout = () => {
    // Clear from both storage locations
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading, // Expose loading state
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
