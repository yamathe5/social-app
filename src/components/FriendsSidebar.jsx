import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth";
// import { jwtDecode as jwt_decode } from "jwt-decode";
import "./FriendsSidebar.css"
import { Link } from "react-router-dom";
export default function FriendsSidebar() {
  const [friends, setFriends] = useState([]);

  const { auth } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {

    const baseUrl = `${apiUrl}/api`;
    fetch(`${baseUrl}/friends`,
  {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  })
      .then((response) => response.json())
      .then((data) => {
        setFriends(data.friends);
      })
      .catch((error) => console.error("Error fetching friends:", error));

  }, [apiUrl, auth.token]);

  return (
    <aside className="feed__friends">
      <h3 className="feed__friends-title">Friends</h3>
      <div className="feed__friends-section">
        <ul className="feed__friends-list">
        {friends &&
        friends.slice(0, 5).map((friend, index) => (
          <li key={index} className="feed__friends-item">
            <Link to={`/user/${friend.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {friend.username}
            </Link>
          </li>
        ))}
        </ul>
      </div>
      
    </aside>
  );
}
