import axios from "../api/axios";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state


  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/user");
      if (res.status === 200) {
        setUser(res.data.data);
        console.log(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user", {
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };


  // Load user from storage on initial render
  useEffect(() => {
    fetchUser();
  }, []);

  const login = (user, access_token, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    // Always stringify before storing
    // storage.setItem("user", JSON.stringify(user));
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
