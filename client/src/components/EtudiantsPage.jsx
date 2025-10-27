
// src/pages/EtudiantsPage.jsx
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EtudiantSchema = Yup.object().shape({
  nom: Yup.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/, "Le nom ne peut contenir que des lettres")
    .required("Le nom est requis"),
  email: Yup.string()
    .email("Format d’email invalide")
    .required("L’email est requis"),
});

function EtudiantsPage() {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEtudiant, setEditingEtudiant] = useState(null);

  useEffect(() => {
    fetchEtudiants();
  }, []);

  async function fetchEtudiants() {
    try {
      const res = await fetch("/api/etudiants");
      const data = await res.json();
      setEtudiants(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(values, { resetForm }) {
    try {
      const url = editingEtudiant
        ? `/api/etudiants/${editingEtudiant.id}`
        : "/api/etudiants";
      const method = editingEtudiant ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        await fetchEtudiants();
        resetForm();
        setEditingEtudiant(null);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Voulez-vous vraiment supprimer cet étudiant ?")) return;

    try {
      const response = await fetch(`/api/etudiants/${id}`, { method: "DELETE" });
      if (response.ok) {
        await fetchEtudiants();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  }

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Gestion des Étudiants</h1>

      <div className="form-container">
        <h2>{editingEtudiant ? "Modifier l’étudiant" : "Ajouter un étudiant"}</h2>
        <Formik
          initialValues={{
            nom: editingEtudiant?.nom || "",
            email: editingEtudiant?.email || "",
          }}
          validationSchema={EtudiantSchema}
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
                  placeholder="Ex: Marie Lemoine"
                />
                <ErrorMessage name="nom" component="div" className="form-error" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <Field
                  className="form-input"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Ex: marie@exemple.com"
                />
                <ErrorMessage name="email" component="div" className="form-error" />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {editingEtudiant ? "Mettre à jour" : "Ajouter"}
                </button>
                {editingEtudiant && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingEtudiant(null)}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <h2 className="section-title">Liste des étudiants</h2>
      <ul className="list-container">
        {etudiants.length === 0 ? (
          <div className="empty-state">
            <p>Aucun étudiant disponible.</p>
          </div>
        ) : (
          etudiants.map((etu) => (
            <li key={etu.id} className="list-item">
              <div className="list-item-content">
                <strong>{etu.nom}</strong>
                <span className="list-item-meta">{etu.email}</span>
              </div>
              <div className="list-item-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingEtudiant(etu)}
                >
                  Modifier
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(etu.id)}
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

export default EtudiantsPage;