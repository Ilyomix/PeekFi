export const getFinancialColorByTickerDelta = (
  delta: 'positive' | 'negative' | 'neutral'
): string => {
  switch (delta) {
    case 'positive':
      return 'green';
    case 'negative':
      return 'red';
    case 'neutral':
      return 'gray';
    default:
      return 'gray';
  }
};
