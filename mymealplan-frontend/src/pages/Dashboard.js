// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's account data from the "my-account" endpoint.
    const fetchData = async () => {
      try {
        const response = await api.get('my-account/');
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data || "Failed to load account data");
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Redirect to login page
    navigate('/login');
  };

  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Username: {userData.username}</p>
      <p>Meal Swipe Balance: {userData.meal_swipe_balance}</p>
      <p>Flex Dollars: {userData.flex_dollars}</p>
      {userData.meal_plan_option && (
        <p>Meal Plan: {userData.meal_plan_option}</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
