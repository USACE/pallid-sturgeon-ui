export const generateToken = (size) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint8Array(size);
  window.crypto.getRandomValues(randomValues); // Populates array with secure random numbers
    
  let result = 'ps-api-';
  for (let i = 0; i < size; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
};

export const hash = async (message, callback) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    const hashHex = new Uint8Array(hash).toHex()
    console.log("hash");
    console.log(hashHex);
    callback(hashHex);
};