from config import create_app, db
from models import Professeur, Cours, Lecon, Etudiant, EtudiantCours

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    p1 = Professeur(nom="Professeur Alice")
    p2 = Professeur(nom="Professeur Bob")
    db.session.add_all([p1, p2])
    db.session.commit()

    c1 = Cours(titre="Flask pour débutants", professeur_id=p1.id)
    c2 = Cours(titre="React avancé", professeur_id=p2.id)
    db.session.add_all([c1, c2])
    db.session.commit()

    l1 = Lecon(titre="Introduction à Flask", contenu="CRUD, REST, SQLAlchemy", cours_id=c1.id)
    l2 = Lecon(titre="React Router", contenu="Routes dynamiques", cours_id=c2.id)
    db.session.add_all([l1, l2])
    db.session.commit()

    e1 = Etudiant(nom="Étudiant 1")
    e2 = Etudiant(nom="Étudiant 2")
    db.session.add_all([e1, e2])
    db.session.commit()

    ec1 = EtudiantCours(etudiant_id=e1.id, cours_id=c1.id, progression=30)
    ec2 = EtudiantCours(etudiant_id=e2.id, cours_id=c2.id, progression=75)
    db.session.add_all([ec1, ec2])
    db.session.commit()

    print(" Données de test insérées avec succès.")
