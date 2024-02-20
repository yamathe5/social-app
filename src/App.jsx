import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PropTypes from "prop-types";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import FeedPage from "./pages/FeedPage"; 
import { useAuth } from "./contexts/auth";
import MyPostPage from "./pages/MyPostsPage";
import ContactsPage from "./pages/ContactsPage";

function App() {
 

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<PublicRoute redirectTo="/feed" element={<LoginPage />} />}
        />
        <Route
          path="/signup"
          element={<PublicRoute redirectTo="/feed" element={<SignupPage />} />}
        />
        <Route
          path="/my-posts"
          element={
            <ProtectedRoute redirectTo="/login" element={<MyPostPage />} />
          }
        />
        <Route
          path="/feed"
          element={
            <ProtectedRoute redirectTo="/login" element={<FeedPage />} />
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute redirectTo="/login" element={<ContactsPage />} />
          }
        />
        
        {/* <Route path="/" element={<Navigate to="/feed" replace />} /> */}
        <Route path="*" element={<div>No encontrada</div>} />

      </Routes>
    </Router>
  );
}


function PublicRoute({ redirectTo, element }) {
  const { auth } = useAuth();

  return !auth.token ? element : <Navigate to={redirectTo} replace />;
}

PublicRoute.propTypes = {
  element: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};
function ProtectedRoute({ redirectTo, element }) {
  const { auth } = useAuth();
  return auth.token ? element : <Navigate to={redirectTo} replace />;
}

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};


export default App;
