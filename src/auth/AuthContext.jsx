import axios from "../api/axios";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [access_token, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("/login", {
        email: data.email,
        password: data.password,
        remember_me: data.rememberMe,
      });
      setUser(res.data.data.user);
      setAccessToken(res.data.data.access_token);
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.data.access_token}`;
      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // const getUser = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get("/refresh-token"{

  //     });
  //     setUser(res.data.data);
  //     setAccessToken(res.data.data.access_token);
  //     axios.defaults.headers.common["Authorization"] =
  //       `Bearer ${res.data.data.access_token}`;
  //   } catch (error) {
  //     toast.error("Login failed", {
  //       description: error?.response?.data?.message || error.message,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getUser();
  // }, []);

  const value = {
    access_token,
    login,
    user,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
