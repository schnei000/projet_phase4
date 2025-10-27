from sqlalchemy_serializer import SerializerMixin
from config import db

class Professeur(db.Model, SerializerMixin):
    __tablename__ = 'professeurs'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    
    # Relations
    cours = db.relationship('Cours', back_populates='professeur', cascade='all, delete-orphan')
    
    # IMPORTANT: Empêcher la récursion infinie
    serialize_rules = ('-cours.professeur',)  # Exclure professeur quand on sérialise cours
    
    def __repr__(self):
        return f'<Professeur {self.nom}>'


class Cours(db.Model, SerializerMixin):
    __tablename__ = 'cours'
    
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(200), nullable=False)
    professeur_id = db.Column(db.Integer, db.ForeignKey('professeurs.id'), nullable=False)
    
    # Relations
    professeur = db.relationship('Professeur', back_populates='cours')
    lecons = db.relationship('Lecon', back_populates='cours', cascade='all, delete-orphan')
    inscriptions = db.relationship('EtudiantCours', back_populates='cours', cascade='all, delete-orphan')
    
    # IMPORTANT: Empêcher la récursion infinie
    serialize_rules = ('-professeur.cours', '-lecons.cours', '-inscriptions.cours')
    
    def __repr__(self):
        return f'<Cours {self.titre}>'


class Lecon(db.Model, SerializerMixin):
    __tablename__ = 'lecons'
    
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(200), nullable=False)
    contenu = db.Column(db.Text)
    cours_id = db.Column(db.Integer, db.ForeignKey('cours.id'), nullable=False)
    
    # Relations
    cours = db.relationship('Cours', back_populates='lecons')
    
    # IMPORTANT: Empêcher la récursion infinie
    serialize_rules = ('-cours.lecons', '-cours.professeur.cours')
    
    def __repr__(self):
        return f'<Lecon {self.titre}>'


class Etudiant(db.Model, SerializerMixin):
    __tablename__ = 'etudiants'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    
    # Relations
    inscriptions = db.relationship('EtudiantCours', back_populates='etudiant', cascade='all, delete-orphan')
    
    # IMPORTANT: Empêcher la récursion infinie
    serialize_rules = ('-inscriptions.etudiant',)
    
    def __repr__(self):
        return f'<Etudiant {self.nom}>'


class EtudiantCours(db.Model, SerializerMixin):
    __tablename__ = 'etudiant_cours'
    
    id = db.Column(db.Integer, primary_key=True)
    etudiant_id = db.Column(db.Integer, db.ForeignKey('etudiants.id'), nullable=False)
    cours_id = db.Column(db.Integer, db.ForeignKey('cours.id'), nullable=False)
    progression = db.Column(db.Integer, default=0)
    
    # Relations
    etudiant = db.relationship('Etudiant', back_populates='inscriptions')
    cours = db.relationship('Cours', back_populates='inscriptions')
    
    
    serialize_rules = ('-etudiant.inscriptions', '-cours.inscriptions', '-cours.professeur.cours')
    
    def __repr__(self):
        return f'<EtudiantCours etudiant_id={self.etudiant_id} cours_id={self.cours_id}>'