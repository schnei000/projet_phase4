import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CoursSchema = Yup.object().shape({
  titre: Yup.string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(200, "Le titre ne peut pas dépasser 200 caractères")
    .required("Le titre est requis"),
  professeur_id: Yup.number()
    .positive("Sélectionnez un professeur valide")
    .required("Le professeur est requis"),
});

function CoursPage() {
  const [cours, setCours] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCours, setEditingCours] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [coursRes, profsRes] = await Promise.all([
        fetch("/api/cours"),
        fetch("/api/professeurs"),
      ]);

      const [coursData, profsData] = await Promise.all([
        coursRes.json(),
        profsRes.json(),
      ]);

      setCours(coursData);
      setProfesseurs(profsData);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(values, { resetForm }) {
    try {
      const url = editingCours
        ? `/api/cours/${editingCours.id}`
        : "/api/cours";
      const method = editingCours ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        await fetchData();
        resetForm();
        setEditingCours(null);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Voulez-vous vraiment supprimer ce cours ?")) return;

    try {
      const response = await fetch(`/api/cours/${id}`, { method: "DELETE" });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Gestion des Cours</h1>

      <div className="form-container">
        <h2>{editingCours ? "Modifier le cours" : "Ajouter un cours"}</h2>
        <Formik
          initialValues={{
            titre: editingCours?.titre || "",
            professeur_id: editingCours?.professeur_id || "",
          }}
          validationSchema={CoursSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label className="form-label" htmlFor="titre">
                  Titre du cours
                </label>
                <Field
                  className="form-input"
                  type="text"
                  id="titre"
                  name="titre"
                  placeholder="Ex: Introduction à Python"
                />
                <ErrorMessage
                  name="titre"
                  component="div"
                  className="form-error"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="professeur_id">
                  Professeur
                </label>
                <Field
                  className="form-select"
                  as="select"
                  id="professeur_id"
                  name="professeur_id"
                >
                  <option value="">Sélectionnez un professeur</option>
                  {professeurs.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nom}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="professeur_id"
                  component="div"
                  className="form-error"
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {editingCours ? "Mettre à jour" : "Ajouter"}
                </button>
                {editingCours && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingCours(null)}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <h2 className="section-title">Liste des cours</h2>
      <div className="card-grid">
        {cours.length === 0 ? (
          <div className="empty-state">
            <p>Aucun cours trouvé.</p>
          </div>
        ) : (
          cours.map((c) => (
            <div className="card" key={c.id}>
              <h3>{c.titre}</h3>
              <p>Professeur : {c.professeur?.nom || "Inconnu"}</p>
              <div className="card-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingCours(c)}
                >
                  Modifier
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(c.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CoursPage;