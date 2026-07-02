const apiUrl = process.env.REACT_APP_API_URL || (
 process.env.NODE_ENV === 'production' ?
 'https://server_name.example.com/api'
 : 'http://localhost:8030/api'
);

const config = {
  apiUrl: apiUrl,
};

export default config;