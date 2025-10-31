
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
 const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  useEffect(() => {
    if (!user) {
      navigate("/connexion");
      return;
    }
    fetchUserData();
  });

  async function fetchUserData() {
    try {
      const res = await fetch(`http://localhost:5000/dash`);
      const data = await res.json();
      const currentUser = data.find(u => u.idetd === user.id);
      setUserData(currentUser);
      setFormData({
        name: currentUser?.nometd || "",
        email: currentUser?.emailetd || "",
        num: currentUser?.numetd || "",
        password: ""
      });
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("❌ Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }
const handleChangePassword = async () => {
  if (!oldPassword || !newPassword) {
    setMessage("❌ Veuillez remplir tous les champs");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/changer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userData.emailetd,
        ancienMotdp: oldPassword,
        nouveauMotdp: newPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Mot de passe changé avec succès !");
      setShowPasswordForm(false);
      setOldPassword("");
      setNewPassword("");
      navigate("/connexion")
    } else {
      setMessage(`❌ ${data.error || "Erreur lors du changement"}`);
    }
  } catch (error) {
    console.error("Erreur:", error);
    setMessage("❌ Erreur de connexion au serveur");
  }
};

  const handleEdit = () => {
    setEditing(true);
    setMessage("");
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: userData?.nometd || "",
      email: userData?.emailetd || "",
      num: userData?.numetd || "",
      password: ""
    });
    setMessage("✅ Modifications annulées");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      setMessage("❌ Le nom et l'email sont obligatoires");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/dash/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nometd: formData.name,
          emailetd: formData.email,
          numetd: formData.num || "",
          motdp: formData.password || userData?.motdp
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserData({
          ...userData,
          nometd: formData.name,
          emailetd: formData.email,
          numetd: formData.num
        });
        setEditing(false);
        setMessage("✅ Informations mises à jour avec succès");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ ${data.error || "Erreur lors de la modification"}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("❌ Erreur de connexion au serveur");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/dash/${user.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("✅ Compte supprimé avec succès");
        navigate("/connexion");
      } else {
        setMessage("❌ Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("❌ Erreur de connexion au serveur");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos informations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      
      <nav className="flex justify-between items-center bg-blue-600 p-4 rounded-lg mb-6 shadow-md">
        <h1 className="text-xl text-white font-bold">Tableau de Bord Utilisateur</h1>
        <div className="flex gap-4 items-center">
          <span className="text-white">Bienvenue, {user.name}</span>
          <Link to="/connexion" className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-gray-100">
            Déconnexion
          </Link>
        </div>
      </nav>

      
      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes("✅") ? "bg-green-100 border border-green-400 text-green-700" : "bg-red-100 border border-red-400 text-red-700"
        }`}>
          {message}
        </div>
      )}
      <div className="my-6">
  <button
    onClick={() => setShowPasswordForm(!showPasswordForm)}
    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
  >
    {showPasswordForm ? "Fermer le formulaire" : "Changer le mot de passe"}
  </button>

  {showPasswordForm && (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="mt-4 bg-white border border-gray-200 p-6 rounded-lg shadow-md max-w-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Modifier votre mot de passe</h3>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleChangePassword}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Enregistrer le nouveau mot de passe
      </button>
      
    </div>
    </div>
  )}
</div>


      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Vos Informations Personnelles</h2>
            
            
            {!editing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium flex items-center gap-2"
                >
                  <span>✏️</span>
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium flex items-center gap-2"
                >
                  <span>🗑️</span>
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-medium flex items-center gap-2"
                >
                  <span>💾</span>
                  Enregistrer
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-medium flex items-center gap-2"
                >
                  <span>❌</span>
                  Annuler
                </button>
              </div>
            )}
          </div>
          
          {userData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             
              <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-blue-600">Informations de base</h3>
                  
                 
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded border text-gray-800">
                        {userData.nometd}
                      </div>
                    )}
                  </div>

               
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded border text-gray-800">
                        {userData.emailetd}
                      </div>
                    )}
                  </div>

                
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone</label>
                    {editing ? (
                      <input
                        type="text"
                        name="num"
                        value={formData.num}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Optionnel"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded border text-gray-800">
                        {userData.numetd || "Non renseigné"}
                      </div>
                    )}
                  </div>

                  
                  
                </div>
              </div>
              
             
              <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-lg mb-4 text-blue-600">Statut du compte</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Utilisateur:</span>
                      <span className="font-mono font-semibold">#{userData.idetd}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type de compte:</span>
                      <span className="font-semibold text-green-600">Utilisateur normal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dernière connexion:</span>
                      <span className="font-semibold">Maintenant</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <span className="font-semibold text-green-600">✓ Actif</span>
                    </div>
                  </div>
                </div>
                
               

               
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Impossible de charger vos informations.</p>
              <button 
                onClick={fetchUserData}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;