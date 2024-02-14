import React from 'react';
import './FeedPage.css'; // Asegúrate de tener este archivo CSS en tu proyecto

export default function FeedPage() {
  return (
    <div className="feed-container">
      <header className="feed-header">
        <div className="logo">LOGO</div>
        <div className="welcome-message">Bienvenido a social app</div>
        <nav className="user-settings">
          <a href="/settings">Configuraciones</a>
          <a href="/profile">Usuario</a>
        </nav>
      </header>
      <main className="feed-main">
        <aside className="feed-sidebar">
          <button>Mis posts</button>
          <button>Post guardados</button>
        </aside>
        <section className="feed-posts">
          {/* Aquí iría el mapeo de los posts obtenidos de la API */}
          <article className="post">
            <h2>Juanito alcatraz</h2>
            <p>Descripción del trabajo...</p>
            <button>Me gusta</button>
            <button>Comentarios</button>
          </article>
          {/* Repite el artículo para más posts */}
        </section>
        <aside className="feed-friends">
          {/* Aquí iría el mapeo de los amigos conectados */}
          <h3>Friends</h3>
          <ul>
            <li>Camilo Rodríguez</li>
            {/* Repite el elemento de lista para más amigos */}
          </ul>
        </aside>
      </main>
    </div>
  );
}
