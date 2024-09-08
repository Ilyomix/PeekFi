export const getPrivateKey = () => {
  const key = import.meta.env.VITE_COIN_MARKET_CAP_API_KEY;
  if (!key) {
    throw new Error('CoinMarketCap API key is not defined');
  }
  return key;
};
