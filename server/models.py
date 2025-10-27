from config import db

class Professeur(db.Model):
    __tablename__ = 'professeurs'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    
    # Relations
    cours = db.relationship('Cours', back_populates='professeur', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'cours': [{'id': c.id, 'titre': c.titre} for c in self.cours] if self.cours else []
        }
    
    def __repr__(self):
        return f'<Professeur {self.nom}>'


class Cours(db.Model):
    __tablename__ = 'cours'
    
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(200), nullable=False)
    professeur_id = db.Column(db.Integer, db.ForeignKey('professeurs.id'), nullable=False)
    
    # Relations
    professeur = db.relationship('Professeur', back_populates='cours')
    lecons = db.relationship('Lecon', back_populates='cours', cascade='all, delete-orphan')
    inscriptions = db.relationship('EtudiantCours', back_populates='cours', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'titre': self.titre,
            'professeur_id': self.professeur_id,
            'professeur': {'id': self.professeur.id, 'nom': self.professeur.nom} if self.professeur else None,
            'lecons': [{'id': l.id, 'titre': l.titre} for l in self.lecons] if self.lecons else []
        }
    
    def __repr__(self):
        return f'<Cours {self.titre}>'


class Lecon(db.Model):
    __tablename__ = 'lecons'
    
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(200), nullable=False)
    contenu = db.Column(db.Text)
    cours_id = db.Column(db.Integer, db.ForeignKey('cours.id'), nullable=False)
    
    # Relations
    cours = db.relationship('Cours', back_populates='lecons')
    
    def to_dict(self):
        return {
            'id': self.id,
            'titre': self.titre,
            'contenu': self.contenu,
            'cours_id': self.cours_id,
            'cours': {'id': self.cours.id, 'titre': self.cours.titre} if self.cours else None
        }
    
    def __repr__(self):
        return f'<Lecon {self.titre}>'


class Etudiant(db.Model):
    __tablename__ = 'etudiants'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    
    # Relations
    inscriptions = db.relationship('EtudiantCours', back_populates='etudiant', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'inscriptions': [{'id': i.id, 'cours_id': i.cours_id, 'progression': i.progression} for i in self.inscriptions] if self.inscriptions else []
        }
    
    def __repr__(self):
        return f'<Etudiant {self.nom}>'


class EtudiantCours(db.Model):
    __tablename__ = 'etudiant_cours'
    
    id = db.Column(db.Integer, primary_key=True)
    etudiant_id = db.Column(db.Integer, db.ForeignKey('etudiants.id'), nullable=False)
    cours_id = db.Column(db.Integer, db.ForeignKey('cours.id'), nullable=False)
    progression = db.Column(db.Integer, default=0)
    
    # Relations
    etudiant = db.relationship('Etudiant', back_populates='inscriptions')
    cours = db.relationship('Cours', back_populates='inscriptions')
    
    def to_dict(self):
        return {
            'id': self.id,
            'etudiant_id': self.etudiant_id,
            'cours_id': self.cours_id,
            'progression': self.progression,
            'etudiant': {'id': self.etudiant.id, 'nom': self.etudiant.nom} if self.etudiant else None,
            'cours': {'id': self.cours.id, 'titre': self.cours.titre} if self.cours else None
        }
    
    def __repr__(self):
        return f'<EtudiantCours etudiant_id={self.etudiant_id} cours_id={self.cours_id}>'