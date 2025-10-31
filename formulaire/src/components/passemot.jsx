import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Passemot() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    {
      const response = await fetch("http://localhost:5000/passemot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Code envoyé à votre adresse email !");
        localStorage.setItem("resetEmail", email);
        setTimeout(() => navigate("/verifie"), 1500);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f7f7]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center text-[#242161]">
          Réinitialiser le mot de passe
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#242161] text-white py-2 rounded-lg hover:bg-[#3b3990]"
          >
            Envoyer le code
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}

export default Passemot;
