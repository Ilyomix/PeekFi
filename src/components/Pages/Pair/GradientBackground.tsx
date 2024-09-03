// src/components/GradientBackground.tsx
import React, { useMemo } from 'react';
import ShaderGradientWithTransition from 'components/Pages/Pair/ShaderGradientWithTransition';

interface GradientBackgroundProps {
  priceChangePercent24h: number;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  priceChangePercent24h
}) => {
  const currentSign = useMemo(() => {
    if (priceChangePercent24h > 0) return 'positive';
    if (priceChangePercent24h < 0) return 'negative';
    return 'neutral';
  }, [priceChangePercent24h]);

  return (
    <ShaderGradientWithTransition
      delta={currentSign}
      value={priceChangePercent24h}
    />
  );
};

export default React.memo(GradientBackground);
