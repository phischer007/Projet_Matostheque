import createCache from '@emotion/cache';

// Creates an Emotion cache with a key of 'css'
export const createEmotionCache = () => {
  // Return a new cache instance with the specified key
  return createCache({ key: 'css' });
};
