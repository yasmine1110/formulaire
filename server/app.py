from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import random, os
import sib_api_v3_sdk

from sib_api_v3_sdk.rest import ApiException

import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)

# Connexion MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="form"
)
cursor = db.cursor(dictionary=True)

# Admin par défaut
ADMIN_EMAIL = "mariam@2gmail.com"
ADMIN_PASSWORD = "123456"

# -------------------------------
# 🔹 Inscription d’un utilisateur
# -------------------------------
@app.route("/Login", methods=["POST"])
def Login():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    num = data.get("num")
    password = data.get("password")

    if not name or not email or not num or not password:
        return jsonify({"error": "Tous les champs sont obligatoires"}), 400

    cursor.execute("SELECT * FROM etudiant WHERE emailetd = %s", (email,))
    if cursor.fetchone():
        return jsonify({"error": "Cet email existe déjà"}), 400

    cursor.execute(
        "INSERT INTO etudiant (nometd, emailetd, numetd, motdp) VALUES (%s, %s, %s, %s)",
        (name, email, num, password)
    )
    db.commit()
    return jsonify({"message": "Inscription réussie"}), 200

# -------------------------------
# 🔹 Connexion (admin ou utilisateur)
# -------------------------------
@app.route("/connexion", methods=["POST"])
def connexion():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Veuillez remplir tous les champs"}), 400

    # Vérifier si admin
    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        return jsonify({
            "message": "Connexion admin réussie",
            "user": {"id": 0, "name": "Administrateur", "email": ADMIN_EMAIL, "admin": True}
        }), 200

    # Sinon utilisateur
    cursor.execute("SELECT * FROM etudiant WHERE emailetd = %s", (email,))
    user = cursor.fetchone()

    if not user or user["motdp"] != password:
        return jsonify({"error": "Email ou mot de passe incorrect"}), 401

    return jsonify({
        "message": "Connexion réussie",
        "user": {
            "id": user["idetd"],
            "name": user["nometd"],
            "email": user["emailetd"],
            "admin": False
        }
    }), 200

# -------------------------------
# 🔹 Afficher tous les étudiants
# -------------------------------
@app.route("/dash", methods=["GET"])
def get_etudiants():
    search = request.args.get('search', '')
    if search:
        cursor.execute("SELECT * FROM etudiant WHERE nometd LIKE %s OR emailetd LIKE %s",
                       (f'%{search}%', f'%{search}%'))
    else:
        cursor.execute("SELECT * FROM etudiant")
    users = cursor.fetchall()
    return jsonify(users)

# -------------------------------
# 🔹 Ajouter un étudiant depuis Admin.jsx
# -------------------------------
@app.route("/dash", methods=["POST"])
def add_etudiant():
    try:
        data = request.get_json(force=True)
        nometd = data.get("nometd")
        emailetd = data.get("emailetd")
        numetd = data.get("numetd")
        motdp = data.get("motdp")

        if not nometd or not emailetd or not numetd or not motdp:
            return jsonify({"error": "Tous les champs sont obligatoires"}), 400

        cursor.execute("SELECT * FROM etudiant WHERE emailetd = %s", (emailetd,))
        if cursor.fetchone():
            return jsonify({"error": "Cet email est déjà utilisé"}), 400

        cursor.execute(
            "INSERT INTO etudiant (nometd, emailetd, numetd, motdp) VALUES (%s, %s, %s, %s)",
            (nometd, emailetd, numetd, motdp)
        )
        db.commit()

        new_id = cursor.lastrowid
        cursor.execute("SELECT * FROM etudiant WHERE idetd = %s", (new_id,))
        new_user = cursor.fetchone()

        return jsonify(new_user), 201

    except Exception as e:
        print(f"❌ Erreur ajout: {e}")
        db.rollback()
        return jsonify({"error": "Erreur lors de l'ajout de l'utilisateur"}), 500

# -------------------------------
# 🔹 Modifier un étudiant
# -------------------------------
@app.route("/dash/<int:id>", methods=["PUT"])
def update_etudiant(id):
    data = request.get_json(force=True)
    nom = data.get("nometd")
    email = data.get("emailetd")
    num = data.get("numetd")
    password = data.get("motdp")

    if not nom or not email:
        return jsonify({"error": "Le nom et l'email sont obligatoires"}), 400

    cursor.execute("SELECT * FROM etudiant WHERE idetd = %s", (id,))
    if not cursor.fetchone():
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    if password:
        cursor.execute(
            "UPDATE etudiant SET nometd=%s, emailetd=%s, numetd=%s, motdp=%s WHERE idetd=%s",
            (nom, email, num, password, id)
        )
    else:
        cursor.execute(
            "UPDATE etudiant SET nometd=%s, emailetd=%s, numetd=%s WHERE idetd=%s",
            (nom, email, num, id)
        )

    db.commit()
    cursor.execute("SELECT * FROM etudiant WHERE idetd = %s", (id,))
    return jsonify(cursor.fetchone())

