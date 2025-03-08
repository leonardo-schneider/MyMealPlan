import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MealPlanSelection from './pages/MealPlanSelection';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for user registration */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Route for user login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route for the user's dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Route for selecting meal plans */}
        <Route path="/meal-plans" element={<MealPlanSelection />} />
        
        {/* Fallback route for unmatched URLs */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
