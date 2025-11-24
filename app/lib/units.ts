export type DimensionInches = {
  width: number;
  height: number;
  length: number;
};

export type DimensionMeters = {
  width: number;
  height: number;
  length: number;
};

const INCHES_PER_FOOT = 12;
const METERS_PER_INCH = 0.0254;

export function inchesToFeet(value: number): number {
  return value / INCHES_PER_FOOT;
}

export function feetToInches(value: number): number {
  return value * INCHES_PER_FOOT;
}

export function inchesToMeters(value: number): number {
  return value * METERS_PER_INCH;
}

export function metersToInches(value: number): number {
  return value / METERS_PER_INCH;
}

export function dimensionsToMeters(dimensions: DimensionInches): DimensionMeters {
  return {
    width: inchesToMeters(dimensions.width),
    height: inchesToMeters(dimensions.height),
    length: inchesToMeters(dimensions.length),
  };
}

export function formatInches(value: number): string {
  const whole = Math.floor(value);
  const fraction = value - whole;
  const precision = Math.round(fraction * 16) / 16;
  return `${whole}${precision ? ` ${precision * 16}/16` : ""}"`.trim();
}
