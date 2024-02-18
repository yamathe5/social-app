// AuthContext.js
import { jwtDecode as jwt_decode } from "jwt-decode";
import { useState, createContext, useContext, useEffect } from "react";
import PropTypes from "prop-types";

// Create a context for auth
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null, // Los detalles del usuario
    token: localStorage.getItem("authToken") || null, // El token JWT
  });

  const fetchUserProfile = async (_id, token) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setAuth((prevAuth) => ({ ...prevAuth, user: data }));
      } else {
        console.error("Error al obtener el perfil del usuario:", data.message);
      }
    } catch (error) {
      console.error("Error en la petición al perfil del usuario:", error);
    }
  };

  // Simulate a login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`http://localhost:3000/api/login`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ email: email, password: password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        const { _id, token } = data;
        setAuth({ token }); // Solo guardamos el token inicialmente
        localStorage.setItem("authToken", token); // Guardamos el token en localStorage
        fetchUserProfile(_id, token); // Obtenemos el perfil del usuario
      } else {
        console.error(data.message);
        // Manejo de errores
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
    }
  };

  // Simulate a signup function
  const signup = async (body) => {
    try {
      const response = await fetch(`http://localhost:3000/api/signup`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(body),
        headers: {
          "Content-type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        const { _id, token } = data;
        setAuth({ token }); // Solo guardamos el token inicialmente
        localStorage.setItem("authToken", token); // Guardamos el token en localStorage
        fetchUserProfile(_id, token); // Obtenemos el perfil del usuario
      } else {
        console.error(data.message);

        // Manejo de errores
      }
    } catch (error) {
      console.error("Error al intentar registrar:", error);
    }
  };

  // Simulate a logout function
  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("authToken"); // Eliminamos el token de localStorage
  };

  // Check if user is logged in whe n the provider mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuth((prevAuth) => ({ ...prevAuth, token: storedToken }));
      const decoded = jwt_decode(storedToken); // Necesitarías una función para decodificar el JWT
      fetchUserProfile(decoded.id, storedToken);
    }
  }, []);

  // Store the user in localStorage when it changes

  // The context value that will be supplied to any descendants of this component.
  const value = {
    auth,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // children debe ser un nodo React
};
