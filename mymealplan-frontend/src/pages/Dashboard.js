import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  // State to hold account data from the backend
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/my-account/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // If using authentication, include the access token:
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch account data');
        }
        const data = await response.json();
        setAccountData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (loading) return <div>Loading account data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard-container">
      {/* Greeting */}
      <div className="dashboard-header">
        <h2>Hi, {accountData.first_name}!</h2>
      </div>
      
      {/* Grid Cards */}
      <div className="dashboard-grid">
        {/* Card for Meal Swipes */}
        <div className="card meal-swipes">
          <h3>Meal Swipes</h3>
          <p>{accountData.meal_swipe_balance}</p>
        </div>
        {/* Card for Flex Dollars */}
        <div className="card flex-dollars">
          <h3>Flex Dollars</h3>
          <p>${accountData.flex_dollars}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
