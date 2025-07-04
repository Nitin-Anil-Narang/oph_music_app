import React, { createContext, useContext, useState ,useEffect} from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token", error);
        setUser(null);
      }
    }
  }, []);

  const login = (jwtToken) => {
    console.log(jwtToken);
    const decoded = jwtDecode(jwtToken);
    console.log(decoded);

    setToken(jwtToken);
    setUser(decoded);
  };

  const logout = () => {
    console.log("called");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  //in frontend send userData -- ophid, name , email, status

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>

      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
