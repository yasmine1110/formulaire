import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dash() {
  const [etudiants, setEtudiants] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nometd: "",
    emailetd: "",
    numetd: "",
    motdp: ""
  });

  // Charger les étudiants depuis le backend
  useEffect(() => {
    fetch("http://localhost:5000/dash")
      .then((res) => res.json())
      .then((data) => setEtudiants(data))
      .catch((err) => console.error("Erreur chargement :", err));
  }, []);

  // Supprimer un étudiant
  const handleDelete = async (idetd) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet étudiant ?")) return;

    const res = await fetch(`http://localhost:5000/dash/${idetd}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setEtudiants(etudiants.filter((e) => e.idetd !== idetd));
    } else {
      console.error("Erreur suppression");
    }
  };

  // Passer en mode édition
  const handleEdit = (etudiant) => {
    setEditing(etudiant.idetd);
    setFormData({
      nometd: etudiant.nometd,
      emailetd: etudiant.emailetd,
      numetd: etudiant.numetd,
      motdp: etudiant.motdp
    });
  };

  // Sauvegarder la modification
  const handleSave = async (idetd) => {
    const res = await fetch(`http://localhost:5000/dash/${idetd}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setEtudiants(
        etudiants.map((e) =>
          e.idetd === idetd
            ? { ...e, ...formData }
            : e
        )
      );
      setEditing(null);
    } else {
      console.error("Erreur modification");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <nav className="flex justify-between items-center bg-blue-600 p-4 rounded-lg mb-6 shadow-md">
        <h1 className="text-xl text-white font-bold">Dashboard - Étudiants</h1>
        <Link
          to="/connexion"
          className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100"
        >
          Déconnexion
        </Link>
      </nav>

      <table className="w-full bg-white border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3 border">Nom</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Numéro</th>
            <th className="p-3 border">Mot de passe</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {etudiants.map((etudiant) => (
            <tr key={etudiant.idetd} className="border">
              <td className="p-3 border">
                {editing === etudiant.idetd ? (
                  <input
                    value={formData.nometd}
                    onChange={(e) =>
                      setFormData({ ...formData, nometd: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  etudiant.nometd
                )}
              </td>

              <td className="p-3 border">
                {editing === etudiant.idetd ? (
                  <input
                    value={formData.emailetd}
                    onChange={(e) =>
                      setFormData({ ...formData, emailetd: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  etudiant.emailetd
                )}
              </td>

              <td className="p-3 border">
                {editing === etudiant.idetd ? (
                  <input
                    value={formData.numetd}
                    onChange={(e) =>
                      setFormData({ ...formData, numetd: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  etudiant.numetd
                )}
              </td>

              <td className="p-3 border">
                {editing === etudiant.idetd ? (
                  <input
                    type="password"
                    value={formData.motdp}
                    onChange={(e) =>
                      setFormData({ ...formData, motdp: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  etudiant.motdp
                )}
              </td>

              <td className="p-3 border text-center">
                {editing === etudiant.idetd ? (
                  <button
                    onClick={() => handleSave(etudiant.idetd)}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Enregistrer
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(etudiant)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Modifier
                  </button>
                )}
                <button
                  onClick={() => handleDelete(etudiant.idetd)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dash;
