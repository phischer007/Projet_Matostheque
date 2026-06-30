export const createResourceId = () => {
  // Create a new Uint8Array of 12 bytes to store the resource ID
  const arr = new Uint8Array(12);

  // Fill the array with cryptographically secure random values
  window.crypto.getRandomValues(arr);

  // Convert the array to a hexadecimal string, padding each value with leading zeros if necessary
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
};
