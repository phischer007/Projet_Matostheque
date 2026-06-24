module.exports = {
  basePath: '/mutmat',
  env: {
    NEXT_PUBLIC_DJANGO_SERVER: process.env.NODE_ENV === 'production'
      ? `https://${process.env.REACT_NEXT_ALLOWED_HOSTS}/api` 
      : 'http://localhost:8030/api',

    NEXT_PUBLIC_ASSETS: process.env.NODE_ENV === 'production'
      ? `https://${process.env.REACT_NEXT_ALLOWED_HOSTS}/media/`
      : 'http://localhost:8030/assets/',
  },
};


// module.exports = {
//   basePath: '/mutmat',
//   env: {
//     NEXT_PUBLIC_DJANGO_SERVER: process.env.NODE_ENV === 'production'
//       ? `https://${process.env.REACT_NEXT_ALLOWED_HOSTS}:8443/api` 
//       : 'http://localhost:8020/api',

//     NEXT_PUBLIC_ASSETS: process.env.NODE_ENV === 'production'
//       ? `https://${process.env.REACT_NEXT_ALLOWED_HOSTS}:8443/media/`
//       : 'http://localhost:8020/assets/',
//   },
// };