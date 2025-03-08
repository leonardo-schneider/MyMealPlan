// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

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
    </div>
  );
};

export default Dashboard;
