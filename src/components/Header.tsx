import {
  Image,
  Button,
  Group,
  Burger,
  Kbd,
  rem,
  useComputedColorScheme,
  getThemeColor,
  useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import classes from 'assets/components/header/index.module.css';
import { ThemeToggle } from './ThemeToggle';
import logo from 'assets/logo.png';

const links = [
  { link: '/', label: 'Screener' },
  { link: '/portfolio', label: 'Portfolio' },
  { link: '/settings', label: 'Settings' },
  { link: '/about', label: 'About' }
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  });

  const { pathname } = useLocation();
  const theme = useMantineTheme();

  const isDarkTheme = computedColorScheme === 'dark';

  const items = links.map((link, index) => {
    return (
      <Link
        key={index + 1}
        to={link.link}
        className={
          pathname === link.link ? classes['link-active'] : classes.link
        }
      >
        {link.label}
      </Link>
    );
  });

  return (
    <>
      <header className={classes.header}>
        <div className={classes.inner}>
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="sm"
            />
            <Image
              className={classes.logo}
              radius="md"
              w="100"
              src={logo}
              style={{
                filter: isDarkTheme ? 'invert()' : ''
              }}
            />
          </Group>

          <Group>
            <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
              {items}
            </Group>
            <ThemeToggle />
            <Button
              classNames={{ root: classes.search }}
              variant="light"
              leftSection={
                <>
                  <IconSearch
                    style={{
                      width: rem(16),
                      height: rem(16),
                      marginRight: rem(8)
                    }}
                    stroke={1.5}
                  />
                  Search
                </>
              }
              fw="500"
              color={
                isDarkTheme
                  ? getThemeColor('white', theme)
                  : getThemeColor('gray.7', theme)
              }
              radius="xl"
              rightSection={
                <div>
                  <Kbd>Ctrl</Kbd> + <Kbd>F</Kbd>
                </div>
              }
              visibleFrom="xs"
            />
          </Group>
        </div>
      </header>
    </>
  );
}
