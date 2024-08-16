export const getNumberPrecision: (
  value: number | string,
  minPrecision?: number
) => number = (value: number | string, minPrecision = 0) => {
  if (!value) return 0;

  const valueToParse = Number(value).toString().split('.')[1];

  if (!valueToParse) return 2; // Return precision = 2 in case of the value is a pure Integer

  const precisionValue = valueToParse.length;

  return minPrecision < precisionValue ? precisionValue : minPrecision;
};
