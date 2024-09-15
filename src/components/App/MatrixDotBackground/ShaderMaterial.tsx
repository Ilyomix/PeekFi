import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Uniforms {
  [key: string]: {
    value: number[] | number[][] | number | THREE.Vector2 | THREE.Vector3;
    type: string;
  };
}

interface ShaderMaterialProps {
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
  colors?: number[][];
}

export const ShaderMaterial: React.FC<ShaderMaterialProps> = React.memo(
  ({ source, uniforms, maxFps = 60 }) => {
    const { size } = useThree();
    const ref = useRef<THREE.Mesh>(null!);
    const lastFrameTimeRef = useRef(0);

    useFrame(({ clock }) => {
      if (!ref.current) return;
      const timestamp = clock.getElapsedTime();
      if (timestamp - lastFrameTimeRef.current < 1 / maxFps) return;
      lastFrameTimeRef.current = timestamp;

      const material = ref.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = timestamp;
    });

    const preparedUniforms = useMemo(() => {
      const result: { [key: string]: { value: any } } = {};

      Object.keys(uniforms).forEach((uniformName) => {
        const uniform = uniforms[uniformName];
        switch (uniform.type) {
          case 'uniform1f':
            result[uniformName] = { value: uniform.value };
            break;
          case 'uniform3f':
            result[uniformName] = {
              value: new THREE.Vector3(...(uniform.value as number[]))
            };
            break;
          case 'uniform1fv':
            result[uniformName] = { value: uniform.value };
            break;
          case 'uniform3fv':
            result[uniformName] = {
              value: (uniform.value as number[][]).map(
                (v) => new THREE.Vector3(...v)
              )
            };
            break;
          case 'uniform2f':
            result[uniformName] = {
              value: new THREE.Vector2(...(uniform.value as number[]))
            };
            break;
          default:
            console.error(`Invalid uniform type for '${uniformName}'.`);
            break;
        }
      });

      result['u_time'] = { value: 0 };
      result['u_resolution'] = {
        value: new THREE.Vector2(size.width * 2, size.height * 2)
      };

      return result;
    }, [uniforms, size.width, size.height]);

    const material = useMemo(() => {
      return new THREE.ShaderMaterial({
        vertexShader: `
          precision mediump float;
          in vec2 coordinates;
          uniform vec2 u_resolution;
          out vec2 fragCoord;
          void main(){
            float x = position.x;
            float y = position.y;
            gl_Position = vec4(x, y, 0.0, 1.0);
            fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
            fragCoord.y = u_resolution.y - fragCoord.y;
          }
        `,
        fragmentShader: source,
        uniforms: preparedUniforms,
        glslVersion: THREE.GLSL3,
        blending: THREE.CustomBlending,
        blendSrc: THREE.SrcAlphaFactor,
        blendDst: THREE.OneFactor
      });
    }, [source, preparedUniforms]);

    return (
      <mesh ref={ref}>
        <planeGeometry args={[2, 2]} />
        <primitive object={material} attach="material" />
      </mesh>
    );
  }
);

ShaderMaterial.displayName = 'ShaderMaterial';

export default ShaderMaterial;
