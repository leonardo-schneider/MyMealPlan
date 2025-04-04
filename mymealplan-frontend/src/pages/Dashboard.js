<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  const [mealsLeft, setMealsLeft] = useState(9); // example starting value
  const maxMeals = 20;

  const handleMealChange = (change) => {
    setMealsLeft(prev => {
      const updated = prev + change;
      if (updated < 0) return 0;
      if (updated > maxMeals) return maxMeals;
      return updated;
    });

    // TODO: Add API call here to update meal count on the backend
  };


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
          setError('Failed to fetch account data.');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setAccountData(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching account data.');
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* NAVIGATION BAR */}
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <Link to="/home" className="logo">MyMealPlan</Link>
        </div>

        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>

          {/* Desktop only dropdown */}
          <div className="profile-dropdown desktop-only">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>Profile ▾</button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile">Go to Profile</Link>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </div>

          {/* Mobile view profile links */}
          {mobileMenuOpen && (
            <div className="mobile-only">
              <Link to="/profile">Go to Profile</Link>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
              <h3>Hi, {accountData?.first_name || "Student"}!</h3>
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
          
          {/*Meals Progress*/}
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
                  strokeDasharray={314}
                  strokeDashoffset={(1 - mealsLeft / maxMeals) * 314}
                />
              </svg>

              <div className="circle-center">
                <span className="meals-number">{mealsLeft}</span>
                <span className="meals-label">Meals Left</span>
              </div>
            </div>
          </div>


          <div className="meals-edit">
            <h3>Edit Meals</h3>
            <div className="edit-controls">
              <button onClick={() => handleMealChange(-1)}>-</button>
              <span>1</span>
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
          <div className="box flex-box">[ Flex Money Box ]</div>
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
=======
>>>>>>> 44e598f9ff4dc5e2816f9985bf2b4d783186ea69
