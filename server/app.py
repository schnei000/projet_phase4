from flask import Flask, request, jsonify
from flask_cors import CORS

# Créer l'application Flask d'abord
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Ensuite importer db et migrate
from config import db, migrate

# Initialiser les extensions
db.init_app(app)
migrate.init_app(app, db)
CORS(app)

# Importer les modèles APRÈS l'initialisation de db
from models import Professeur, Cours, Lecon, Etudiant, EtudiantCours


# ------------------------
#   ROUTES PROFESSEURS
# ------------------------
@app.route('/api/professeurs', methods=['GET', 'POST'])
def professeurs():
    if request.method == 'GET':
        profs = Professeur.query.all()
        return jsonify([p.to_dict() for p in profs]), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        try:
            prof = Professeur(nom=data['nom'])
            db.session.add(prof)
            db.session.commit()
            return jsonify(prof.to_dict()), 201
        except Exception as e:
            return jsonify({'erreur': str(e)}), 400

@app.route('/api/professeurs/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def professeur_detail(id):
    prof = Professeur.query.get(id)
    if not prof:
        return jsonify({'erreur': 'Professeur non trouvé'}), 404
    
    if request.method == 'GET':
        return jsonify(prof.to_dict()), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        prof.nom = data.get('nom', prof.nom)
        db.session.commit()
        return jsonify(prof.to_dict()), 200
    
    elif request.method == 'DELETE':
        db.session.delete(prof)
        db.session.commit()
        return jsonify({'message': 'Professeur supprimé'}), 204


# ------------------------
#   ROUTES COURS
# ------------------------
@app.route('/api/cours', methods=['GET', 'POST'])
def cours():
    if request.method == 'GET':
        all_cours = Cours.query.all()
        return jsonify([c.to_dict() for c in all_cours]), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        try:
            nouveau_cours = Cours(titre=data['titre'], professeur_id=data['professeur_id'])
            db.session.add(nouveau_cours)
            db.session.commit()
            return jsonify(nouveau_cours.to_dict()), 201
        except Exception as e:
            return jsonify({'erreur': str(e)}), 400

@app.route('/api/cours/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def cours_detail(id):
    cours_item = Cours.query.get(id)
    if not cours_item:
        return jsonify({'erreur': 'Cours non trouvé'}), 404
    
    if request.method == 'GET':
        return jsonify(cours_item.to_dict()), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        cours_item.titre = data.get('titre', cours_item.titre)
        cours_item.professeur_id = data.get('professeur_id', cours_item.professeur_id)
        db.session.commit()
        return jsonify(cours_item.to_dict()), 200
    
    elif request.method == 'DELETE':
        db.session.delete(cours_item)
        db.session.commit()
        return jsonify({'message': 'Cours supprimé'}), 204


# ------------------------
#   ROUTES ETUDIANTS
# ------------------------
@app.route('/api/etudiants', methods=['GET', 'POST'])
def etudiants():
    if request.method == 'GET':
        all_etudiants = Etudiant.query.all()
        return jsonify([e.to_dict() for e in all_etudiants]), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        try:
            etudiant = Etudiant(nom=data['nom'])
            db.session.add(etudiant)
            db.session.commit()
            return jsonify(etudiant.to_dict()), 201
        except Exception as e:
            return jsonify({'erreur': str(e)}), 400

@app.route('/api/etudiants/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def etudiant_detail(id):
    etudiant = Etudiant.query.get(id)
    if not etudiant:
        return jsonify({'erreur': 'Étudiant non trouvé'}), 404
    
    if request.method == 'GET':
        return jsonify(etudiant.to_dict()), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        etudiant.nom = data.get('nom', etudiant.nom)
        db.session.commit()
        return jsonify(etudiant.to_dict()), 200
    
    elif request.method == 'DELETE':
        db.session.delete(etudiant)
        db.session.commit()
        return jsonify({'message': 'Étudiant supprimé'}), 204


# ------------------------
#   ROUTES LECONS
# ------------------------
@app.route('/api/lecons', methods=['GET', 'POST'])
def lecons():
    if request.method == 'GET':
        all_lecons = Lecon.query.all()
        return jsonify([l.to_dict() for l in all_lecons]), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        try:
            lecon = Lecon(titre=data['titre'], contenu=data.get('contenu', ''), cours_id=data['cours_id'])
            db.session.add(lecon)
            db.session.commit()
            return jsonify(lecon.to_dict()), 201
        except Exception as e:
            return jsonify({'erreur': str(e)}), 400

@app.route('/api/lecons/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def lecon_detail(id):
    lecon = Lecon.query.get(id)
    if not lecon:
        return jsonify({'erreur': 'Leçon non trouvée'}), 404
    
    if request.method == 'GET':
        return jsonify(lecon.to_dict()), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        lecon.titre = data.get('titre', lecon.titre)
        lecon.contenu = data.get('contenu', lecon.contenu)
        lecon.cours_id = data.get('cours_id', lecon.cours_id)
        db.session.commit()
        return jsonify(lecon.to_dict()), 200
    
    elif request.method == 'DELETE':
        db.session.delete(lecon)
        db.session.commit()
        return jsonify({'message': 'Leçon supprimée'}), 204


# ------------------------
#   ROUTES ETUDIANT-COURS
# ------------------------
@app.route('/api/etudiant-cours', methods=['GET', 'POST'])
def etudiant_cours():
    if request.method == 'GET':
        inscriptions = EtudiantCours.query.all()
        return jsonify([ec.to_dict() for ec in inscriptions]), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        try:
            inscription = EtudiantCours(
                etudiant_id=data['etudiant_id'],
                cours_id=data['cours_id'],
                progression=data.get('progression', 0)
            )
            db.session.add(inscription)
            db.session.commit()
            return jsonify(inscription.to_dict()), 201
        except Exception as e:
            return jsonify({'erreur': str(e)}), 400

@app.route('/api/etudiant-cours/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def etudiant_cours_detail(id):
    inscription = EtudiantCours.query.get(id)
    if not inscription:
        return jsonify({'erreur': 'Inscription non trouvée'}), 404
    
    if request.method == 'GET':
        return jsonify(inscription.to_dict()), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        inscription.progression = data.get('progression', inscription.progression)
        db.session.commit()
        return jsonify(inscription.to_dict()), 200
    
    elif request.method == 'DELETE':
        db.session.delete(inscription)
        db.session.commit()
        return jsonify({'message': 'Inscription supprimée'}), 204


if __name__ == '__main__':
    # Afficher toutes les routes disponibles
    print("\n" + "="*50)
    print("📋 ROUTES API DISPONIBLES:")
    print("="*50)
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static':
            methods = ', '.join(rule.methods - {'HEAD', 'OPTIONS'})
            print(f"  {rule.rule:40} [{methods}]")
    print("="*50 + "\n")
    
    print("🚀 Serveur Flask démarré sur http://localhost:5000")
    print("✅ Testez : http://localhost:5000/api/cours\n")
    
    # host='0.0.0.0' permet l'accès depuis Windows dans WSL
    app.run(debug=True, host='0.0.0.0', port=5000)