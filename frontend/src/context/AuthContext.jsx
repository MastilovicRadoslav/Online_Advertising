import { createContext, useState, useEffect } from "react";

// 1. Napravi kontekst
export const AuthContext = createContext();

// 2. Provider komponenta
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    username: null,
    userId: null,
  });

  // 3. Učitaj podatke iz localStorage kad se aplikacija pokrene
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");

    if (token && username) {
      setAuth({ token, username, userId });
    }
  }, []);

  // 4. Funkcija za login
  const login = (token, username, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
    setAuth({ token, username, userId });
  };

  // 5. Funkcija za logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setAuth({ token: null, username: null, userId: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
