export type MeshT = {
  type?: 'plane' | 'sphere' | 'waterPlane';
  animate?: 'on' | 'off';
  axesHelper?: 'on' | 'off';
  bgColor1?: string;
  bgColor2?: string;
  destination?: 'onCanvas' | 'offCanvas';
  embedMode?: 'on' | 'off';
  format?: 'gif' | 'png' | 'jpg';
  fov?: number;
  pixelDensity?: number;
  uTime?: number;
  uSpeed?: number;
  uStrength?: number;
  uDensity?: number;
  uFrequency?: number;
  uAmplitude?: number;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  range?: 'enabled' | 'disabled';
  color1?: string;
  color2?: string;
  color3?: string;
  reflection?: number;
  wireframe?: boolean;
  shader?: string;
  rotSpringOption?: unknown;
  posSpringOption?: unknown;
};

export type GradientT = MeshT & {
  control?: 'query' | 'props';
  isFigmaPlugin?: boolean;
  dampingFactor?: number;

  // View (camera) props
  cAzimuthAngle?: number;
  cPolarAngle?: number;
  cDistance?: number;
  cameraZoom?: number;

  // Effect props
  lightType?: '3d' | 'env';
  brightness?: number;
  envPreset?: 'city' | 'dawn' | 'lobby';
  grain?: 'on' | 'off';
  grainBlending?: number;

  // Tool props
  zoomOut?: boolean;
  toggleAxis?: boolean;
  hoverState?: string;

  enableTransition?: boolean;
};
