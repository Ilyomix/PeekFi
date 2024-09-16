export const getNumberPrecision: (
  value: number | string,
  minPrecision?: number
) => number = (value: number | string, minPrecision = 0) => {
  if (!value) return 0;
  const valueToFormat = value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 16
  });

  const valueToParse = Number(valueToFormat).toString().split('.')[1];

  if (!valueToParse) return 2; // Return precision = 2 in case of the value is a pure Integer

  const precisionValue = valueToFormat.split('.')[1].length;

  return minPrecision < precisionValue ? precisionValue : minPrecision;
};
