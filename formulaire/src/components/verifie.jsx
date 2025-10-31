import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Verifie() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("❌ Aucune adresse email trouvée. Veuillez recommencer.");
      return;
    }

   {
      const response = await fetch("http://localhost:5000/verifie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Code vérifié !");
        setTimeout(() => navigate("/confirme"), 1000);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f7f7]">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center text-[#242161]">
          Vérifiez votre code
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Entrez le code reçu"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 mb-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#242161] text-white py-2 rounded-lg hover:bg-[#3b3990]"
          >
            Vérifier
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}

export default Verifie;
