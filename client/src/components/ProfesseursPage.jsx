
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ProfesseurSchema = Yup.object().shape({
  nom: Yup.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, "Le nom ne peut contenir que des lettres")
    .required("Le nom est requis"),
});

function ProfesseursPage() {
  const [professeurs, setProfesseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProf, setEditingProf] = useState(null);

  useEffect(() => {
    fetchProfesseurs();
  }, []);

  async function fetchProfesseurs() {
    try {
      const response = await fetch("/api/professeurs");
      const data = await response.json();
      setProfesseurs(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(values, { resetForm }) {
    try {
      const url = editingProf
        ? `/api/professeurs/${editingProf.id}`
        : "/api/professeurs";
      const method = editingProf ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        await fetchProfesseurs();
        resetForm();
        setEditingProf(null);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Voulez-vous vraiment supprimer ce professeur ?")) return;

    try {
      const response = await fetch(`/api/professeurs/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchProfesseurs();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Gestion des Professeurs</h1>

      <div className="form-container">
        <h2>
          {editingProf ? "Modifier le professeur" : "Ajouter un professeur"}
        </h2>
        <Formik
          initialValues={{ nom: editingProf?.nom || "" }}
          validationSchema={ProfesseurSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label className="form-label" htmlFor="nom">
                  Nom complet
                </label>
                <Field
                  className="form-input"
                  type="text"
                  id="nom"
                  name="nom"
                  placeholder="Ex: Jean Dupont"
                />
                <ErrorMessage
                  name="nom"
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
                  {editingProf ? "Mettre à jour" : "Ajouter"}
                </button>
                {editingProf && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingProf(null)}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <h2 className="section-title">Liste des professeurs</h2>
      <ul className="list-container">
        {professeurs.length === 0 ? (
          <div className="empty-state">
            <p>Aucun professeur disponible.</p>
          </div>
        ) : (
          professeurs.map((prof) => (
            <li key={prof.id} className="list-item">
              <div className="list-item-content">
                <strong>{prof.nom}</strong>
                {prof.cours?.length > 0 && (
                  <span className="list-item-meta">
                    ({prof.cours.length} cours)
                  </span>
                )}
              </div>
              <div className="list-item-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingProf(prof)}
                >
                  Modifier
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(prof.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ProfesseursPage;