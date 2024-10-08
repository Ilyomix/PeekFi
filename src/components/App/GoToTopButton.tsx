import React from 'react';
import { useWindowScroll } from '@mantine/hooks';
import { ActionIcon, Transition } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import { animate } from 'framer-motion';
import PageTransition from './PageTransition';

interface GoToTopButtonProps {
  color?: string;
}

const GoToTopButton: React.FC<GoToTopButtonProps> = ({ color }) => {
  const [scroll, scrollTo] = useWindowScroll();

  const handleScrollToTop = () => {
    // Smoothly animate the scroll.y position to 0
    animate(scroll.y, 0, {
      duration: 0.2, // Adjust the duration for the easing effect
      ease: 'easeInOut',
      onUpdate: (latest) => {
        scrollTo({ y: latest });
      }
    });
  };

  return (
    <PageTransition>
      <Transition
        mounted={scroll.y > 100} // Show the button after scrolling 100px
        transition="slide-up"
        keepMounted
        duration={300}
        exitDelay={150}
        timingFunction="ease"
      >
        {(styles) => (
          <ActionIcon
            className="go-to-top-button"
            onClick={handleScrollToTop}
            size="xl"
            radius="xl"
            variant="filled"
            color={color || 'dark.7'}
            style={{
              ...styles
            }}
          >
            <IconArrowUp size="1.25rem" />
          </ActionIcon>
        )}
      </Transition>
    </PageTransition>
  );
};

export default GoToTopButton;
