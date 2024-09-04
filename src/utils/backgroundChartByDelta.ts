import { GradientT, MeshT } from 'types/threeGradient';

export const backgroundChartByDelta = (value: string): GradientT & MeshT => {
  const isNeutral = value === 'neutral';
  const color1 = isNeutral
    ? '#495057' // Neutral gray
    : value === 'positive'
      ? '#3ddc97' // Vibrant green (bright, matches the brightness of red)
      : '#ff6b6b'; // Bright red

  const color2 = isNeutral
    ? '#343a40' // Darker neutral gray
    : value === 'positive'
      ? '#5ef7b1' // Lighter pastel green
      : '#ff8787'; // Pastel red

  const color3 = isNeutral
    ? '#424242' // Neutral dark
    : value === 'positive'
      ? '#89ffce' // Very light pastel green
      : '#ff5c5c'; // Light pastel red

  // Return the updated properties with the computed values
  return {
    animate: 'on',
    axesHelper: 'on',
    bgColor1: '#000000',
    bgColor2: '#000000',
    brightness: 2.5, // Updated brightness
    cAzimuthAngle: 180,
    cDistance: 2, // Updated distance
    cPolarAngle: 95, // Updated polar angle
    cameraZoom: 1,
    destination: 'onCanvas',
    embedMode: 'off',
    envPreset: 'city', // Updated environment preset
    format: 'gif', // Updated format
    grain: 'off',
    lightType: '3d',
    pixelDensity: 0.5, // Updated pixel density
    positionX: 0,
    positionY: -2.1, // Updated positionY
    positionZ: 0,
    reflection: 0.1,
    range: 'disabled',
    rotationX: 0,
    rotationY: 0,
    rotationZ: 225, // Updated rotationZ
    shader: 'defaults',
    type: 'waterPlane', // Updated type
    uAmplitude: 0,
    uDensity: 1.8, // Updated density
    uFrequency: 2.5, // Updated frequency
    uSpeed: 0.1, // Updated speed
    uStrength: 3, // Updated strength
    uTime: 0.2, // Updated time
    wireframe: false,
    color1,
    color2,
    color3
  };
};
