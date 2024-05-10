import "./UsersPage.css";
import { useEffect, useState } from "react";
import Logo from "../assets/logo.jpg";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import { useAuth } from "../contexts/auth";
import FriendsSidebar from "../components/FriendsSidebar";
import { Link } from "react-router-dom";
import SearchInput from "../components/SearchInput";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const { auth } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/users`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((fetchedUsers) => {
        const updatedUsers = fetchedUsers.map((user, index) => ({
          ...user,
          profilePicture: user.profilePicture || `https://source.unsplash.com/random/?profile,${index}`
        }));
        setUsers(updatedUsers);
      });
  }, [apiUrl, auth.token]);
  if (!auth?.user) return null;

  return (
    <div className="feed">
      <header className="feed__header">
        <div className="feed__logo">
          <img className="feed__logo-image" src={Logo} alt="Logo" />
        </div>
        <div className="feed__welcome-message">Bienvenido</div>
        <nav className="feed__user-settings">
          {/* <a href="/settings" className="feed__link">
            Configuraciones
          </a> */}
          <Link to={`/user/${auth.user._id}`} className="feed__link">
            Usuario
          </Link>
        </nav>
      </header>
      <main className="feed__main">
        <Sidebar />
        <MobileSidebar />
        <section className="feed__posts">
          <h2>Todos los Usuarios</h2>
          <div className="search-container">
          <SearchInput users={users} />
          <div className="users__grid">
            {users.map((user, index) => (
              <Link to={`/user/${user._id}`} key={index} className="user__card">
                <img
                  src={user.profilePicture}
                  alt={`${user.username}'s profile`}
                  className="user__image"
                />
                <h4 className="user__name">{user.username}</h4>
                <p className="user__bio">{user.bio || "No bio available."}</p>
              </Link>
            ))}
          </div>
          </div>
        </section>
        <div className="friends__bar">
        <FriendsSidebar /></div>
      </main>
    </div>
  );
}
