const apiUrl = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production' ? 
  'https://liphy-matostheque.univ-grenoble-alpes.fr/api' 
  : 'http://localhost:8030/api'
);

const config = {
  apiUrl: apiUrl,
};

export default config;
