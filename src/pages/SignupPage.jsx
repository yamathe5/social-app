import "./SignupPage.css"; // Asegúrate de tener este archivo CSS en tu proyecto

export default function SignupPage() {
  // Función para manejar el registro (a implementar)
  const handleSignUp = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para manejar el registro
    console.log("Registro de usuario");
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignUp}>
        <h2 className="signup-title">Regístrate en social app</h2>
        <div className="input-container">
          <label htmlFor="username">Nombre de usuario</label>
          <input type="text" id="username" required />
        </div>
        <div className="input-container">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" required />
        </div>
        <div className="input-container">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" required />
        </div>
        <div className="input-container">
          <label htmlFor="confirm-password">Confirmar contraseña</label>
          <input type="password" id="confirm-password" required />
        </div>
        <button type="submit" className="signup-button">
          Registrarse
        </button>
        <div className="signup-links">
          <a href="/login">¿Ya tienes una cuenta? Inicia sesión</a>
        </div>
      </form>
    </div>
  );
}
