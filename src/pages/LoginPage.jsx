import { useState, useEffect } from "react";
import "./LoginPage.css";
import { useAuth } from "../contexts/auth";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [inputs, setInput] = useState({ mail: "manuelsegmar@gmail.com", password: "password" });
  const [backendReady, setBackendReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Social App backend is loading...");

  const { login } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users`);  //aqui cambiar con un endpoint especifico para retornar un 200

        if (response.ok) {
          setBackendReady(true);
          setStatusMessage("Social App is Ready to use");
        } else {
          setStatusMessage("Could not connect to the backend");
        }
      } catch (error) {
        setStatusMessage("Could not connect to the backend");
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  function handleSetInputs(e, type) {
    setInput((prevInput) => ({
      ...prevInput,
      [type]: e.target.value,
    }));
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Social App Backend is loading...");

    try {
      await login(inputs.mail, inputs.password);
      setStatusMessage("Social App Ready to use");
    } catch (error) {
      setStatusMessage("Error: Could not connect to the backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-status">
        
        {statusMessage}
      
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">social app</h2>
        <div className="input-container">
          <label htmlFor="email">Mail</label>
          <input
            type="email"
            id="email"
            value={inputs.mail}
            onChange={(e) => handleSetInputs(e, "mail")}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={inputs.password}
            onChange={(e) => handleSetInputs(e, "password")}
            required
          />
        </div>
        <button type="submit" className="login-button" disabled={!backendReady || loading}>
          {loading ? "Loading..." : "Iniciar sesión"}
        </button>
        <div className="login-links">
          <Link to="/signup">No tienes una cuenta? Regístrate</Link>
          <Link to="/forgot-password">Olvidaste tu contraseña?</Link>
        </div>
      </form>
    </div>
  );
}
