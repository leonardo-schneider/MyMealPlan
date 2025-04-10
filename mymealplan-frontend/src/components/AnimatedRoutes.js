// src/components/AnimatedRoutes.js
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PageTransitionOverlay from './PageTransitionOverlay';

import Home from '../pages/Home';
import About from '../pages/About';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/RegisterPage';
import Login from '../pages/LoginPage';
import ForgotPassword from '../pages/ForgotPassword';
import Profile from '../pages/Profile';

const MotionWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

export default function AnimatedRoutes({ token, onMealPlanUpdate, mealPlan })
  {
  const location = useLocation();
  const [transitionTrigger, setTransitionTrigger] = useState(false);

  useEffect(() => {
    setTransitionTrigger(true);
    const timeout = setTimeout(() => setTransitionTrigger(false), 1200); // matches overlay duration
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      <PageTransitionOverlay trigger={transitionTrigger} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/about" element={<MotionWrapper><About /></MotionWrapper>} />
          <Route path="/dashboard" element={<MotionWrapper><Dashboard mealPlan={mealPlan} /></MotionWrapper>} />
          <Route path="/register" element={<MotionWrapper><Register /></MotionWrapper>} />
          <Route path="/login" element={<MotionWrapper><Login /></MotionWrapper>} />
          <Route path="/home" element={<MotionWrapper><Home /></MotionWrapper>} />
          <Route path="/forgot-password" element={<MotionWrapper><ForgotPassword /></MotionWrapper>} />
          <Route path="/profile" element={<MotionWrapper key={token}><Profile token={token} onMealPlanUpdate={onMealPlanUpdate} /></MotionWrapper>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}