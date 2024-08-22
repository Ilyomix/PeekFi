export const getPrivateKey = () => {
  const key = import.meta.env.VITE_COIN_GECKO_PRIVATE_KEY;
  if (!key) {
    throw new Error('Private key is not defined');
  }
  return key;
};
