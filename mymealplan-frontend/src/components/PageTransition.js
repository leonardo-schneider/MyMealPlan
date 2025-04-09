import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

const overlayVariants = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '-100%' },
};

const TransitionOverlay = () => {
  const location = useLocation();
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, 1000); // keep in sync with animation

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          className="transition-overlay"
          key={location.pathname}
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
};

export default TransitionOverlay;