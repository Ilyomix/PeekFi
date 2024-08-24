import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import { OrbitControls, Box, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring as springThree } from '@react-spring/three';
import { backgroundChartByDelta } from 'utils/backgroundChartByDelta';
import { GradientT } from 'types/threeGradient';
import * as THREE from 'three';

type ShaderGradientWithTransitionProps = {
  priceChangePercent: string;
};

export const ShaderGradientWithTransition: React.FC<
  ShaderGradientWithTransitionProps
> = ({ priceChangePercent }) => {
  const initialProps = backgroundChartByDelta(priceChangePercent);
  const [shaderProps, setShaderProps] = useState<GradientT>(initialProps);
  const [prevSign, setPrevSign] = useState<number | null>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  const fadeStyle = useSpring({
    opacity: 1,
    from: { opacity: 0.9 },
    config: { duration: 2000 }
  });

  useEffect(() => {
    if (priceChangePercent !== null && priceChangePercent !== undefined) {
      const newSign = Math.sign(parseFloat(priceChangePercent));

      if (newSign !== prevSign) {
        const newProps = backgroundChartByDelta(priceChangePercent);
        setShaderProps(newProps);
        setPrevSign(newSign);

        fadeStyle.opacity.set(1);
      }
    }
  }, [priceChangePercent, prevSign, fadeStyle]);

  useEffect(() => {
    return () => {
      if (glRef.current) {
        glRef.current.dispose();
        glRef.current = null;
      }
    };
  }, []);

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
        onCreated={({ gl }: { gl: THREE.WebGLRenderer }) => {
          gl.domElement.style.pointerEvents = 'none';
          glRef.current = gl;
        }}
      >
        <ShaderGradient {...shaderProps} frameRate={2} />
      </ShaderGradientCanvas>
    </animated.div>
  );
};
