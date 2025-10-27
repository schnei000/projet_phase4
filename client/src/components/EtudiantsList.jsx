function EtudiantsList({ etudiants }) {
  return (
    <section>
      <h2>Étudiants inscrits</h2>
      {etudiants.length === 0 ? (
        <p>Aucun étudiant inscrit.</p>
      ) : (
        <ul>
          {etudiants.map((e) => (
            <li key={e.id}>{e.nom}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default EtudiantsList;
