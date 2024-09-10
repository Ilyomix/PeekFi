// src/components/GradientBackground.tsx
import React, { useMemo } from 'react';
import ShaderGradientWithTransition from 'components/Pages/Pair/ShaderGradientWithTransition';

interface GradientBackgroundProps {
  priceChangePercent: number;
  loading: boolean;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  priceChangePercent,
  loading
}) => {
  const currentSign = useMemo(() => {
    if (priceChangePercent > 0) return 'positive';
    if (priceChangePercent < 0) return 'negative';
    return 'neutral';
  }, [priceChangePercent]);

  return (
    <ShaderGradientWithTransition
      delta={currentSign}
      value={priceChangePercent}
      loading={loading}
    />
  );
};

export default React.memo(GradientBackground);
