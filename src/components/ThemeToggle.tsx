import cx from 'clsx';
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Group
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
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
        color={computedColorScheme === 'light' ? 'cyan' : 'yellow'}
        variant="light"
        radius="xl"
        size="lg"
        aria-label="Toggle color scheme"
        className={classes.button}
      >
        <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
        <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
      </ActionIcon>
    </Group>
  );
}
