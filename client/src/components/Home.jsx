import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [stats, setStats] = useState({
    cours: 0,
    professeurs: 0,
    etudiants: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [coursRes, profsRes, etudsRes] = await Promise.all([
          fetch("/api/cours"),
          fetch("/api/professeurs"),
          fetch("/api/etudiants"),
        ]);

        const [coursData, profsData, etudsData] = await Promise.all([
          coursRes.json(),
          profsRes.json(),
          etudsRes.json(),
        ]);

        setStats({
          cours: coursData.length,
          professeurs: profsData.length,
          etudiants: etudsData.length,
        });
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Bienvenue sur la Plateforme d'apprentissage</h1>
      <p className="page-subtitle">
        Gérez vos cours, professeurs et étudiants en toute simplicité
      </p>

      <div className="card-grid">
        <Link to="/cours" className="card-link">
          <div className="card">
            <h3> {stats.cours} Cours</h3>
            <p>Explorez et gérez tous les cours disponibles</p>
          </div>
        </Link>

        <Link to="/professeurs" className="card-link">
          <div className="card">
            <h3> {stats.professeurs} Professeurs</h3>
            <p>Consultez la liste des professeurs</p>
          </div>
        </Link>

        <Link to="/etudiants" className="card-link">
          <div className="card">
            <h3> {stats.etudiants} Étudiants</h3>
            <p>Gérez les inscriptions des étudiants</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;