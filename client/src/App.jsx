import { useEffect, useState } from "react";
import "./App.css"; 
import CoursList from "./components/CoursList";
import ProfesseursList from "./components/ProfesseursList";
import EtudiantsList from "./components/EtudiantsList";

function App() {
  const [cours, setCours] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "/api";

  useEffect(() => {
    async function fetchData() {
      try {
        const [coursRes, profsRes, etudsRes] = await Promise.all([
          fetch(`${API_URL}/cours`),
          fetch(`${API_URL}/professeurs`),
          fetch(`${API_URL}/etudiants`),
        ]);

        
        if (!coursRes.ok || !profsRes.ok || !etudsRes.ok) {
          throw new Error("Erreur lors du chargement des données API");
        }

        const [coursData, profsData, etudsData] = await Promise.all([
          coursRes.json(),
          profsRes.json(),
          etudsRes.json(),
        ]);

        setCours(coursData);
        setProfesseurs(profsData);
        setEtudiants(etudsData);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <h2>Chargement des données...</h2>;

  return (
    <div className="container">
      <h1>📘 Plateforme d’apprentissage Flask</h1>
      <CoursList cours={cours} />
      <ProfesseursList professeurs={professeurs} />
      <EtudiantsList etudiants={etudiants} />
    </div>
  );
}

export default App;
