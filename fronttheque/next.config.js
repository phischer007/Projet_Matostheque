/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/mutmat',
  
  // The '.env' object allows you to inject these variables 
  // into your client-side code at build time.
  env: {
    NEXT_PUBLIC_DJANGO_SERVER: process.env.NEXT_PUBLIC_DJANGO_SERVER || (
      process.env.NODE_ENV === 'production' 
        ? `https://${process.env.NEXT_PUBLIC_ALLOWED_HOSTS}/api` 
        : 'http://localhost:8030/api'
    ),
    
    NEXT_PUBLIC_ASSETS: process.env.NEXT_PUBLIC_ASSETS || (
      process.env.NODE_ENV === 'production' 
        ? `https://${process.env.NEXT_PUBLIC_ALLOWED_HOSTS}/media/` 
        : 'http://localhost:8030/assets/'
    ),
  },
};

module.exports = nextConfig;