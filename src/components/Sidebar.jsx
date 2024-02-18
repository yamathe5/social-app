import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faBookmark, faUserFriends, faCog, faSignOutAlt, faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";

const Sidebar = () => {
    const navigate = useNavigate();
    const {logout} = useAuth()
  
    return (
      <aside className="feed__sidebar">
        <button className="feed__button" onClick={() => navigate('/feed')}>
          <FontAwesomeIcon className="feed__icon" icon={faHouse} /> Feed
        </button>
        <button className="feed__button" onClick={() => navigate('/my-posts')}>
          <FontAwesomeIcon className="feed__icon" icon={faPenToSquare} /> Mis posts
        </button>
        <button className="feed__button" onClick={() => navigate('/saved-posts')}>
          <FontAwesomeIcon className="feed__icon" icon={faBookmark} /> Post guardados
        </button>
        <button className="feed__button" onClick={() => navigate('/contacts')}>
          <FontAwesomeIcon className="feed__icon" icon={faUserFriends} /> Mis contactos
        </button>
        <button className="feed__button" onClick={() => navigate('/settings')}>
          <FontAwesomeIcon className="feed__icon" icon={faCog} /> Configuraciones
        </button>
        <button className="feed__button" onClick={() => {
          logout( )
          navigate('/login');
        }}>
          <FontAwesomeIcon className="feed__icon" icon={faSignOutAlt} /> Salir
        </button>
      </aside>
    );
  };
  
export default Sidebar;
