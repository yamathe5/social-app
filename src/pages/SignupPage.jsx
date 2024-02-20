import { useState } from "react";
import "./SignupPage.css"; // Asegúrate de tener un archivo CSS para estilos
import { useAuth } from "../contexts/auth";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { signup } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signup(inputs)
      .then(() => {
        console.log("Registro exitoso");
      })
      .catch((error) => {
        console.error("Error en el registro", error);
      });
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Registro</h2>
        <div className="input-container">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={inputs.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={inputs.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={inputs.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="signup-button">
          Registrarse
        </button>
        <div className="signup-links">
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
}
