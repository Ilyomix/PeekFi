import React, {
  memo,
  useEffect,
  useCallback,
  useRef,
  useState,
  CSSProperties
} from 'react';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import './styles.css';

export interface AnimatedCounterProps {
  value?: number;
  fontSize?: string;
  color?: string;
  incrementColor?: string;
  decrementColor?: string;
  animationDuration?: string;
  includeDecimals?: boolean;
  decimalPrecision?: number;
  includeCommas?: boolean;
  containerStyles?: CSSProperties;
  digitStyles?: CSSProperties;
  locale?: string;
}

export interface NumberColumnProps {
  digit: string;
  delta: string | null;
  fontSize: string;
  color: string;
  incrementColor: string;
  decrementColor: string;
  animationDuration: string;
  digitStyles: CSSProperties;
  locale: string;
}

export interface DecimalColumnProps {
  fontSize: string;
  color: string;
  separator: string;
  isDecimalPoint: boolean;
  digitStyles: CSSProperties;
}

// Custom hook to get the previous value
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Function to get the decimal and group separators for the locale
function getSeparators(locale: string): {
  decimalSeparator: string;
  groupSeparator: string;
} {
  const numberWithDecimal = 1.1;
  const numberWithGroup = 1000;

  const formattedNumberWithDecimal = numberWithDecimal.toLocaleString(locale);
  const formattedNumberWithGroup = numberWithGroup.toLocaleString(locale);

  const decimalSeparator =
    formattedNumberWithDecimal.replace(/\d/g, '')[0] || '.';
  const groupSeparatorMatch = formattedNumberWithGroup.match(/1(.*)000/);
  const groupSeparator = groupSeparatorMatch ? groupSeparatorMatch[1] : '';

  return {
    decimalSeparator,
    groupSeparator
  };
}

// Function to format the number for display
function formatForDisplay(
  value: number,
  includeDecimals: boolean,
  decimalPrecision: number,
  includeCommas: boolean,
  locale: string
): string[] {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: includeDecimals ? decimalPrecision : 0,
    maximumFractionDigits: includeDecimals ? decimalPrecision : 0,
    useGrouping: includeCommas
  };
  const formattedNumber = value.toLocaleString(locale, options);
  return formattedNumber.split('').reverse();
}

// Decimal element component
const DecimalColumn = ({
  fontSize,
  color,
  separator,
  isDecimalPoint,
  digitStyles
}: DecimalColumnProps) => (
  <span
    style={{
      fontSize: fontSize,
      lineHeight: fontSize,
      color: color,
      width: !isDecimalPoint ? '0.25em' : 'inherit',
      marginLeft: `calc(-${fontSize} / 10)`,
      ...digitStyles
    }}
  >
    {separator}
  </span>
);

// Individual number element component
const NumberColumn = memo(
  ({
    digit,
    delta,
    fontSize,
    color,
    incrementColor,
    decrementColor,
    animationDuration,
    digitStyles,
    locale
  }: NumberColumnProps) => {
    const localizedDigits = [...Array(10).keys()]
      .map((num) => num.toLocaleString(locale))
      .reverse();

    const currentDigitIndex = localizedDigits.indexOf(digit);
    const previousDigitIndex = usePrevious(currentDigitIndex);

    const [position, setPosition] = useState<number>(0);
    const [animationClass, setAnimationClass] = useState<string | null>(null);
    const columnContainer = useRef<HTMLDivElement>(null);

    // Handle animation completion
    const handleAnimationComplete = debounce(() => {
      setAnimationClass('');
    }, 500);

    const setColumnToNumber = useCallback((digitIndex: number) => {
      if (columnContainer.current) {
        const digitHeight = columnContainer.current.clientHeight;
        setPosition(digitHeight * 9 - digitHeight * digitIndex);
      }
    }, []);

    useEffect(() => {
      if (
        currentDigitIndex !== -1 &&
        previousDigitIndex !== undefined &&
        previousDigitIndex !== -1
      ) {
        setAnimationClass(
          previousDigitIndex !== currentDigitIndex ? delta : ''
        );
      }
    }, [currentDigitIndex, delta, previousDigitIndex]);

    useEffect(() => {
      if (currentDigitIndex !== -1) {
        setColumnToNumber(currentDigitIndex);
      }
    }, [currentDigitIndex, setColumnToNumber]);

    // If digit is not a number (e.g., negative sign), render it directly
    if (currentDigitIndex === -1) {
      return (
        <span
          style={{
            color: color,
            fontSize: fontSize,
            lineHeight: fontSize,
            marginRight: `calc(${fontSize} / 5)`,
            ...digitStyles
          }}
        >
          {digit}
        </span>
      );
    }

    return (
      <div
        className="ticker-column-container"
        ref={columnContainer}
        style={
          {
            fontSize: fontSize,
            lineHeight: fontSize,
            height: 'auto',
            '--increment-color': `${incrementColor}`,
            '--decrement-color': `${decrementColor}`,
            '--animation-duration': `${animationDuration}`,
            ...digitStyles
          } as React.CSSProperties
        }
      >
        <motion.div
          animate={{
            x: 0,
            y: position,
            transition: { duration: 0.5, ease: 'backInOut' }
          }}
          className={`ticker-column ${animationClass}`}
          onAnimationComplete={handleAnimationComplete}
        >
          {localizedDigits.map((num) => (
            <div className="ticker-digit" key={num}>
              <span
                style={{
                  ...digitStyles,
                  fontSize: fontSize,
                  lineHeight: fontSize,
                }}
              >
                {num}
              </span>
            </div>
          ))}
        </motion.div>
        <span className="number-placeholder">0</span>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.digit === nextProps.digit && prevProps.delta === nextProps.delta
);

NumberColumn.displayName = 'NumberColumn';

// Main component
const AnimatedCounter = ({
  value = 0,
  fontSize = '18px',
  color = 'black',
  incrementColor = '#32cd32',
  decrementColor = '#fe6862',
  animationDuration = '1000ms',
  includeDecimals = true,
  decimalPrecision = 2,
  includeCommas = false,
  containerStyles = {},
  digitStyles = {},
  locale = navigator.language // Provide a default value for the locale parameter
}: AnimatedCounterProps) => {
  const { decimalSeparator, groupSeparator } = getSeparators(locale);

  const numArray = formatForDisplay(
    value,
    includeDecimals,
    decimalPrecision,
    includeCommas,
    locale
  );
  const previousNumber = usePrevious(value);

  let delta: string | null = null;

  if (previousNumber !== undefined) {
    if (value > previousNumber) {
      delta = 'increase';
    } else if (value < previousNumber) {
      delta = 'decrease';
    }
  }

  const numberColumnCommonProps = {
    delta,
    color,
    fontSize,
    incrementColor,
    decrementColor,
    animationDuration,
    digitStyles,
    locale
  };

  return (
    <motion.div layout className="ticker-view" style={{ ...containerStyles }}>
      {numArray.map((number: string, index: number) =>
        number === decimalSeparator || number === groupSeparator ? (
          <DecimalColumn
            key={index}
            fontSize={fontSize}
            color={color}
            separator={number}
            isDecimalPoint={number === decimalSeparator}
            digitStyles={digitStyles}
          />
        ) : (
          <NumberColumn
            key={index}
            digit={number}
            {...numberColumnCommonProps}
          />
        )
      )}
    </motion.div>
  );
};

export default AnimatedCounter;
