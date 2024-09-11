import cx from 'clsx';
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Group
} from '@mantine/core';
import { IconMoonStars, IconSunFilled } from '@tabler/icons-react';
import classes from 'assets/components/themeToggle/index.module.css';

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme({
    keepTransitions: true
  });
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  });

  return (
    <Group justify="center">
      <ActionIcon
        onClick={() =>
          setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
        }
        aria-label="Toggle color scheme"
        className={classes.button}
        variant="default"
        bg="transparent"
        color="light-dark(black, yellow)"
        radius="xl"
        size="lg"
      >
        {computedColorScheme === 'dark' ? (
          <IconSunFilled className={cx(classes.icon, classes.light)} />
        ) : (
          <IconMoonStars className={cx(classes.icon, classes.dark)} />
        )}
      </ActionIcon>
    </Group>
  );
}
