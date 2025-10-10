from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)  # Autoriser toutes les requêtes venant du frontend

# Config MySQL
db = mysql.connector.connect(
    host="localhost",       
    user="root",          
    password="",    
    database="form"      
)


cursor = db.cursor(dictionary=True)

@app.route("/Login", methods=["POST"])
def Login ():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    num = data.get("num")
    password = data.get("password")

    if not name or not email or not num or not password:
        return jsonify({"error": "Tous les champs sont obligatoires"}), 400

    

    cursor.execute(
        " INSERT INTO etudiant (nometd, emailetd, numetd, motdp) VALUES (%s, %s, %s, %s)",
        (name, email, num, password)
    )
    db.commit()
    return jsonify({"message": "Inscription réussie"}), 200

cursor = db.cursor(dictionary=True)

@app.route("/connexion", methods=["POST"])
def connexion():
    data = request.json
    email1 = data.get("email")
    password1 = data.get("password")
    num = data.get("num")
    password = data.get("password")

    if not email1 or not password1:
        return jsonify({"error": "Veuillez remplir tous les champs"}), 400

    cursor.execute("SELECT * FROM etudiant WHERE emailetd = %s", (email1,))
    user = cursor.fetchone()

    if not user or user["motdp"] != password1:
        return jsonify({"error": "Email ou mot de passe incorrect"}), 401

    return jsonify({
        "message": "Connexion réussie",
        "user": {
            "id": user["idetd"],
            "name": user["nometd"],
            "email": user["emailetd"]
        }
    }), 200



cursor = db.cursor(dictionary=True)

# Récupérer tous les étudiants


@app.route("/dash", methods=["GET"])
def get_etudiants():
    cursor.execute("SELECT * FROM etudiant")
    users = cursor.fetchall()
    return jsonify(users)

# --- Modifier un étudiant ---
@app.route("/dash/<int:id>", methods=["PUT"])
def update_etudiant(id):
    data = request.get_json(force=True)

    # Les noms doivent correspondre à ceux envoyés depuis le frontend
    nom = data.get("nometd")
    email = data.get("emailetd")
    num = data.get("numetd")
    password = data.get("motdp")

    if not nom or not email:
        return jsonify({"error": "Champs manquants"}), 400

    cursor.execute(
        "UPDATE etudiant SET nometd=%s, emailetd=%s, numetd=%s, motdp=%s WHERE idetd=%s",
        (nom, email, num, password, id)
    )
    db.commit()

    return jsonify({"message": "Étudiant modifié avec succès"})


@app.route("/dash/<int:id>", methods=["DELETE"])
def delete_etudiant(id):
    cursor.execute("DELETE FROM etudiant WHERE idetd=%s", (id,))
    db.commit()
    return jsonify({"message": "Étudiant supprimé avec succès"})

if __name__ == "__main__":
    app.run(debug=True)