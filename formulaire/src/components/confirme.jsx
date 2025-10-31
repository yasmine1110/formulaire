import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Confirme() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
    setMessage("❌ Les mots de passe ne correspondent pas !");
    return;
  }

  if (!email) {
    setMessage("❌ Aucune adresse email trouvée. Veuillez recommencer.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/confirme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, new_password: newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("✅ Mot de passe modifié avec succès !");
      localStorage.removeItem("resetEmail");
      setTimeout(() => navigate("/connexion"), 1500);
    } else {
      setMessage(`❌ ${data.error}`);
    }
  
  } catch (error) {
    setMessage("Erreur de connexion au serveur.");
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f7f7]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center text-[#242161]">
          Nouveau mot de passe
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 mb-3 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Confirmez le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mb-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#242161] text-white py-2 rounded-lg hover:bg-[#3b3990]"
          >
            Confirmer
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}

export default Confirme;
