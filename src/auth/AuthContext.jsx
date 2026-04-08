import axios from "../api/axios";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [access_token, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user
  const fetchUser = async () => {
    if (!access_token) return; // don't fetch without access token
    try {
      const res = await axios.get("/user");
      setUser(res.data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user", {
        description: error.response?.data?.message || error.message,
      });
    }
  };

  // Refresh access token from cookie
  const refreshAccessToken = async () => {
    try {
      const res = await axios.post(
        "/refresh-token",
        {},
        { withCredentials: true },
      );
      const token = res.data.data.access_token;
      setAccessToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return token;
    } catch (err) {
      console.log("No refresh token or expired", err);
      setAccessToken(null);
      setUser(null);
      return null;
    }
  };

  // Initial load
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const token = await refreshAccessToken(); // try to get access token via refresh token
      if (token) {
        await fetchUser();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Update user whenever access token changes
  useEffect(() => {
    if (access_token) fetchUser();
  }, [access_token]);

  // Set access token after login
  const getAccessToken = (token) => {
    setAccessToken(token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUser();
  };

  const value = {
    access_token,
    getAccessToken,
    user,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
