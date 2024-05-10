import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faUserFriends, faSignOutAlt, faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/auth";

const Sidebar = ({ isMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path;
    }

    const sidebarClass = isMobile ? "feed__sidebar mobile-visible" : "feed__sidebar";

    return (
      <aside className={sidebarClass}>
        <button className={`feed__button ${isActive('/feed') ? 'active' : ''}`} onClick={() => navigate('/feed')}>
          <FontAwesomeIcon className="feed__icon" icon={faHouse} /> Feed
        </button>
        <button className={`feed__button ${isActive('/my-posts') ? 'active' : ''}`} onClick={() => navigate('/my-posts')}>
          <FontAwesomeIcon className="feed__icon" icon={faPenToSquare} /> Mis posts
        </button>
        <button className={`feed__button ${isActive('/contacts') ? 'active' : ''}`} onClick={() => navigate('/contacts')}>
          <FontAwesomeIcon className="feed__icon" icon={faUserFriends} /> Mis contactos
        </button>
        <button className={`feed__button ${isActive('/users') ? 'active' : ''}`} onClick={() => navigate('/users')}>
          <FontAwesomeIcon className="feed__icon" icon={faUserFriends} /> Users
        </button>
        <button className={`feed__button ${isActive('/login') ? 'active' : ''}`} onClick={() => {
          logout()
          navigate('/login');
        }}>
          <FontAwesomeIcon className="feed__icon" icon={faSignOutAlt} /> Salir
        </button>
      </aside>
    );
  };
  
export default Sidebar;
