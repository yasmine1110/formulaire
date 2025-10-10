import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [num, setNum] = useState("");
  const [name, setName] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [numError, setNumError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [nameError, setNameError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset des erreurs
    setEmailError("");
    setPasswordError("");
    setNumError("");
    setConfirmError("");
    setNameError("");

    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numRegex = /^[0-9]+$/;
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    if (name === "" || !nameRegex.test(name)) {
      setNameError("Le nom et prénom doivent contenir uniquement des lettres.");
      isValid = false;
    }

    if (email === "" || !emailRegex.test(email)) {
      setEmailError("L'email doit contenir un '@' valide.");
      isValid = false;
    }

    if (password === "" || password.length < 6) {
      setPasswordError("Le mot de passe doit avoir au moins 6 caractères.");
      isValid = false;
    }

    if (num === "" || !numRegex.test(num) || num.length !== 10) {
      setNumError("Le numéro doit contenir exactement 10 chiffres.");
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmError("Les mots de passe ne correspondent pas.");
      isValid = false;
    }

    if (!isValid) return;

    // Envoi des données au backend Flask
    fetch("http://127.0.0.1:5000/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, num, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          // Réinitialiser le formulaire
          setName("");
          setEmail("");
          setNum("");
          setPassword("");
          setConfirmPassword("");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className=" bg-white px-15 py-8 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <h1 className="text-4xl font-bold text-center">Formulaire d'inscription</h1>

        <div className="flex flex-col">
          <label>Nom et prénom</label>
          <input
            id="nom"
            placeholder="Entrez votre nom et votre prénom"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 rounded-md py-1 px-1"
            required
          />
          {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
        </div>

        <div className="flex flex-col">
          <label>E-mail</label>
          <input
            id="email"
            placeholder="Entrez votre adresse mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 rounded-md py-1 px-1"
            required
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>

        <div className="flex flex-col">
          <label>Numéro de téléphone</label>
          <input
            type="text"
            id="numero"
            value={num}
            onChange={(e) => setNum(e.target.value)}
            className="border-2 rounded-md py-1"
            required
          />
          {numError && <p className="text-red-500 text-sm">{numError}</p>}
        </div>

        <div className="flex flex-col">
          <label>Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 rounded-md py-1"
            required
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>

        <div className="flex flex-col">
          <label>Confirmer votre mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-2 rounded-md py-1"
            required
          />
          {confirmError && <p className="text-red-500 text-sm">{confirmError}</p>}
        </div>

        <div className="text-center py-2">
          <button type="submit" className="border rounded-md bg-black text-white py-3 px-4">
            Envoyer
          </button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-center">Avez-vous déjà un compte ?</p>
        <Link to="/Connexion" className="mx-2 text-blue-600">
          Connectez-vous
        </Link>
      </div>
    </div>
  );
}

export default Login;

