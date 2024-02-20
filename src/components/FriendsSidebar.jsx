import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function FriendsSidebar() {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const { auth } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    // Reemplaza 'userId' con el ID real del usuario si es necesario

    const decoded = jwt_decode(auth.token);
    const baseUrl = `${apiUrl}/api/${decoded.id}`;
    // Llamada a la API para obtener seguidores
    fetch(`${baseUrl}/followers`)
      .then((response) => response.json())
      .then((data) => {
        setFollowers(data);
      })
      .catch((error) => console.error("Error fetching followers:", error));

    // Llamada a la API para obtener seguidos
    fetch(`${baseUrl}/following`)
      .then((response) => response.json())
      .then((data) => {
        setFollowing(data);
      })
      .catch((error) => console.error("Error fetching following:", error));
  }, [auth.token]);

  return (
    <aside className="feed__friends">
      <h3 className="feed__friends-title">Friends</h3>
      <div className="feed__friends-section">
        <h4>Followers</h4>
        <ul className="feed__friends-list">
          {followers &&
            followers.slice(0, 5).map((follower, index) => (
              <li key={index} className="feed__friends-item">
                {follower.followerId.username}
              </li>
            ))}
        </ul>
      </div>
      <div className="feed__friends-section">
        <h4>Following</h4>
        <ul className="feed__friends-list">
          {following &&
            following.slice(0, 5).map((follow, index) => (
              <li key={index} className="feed__friends-item">
                {follow.followingId.username}
              </li>
            ))}
        </ul>
      </div>
    </aside>
  );
}
