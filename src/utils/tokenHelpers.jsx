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

export const hash = async (u,ak,sk,exp, callback) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(sk);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    callback(u,ak,hashHex,exp);
};