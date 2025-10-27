function CoursList({ cours }) {
  return (
    <section>
      <h2>Cours disponibles</h2>
      <div className="card-grid">
        {cours.length === 0 ? (
          <p>Aucun cours trouvé.</p>
        ) : (
          cours.map((c) => (
            <div className="card" key={c.id}>
              <h3>{c.titre}</h3>
              <p>Professeur : {c.professeur ? c.professeur.nom : "Inconnu"}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default CoursList;
