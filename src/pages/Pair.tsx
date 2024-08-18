import React, { useMemo } from 'react';
import { Avatar, Flex, Group, Paper, Text } from '@mantine/core';
import PageTransition from 'components/PageTransition';
import useCryptoTicker from 'hooks/useRealTimeCryptoTicker';
import { AnimatedCounter } from 'react-animated-counter';
import { useParams } from 'react-router-dom';
import { getNumberPrecision } from 'utils/getNumberPrecision';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconQuestionMark
} from '@tabler/icons-react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import * as reactSpring from '@react-spring/three';
import * as drei from '@react-three/drei';
import * as fiber from '@react-three/fiber';

import { getAssetsImageUrl } from 'utils/assetsIcons';
import AreaChart from 'components/AreaChart';
import 'assets/app/pair.css';

const renderCounter = (
  value: string | number,
  fontSize: string,
  decimalPrecision?: number,
  color?: string,
  valueMovementColor = true
) => (
  <AnimatedCounter
    fontSize={fontSize}
    includeCommas
    incrementColor={
      !valueMovementColor ? color : 'var(--mantine-color-teal-text)'
    }
    decrementColor={!valueMovementColor ? color : 'var(--mantine-color-red-5)'}
    value={Number(value)}
    decimalPrecision={decimalPrecision ?? getNumberPrecision(value, 2)}
    color={color}
  />
);

const Pair: React.FC = () => {
  const { pair } = useParams<{ pair: string }>();

  const { tickerData, loading, error } = useCryptoTicker(
    pair?.toLowerCase() || ''
  );

  const {
    symbol: tickerSymbol = 'Unknown',
    priceChange = '0',
    priceChangePercent = '0',
    highPrice = 'N/A',
    lowPrice = 'N/A',
    openPrice = 'N/A',
    price = '0',
    prevClosePrice = 'N/A',
    quoteVolume = 'N/A',
    volume = 'N/A',
    lastPrice = 'N/A',
    currencyPair = 'UNKNOWN'
  } = tickerData || {};

  const backgroundChartByDelta = (value: string | null) => {
    const parsedValue = parseFloat(value as string);
    if (parsedValue === 0 || !value)
      return 'https://www.shadergradient.co/customize?animate=on&axesHelper=on&bgColor1=%23000000&bgColor2=%23000000&brightness=2.8&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=95&cameraZoom=1&color1=%23495057&color2=%23343a40&color3=%23424242&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=-2.1&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=225&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.8&uFrequency=5.5&uSpeed=0.03&uStrength=3&uTime=0.2&wireframe=false';
    return parsedValue > 0
      ? 'https://www.shadergradient.co/customize?animate=on&axesHelper=on&bgColor1=%23000000&bgColor2=%23000000&brightness=2.2&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=95&cameraZoom=1&color1=%2312b886&color2=%2396f2d7&color3=%2363e6be&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=-2.1&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=225&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.8&uFrequency=5.5&uSpeed=0.03&uStrength=3&uTime=0.2&wireframe=false'
      : 'https://www.shadergradient.co/customize?animate=on&axesHelper=on&bgColor1=%23000000&bgColor2=%23000000&brightness=2.8&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=95&cameraZoom=1&color1=%23e03131&color2=%23f03e3e&color3=%23c92a2a&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=-2.1&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=225&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.8&uFrequency=5.5&uSpeed=0.03&uStrength=3&uTime=0.2&wireframe=false';
  };

  const getColorClass = (value: number | string) => {
    if (Number(value) === 0) return 'var(--mantine-color-gray-text)';
    return Number(value) > 0
      ? 'var(--mantine-color-teal-4)'
      : 'var(--mantine-color-red-4)';
  };

  const getDiffIcon = (value: number | string) => {
    return Number(value) > 0 ? IconArrowUpRight : IconArrowDownRight;
  };

  const DiffIcon = useMemo(() => getDiffIcon(priceChange), [priceChange]);

  const colorClass = useMemo(
    () => getColorClass(Number(priceChange)),
    [priceChange]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PageTransition>
      <Paper
        shadow="xl"
        radius="xl"
        style={{
          background: 'transparent',
          position: 'relative'
        }}
      >
        <ShaderGradientCanvas
          importedFiber={{ ...fiber, ...drei, ...reactSpring }}
          style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            zIndex: -1,
            borderRadius: '30px'
          }}
        >
          <ShaderGradient
            control="query"
            urlString={backgroundChartByDelta(priceChangePercent)}
          />
        </ShaderGradientCanvas>
        <Flex align="flex-start" direction="column">
          <Flex
            justify="center"
            align="center"
            title={tickerSymbol}
            mb={21}
            ml={7}
            p={32}
          >
            {tickerSymbol && (
              <Avatar
                src={getAssetsImageUrl(
                  tickerSymbol.replace(/USDT|USD|EUR|GBP|AUD|JPY|TRY/g, '')
                )}
                alt={tickerSymbol.toUpperCase() || ''}
                size="md"
                mr={14}
              >
                <IconQuestionMark />
              </Avatar>
            )}
            <Text
              component="div"
              fw={600}
              size="xl"
              c="white"
              style={{ letterSpacing: '2px' }}
            >
              {tickerSymbol}
            </Text>
          </Flex>
          <Group align="flex-start" justify="flex-start" gap={4}>
            <Text
              component="div"
              mt={-40}
              mb={21}
              ml={28}
              fw={200}
              c="white"
              style={{ letterSpacing: '-4px' }}
            >
              {renderCounter(
                price,
                '100px',
                undefined,
                'var(--mantine-color-dark)'
              )}
            </Text>
            <Group mt={17} ml={14}>
              <Text
                component="div"
                c={getColorClass(priceChange)}
                fz="md"
                mt={0}
                fw={500}
                className="diff"
              >
                {priceChange ? (
                  <Flex>
                    {renderCounter(
                      priceChangePercent,
                      '28px',
                      2,
                      getColorClass(priceChange)
                    )}
                    <Text size="28px" c={colorClass} mt={1}>
                      {'%'}
                    </Text>
                  </Flex>
                ) : (
                  '0.00%'
                )}
                {Number(priceChange) !== 0 && (
                  <DiffIcon size="40px" stroke={1.5} />
                )}
              </Text>
              {priceChange && (
                <Flex
                  ml={-7}
                  mt={2}
                  fw={500}
                  align="flex-start"
                  justify="flex-start"
                >
                  <Text fw={500} size="24px" c={colorClass}>
                    {'('}
                  </Text>
                  {renderCounter(
                    priceChange,
                    '24px',
                    getNumberPrecision(priceChange),
                    getColorClass(priceChange)
                  )}
                  <Text fw={500} size="24px" c={colorClass}>
                    {')'}
                  </Text>
                </Flex>
              )}
            </Group>
          </Group>
          <AreaChart symbol={tickerSymbol} interval={'1s'} />
        </Flex>
        {/* <p>
        Change: {priceChange} ({priceChangePercent}%)
      </p>
      <p>High: {highPrice}</p>
      <p>Low: {lowPrice}</p>
      <p>Open: {openPrice}</p>
      <p>Prev Close: {prevClosePrice}</p>
      <p>Volume: {volume}</p>
      <p>Quote Volume: {quoteVolume}</p>
      <p>Last Price: {lastPrice}</p>
      <p>Currency Pair: {currencyPair}</p> */}
      </Paper>
    </PageTransition>
  );
};

Pair.displayName = 'Pair'; // Ensuring the component has a display name

export default Pair;
