export const getPrivateKey = () => {
  const key = process.env.COIN_GECKO_PRIVATE_KEY;
  if (!key) {
    throw new Error('Private key is not defined');
  }
  return key;
};
