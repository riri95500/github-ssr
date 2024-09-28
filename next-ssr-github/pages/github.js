import { useState } from 'react';

export async function getServerSideProps(context) {
  const username = context.query.username || 'octocat'; // Utilisez 'octocat' comme utilisateur par défaut
  const res = await fetch(`https://api.github.com/users/${username}`);
  
  // Gestion des erreurs si l'utilisateur n'existe pas
  if (res.status !== 200) {
    return {
      props: {
        error: `Utilisateur GitHub "${username}" non trouvé.`
      }
    };
  }
  
  const data = await res.json();

  return {
    props: {
      user: data
    }
  };
}

const GitHubUser = ({ user, error }) => {
  const [username, setUsername] = useState(''); // État pour le champ de recherche
  const [loading, setLoading] = useState(false); // Indicateur de chargement

  // Fonction pour gérer la recherche
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true); // Activer le mode "chargement"
    window.location.href = `/github?username=${username}`; // Redirection vers la page avec le nom d'utilisateur recherché
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Rechercher un utilisateur GitHub</h1>
      
      {/* Formulaire de recherche */}
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Entrez un nom d'utilisateur GitHub"
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}>Rechercher</button>
      </form>

      {loading && <p>Chargement des données...</p>} {/* Affichage du loading */}

      {/* Affichage des erreurs */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Affichage des informations de l'utilisateur GitHub */}
      {user && !error && (
        <div>
          <h2>Informations GitHub de {user.name || user.login}</h2>
          <img src={user.avatar_url} alt="avatar" style={{ borderRadius: '50%', width: '150px' }} />
          <p>Nom d'utilisateur : {user.login}</p>
          <p>Nombre de dépôts : {user.public_repos}</p>
          <p>Nombre de followers : {user.followers}</p>
          <p>Nombre de personnes suivies : {user.following}</p>
        </div>
      )}
    </div>
  );
};

export default GitHubUser;
