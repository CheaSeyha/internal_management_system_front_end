import axios from "../api/axios";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [access_token, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const isRestoring = useRef(false);
  const avatarUrlRef = useRef(null);

  const fetchUserImage = async (userId) => {
    if (!userId) return null;
    try {
      const response = await axios.get("/user/image/" + userId, {
        responseType: "blob",
      });
      if (avatarUrlRef.current) {
        URL.revokeObjectURL(avatarUrlRef.current);
      }
      const imageUrl = URL.createObjectURL(response.data);
      avatarUrlRef.current = imageUrl;
      return imageUrl;
    } catch (err) {
      console.error("Failed to fetch user image:", err);
      return null;
    }
  };

  const login = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("/login", {
        email: data.email,
        password: data.password,
        remember_me: data.rememberMe,
      });
      const user = res.data.data.user;
      const token = res.data.data.access_token;

      // Set token first so image fetch can use it
      setAccessToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Set user immediately
      setUser(user);

      // 3. fetch image in background
      fetchUserImage(user.id).then((avatar) => {
        if (avatar) {
          setUser((prev) => (prev ? { ...prev, avatar } : null));
        }
      });

      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const restoreSession = async () => {
    if (isRestoring.current) return;
    setLoading(true);
    isRestoring.current = true;
    console.log("1. restoreSession started");
    try {
      // 1. call refresh token
      const res = await axios.post("/refresh-token");
      const token = res.data?.data?.access_token || res.data?.access_token;

      // 2. set access token in axios header
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      // 3. call get user with new token
      let userData = res.data?.data?.user || res.data?.user;
      if (!userData) {
        const userRes = await axios.get("/user", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        userData =
          userRes.data?.data?.user || userRes.data?.data || userRes.data;
      }

      if (!userData) {
        throw new Error("No user fetched");
      }

      // 4. setUser(user) first to unblock UI
      setUser(userData);
      setAccessToken(token);

      // 5. Success, stop initial loading
      setLoading(false);

      // 6. Fetch avatar in the background
      fetchUserImage(userData.id).then((avatar) => {
        if (avatar) {
          setUser((prev) => (prev ? { ...prev, avatar } : null));
        }
      });
    } catch (error) {
      console.log(
        "restoreSession failed:",
        error?.response?.status,
        error?.response?.data,
      );
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false); // ONLY place setLoading(false) is called
      isRestoring.current = false;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post("/logout");
    } catch (error) {
      // silent fail
    } finally {
      if (avatarUrlRef.current) {
        URL.revokeObjectURL(avatarUrlRef.current);
        avatarUrlRef.current = null;
      }
      setUser(null);
      setAccessToken(null);
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const value = {
    access_token,
    login,
    logout,
    user,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
