import {
  Image,
  Button,
  Group,
  Burger,
  Kbd,
  rem,
  useComputedColorScheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import classes from 'assets/components/header/index.module.css';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { link: '/', label: 'Screener' },
  { link: '/pair/d', label: 'Pair' },
  { link: '/settings', label: 'Settings' }
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  });

  const isDarkTheme = computedColorScheme === 'dark';

  const items = links.map((link, index) => (
    <Link key={index + 1} to={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <>
      <header className={classes.header}>
        <div
          className={
            isDarkTheme ? classes['inner-dark'] : classes['inner-light']
          }
        >
          <Group>
            <Image
              className={classes.logo}
              radius="md"
              w="100"
              src="./src/assets/logo.png"
              style={{
                filter: isDarkTheme ? 'invert()' : ''
              }}
            />
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="sm"
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
              color="gray"
              fw="400"
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
