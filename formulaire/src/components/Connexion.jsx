import React ,{useState} from 'react'

import {  Link ,  useNavigate} from "react-router-dom";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg("");

  try {
      const res = await fetch("http://127.0.0.1:5000/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error);
        return;
      }

      alert(" Connexion réussie !");
      console.log("Données reçues:", data);

      
      if (data.user.admin) {
       
        console.log("Redirection vers /admin");
        navigate("/admin", { state: { user: data.user } });
      } else {
        // Si c'est un utilisateur normal
        console.log("Redirection vers /dash");
        navigate("/dash", { state: { user: data.user } });
      }

    } catch (error) {
      console.error("Erreur serveur :", error);
      setErrorMsg("Impossible de se connecter au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
 <div className=' border bg-white   px-15 py-15  '>
      
       <form onSubmit={handleSubmit} className='space-y-8' method="POST">
      <h1 className='text-4xl font-bold text-center'>
connexion
      </h1>
      
       
        <div className="flex flex-col">
        <label>E-mail</label>
        <input placeholder='entrez votre adresse mail' type="e-mail" value={email}
            onChange={(e) => setEmail(e.target.value)} className="border-2 rounded-md py-1 "/>

        </div>

        <div className="flex flex-col">
         <label>Mot de passe</label>
        <input type='password' className="border-2 rounded-md py-1" value={password}
            onChange={(e) => setPassword(e.target.value)} />
            {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
        </div>
        
        <div className='text-center py-2'>
           <button type="submit" className='border rounded-md bg-black text-white py-3 px-4'  disabled={loading} > 
           {loading ? "Connexion..." : "Se connecter"}</button>
        </div>
        </form>
        <div className='text-center'>
      <Link to="/login" className="mx-2 text-blue-600 ">Inscription</Link>

      <Link to="/passemot" className="mx-2 text-blue-600 ">Mot de passe oublié ?</Link>
      </div>
        </div>

      
      
        
  )}
  export default Connexion;
       





