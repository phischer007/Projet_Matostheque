module.exports = {
  basePath: '/matostheque',
  env: {
    NEXT_PUBLIC_DJANGO_SERVER: process.env.NEXT_PUBLIC_DJANGO_SERVER || (
      process.env.NODE_ENV === 'production' ? 
      'https://liphy-matostheque.unvi-grenoble-alpes.fr/api' 
      : 'http://localhost:8030/api'
    ),
    NEXT_PUBLIC_ASSETS: process.env.NEXT_PUBLIC_ASSETS || (
      process.env.NODE_ENV === 'production' ? 
      'https://liphy-matostheque.univ-grenoble-alpes.fr/static/' 
      : 'http://localhost:8030/assets/'
    ),
  },
};
