import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await fetch('http://localhost:8000/api/my-account/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Use backend values
  const mealsLeft = accountData.meal_swipe_balance; // current balance from backend
  const totalMeals = accountData.total_meal_swipes;  // total provided by the plan

  // Calculate progress for the SVG circle (assuming a circle radius of 50)
  const circleCircumference = 314; // 2 * π * 50
  const progressOffset = totalMeals ? (1 - (mealsLeft / totalMeals)) * circleCircumference : 0;

  // Update meal swipe balance locally with an upper bound check
  const handleMealChange = (change) => {
    setAccountData(prevData => {
      const maxMeals = prevData.total_meal_swipes || 0;
      const newBalance = prevData.meal_swipe_balance + change;
      return {
        ...prevData,
        meal_swipe_balance: Math.min(maxMeals, Math.max(0, newBalance))
      };
    });
  };

  return (
    <>
      {/* NAVIGATION BAR */}
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <Link to="/home" className="logo">MyMealPlan</Link>
        </div>
        <div className="navbar-links">
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <div className="profile-dropdown desktop-only">
            <button>Profile ▾</button>
            <div className="dropdown-menu">
              <Link to="/profile">Go to Profile</Link>
              <button onClick={() => {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                navigate('/login');
              }}>Sign Out</button>
            </div>
          </div>
        </div>
        <div className="hamburger" onClick={() => { /* toggle mobile menu */ }}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </nav>

      {/* DASHBOARD LAYOUT */}
      <div className="dashboard-grid">
        {/* Column 1 */}
        <div className="column column-1">
          <div className="box greeting-box">
            <div className="greeting-content">
              <div className="avatar-wrapper">
                <div className="avatar"></div>
              </div>
              <div className="greeting-text">
                <h3>Hi, {accountData.first_name || "Student"}!</h3>
                <a href="/profile">Profile</a>
              </div>
            </div>
          </div>
          <div className="box meals-box">
            <div className="meals-header">
              <div>
                <p>Spring 2025</p>
                <p>Week 3/23 - 3/28</p>
              </div>
              <div className="meals-links">
                <a href="#">View My Meal Plan</a>
                <a href="/profile">View My Profile</a>
              </div>
            </div>
            {/* Meals Progress */}
            <div className="meals-progress">
              <div className="circle-wrapper">
                <svg className="progress-ring" width="120" height="120">
                  <circle
                    className="progress-ring__bg"
                    stroke="#eee"
                    strokeWidth="10"
                    fill="transparent"
                    r="50"
                    cx="60"
                    cy="60"
                  />
                  <circle
                    className="progress-ring__circle"
                    stroke="#13D23A"
                    strokeWidth="10"
                    fill="transparent"
                    r="50"
                    cx="60"
                    cy="60"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={progressOffset}
                  />
                </svg>
                <div className="circle-center">
                  <span className="meals-number">{mealsLeft}</span>
                  <span className="meals-label">Meals Left</span>
                </div>
              </div>
            </div>

            {/* Edit Meals Section */}
            <div className="meals-edit">
              <h3>Edit Meals</h3>
              <div className="edit-controls">
                <button onClick={() => handleMealChange(-1)}>-</button>
                <span>{accountData.meal_swipe_balance}</span>
                <button onClick={() => handleMealChange(1)}>+</button>
              </div>
            </div>
            <p className="meals-note">
              Meal swipes can be used in Cafeteria, C-Store, Daily Grind, or Dusty’s.
            </p>
          </div>
        </div>

        {/* Column 2 */}
        <div className="column column-2">
          <div className="box flex-box">
            <h3>Flex Dollars</h3>
            <p>${accountData.flex_dollars}</p>
          </div>
          <div className="box transactions-box">[ Transaction History Box ]</div>
        </div>

        {/* Column 3 */}
        <div className="column column-3">
          <div className="box links-box">[ Useful Links Box ]</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
