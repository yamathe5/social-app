import "./FeedPage.css"; // Asegúrate de tener este archivo CSS en tu proyecto
import { useEffect, useState } from "react";
import Logo from "../assets/logo.jpg";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/auth";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function ContactsPage() {
  const [followers,  setFollowers] = useState(null);
  const [followgins,  setFollowgins] = useState(null);

  const { auth } = useAuth();

  useEffect(() => {
    const decoded = jwt_decode(auth.token); // Necesitarías una función para decodificar el JWT
    console.log(decoded);

    fetch(`http://localhost:3000/api/${decoded.id}/followers`)
      .then((data) => data.json())
      .then((data) => {setFollowers(data); console.log(data)});
    fetch(`http://localhost:3000/api/${decoded.id}/following`)
      .then((data) => data.json())
      .then((data) => {setFollowgins(data); console.log(data)});
  }, [auth.token]);

  return (
    <div className="feed">
      <header className="feed__header">
        <div className="feed__logo">
          <img className="feed__logo-image" src={Logo} alt="" />
        </div>
        <div className="feed__welcome-message">Bienvenido a social app</div>
        <nav className="feed__user-settings">
          <a href="/settings" className="feed__link">
            Configuraciones
          </a>
          <a href="/profile" className="feed__link">
            Usuario
          </a>
        </nav>
      </header>
      <main className="feed__main">
        <Sidebar></Sidebar>
        <section className="feed__posts">
          FOLLOWERS
          {followers &&
            followers.map((item, index) => {
              return (
                <div key={index}>
                  <img src="" alt="" />
                  <h4>{item.followerId.username}</h4>
                </div>
              );
            })}
        </section>
        <section className="feed__posts">
          FOLLOWING
          {followgins &&
            followgins.map((item, index) => {
              return (
                <div key={index}>
                  <img src="" alt="" />
                  <h4>{item.followingId.username}</h4>
                </div>
              );
            })}
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
