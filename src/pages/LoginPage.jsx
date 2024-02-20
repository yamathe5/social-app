import { useState } from "react";
import "./LoginPage.css";
import { useAuth } from "../contexts/auth";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [inputs, setInput] = useState({ mail: "", password: "" });
  const { login } = useAuth();

  function handleSetInputs(e, type) {
    setInput((prevInput) => ({
      ...prevInput,
      [type]: e.target.value,
    }));
  }

  const handleLogin = (e) => {
    e.preventDefault();
    login(inputs.mail, inputs.password);
    console.log("Inicio de sesión");
  };

  return (
    <div className="login-container">
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
        <button type="submit" className="login-button">
          Iniciar sesión
        </button>
        <div className="login-links">
          <Link to="/signup">No tienes una cuenta? Regístrate</Link>
          <Link to="/forgot-password">Olvidaste tu contraseña?</Link>
        </div>
      </form>
    </div>
  );
}
