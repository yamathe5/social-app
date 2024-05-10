import "./FeedPage.css";
import "./ContactsPage.css";
import { useEffect, useState } from "react";
import Logo from "../assets/logo.jpg";
import MobileSidebar from "../components/MobileSidebar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/auth";
import FriendsSidebar from "../components/FriendsSidebar";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const { auth } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (auth?.user?._id) {
      fetch(`${apiUrl}/api/friends`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setContacts(data.friends || []);
        })
        .catch((err) => console.error("Error fetching contacts:", err));

      fetch(`${apiUrl}/api/friend-requests/sent`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setSentRequests(data.sentRequests || []);
        })
        .catch((err) => console.error("Error fetching sent requests:", err));

      fetch(`${apiUrl}/api/friend-requests/received`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setReceivedRequests(data.receivedRequests || []);
        })
        .catch((err) => console.error("Error fetching received requests:", err));
    }
  }, [apiUrl, auth]);

  const acceptRequest = async (requestId) => {
    const url = `${apiUrl}/api/friend-requests/accept/${requestId}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setReceivedRequests((prev) =>
          prev.filter((req) => req._id !== requestId)
        );
      } else {
        console.error("Error al aceptar solicitud:", data.message);
      }
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/friend-requests/cancel/${requestId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setReceivedRequests((prev) =>
          prev.filter((req) => req._id !== requestId)
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const response = await fetch(`${apiUrl}/api/friends/${friendId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setContacts((prev) => prev.filter((contact) => contact.id !== friendId));
      } else {
        console.log(data)
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
    }
  };

  const cancelSentRequest = async (requestId) => {
    try {
      const response = await fetch(`${apiUrl}/api/friend-requests/cancel/${requestId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSentRequests((prev) => prev.filter((req) => req._id !== requestId));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al cancelar solicitud enviada:", error);
    }
  };

  if (!auth?.user) return null;

  return (
    <div className="feed">
      <header className="feed__header">
        <div className="feed__logo">
          <img className="feed__logo-image" src={Logo} alt="Logo" />
        </div>
        <div className="feed__welcome-message">Bienvenido</div>
        <nav className="feed__user-settings">
          <Link to={`/user/${auth.user._id}`} className="feed__link">
            Usuario
          </Link>
        </nav>
      </header>
      <main className="feed__main">
        <Sidebar />
        <MobileSidebar />
        <section className="feed__posts">
          <div className="section__header">
            <h2 className="section__title">Contactos</h2>
          </div>
          <div className="contacts__grid">
            {contacts.length > 0 ? (
              <div className="contacts__grid">
                {contacts.map((contact, index) => (
                  <div key={index} className="contact__card">
                    <img
                      src={
                        contact.profilePicture ||
                        "https://source.unsplash.com/random"
                      }
                      alt={`${contact.username}'s profile`}
                      className="contact__image"
                    />
                    <h4 className="contact__name">{contact.username}</h4>
                    <button 
                      className="button remove"
                      onClick={() => removeFriend(contact.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-contacts">Sin contactos</div>
            )}
          </div>
          <div className="section__header">
            <h2 className="section__title">Solicitudes Enviadas</h2>
          </div>
          <div className="contacts__grid">
            {sentRequests.length > 0 ? (
              <div className="contacts__grid">
                {sentRequests.map((request, index) => (
                  <div key={index} className="contact__card">
                    <img
                      src={
                        request.receiverId.profilePicture ||
                        "https://source.unsplash.com/random"
                      }
                      alt={`${request.receiverId.username}'s profile`}
                      className="contact__image"
                    />
                    <h4 className="contact__name">
                      {request.receiverId.username}
                    </h4>
                    <p>
                      {formatDistanceToNow(new Date(request.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                    <button
                      className="button cancel"
                      onClick={() => cancelSentRequest(request._id)}
                    >
                      Cancelar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-requests">No has realizado solicitudes</div>
            )}
          </div>
          <div className="section__header">
            <h2 className="section__title">Solicitudes Recibidas</h2>
          </div>
          <div className="contacts__grid">
            {receivedRequests.length > 0 ? (
              <div className="contacts__grid">
                {receivedRequests.map((request, index) => 
                  {
                    return <div key={index} className="contact__card">
                    <img
                      src={
                        request.senderId.profilePicture ||
                        "https://source.unsplash.com/random"
                      }
                      alt={`${request.senderId.username}'s profile`}
                      className="contact__image"
                    />
                    <h4 className="contact__name">
                      {request.senderId.username}
                    </h4>
                    <p>
                      Recibido:{" "}
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      className="button accept"
                      onClick={() => acceptRequest(request._id)}
                    >
                      Aceptar
                    </button>
                    <button
                      className="button reject"
                      onClick={() => rejectRequest(request._id)}
                    >
                      Rechazar
                    </button>
                  </div>}
                )}
              </div>
            ) : (
              <div className="no-requests">Sin solicitudes</div>
            )}
          </div>
        </section>
        <FriendsSidebar />
      </main>
    </div>
  );
}
