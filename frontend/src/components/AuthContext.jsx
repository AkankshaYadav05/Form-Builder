import { createContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check server session on app load
  const checkAuth = async () => {
    try {
      const res = await axios.get("https://form-builder-production-cee9.up.railway.app/api/users/me");
      if (res.data.loggedIn) setAuth(res.data.username);
      else setAuth(null);
    } catch {
      setAuth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, checkAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
