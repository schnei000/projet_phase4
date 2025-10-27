
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import CoursPage from "./components/CoursPage";
import ProfesseursPage from "./components/ProfesseursPage";
import EtudiantsPage from "./components/EtudiantsPage";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">Plateforme d'apprentissage</h1>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Accueil</Link>
              </li>
              <li className="nav-item">
                <Link to="/cours" className="nav-link">Cours</Link>
              </li>
              <li className="nav-item">
                <Link to="/professeurs" className="nav-link">Professeurs</Link>
              </li>
              <li className="nav-item">
                <Link to="/etudiants" className="nav-link">Étudiants</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cours" element={<CoursPage />} />
            <Route path="/professeurs" element={<ProfesseursPage />} />
            <Route path="/etudiants" element={<EtudiantsPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 Plateforme d'apprentissage. Tous droits réservés.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;