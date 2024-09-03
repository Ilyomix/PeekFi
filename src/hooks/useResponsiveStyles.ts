// src/hooks/useResponsiveStyles.ts
import { useMemo } from 'react';

const useResponsiveStyles = () => {
  return useMemo(
    () => ({
      animatedTickerDisplay: {
        fontSize: '100px',
        ...(window.innerWidth <= 1408 && { fontSize: '80px' }),
        ...(window.innerWidth <= 768 && { fontSize: '60px' }),
        ...(window.innerWidth <= 425 && { fontSize: '40px' })
      },
      deltaFontSize: {
        fontSizeDelta: '30px',
        ...(window.innerWidth <= 1408 && { fontSize: '20px' }),
        ...(window.innerWidth <= 768 && { fontSize: '16px' }),
        ...(window.innerWidth <= 425 && { fontSize: '16px' })
      },
      animatedTicker: window.innerWidth <= 1408
    }),
    []
  );
};

export default useResponsiveStyles;
