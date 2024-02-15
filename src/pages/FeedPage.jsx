import { useState } from "react";
import "./FeedPage.css"; // Asegúrate de tener este archivo CSS en tu proyecto
import { useEffect } from "react";

export default function FeedPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then((resp) => resp.json())
      .then((resp) => setData(resp))
      .catch((error) => console.error("Error al cargar los posts:", error));
  }, []);

  return (
    <div className="feed">
      <header className="feed__header">
        <div className="feed__logo">LOGO</div>
        <div className="feed__welcome-message">Bienvenido a social app</div>
        <nav className="feed__user-settings">
          <a href="/settings" className="feed__link">Configuraciones</a>
          <a href="/profile" className="feed__link">Usuario</a>
        </nav>
      </header>
      <main className="feed__main">
        <aside className="feed__sidebar">
          <button className="feed__button">Feed</button>
          <button className="feed__button">Mis posts</button>
          <button className="feed__button">Post guardados</button>
          <button className="feed__button">Mis contactos</button>
          <button className="feed__button">Settings</button>
          <button className="feed__button">Salir</button>
        </aside>
        <section className="feed__posts">
          {data && data.map((item, index) => (
            <article className="post" key={index}>
              <h2 className="post__username">{item.user.username}</h2>
              <p className="post__content">{item.content}</p>
              <img className="post__image" src="https://coffee.alexflipnote.dev/random" alt="" />
              <div className="post__buttons">

              <button className="post__button">Me gusta</button>
              <button className="post__button">Comentarios</button>
              </div>
            </article>
          ))}
        </section>
        <aside className="feed__friends">
          <h3 className="feed__friends-title">Friends</h3>
          <ul className="feed__friends-list">
            <li className="feed__friends-item">Camilo Rodríguez</li>
            {/* Repite el elemento de lista para más amigos */}
          </ul>
        </aside>
      </main>
    </div>
  );
}
