// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [swipesToSubtract, setSwipesToSubtract] = useState('');
  const [flexToSubtract, setFlexToSubtract] = useState('');
  const navigate = useNavigate();

  // Fetch updated user data from the "my-account" endpoint.
  const fetchData = async () => {
    try {
      const response = await api.get('my-account/');
      setUserData(response.data);
    } catch (err) {
      setError(err.response?.data || "Failed to load account data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle the transaction submission.
  const handleTransaction = async (e) => {
    e.preventDefault();
    // Convert empty inputs to zero.
    const swipes = swipesToSubtract ? parseInt(swipesToSubtract, 10) : 0;
    const flex = flexToSubtract ? parseFloat(flexToSubtract) : 0;

    // Ensure at least one value is provided.
    if (swipes === 0 && flex === 0) {
      setError("Please enter a value for either meal swipes or flex dollars.");
      return;
    }

    // Prepare the payload.
    const payload = {
      amount: swipes, // meal swipes to subtract
      cash: flex,     // flex dollars to subtract
    };

    try {
      // Send the transaction request to the backend.
      await api.post('transactions/', payload);
      // Refresh user data after transaction.
      await fetchData();
      // Clear input fields.
      setSwipesToSubtract('');
      setFlexToSubtract('');
      setError(null);
    } catch (err) {
      setError(err.response?.data || "Transaction failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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

      <h3>Make a Transaction</h3>
      <form onSubmit={handleTransaction}>
        <div>
          <label>Swipes to subtract (optional):</label>
          <input
            type="number"
            value={swipesToSubtract}
            onChange={(e) => setSwipesToSubtract(e.target.value)}
            placeholder="Enter meal swipes"
            min = "0"
          />
        </div>
        <div>
          <label>Flex dollars to subtract (optional):</label>
          <input
            type="number"
            step="0.01"
            value={flexToSubtract}
            onChange={(e) => setFlexToSubtract(e.target.value)}
            placeholder="Enter flex dollars"
            min = "0"
          />
        </div>
        <button type="submit">Submit Transaction</button>
      </form>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
