// utils.ts

import { IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react';

/**
 * Retourne l'URL du gradient de fond en fonction de la variation du prix.
 */
export const backgroundChartByDelta = (value: string | null) => {
  const parsedValue = parseFloat(value as string);

  const baseURL = 'https://www.shadergradient.co/customize?';
  const commonParams =
    'animate=on&axesHelper=on&bgColor1=%23000000&bgColor2=%23000000&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=95&cameraZoom=1&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=-2.1&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=225&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.8&uFrequency=5.5&uSpeed=0.1&uStrength=3&uTime=0.2&wireframe=false';

  if (parsedValue === 0 || !value) {
    return `${baseURL}${commonParams}&brightness=2.8&color1=%23495057&color2=%23343a40&color3=%23424242`;
  }

  const dynamicParams =
    parsedValue > 0
      ? 'brightness=2.2&color1=%2312b886&color2=%2396f2d7&color3=%2363e6be'
      : 'brightness=2.8&color1=%23e03131&color2=%23f03e3e&color3=%23c92a2a';

  return `${baseURL}${commonParams}&${dynamicParams}`;
};

/**
 * Retourne la classe de couleur appropriée en fonction de la valeur.
 */
export const getColorClass = (value: number | string) => {
  if (Number(value) === 0) return 'var(--mantine-color-gray-text)';
  return Number(value) > 0
    ? 'var(--mantine-color-teal-4)'
    : 'var(--mantine-color-red-4)';
};

/**
 * Retourne la précision des nombres en fonction de leur valeur.
 */
export const getNumberPrecision = (
  value: string | number,
  defaultPrecision = 2
): number => {
  // Assurez-vous d'utiliser une fonction appropriée pour calculer la précision
  const valueStr = value.toString();
  const decimalPart = valueStr.split('.')[1];
  return decimalPart ? decimalPart.length : defaultPrecision;
};
