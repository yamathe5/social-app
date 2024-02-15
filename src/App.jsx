import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PropTypes from "prop-types";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import FeedPage from "./pages/FeedPage"; // Asumiendo que tienes un componente FeedPage para el feed de tu red social
import { useAuth } from "./contexts/auth";

function App() {
  const { auth } = useAuth();
  console.log(auth);

  if (!auth) {
    console.log(!auth);
    console.log({});
    console.log(!{});
    console.log("bien");
  }

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
          path="/feed"
          element={
            <ProtectedRoute redirectTo="/login" element={<FeedPage />} />
          }
        />
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />

      </Routes>
    </Router>
  );
}


function PublicRoute({ redirectTo, element }) {
  const { auth } = useAuth();
  return !auth ? element : <Navigate to={redirectTo} replace />;
}

PublicRoute.propTypes = {
  element: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};
function ProtectedRoute({ redirectTo, element }) {
  const { auth } = useAuth();
  return auth ? element : <Navigate to={redirectTo} replace />;
}

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  redirectTo: PropTypes.string.isRequired,
};


export default App;
