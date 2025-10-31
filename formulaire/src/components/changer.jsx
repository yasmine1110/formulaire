import React, { useState } from "react";

function Changer() {
  const [ancienMotdp, setAncienMotdp] = useState("");
  const [nouveauMotdp, setNouveauMotdp] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email"); // récupère l'email stocké à la connexion

    if (!email) {
      setMessage("Erreur : email non trouvé. Veuillez vous reconnecter.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/changer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ancienMotdp,
          nouveauMotdp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Mot de passe changé avec succès ✅");
        setAncienMotdp("");
        setNouveauMotdp("");
      } else {
        setMessage(data.error || "Une erreur est survenue ❌");
      }
    } catch (error) {
      setMessage("Erreur de connexion au serveur ❌");
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-2xl p-6 w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Changer le mot de passe
        </h1>

        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Ancien mot de passe"
            value={ancienMotdp}
            onChange={(e) => setAncienMotdp(e.target.value)}
            className="border w-full p-2 mb-3 rounded"
            required
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={nouveauMotdp}
            onChange={(e) => setNouveauMotdp(e.target.value)}
            className="border w-full p-2 mb-3 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </>
  );
}

export default Changer;
