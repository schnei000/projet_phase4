function ProfesseursList({ professeurs }) {
  return (
    <section>
      <h2>Professeurs</h2>
      {professeurs.length === 0 ? (
        <p>Aucun professeur disponible.</p>
      ) : (
        <ul>
          {professeurs.map((p) => (
            <li key={p.id}>{p.nom}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ProfesseursList;
