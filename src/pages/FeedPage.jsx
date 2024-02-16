import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types'; // Importa PropTypes
import { useState } from "react";
import "./FeedPage.css"; // Asegúrate de tener este archivo CSS en tu proyecto
import { useEffect } from "react";
import Logo from "../assets/logo.jpg";
import {
  faPenToSquare,
  faBookmark,
  faUserFriends,
  faCog,
  faSignOutAlt,
  faHouse,
} from "@fortawesome/free-solid-svg-icons"; // Importa los iconos específicos
export default function FeedPage() {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then((resp) => resp.json())
      .then((resp) => setData(resp))
      .catch((error) => console.error("Error al cargar los posts:", error));
  }, []);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };



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
        <aside className="feed__sidebar">
          <button className="feed__button">
            <FontAwesomeIcon className="feed__icon" icon={faHouse} /> Feed
          </button>
          <button className="feed__button">
            <FontAwesomeIcon className="feed__icon" icon={faPenToSquare} /> Mis
            posts
          </button>
          <button className="feed__button">
            <FontAwesomeIcon className="feed__icon" icon={faBookmark} /> Post
            guardados
          </button>
          <button className="feed__button">
            <FontAwesomeIcon className="feed__icon" icon={faUserFriends} /> Mis
            contactos
          </button>
          <button className="feed__button">
            <FontAwesomeIcon className="feed__icon" icon={faCog} /> Settings
          </button>
          <button className="feed__button">
            <FontAwesomeIcon className="feed__icon" icon={faSignOutAlt} /> Salir
          </button>
        </aside>
        <section className="feed__posts">
          {isModalOpen && (
            <Modal post={selectedPost} onClose={() => setIsModalOpen(false)} />
          )}

          {data &&
            data.map((item, index) => (
              <article className="post" key={index}>
                <h2 className="post__username">{item.user.username}</h2>
                <p className="post__content">{item.content}</p>
                <img className="post__image" src={item.image} alt="" />
                <p>Comments {item.comments.length}</p>
                <div className="post__buttons">
                  <button className="post__button">Me gusta</button>
                  <button
                    className="post__button"
                    onClick={() => openModal(item)}
                  >
                    Comentarios
                  </button>
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

const Modal = ({ post, onClose }) => {
  if (!post) return null;

  const [inputValue, setInputValue] = useState("")

  function  handleChangeInput(e){
    console.log(e.target.value)
    setInputValue(e.target.value)
  }
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <article className="post">
          <h2 className="post__username">{post.user.username}</h2>
          <p className="post__content">{post.content}</p>
          {post.image && <img className="post__image" src={post.image} alt="Post" />}
          <p>Comments {post.comments ? post.comments.length : 0}</p>
          {post.comments && post.comments.map((comment, index) => (
            <div key={index} className="comment">
              <strong>{comment.user}: </strong>
              <span>{comment.text}</span>
            </div>
          ))}

          <div className="post__buttons">
            <button className="post__button">Me gusta</button>
            <button className="post__button" onClick={onClose}>Cerrar</button>
          </div>

          <div>
            <p>Escribe un comentario</p>
            <input type="text" value={inputValue} placeholder="Escribe un comentario" onChange={(e) => handleChangeInput(e)} />
            <button>Envia</button>
          </div>
        </article>
      </div>
    </div>
  );
};
Modal.propTypes = {
  post: PropTypes.shape({
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string.isRequired,
    image: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.shape({
      user: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })),
  }),
  onClose: PropTypes.func.isRequired, // Indica que onClose es una función requerida
};
