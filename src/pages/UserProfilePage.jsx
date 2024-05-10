import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/auth";
import FriendsSidebar from "../components/FriendsSidebar";
import Sidebar from "../components/Sidebar";
import Logo from "../assets/logo.jpg";
import "./UserProfilePage.css";
import MobileSidebar from "../components/MobileSidebar";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const { userId } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { auth } = useAuth();
  // http://localhost:3000/api/friend-requests

  function handleSendFriendRequest() {
    fetch(`${apiUrl}/api/friend-requests`, {
      method: "POST", // Especifica que es una petición POST
      headers: {
        "Content-Type": "application/json", // Indica que el cuerpo de la petición es JSON
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        receiverId: userId, // Usa el ID del usuario de la página de perfil
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(data => {
            throw new Error(`${data.message}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        alert(data.message); // Muestra un mensaje con la respuesta del servidor
      })
      .catch((error) => {
        console.log(error)
        console.error("Error al enviar la solicitud de amistad:", error);
        alert(error); // Maneja posibles errores
      });
  }

  useEffect(() => {
    fetch(`${apiUrl}/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        return fetch(`${apiUrl}/api/user/${userId}/posts`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
      })
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error);
  }, [apiUrl, auth.token, userId]);

  const isMyProfile = auth.user && userId === auth.user._id;
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
        <MobileSidebar />        <div className="user-profile">
          {user ? (
            <div>
              <img
                src={user.profilePicture || "../assets/logo.jpg"}
                alt={user.username}
                className="profile__image"
              />
              <h2>{user.username}</h2>
              <p>{user.email}</p>
              <p>{user.bio}</p>
              {isMyProfile ? (
                <Link to="/edit-profile" className="btn btn-edit">
                  Editar Perfil
                </Link>
              ) : (
                <button
                  className="btn btn-add"
                  onClick={handleSendFriendRequest}
                >
                  Agregar amigo
                </button>
              )}
              <div>
                <h3>Posts:</h3>
                {posts.map((post, index) => (
                  <div key={index}>
                    <p>{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Loading user profile...</p>
          )}
        </div>
        <FriendsSidebar />
      </main>
    </div>
  );
}
