import "./FeedPage.css";
import { useEffect, useState } from "react";
import Logo from "../assets/logo.jpg";

import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/auth";
import { jwtDecode as jwt_decode } from "jwt-decode";
import FriendsSidebar from "../components/FriendsSidebar";

export default function ContactsPage() {
  const [followers,  setFollowers] = useState(null);
  const [followgins,  setFollowgins] = useState(null);

  const { auth } = useAuth();

  useEffect(() => {
    const decoded = jwt_decode(auth.token); 

    fetch(`http://localhost:3000/api/${decoded.id}/followers`)
      .then((data) => data.json())
      .then((data) => {setFollowers(data); });
    fetch(`http://localhost:3000/api/${decoded.id}/following`)
      .then((data) => data.json())
      .then((data) => {setFollowgins(data); });
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
        <FriendsSidebar></FriendsSidebar>
      </main>
    </div>
  );
}