# -------------------------------
# 🔹 Supprimer un étudiant
# -------------------------------
@app.route("/dash/<int:id>", methods=["DELETE"])
def delete_etudiant(id):
    cursor.execute("SELECT * FROM etudiant WHERE idetd = %s", (id,))
    if not cursor.fetchone():
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    cursor.execute("DELETE FROM etudiant WHERE idetd=%s", (id,))
    db.commit()
    return jsonify({"message": "Étudiant supprimé avec succès"}), 200

# Config Brevo (ou SMTP si tu veux)
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

# stockage temporaire des codes
reset_codes = {}  # email -> code

# Inscription (stocke mot de passe en clair)
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    num = data.get("num")
    password = data.get("password")
    if not name or not email or not password:
        return jsonify({"error":"Champs manquants"}), 400

    cursor.execute("SELECT * FROM etudiant WHERE emailetd=%s", (email,))
    if cursor.fetchone():
        return jsonify({"error":"Email déjà utilisé"}), 400

    cursor.execute(
        "INSERT INTO etudiant (nometd, emailetd, numetd, motdp) VALUES (%s,%s,%s,%s)",
        (name, email, num, password)
    )
    db.commit()
    return jsonify({"message":"Inscription OK"}), 201




# Stockage temporaire des codes
reset_codes = {}

# Config Gmail (compte qui envoie les mails)
GMAIL_USER = "yasminemariamd@gmail.com"       # <-- ton email Gmail
GMAIL_PASSWORD = "godhNftkdycbdfmn"     # <-- mot de passe d'application Gmail

@app.route("/passemot", methods=["POST"])
def send_reset_code():
    data = request.get_json()
    email = data.get("email")
    
    if not email:
        return jsonify({"error": "Email requis"}), 400

    # Vérifier si l'utilisateur existe dans la DB
    cursor.execute("SELECT * FROM etudiant WHERE emailetd=%s", (email,))
    user = cursor.fetchone()
    if not user:
        return jsonify({"error": "Aucun compte trouvé"}), 404

    # Générer un code aléatoire à 6 chiffres
    code = str(random.randint(100000, 999999))
    reset_codes[email] = code
    print(f"[DEBUG] Code pour {email}: {code}")  # utile pour debug

    # Contenu du mail
    subject = "Réinitialisation de votre mot de passe"
    content = f"Bonjour {user['nometd']},\n\nVotre code de réinitialisation est : {code}\n\nMerci."

    # Préparer le mail
    msg = MIMEText(content)
    msg['Subject'] = subject
    msg['From'] = GMAIL_USER
    msg['To'] = email

    try:
        # Connexion au serveur SMTP Gmail
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(GMAIL_USER, GMAIL_PASSWORD)
            server.sendmail(GMAIL_USER, [email], msg.as_string())

        return jsonify({"message": "Code envoyé à votre email"}), 200

    except Exception as e:
        print("Erreur envoi mail:", e)
        return jsonify({"error": "Impossible d'envoyer le mail. Vérifiez vos identifiants Gmail"}), 500

# Vérifier code
@app.route("/verifie", methods=["POST"])
def verify_code():
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")
    if reset_codes.get(email) == code:
        return jsonify({"message":"Code vérifié"}), 200
    return jsonify({"error":"Code invalide"}), 400

# Changer mot de passe (en clair)
@app.route("/confirme", methods=["POST"])
def changer_motdepasse():
    data = request.get_json()
    email = data.get("email")
    new_password = data.get("new_password")
    if not email or not new_password:
        return jsonify({"error":"Champs manquants"}), 400

    cursor.execute("UPDATE etudiant SET motdp=%s WHERE emailetd=%s", (new_password, email))
    db.commit()
    reset_codes.pop(email, None)
    return jsonify({"message":"Mot de passe mis à jour"}), 200

@app.route("/changer", methods=["POST"])
def change_password():
    data = request.get_json()
    email = data.get("email")
    nouveauMotdp = data.get("nouveauMotdp")

    if not email or not nouveauMotdp:
        return jsonify({"error": "Champs manquants"}), 400

    # Vérifie que l'utilisateur existe
    cursor.execute("SELECT * FROM etudiant WHERE emailetd = %s", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404

    # Met à jour le mot de passe
    cursor.execute(
        "UPDATE etudiant SET motdp = %s WHERE emailetd = %s",
        (nouveauMotdp, email),
    )
    db.commit()

    return jsonify({"message": "Mot de passe mis à jour avec succès ✅"}), 200
 
if __name__ == "__main__":
    app.run(debug=True)

        
   