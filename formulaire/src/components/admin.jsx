import React, { useEffect, useState } from "react";
import {  Link } from "react-router-dom";

function Admin() {

  const [etudiants, setEtudiants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    nometd: "",
    emailetd: "",
    numetd: "",
    motdp: ""
  });

  useEffect(() => {
    fetchEtudiants();
  }, []);

  const fetchEtudiants = async (search = "") => {
    let url = "http://localhost:5000/dash";
    if (search) url += `?search=${encodeURIComponent(search)}`;

    const res = await fetch(url);
    const data = await res.json();
    setEtudiants(data);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/dash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      const addedUser = await res.json();
      setEtudiants([...etudiants, addedUser]);
      setShowAddForm(false);
      setNewUser({ nometd: "", emailetd: "", numetd: "", motdp: "" });
      alert("Étudiant ajouté avec succès ✅");
    } else {
      const errorData = await res.json();
      alert(errorData.error || "Erreur lors de l’ajout ❌");
    }
  };

  const handleEdit = (etudiant) => {
    setEditingId(etudiant.idetd);
    setFormData({ ...etudiant });
  };

  const handleSave = async (id) => {
    const res = await fetch(`http://localhost:5000/dash/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setEtudiants(etudiants.map(e => e.idetd === id ? updatedUser : e));
      setEditingId(null);
      alert("Modifié avec succès ✅");
    } else {
      alert("Erreur lors de la modification ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet étudiant ?")) return;

    const res = await fetch(`http://localhost:5000/dash/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEtudiants(etudiants.filter(e => e.idetd !== id));
      alert("Supprimé avec succès 🗑️");
    } else {
      alert("Erreur lors de la suppression ❌");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEtudiants(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="flex justify-between bg-red-600 p-4 rounded-lg mb-6 shadow-md">
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <Link to="/connexion" className="bg-white text-red-600 px-4 py-2 rounded-lg">Déconnexion</Link>
      </nav>

      <button
        onClick={() => setShowAddForm(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        + Ajouter un utilisateur
      </button>

      {showAddForm && (
         <div className="fixed inset-0 bg-transparent bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4">Nouvel étudiant</h2>
          <form onSubmit={handleAddUser} className="space-y-3">
            <input type="text" placeholder="Nom" value={newUser.nometd}
              onChange={(e) => setNewUser({ ...newUser, nometd: e.target.value })}
              className="border w-full p-2 rounded" required />
            <input type="email" placeholder="Email" value={newUser.emailetd}
              onChange={(e) => setNewUser({ ...newUser, emailetd: e.target.value })}
              className="border w-full p-2 rounded" required />
            <input type="text" placeholder="Numéro" value={newUser.numetd}
              onChange={(e) => setNewUser({ ...newUser, numetd: e.target.value })}
              className="border w-full p-2 rounded" required />
            <input type="password" placeholder="Mot de passe" value={newUser.motdp}
              onChange={(e) => setNewUser({ ...newUser, motdp: e.target.value })}
              className="border w-full p-2 rounded" required />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="bg-gray-400 px-3 py-2 rounded text-white">Annuler</button>
              <button type="submit" className="bg-blue-600 px-3 py-2 rounded text-white">Ajouter</button>
            </div>
          </form>
        </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <input type="text" placeholder="Rechercher..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border flex-1 p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">Chercher</button>
      </form>

      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Nom</th>
            <th className="p-3">Email</th>
            <th className="p-3">Numéro</th>
            <th className="p-3">Mot de passe</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {etudiants.map((e) => (
            <tr key={e.idetd} className="border-t hover:bg-gray-50">
              <td className="p-3">
                {editingId === e.idetd ? (
                  <input value={formData.nometd} onChange={(ev) => setFormData({ ...formData, nometd: ev.target.value })} />
                ) : e.nometd}
              </td>
              <td className="p-3">
                {editingId === e.idetd ? (
                  <input value={formData.emailetd} onChange={(ev) => setFormData({ ...formData, emailetd: ev.target.value })} />
                ) : e.emailetd}
              </td>
              <td className="p-3">
                {editingId === e.idetd ? (
                  <input value={formData.numetd} onChange={(ev) => setFormData({ ...formData, numetd: ev.target.value })} />
                ) : e.numetd}
              </td>
              <td className="p-3">
                {editingId === e.idetd ? (
                  <input type="password" value={formData.motdp} onChange={(ev) => setFormData({ ...formData, motdp: ev.target.value })} />
                ) : "••••••••"}
              </td>
              <td className="p-3 flex gap-2">
                {editingId === e.idetd ? (
                  <>
                    <button onClick={() => handleSave(e.idetd)} className="bg-green-500 px-2 rounded text-white">✓</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-500 px-2 rounded text-white">✗</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(e)} className="bg-blue-500 px-2 rounded text-white">Modifier</button>
                    <button onClick={() => handleDelete(e.idetd)} className="bg-red-500 px-2 rounded text-white">Supprimer</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {etudiants.length === 0 && <p className="text-center text-gray-500 mt-4">Aucun étudiant trouvé</p>}
    </div>
  );
}

export default Admin;
