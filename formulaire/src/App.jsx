import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Connexion from "./components/Connexion";
import Dash from "./components/dash";

function Users() {
  return (

    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-300">

        <Routes>
          {/* 🚀 Redirection automatique vers /login */}
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/dash" element={<Dash />} />
        </Routes>

      </div>
    </Router>
  );
}

export default Users;
