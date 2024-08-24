import { GradientT } from 'types/threeGradient';

export const backgroundChartByDelta = (value: string | null): GradientT => {
  const parsedValue = parseFloat(value as string);
  const isNeutral = parsedValue === 0 || isNaN(parsedValue);

  // Precompute values based on conditions
  const brightness = isNeutral ? 2.8 : parsedValue > 0 ? 2.2 : 2.8;
  const color1 = isNeutral ? '#495057' : parsedValue > 0 ? '#12b886' : '#e03131';
  const color2 = isNeutral ? '#343a40' : parsedValue > 0 ? '#96f2d7' : '#f03e3e';
  const color3 = isNeutral ? '#424242' : parsedValue > 0 ? '#63e6be' : '#c92a2a';

  // Return the base properties with the computed values
  return {
    animate: 'on', // Keep animations on, but they could be disabled on low-end devices dynamically
    axesHelper: 'off',
    bgColor1: '#000000',
    enableTransition: false, // Disable transitions by default to improve performance
    bgColor2: '#000000',
    cAzimuthAngle: 180,
    cDistance: 2.8,
    cPolarAngle: 95,
    cameraZoom: 1, // Default zoom level
    destination: 'offCanvas', // Depending on the context, 'onCanvas' might perform better, but offCanvas generally has better compatibility
    embedMode: 'off',
    envPreset: 'dawn', // 'dawn' preset is generally less performance-intensive
    format: 'jpg', // 'jpg' is more efficient than 'png' or other formats
    fov: 75, // Lower the field of view slightly to reduce the rendering load (default 75 for a good balance)
    grain: 'off',
    lightType: '3d', // '3d' lighting is generally supported, but 'env' could be used for performance
    pixelDensity: 0.5, // Reduce pixel density for better performance, but still looks good
    positionX: 0,
    positionY: -2.1,
    positionZ: 0,
    reflection: 0.1,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 200,
    shader: 'defaults',
    type: 'waterPlane', // 'waterPlane' might be performance-heavy; consider 'plane' if necessary
    uAmplitude: 0,
    uDensity: 1.5, // Lower density for better performance
    uFrequency: 5, // Lower frequency to reduce the strain on lower-end GPUs
    uSpeed: 0.05, // Slower speed to reduce the number of computations
    uStrength: 2, // Lower strength for less intensive rendering
    uTime: 0.1, // Adjust time scale for smoother animations
    wireframe: false, // Wireframe set to false for better performance
    zoomOut: false,
    toggleAxis: false,
    brightness,
    color1,
    color2,
    color3
  };
};
