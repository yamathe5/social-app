import { jwtDecode as jwt_decode } from "jwt-decode";
import { useState, createContext, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [auth, setAuth] = useState({
    user: null,
    token: localStorage.getItem("authToken") || null,
  });

  const fetchUserProfile = async (_id, token) => {
    try {
      const response = await fetch(`${apiUrl}/api/user/${_id}`, {
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

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
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
        setAuth({ token });
        localStorage.setItem("authToken", token);
        fetchUserProfile(_id, token);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
    }
  };

  const signup = async (body) => {
    try {
      const response = await fetch(`${apiUrl}/api/signup`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(body),
        headers: {
          "Content-type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        const _id = data.user.id;
        const token = data.user.token;
        setAuth({ user: data.user, token });
        localStorage.setItem("authToken", token);
        fetchUserProfile(_id, token);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al intentar registrar:", error);
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("authToken");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuth((prevAuth) => ({ ...prevAuth, token: storedToken }));
      const decoded = jwt_decode(storedToken);
      fetchUserProfile(decoded.id, storedToken);
    }
  }, []);

  const value = {
    auth,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
