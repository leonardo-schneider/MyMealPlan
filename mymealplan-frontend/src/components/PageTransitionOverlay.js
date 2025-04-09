// src/components/PageTransitionOverlay.js
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const overlayVariants = {
  initial: { y: '100%' },
  enter: {
    y: 0,
    transition: { duration: 0.6, ease: 'easeInOut' }
  },
  exit: {
    y: '100%',
    transition: { duration: 0.6, ease: 'easeInOut', delay: 0.2 }
  },
};

export default function PageTransitionOverlay({ trigger }) {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start('enter');
      await controls.start('exit');
    };
    if (trigger) {
      sequence();
    }
  }, [trigger, controls]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-black z-50"
      initial="initial"
      animate={controls}
      variants={overlayVariants}
    />
  );
}
