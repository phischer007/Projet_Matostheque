const apiUrl = process.env.NEXT_PUBLIC_API_URL || (
  process.env.NODE_ENV === 'production' ? 
  `https://${process.env.NEXT_PUBLIC_ALLOWED_HOSTS}/api` : 
  'http://localhost:8030/api'
);

const config = {
  apiUrl: apiUrl,
};

export default config;