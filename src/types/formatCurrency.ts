/**
 * A utility function to format numbers into currency strings.
 *
 * @param value - The numeric value to be formatted
 * @param currency - The currency code (default is USD)
 * @param locale - The locale for formatting (default is en-US)
 * @returns A string representing the formatted currency value
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
};
