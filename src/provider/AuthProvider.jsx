import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Crea contexto para compartir el estado de autenticacion a traves de los componentes
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Trae el token desde el localstorage, si es que existe.
  const [token, setAuthToken] = useState(localStorage.getItem("auth_token"));

  // Funcion para definir el token
  const setToken = (newToken) => {
    setAuthToken(newToken);
  };

  // Guarda el token, o lo elimina si la funcion viene vacia.
  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token',token);
    } else {
      localStorage.removeItem('auth_token')
    }
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  // Envia el contexto de autenticacion a componentes descendientes.
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook para acceder al contexto desde otros componentes
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
