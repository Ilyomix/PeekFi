import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import { OrbitControls, Box, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring as springThree } from '@react-spring/three';
import { backgroundChartByDelta } from 'utils/backgroundChartByDelta';

type ShaderGradientWithTransitionProps = {
  priceChangePercent: string;
};

export const ShaderGradientWithTransition: React.FC<
  ShaderGradientWithTransitionProps
> = ({ priceChangePercent }) => {
  const [prevUrl, setPrevUrl] = useState<string>(
    backgroundChartByDelta(priceChangePercent)
  );
  const [prevSign, setPrevSign] = useState<number | null>(null);

  const fadeStyle = useSpring({
    opacity: 1,
    from: { opacity: 0.9 },
    config: { duration: 2000 }
  });

  useEffect(() => {
    if (priceChangePercent !== null && priceChangePercent !== undefined) {
      const newSign = Math.sign(parseFloat(priceChangePercent));

      if (newSign !== prevSign) {
        const newUrl = backgroundChartByDelta(priceChangePercent);
        setPrevUrl(newUrl);
        setPrevSign(newSign);

        fadeStyle.opacity.set(1);
      }
    }
  }, [priceChangePercent, prevSign, fadeStyle]);

  return (
    <animated.div style={fadeStyle}>
      <ShaderGradientCanvas
        importedfiber={{
          Canvas,
          OrbitControls,
          Box,
          useTexture,
          useFrame,
          springThree
        }}
        style={{
          position: 'absolute',
          top: 0,
          height: '100%',
          zIndex: 0,
          borderRadius: '30px'
        }}
        onCreated={({ gl }: { gl: import('three').WebGLRenderer }) => {
          gl.domElement.style.pointerEvents = 'none'; // Disable interactions
        }}
      >
        <ShaderGradient
          zoomOut={false}
          toggleAxis={false}
          enableTransition={false}
          control="query"
          urlString={prevUrl}
        />
      </ShaderGradientCanvas>
    </animated.div>
  );
};
