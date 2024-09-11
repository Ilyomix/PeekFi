import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DotMatrixWallEffect = React.memo(
  ({
    opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
    colors = [[0, 255, 255]],
    containerClassName,
    dotSize,
    showGradient = true,
    deltaPercent = 0
  }: {
    /**
     * 0.1 - slower
     * 1.0 - faster
     */
    animationSpeed?: number;
    opacities?: number[];
    colors?: number[][];
    containerClassName?: string;
    dotSize?: number;
    showGradient?: boolean;
    deltaPercent?: number;
  }) => {
    return (
      <div className={cn('absolute h-full w-full', containerClassName)}>
        <div className="h-full w-full">
          <DotMatrix
            colors={colors ?? [[0, 255, 255]]}
            dotSize={dotSize ?? 3}
            opacities={
              opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
            }
            center={['x', 'y']}
            deltaPercent={deltaPercent}
          />
        </div>
        {showGradient && (
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" />
        )}
      </div>
    );
  }
);

DotMatrixWallEffect.displayName = 'DotMatrixWallEffect';

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ('x' | 'y')[];
  deltaPercent: number;
}

const DotMatrix: React.FC<DotMatrixProps> = React.memo(
  ({
    colors = [[0, 0, 0]],
    opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
    totalSize = 10,
    shader = '',
    center = ['x', 'y'],
    deltaPercent
  }) => {
    // Memoize uniforms with colors as a dependency
    const uniforms = useMemo(() => {
      let colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[0],
        colors[0],
        colors[0]
      ];
      if (colors.length === 2) {
        colorsArray = [
          colors[0],
          colors[0],
          colors[0],
          colors[1],
          colors[1],
          colors[1]
        ];
      } else if (colors.length === 3) {
        colorsArray = [
          colors[0],
          colors[0],
          colors[1],
          colors[1],
          colors[2],
          colors[2]
        ];
      }

      return {
        u_colors: {
          value: colorsArray.map((color) => [
            color[0] / 255,
            color[1] / 255,
            color[2] / 255
          ]),
          type: 'uniform3fv'
        },
        u_opacities: {
          value: opacities,
          type: 'uniform1fv'
        },
        u_total_size: {
          value: totalSize,
          type: 'uniform1f'
        },
        u_dot_size: {
          value: 2.5,
          type: 'uniform1f'
        }
      };
    }, [colors, opacities, totalSize]); // Ensure colors is a dependency
    const rawFrequency =
      deltaPercent === 0 ? 3600 : Math.abs(30 / Math.ceil(deltaPercent));

    const frequency = Number(
      rawFrequency < 0.125 ? 0.125 : rawFrequency
    ).toFixed(2);
    return (
      <Shader
        source={`
            precision mediump float;
            in vec2 fragCoord;

            uniform float u_time;
            uniform float u_opacities[10];
            uniform vec3 u_colors[6];
            uniform float u_total_size;
            uniform float u_dot_size;
            uniform vec2 u_resolution;
            out vec4 fragColor;
            float PHI = 1.61803398874989484820459;
            float random(vec2 xy) {
                return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
            }
            float map(float value, float min1, float max1, float min2, float max2) {
                return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
            }
            void main() {
                vec2 st = fragCoord.xy;
                ${
                  center.includes('x')
                    ? 'st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));'
                    : ''
                }
                ${
                  center.includes('y')
                    ? 'st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));'
                    : ''
                }
          
          float opacity = step(0.0, st.x);
          opacity *= step(0.0, st.y);

          vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));
          
          float frequency = ${frequency};
          float show_offset = random(st2);
          float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
          opacity *= u_opacities[int(rand * 10.0)];
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));
          vec3 color = u_colors[int(show_offset * 6.0)];

          ${shader}

          fragColor = vec4(color, opacity);
          fragColor.rgb *= fragColor.a;
        }`}
        uniforms={uniforms}
        deltaPercent={deltaPercent}
        maxFps={60}
      />
    );
  }
);

