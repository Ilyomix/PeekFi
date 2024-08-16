import { motion } from 'framer-motion';
import { PropsWithChildren, ReactNode } from 'react';

const PageTransition: (props: PropsWithChildren) => ReactNode = (props) => {
  const { children } = props;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
