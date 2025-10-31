import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Connexion from "./components/Connexion";
import Dash from "./components/dash";
import  Admin from "./components/admin";
import Passemot from "./components/passemot"
import Verifie from "./components/verifie"
import Confirme from "./components/confirme"

import Changer from "./components/changer"

function Users() {
  return (

    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center ">

        <Routes>
          
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/dash" element={<Dash />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/passemot" element={<Passemot />} />
          <Route path="/verifie" element={<Verifie />} />
          <Route path="/confirme" element={<Confirme />} />
          <Route path="/changer" element={<Changer />} />
        </Routes>

      </div>

    </Router>
  );
}

export default Users;
