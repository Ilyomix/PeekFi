import { useState, useEffect, useMemo } from 'react';

const useResponsiveStyles = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Return responsive styles based on the current window width
  return useMemo(() => {
    return {
      animatedTickerDisplay: {
        fontSize: '100px',
        ...(windowWidth <= 1408 && { fontSize: '80px' }),
        ...(windowWidth <= 768 && { fontSize: '50px' }),
        ...(windowWidth <= 425 && { fontSize: '40px' })
      },
      deltaFontSize: {
        fontSize: '34px',
        ...(windowWidth <= 1408 && { fontSize: '26px' }),
        ...(windowWidth <= 768 && { fontSize: '27px' }),
        ...(windowWidth <= 425 && { fontSize: '27px' })
      },
      animatedTicker: windowWidth <= 1408
    };
  }, [windowWidth]);
};

export default useResponsiveStyles;
