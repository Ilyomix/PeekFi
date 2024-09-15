import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ShaderMaterial } from './ShaderMaterial';

interface ShaderProps {
  source: string;
  colors: number[][];
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

export const Shader: React.FC<ShaderProps> = React.memo(
  ({ colors, source, uniforms, maxFps = 60 }) => {
    return (
      <Canvas className="absolute inset-0 h-full w-full">
        <ShaderMaterial
          colors={colors}
          source={source}
          uniforms={uniforms}
          maxFps={maxFps}
        />
      </Canvas>
    );
  }
);

Shader.displayName = 'Shader';

export default Shader;
