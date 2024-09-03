import { motion } from 'framer-motion';
import { PropsWithChildren, ReactNode } from 'react';

const PageTransition: (
  props: PropsWithChildren & { duration?: number }
) => ReactNode = (props) => {
  const { children, duration = 0.25 } = props;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
