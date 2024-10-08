import React, { useMemo } from 'react';
import clsx from 'clsx';
import { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DotMatrix } from './DotMatrix';

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

interface DotMatrixWallEffectProps {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  deltaPercent: number;
  showGradient?: boolean;
  interval?: string;
}

export const DotMatrixWallEffect: React.FC<DotMatrixWallEffectProps> =
  React.memo(
    ({
      opacities,
      colors,
      containerClassName,
      dotSize,
      showGradient = true,
      interval = '1d',
      deltaPercent
    }) => {
      const center: ('x' | 'y')[] = useMemo(() => ['x', 'y'], []);
      const defaultColors = useMemo(() => [[0, 255, 255]], []);
      const defaultOpacities = useMemo(
        () => [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
        []
      );

      return (
        <div
          className={cn(
            'h-full absolute bg-[#131025] opacity-90 w-full',
            containerClassName
          )}
        >
          <div className="h-full w-full">
            <DotMatrix
              colors={colors ?? defaultColors}
              dotSize={dotSize ?? 2}
              deltaPercent={deltaPercent}
              opacities={opacities ?? defaultOpacities}
              center={center}
              interval={interval}
            />
          </div>
          {showGradient && (
            <div className="absolute inset-0 bg-gradient-to-t from-black to-[120%]" />
          )}
        </div>
      );
    }
  );

DotMatrixWallEffect.displayName = 'DotMatrixWallEffect';

export default DotMatrixWallEffect;