DotMatrix.displayName = 'DotMatrix';

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};
const ShaderMaterial = React.memo(
  ({
    source,
    uniforms,
    maxFps = 60,
    deltaPercent
  }: {
    source: string;
    hovered?: boolean;
    maxFps?: number;
    uniforms: Uniforms;
    deltaPercent: number;
  }) => {
    const { size } = useThree();
    const ref = useRef<THREE.Mesh>();
    const lastFrameTimeRef = useRef(0);
    const frequencyRef = useRef(deltaPercent);
    const seedRef = useRef(Math.random()); // Add a persistent seed for randomness

    useEffect(() => {
      frequencyRef.current = deltaPercent;
    }, [deltaPercent]);

    useFrame(({ clock }) => {
      if (!ref.current) return;
      const timestamp = clock.getElapsedTime();
      if (timestamp - lastFrameTimeRef.current < 1 / maxFps) {
        return;
      }
      lastFrameTimeRef.current = timestamp;

      const material: any = ref.current.material;
      material.uniforms.u_time.value = timestamp;

      // Update frequency uniform
      const frequency = Math.abs(
        frequencyRef.current ? 360 / frequencyRef.current : 3600
      );
      material.uniforms.u_frequency.value = Math.max(0.5, frequency);
    });

    const getUniforms = () => {
      const preparedUniforms: any = {};

      for (const uniformName in uniforms) {
        const uniform: any = uniforms[uniformName];

        switch (uniform.type) {
          case 'uniform1f':
            preparedUniforms[uniformName] = {
              value: uniform.value,
              type: '1f'
            };
            break;
          case 'uniform3f':
            preparedUniforms[uniformName] = {
              value: new THREE.Vector3().fromArray(uniform.value),
              type: '3f'
            };
            break;
          case 'uniform1fv':
            preparedUniforms[uniformName] = {
              value: uniform.value,
              type: '1fv'
            };
            break;
          case 'uniform3fv':
            preparedUniforms[uniformName] = {
              value: uniform.value.map((v: number[]) =>
                new THREE.Vector3().fromArray(v)
              ),
              type: '3fv'
            };
            break;
          case 'uniform2f':
            preparedUniforms[uniformName] = {
              value: new THREE.Vector2().fromArray(uniform.value),
              type: '2f'
            };
            break;
          default:
            console.error(`Invalid uniform type for '${uniformName}'.`);
            break;
        }
      }

      preparedUniforms['u_time'] = { value: 0, type: '1f' };
      preparedUniforms['u_resolution'] = {
        value: new THREE.Vector2(size.width * 2, size.height * 2)
      };
      preparedUniforms['u_frequency'] = { value: 3600, type: '1f' };
      preparedUniforms['u_seed'] = { value: seedRef.current, type: '1f' }; // Add seed uniform
      return preparedUniforms;
    };

    // Shader material
    const material = useMemo(() => {
      const updatedSource = source
        .replace(
          'float frequency = ${frequency};',
          'uniform float u_frequency;'
        )
        .replace(
          'float PHI = 1.61803398874989484820459;',
          `
        uniform float u_seed;
        float PHI = 1.61803398874989484820459;
        float pseudoRandom(vec2 co) {
            return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }
        `
        )
        .replace(
          'float pseudoRandom(vec2 xy) {',
          `
        float random(vec2 xy) {
          xy += u_seed;
        `
        );

      const materialObject = new THREE.ShaderMaterial({
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
        fragmentShader: updatedSource,
        uniforms: getUniforms(),
        glslVersion: THREE.GLSL3,
        blending: THREE.CustomBlending,
        blendSrc: THREE.SrcAlphaFactor,
        blendDst: THREE.OneFactor
      });

      return materialObject;
    }, [size.width, size.height, source]);

    return (
      <mesh ref={ref as any}>
        <planeGeometry args={[2, 2]} />
        <primitive object={material} attach="material" />
      </mesh>
    );
  }
);

ShaderMaterial.displayName = 'ShaderMaterial';

const Shader: React.FC<any> = ({
  source,
  uniforms,
  maxFps = 60,
  deltaPercent
}) => {
  // Use frequencyRef to update frequency dynamically without rerender
  const frequencyRef = useRef(deltaPercent);

  // When deltaPercent changes, update the frequencyRef
  useEffect(() => {
    frequencyRef.current = deltaPercent;
  }, [deltaPercent]);

  return (
    <Canvas
      style={{
        margin: '-2rem',
        height: 'calc(100% + 4rem)',
        width: 'calc(100% + 2rem)'
      }}
    >
      <ShaderMaterial
        source={source}
        uniforms={uniforms}
        maxFps={maxFps}
        deltaPercent={deltaPercent}
      />
    </Canvas>
  );
};
