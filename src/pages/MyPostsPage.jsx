import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale"; // Importa el locale que necesites, en este caso español

import PropTypes from "prop-types"; // Importa PropTypes
import { useState } from "react";
import "./MyPostPage.css"; // Asegúrate de tener este archivo CSS en tu proyecto
import { useEffect } from "react";
import Logo from "../assets/logo.jpg";
import { jwtDecode as jwt_decode } from "jwt-decode";


import { useAuth } from "../contexts/auth";
import Sidebar from "../components/Sidebar";
export default function MyPostPage() {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { auth } = useAuth();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const decoded = jwt_decode(auth.token); // Necesitarías una función para decodificar el JWT
    console.log(decoded);
    fetch(`http://localhost:3000/api/user/${decoded.id}/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`, // Incluye el token aquí
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        console.log(resp)
        setData(resp);
      })
      .catch((error) => console.error("Error al cargar los posts:", error));
  }, [auth.token]);

  function toogleLike(type, postId) {
    console.log(type, postId)

    fetch(`http://localhost:3000/api/posts/${postId}/${type}`, {
      method: "PATCH",
      mode: "cors",
      body: JSON.stringify({
        userId: auth.user._id,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        const updatedPosts = data.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: !post.hasLiked
                ? [...post.likes, auth.user._id]
                : post.likes.filter((id) => id !== auth.user._id),
              hasLiked: !post.hasLiked,
            }; // Asume que el servidor devuelve el post actualizado
          }
          return post;
        });
        setData(updatedPosts); // Actualiza el estado con los posts actualizados
      }).catch(err => console.log(err));
  }

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
        <div className="feed__welcome-message">
          Bienvenido a social appaaaaaa
        </div>
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
          {isModalOpen && (
            <Modal
            inputValue={inputValue}
            setInputValue={setInputValue}
            post={selectedPost}
            auth={auth}
            setSelectedPost={setSelectedPost}
            onClose={() => setIsModalOpen(false)}
            />
          )}

          {data &&
            data.map((item, index) => (
              <article className="post" key={index}>
                <h2 className="post__username">{item.user.username}</h2>
                <p className="post__content">{item.content}</p>
                <img className="post__image" src={item.image} alt="" />
                <p>Comments {item.comments.length}</p>
                <div className="post__buttons">
                {item.hasLiked ? (
                    <button
                      className="post__button post__button--liked"
                      onClick={() => toogleLike("unlike", item._id)}
                    >
                      Me gusta
                    </button>
                  ) : (
                    <button
                      className="post__button"
                      onClick={() => toogleLike("like", item._id)}
                    >
                      Me gusta
                    </button>
                  )}
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


const Modal = ({
  post,
  onClose,
  auth,
  setSelectedPost,
  inputValue,
  setInputValue,
}) => {
  if (!post) return null;

  function handleChangeInput(e) {
    setInputValue(e.target.value);
  }

  function onSubmit() {
    fetch(`http://localhost:3000/api/posts/${post._id}/comments`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        text: inputValue,
        userId: auth.user._id,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((newComment) => {
        // Actualiza el estado para incluir el nuevo comentario
        // Asume que newComment es el comentario recién creado, devuelto por el servidor
        setSelectedPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, newComment],
        }));
        setInputValue(""); // Limpia el campo de entrada
      })
      .catch((error) =>
        console.error("Error al agregar el comentario:", error)
      );
  }
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <article className="modal_post">
          <h2 className="post__username">{post.user.username}</h2>
          <p className="post__content">{post.content}</p>
          {post.image && (
            <img className="post__image" src={post.image} alt="Post" />
          )}
          <p>Comments {post.comments ? post.comments.length : 0}</p>
          <div className="comments__container">
          {post.comments &&
            post.comments.map((comment, index) => (
              <div key={index} className="comment">
                <strong className="comment__username" >{comment.user.username}: </strong>
                <br />
                <span className="comment__content">{comment.text}</span>
                <br />
                <span className="comment__date">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            ))}

          </div>
          
          <div className="post__buttons">
            <button className="post__button">Me gusta</button>
            <button className="post__button" onClick={onClose}>
              Cerrar
            </button>
          </div>

          <div className="input__box" >
            <input
            className="input__box__comment"
              type="text"
              value={inputValue}
              placeholder="Escribe un comentario"
              onChange={(e) => handleChangeInput(e)}
            />
            <button className="input__box__send-button" onClick={() => onSubmit()}>Envia</button>
          </div>
        </article>
      </div>
    </div>
  );
};
Modal.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    image: PropTypes.string,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired, // Asume que user es un objeto con un campo username
      // Puedes añadir más campos del usuario aquí si es necesario
    }).isRequired,
    likes: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
          // Incluye otros campos del modelo de usuario si son necesarios aquí
        }).isRequired,
        // Añade aquí más campos según tu modelo
      })
    ),
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }),
  auth: PropTypes.shape({
    token: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      // Incluye otros campos del modelo de usuario si son necesarios aquí
    }),
  }),
  onClose: PropTypes.func.isRequired,
  setSelectedPost: PropTypes.func.isRequired, // Añade esta línea
  inputValue: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
};
