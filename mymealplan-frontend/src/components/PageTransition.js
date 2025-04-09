// src/components/PageTransition.js
import { motion, AnimatePresence } from 'framer-motion';
import './PageTransition.css';

const transitionVariants = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '-100%' },
};

const PageTransition = ({ children }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          className="transition-screen"
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      {children}
    </>
  );
};

export default PageTransition;
