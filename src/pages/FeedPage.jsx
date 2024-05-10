import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "./FeedPage.css";
import Logo from "../assets/logo.jpg";
import { useAuth } from "../contexts/auth";
import Sidebar from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FriendsSidebar from "../components/FriendsSidebar";
import MobileSidebar from "../components/MobileSidebar";
import { Link } from "react-router-dom";

export default function FeedPage() {
  const [data, setData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [newPost, setNewPost] = useState({
    content: "",
    image: "", // Asumiendo que manejas la carga de imágenes como un URL por simplicidad
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleImageChange = (e) => {
    // Configura para aceptar solo el primer archivo
    setImageFile(e.target.files[0]);
  };

  const { auth } = useAuth();

  useEffect(() => {
    if (auth?.user?._id) {
      fetch(`${apiUrl}/api/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          setData(resp);
        })
        .catch((error) => console.error("Error al cargar los posts:", error));
    }
  }, [apiUrl, auth.token, auth.user]);

  const openModal = (post) => {
    fetch(`${apiUrl}/api/posts/${post._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setSelectedPost(res);
        setIsModalOpen(true);
        toggleBodyScroll(true);
      });
  };

  const toggleBodyScroll = (isOpen) => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  };

  function toggleLike(type, postId) {
    fetch(`${apiUrl}/api/posts/${postId}/${type}`, {
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
      .then(() => {
        const updatedPosts = data.map((post) => {
          if (post._id === postId) {
            const updatedPost = {
              ...post,
              likes: !post.hasLiked
                ? [...post.likes, auth.user._id]
                : post.likes.filter((id) => id !== auth.user._id),
              hasLiked: !post.hasLiked,
            };
            if (selectedPost && selectedPost._id === postId) {
              setSelectedPost(updatedPost);
            }
            return updatedPost;
          }
          return post;
        });
        setData(updatedPosts);
      });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) {
      alert("El contenido del post es obligatorio.");
      return;
    }

    const formData = new FormData();
    formData.append("content", newPost.content);
    formData.append("user", auth.user._id);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      const newPostResponse = await response.json();
      if (response.ok) {
        setData((prevPosts) => [newPostResponse, ...prevPosts]);
        setNewPost({ user: "", content: "", image: "" });
      } else {
        console.error("Error al publicar el post:", newPostResponse.message);
      }
    } catch (error) {
      console.error("Error al publicar el post:", error);
    }
  };

  if (!auth?.user) return null;

  return (
    <div className="feed">
      <header className="feed__header">
        <div className="feed__logo">
          <img className="feed__logo-image" src={Logo} alt="" />
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
          <form
            className="new-post-form"
            onSubmit={handleNewPostSubmit}
            encType="multipart/form-data"
          >
            <textarea
              className="new-post-form__content"
              name="content"
              value={newPost.content}
              onChange={handleInputChange}
              placeholder="Contenido del post"
              required
            ></textarea>
            <input
              className="new-post-form__image"
              type="file"
              name="image" // Asegúrate de que este sea el nombre que tu backend espera
              onChange={handleImageChange}
              accept="image/*" // Esto limitará los archivos a imágenes
            />
            <button type="submit" className="new-post-form__submit">
              Publicar
            </button>
          </form>

          {isModalOpen && (
            <Modal
              apiUrl={apiUrl}
              data={data}
              setData={setData}
              inputValue={inputValue}
              setInputValue={setInputValue}
              post={selectedPost}
              auth={auth}
              setSelectedPost={setSelectedPost}
              onClose={() => {
                setIsModalOpen(false);
                toggleBodyScroll(false);
              }}
              toggleLike={toggleLike}
            />
          )}

          {data &&
            data.map((item, index) => (
              <article className="post" key={index}>
                <h2 className="post__username">{item.user.username}</h2>
                <p className="post__content">{item.content}</p>
                <img className="post__image" src={item.signedImageUrl} alt="" />
                <div className="post__stadistics">
                  <span className="post__comment-quantity">
                    Likes {item.likes.length}{" "}
                  </span>
                  <span className="post__comment-quantity">
                    Comments {item.comments.length}{" "}
                  </span>
                </div>
                <div className="post__buttons">
                  {item.hasLiked ? (
                    <button
                      className="post__button post__button--liked"
                      onClick={() => toggleLike("unlike", item._id)}
                    >
                      Me gusta
                    </button>
                  ) : (
                    <button
                      className="post__button"
                      onClick={() => toggleLike("like", item._id)}
                    >
                      Me gusta
                    </button>
                  )}
                  <button
                    className="post__button"
                    onClick={() => {
                      openModal(item);
                    }}
                  >
                    Comentarios
                  </button>
                </div>
              </article>
            ))}
        </section>
        <FriendsSidebar />
      </main>
    </div>
  );
}

const Modal = ({
  apiUrl,
  data,
  setData,
  post,
  onClose,
  auth,
  setSelectedPost,
  inputValue,
  setInputValue,
  toggleLike,
}) => {
  if (!post) return null;

  function handleChangeInput(e) {
    setInputValue(e.target.value);
  }

  function onSubmit() {
    if (inputValue.length === 0) return;

    fetch(`${apiUrl}/api/posts/${post._id}/comments`, {
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
        const updatedSelectedPost = {
          ...post,
          comments: [...post.comments, newComment],
        };
        setSelectedPost(updatedSelectedPost);

        const updatedPosts = data.map((postItem) => {
          if (postItem._id === post._id) {
            return updatedSelectedPost;
          }
          return postItem;
        });

        // Actualiza el estado global de los posts
        setData(updatedPosts);
        setInputValue("");
      })
      .catch((error) =>
        console.error("Error al agregar el comentario:", error)
      );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <article className="modal_post">
          <div className="modal-header">
            <h2 className="post__username">{post.user.username}</h2>
            <FontAwesomeIcon
              icon={faTimes}
              className="modal-close-icon"
              onClick={onClose}
            />
          </div>
          <p className="post__content">{post.content}</p>
          {post.signedImageUrl && (
            <img className="post__image" src={post.signedImageUrl} alt="Post" />
          )}
          <div className="post__stadistics">
            <span className="post__comment-quantity">
              Likes {post.likes.length}{" "}
            </span>
            <span className="post__comment-quantity">
              Comments {post.comments.length}{" "}
            </span>
          </div>
          <div className="comments__container">
            {post.comments &&
              post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <strong className="comment__username">
                    {comment.user.username}:{" "}
                  </strong>
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
            {post.hasLiked ? (
              <button
                className="post__button post__button--liked"
                onClick={() => toggleLike("unlike", post._id)}
              >
                Me gusta
              </button>
            ) : (
              <button
                className="post__button"
                onClick={() => toggleLike("like", post._id)}
              >
                Me gusta
              </button>
            )}
            <button className="post__button" onClick={onClose}>
              Cerrar
            </button>
          </div>

          <div className="input__box">
            <input
              className="input__box__comment"
              type="text"
              value={inputValue}
              placeholder="Escribe un comentario"
              onChange={(e) => handleChangeInput(e)}
            />
            <button
              className="input__box__send-button"
              onClick={() => onSubmit()}
            >
              Enviar
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};
Modal.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    hasLiked: PropTypes.bool.isRequired,
    image: PropTypes.string,
    signedImageUrl: PropTypes.string,

    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
    likes: PropTypes.arrayOf(PropTypes.string.isRequired),

    comments: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
        }).isRequired,
      })
    ),
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      hasLiked: PropTypes.bool.isRequired,
      image: PropTypes.string,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
      }),
      likes: PropTypes.arrayOf(PropTypes.string),
      comments: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          user: PropTypes.shape({
            username: PropTypes.string.isRequired,
          }),
        })
      ),
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    })
  ).isRequired,

  auth: PropTypes.shape({
    token: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  setSelectedPost: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
  toogleLike: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  apiUrl: PropTypes.string.isRequired,
};
