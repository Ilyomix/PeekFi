import React from 'react';
import {
  Image,
  Button,
  Group,
  Burger,
  rem,
  useComputedColorScheme,
  getThemeColor,
  useMantineTheme,
  Drawer,
  Flex,
  Divider,
  ScrollArea,
  Title,
  ActionIcon,
  Kbd
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconSearch, IconX } from '@tabler/icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { openSpotlight } from '@mantine/spotlight';
import classes from 'assets/components/header/index.module.css';
import { ThemeToggle } from './ThemeToggle';
import logo from 'assets/images/logo.svg';
import CryptoSearch from './CryptoSearch';

const links = [
  { link: '/screener/page/1', label: 'Screener' }
  // { link: '/portfolio', label: 'Portfolio' },
  // { link: '/settings', label: 'Settings' },
  // { link: '/pair/', label: 'Pair' }
  // { link: '/about/', label: 'About' }
];

export function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  });
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isDarkTheme = computedColorScheme === 'dark';

  const isLinkActive = (link: string) => {
    return pathname.split('/')[1] === link.split('/')[1];
  };

  const items = links.map((link, index) => (
    <Link
      key={index + 1}
      to={link.link}
      className={
        isLinkActive(link.link) ? classes['link-active'] : classes.link
      }
      onClick={close}
    >
      {link.label}
    </Link>
  ));

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
              h={26}
              src={logo}
              style={{
                filter: isDarkTheme ? 'invert()' : ''
              }}
              onClick={() => navigate('/')}
            />
          </Group>

          <Group>
            <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
              {items}
            </Group>
            <ThemeToggle />
            <Button
              classNames={{ root: classes.search }}
              display="flex"
              bg="transparent"
              variant="default"
              size="sm"
              onClick={() => openSpotlight()}
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
              radius="xl"
              visibleFrom="xs"
              rightSection={
                isDesktop && (
                  <>
                    <Kbd ml={rem(isDesktop ? 20 : 0)}>Ctrl</Kbd> + <Kbd>K</Kbd>
                  </>
                )
              }
            ></Button>
          </Group>
          <CryptoSearch />
        </div>
      </header>

      {/* Drawer for navigation links */}
      <Drawer
        opened={opened}
        onClose={close}
        padding="xl"
        position="right"
        size="xl"
        withCloseButton={false}
      >
        <Flex
          p="apart"
          justify="space-between"
          align="center"
          style={{ width: '100%' }}
        >
          <Title order={2} fw={700}>
            Menu
          </Title>
          <ActionIcon
            size="md"
            variant="transparent"
            c="light-dark(var(--mantine-color-gray-9), var(--mantine-color-gray))"
            onClick={close}
          >
            <IconX size="32" />
          </ActionIcon>
        </Flex>
        <Divider my="md" />

        <ScrollArea
          style={{ height: '70vh', paddingTop: '0rem' }}
          type="scroll"
        >
          {items}
          <Button
            className={classes.link}
            variant="light"
            onClick={() => {
              openSpotlight();
              close(); // Close the drawer when the search button is clicked
            }}
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
            radius="xl"
            fullWidth
            mt="md"
            fw="500"
            color={
              isDarkTheme
                ? getThemeColor('white', theme)
                : getThemeColor('gray.9', theme)
            }
          ></Button>
        </ScrollArea>
      </Drawer>
    </>
  );
}
