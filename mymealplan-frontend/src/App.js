import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import Home from './pages/Home';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for home page */}
        <Route path="/home" element={<Home/>} />

        {/* Route for user registration */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Route for user login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route for the user's dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Route to profile */}
        <Route path="/profile" element={<Profile />} />
        
        {/* Fallback route for unmatched URLs */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
