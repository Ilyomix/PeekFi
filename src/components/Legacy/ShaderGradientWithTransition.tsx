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
  loading?: boolean;
};

const ShaderGradientWithTransition: React.FC<
  ShaderGradientWithTransitionProps
> = ({ delta, value, loading }) => {
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  console.log('passed', delta);

  // Memoize the shader properties based on the delta value
  const shaderProps = useMemo(() => {
    return backgroundChartByDelta(delta);
  }, [delta]);

  // Opacity animation using useSpring
  const { opacity } = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
    reset: true
  });

  // Effect for disposing WebGL renderer on unmount or delta change
  useEffect(() => {
    return () => {
      if (glRef.current) {
        glRef.current.dispose();
        glRef.current = null;
      }
    };
  }, [delta]);

  // Cap uSpeed at a maximum of 1
  const cappedSpeed = Math.min(0.01 * Math.abs(value), 1);

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
          gl.domElement.style.pointerEvents = 'none'; // Disable pointer events for the WebGL canvas
          glRef.current = gl;
        }}
        pixelDensity={0.35}
        fov={25}
      >
        <ShaderGradient
          {...shaderProps}
          uSpeed={cappedSpeed} // Apply the capped speed
          enableTransition={false}
          control="props"
        />
      </ShaderGradientCanvas>
    </animated.div>
  );
};

// Use React.memo to avoid unnecessary re-renders
export default React.memo(
  ShaderGradientWithTransition,
  (prevProps, nextProps) => {
    // If loading transitions from true to false, trigger re-render
    if (prevProps.loading && !nextProps.loading) {
      return false;
    }

    // If delta has changed, trigger re-render
    if (prevProps.delta !== nextProps.delta) {
      return false;
    }

    // Otherwise, prevent re-render
    return true;
  }
);
