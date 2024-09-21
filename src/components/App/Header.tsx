import React from 'react';
import {
  Image,
  Button,
  Group,
  Burger,
  rem,
  useComputedColorScheme,
  Drawer,
  Flex,
  Divider,
  ScrollArea,
  Title,
  ActionIcon,
  Kbd,
  Text
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
  { link: '/screener/page/1', label: 'Screener' },
  // { link: '/portfolio', label: 'Portfolio' }
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

  const itemsDrawer = links.map((link, index) => (
    <Link
      key={index + 1}
      to={link.link}
      className={
        isLinkActive(link.link)
          ? classes['link-drawer-active']
          : classes['link-drawer']
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
          <Group gap={5}>
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="sm"
              style={{ transform: 'translateX(-4px)' }}
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
            <ActionIcon
              hiddenFrom="sm"
              onClick={() => openSpotlight()}
              aria-label="Search for cryptocurrencies"
              bg="transparent"
              variant="default"
              radius="xl"
              color="light-dark(var(--mantine-text-color-black), var(--mantine-text-color-white))"
              size="lg"
              c="light-dark(var(--mantine-text-color-black), var(--mantine-text-color-white))"
            >
              <IconSearch stroke={1} size={22} />
            </ActionIcon>
            <Button
              classNames={{ root: classes.search }}
              display="flex"
              bg="transparent"
              variant="default"
              visibleFrom="sm"
              size="sm"
              onClick={() => openSpotlight()}
              leftSection={
                <>
                  <IconSearch
                    style={{
                      width: rem(16),
                      height: rem(16)
                    }}
                    stroke={1.5}
                  />
                  <Text size={rem(14)} fw={500} lh={0} ml={8} visibleFrom="xs">
                    Search
                  </Text>
                </>
              }
              fw="500"
              radius="xl"
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
        <Flex p="apart" justify="space-between" align="center">
          <Title order={2} fw={700}>
            <Image
              src={logo}
              h={32}
              radius="md"
              ml={-4}
              style={{
                filter: isDarkTheme ? 'invert()' : ''
              }}
            />
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
          style={{
            height: 'calc(100vh - 140px)',
            padding: '1rem 0',
            justifyContent: 'center',
            display: 'flex'
          }}
          type="scroll"
        >
          <Flex
            direction="column"
            justify="center"
            h="100%"
            style={{
              alignSelf: 'center'
            }}
          >
            {itemsDrawer}
          </Flex>
        </ScrollArea>
      </Drawer>
    </>
  );
}
