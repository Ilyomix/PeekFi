import React, { useMemo } from 'react';
import { Shader } from './Shader';

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  interval?: string;
  deltaPercent: number;
  center?: ('x' | 'y')[];
}

export const DotMatrix: React.FC<DotMatrixProps> = React.memo(
  ({
    colors = [[0, 0, 0]],
    opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
    totalSize = 10,
    dotSize = 2,
    deltaPercent,
    shader = '',
    center = ['x', 'y']
  }) => {
    const frequency = useMemo(() => {
      const dp = Math.abs(deltaPercent);
      return dp === 0 ? 3600 : Math.max(30 - dp, 0.2);
    }, [deltaPercent]);
    const uniforms = useMemo(() => {
      let colorsArray = new Array(6).fill(colors[0]);

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
          value: colorsArray.map((color) => color.map((c: number) => c / 255)),
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
          value: dotSize,
          type: 'uniform1f'
        },
        u_frequency: {
          value: frequency,
          type: 'uniform1f'
        }
      };
    }, [colors, opacities, totalSize, dotSize, frequency]);

    const shaderSource = useMemo(() => {
      const centerX = center.includes('x')
        ? 'st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));'
        : '';
      const centerY = center.includes('y')
        ? 'st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));'
        : '';

      return `
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform float u_frequency;
        uniform vec2 u_resolution;
        out vec4 fragColor;
        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        void main() {
            vec2 st = fragCoord.xy;
            ${centerX}
            ${centerY}
            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = u_frequency;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            ${shader}

            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }
      `;
    }, []);

    return (
      <Shader
        source={shaderSource}
        uniforms={uniforms}
        maxFps={600}
        colors={colors}
      />
    );
  }
);

DotMatrix.displayName = 'DotMatrix';

export default DotMatrix;
