// utils/scrollLock.ts

export const lockBodyScroll = () => {
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.marginRight = `-${scrollBarWidth}px`; // Prevent content shift
};

export const unlockBodyScroll = () => {
  document.body.style.overflow = '';
  document.body.style.marginRight = 'inherit'; // Reset padding when unlocking
};
