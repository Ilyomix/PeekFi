import React, { useRef, useMemo, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import { OrbitControls, Box, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring as springThree } from '@react-spring/three';
import { backgroundChartByDelta } from 'utils/backgroundChartByDelta';
import * as THREE from 'three';

type ShaderGradientWithTransitionProps = {
  delta: 'positive' | 'negative' | 'neutral';
  value: number;
};

const ShaderGradientWithTransition: React.FC<
  ShaderGradientWithTransitionProps
> = ({ delta, value }) => {
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  console.log('passed', delta);
  const shaderProps = useMemo(() => {
    return backgroundChartByDelta(delta);
  }, [delta]);

  const { opacity } = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 2000 },
    reset: true
  });

  useEffect(() => {
    return () => {
      if (glRef.current) {
        glRef.current.dispose();
        glRef.current = null;
      }
    };
  }, [delta]);

  return (
    <animated.div style={{ opacity }}>
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
          zIndex: -1,
          borderRadius: '30px'
        }}
        onCreated={({ gl }: { gl: THREE.WebGLRenderer }) => {
          gl.domElement.style.pointerEvents = 'none';
          glRef.current = gl;
        }}
        pixelDensity={0.35}
        fov={25}
      >
        <ShaderGradient
          {...shaderProps}
          uSpeed={0.01 * Math.abs(value)}
          enableTransition={false}
          control="props"
        />
      </ShaderGradientCanvas>
    </animated.div>
  );
};

export default React.memo(
  ShaderGradientWithTransition,
  (prevProps, nextProps) => prevProps.delta === nextProps.delta
);
