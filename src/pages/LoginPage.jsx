import "./LoginPage.css"; // Asegúrate de crear un archivo CSS para estilizar tu página de inicio de sesión

export default function LoginPage() {
  // Función para manejar el inicio de sesión (a implementar)
  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para manejar el inicio de sesión
    console.log("Inicio de sesión");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">social app</h2>
        <div className="input-container">
          <label htmlFor="email">Mail</label>
          <input type="email" id="email" required />
        </div>
        <div className="input-container">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" required />
        </div>
        <button type="submit" className="login-button">
          Iniciar sesión
        </button>
        <div className="login-links">
          <a href="/register">No tienes una cuenta? Regístrate</a>
          <a href="/forgot-password">Olvidaste tu contraseña?</a>
        </div>
      </form>
    </div>
  );
}
