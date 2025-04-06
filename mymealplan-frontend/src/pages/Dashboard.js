import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingMeals, setPendingMeals] = useState(null);
  const navigate = useNavigate();
  const [flexAmount, setFlexAmount] = useState('');
  const [showFlexConfirm, setShowFlexConfirm] = useState(false);

  {/*Date Constants*/}
  const today = new Date();
  const year = today.getFullYear();
  const spring = [new Date(year, 0, 1), new Date(year, 4, 1)];
  const summer = [new Date(year, 4, 2), new Date(year, 7, 11)];
  const fall = [new Date(year, 7, 12), new Date(year, 11, 20)];


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
        if (!response.ok) throw new Error('Failed to fetch account data');
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

  const handleMealChange = (change) => {
    setPendingMeals(prev => {
      const current = prev !== null ? prev : accountData.meal_swipe_balance;
      const updated = current + change;
      const max = accountData.total_meal_swipes;
      return Math.min(max, Math.max(0, updated));
    });
  };

  const handleConfirmMeals = async () => {
    if (pendingMeals === null || pendingMeals === accountData.meal_swipe_balance) return;

    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8000/api/my-account/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ meal_swipe_balance: pendingMeals }),
      });

      if (!response.ok) throw new Error('Failed to update meals');
      const updatedData = await response.json();
      setAccountData(updatedData);
      setPendingMeals(null);
    } catch (err) {
      console.error('Meal update error:', err);
      alert("There was an error saving your changes.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const mealsLeft = pendingMeals !== null ? pendingMeals : accountData.meal_swipe_balance;
  const totalMeals = accountData.total_meal_swipes;
  const circleCircumference = 314;
  const progressOffset = totalMeals ? (1 - (mealsLeft / totalMeals)) * circleCircumference : 0;

  return (
    <>
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <Link to="/home" className="logo">MyMealPlan</Link>
        </div>
        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <div className="profile-dropdown desktop-only">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>Profile ▾</button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile">Go to Profile</Link>
                <button onClick={() => {
                  localStorage.removeItem('access');
                  localStorage.removeItem('refresh');
                  navigate('/login');
                }}>Sign Out</button>
              </div>
            )}
          </div>
          {mobileMenuOpen && (
            <div className="mobile-only">
              <Link to="/profile">Go to Profile</Link>
              <button onClick={() => {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                navigate('/login');
              }}>Sign Out</button>
            </div>
          )}
        </div>
        <div className="hamburger" onClick={() => setMobileMenuOpen(prev => !prev)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </nav>

      <div className="dashboard-grid">
        <div className="column column-1">
          <div className="box greeting-box">
            <div className="greeting-content">
              <div className="avatar-wrapper"><div className="avatar"></div></div>
              <div className="greeting-text">
                <h3>Hi, {accountData.first_name || "Student"}!</h3>
                <a href="/profile">Profile</a>
              </div>
            </div>
          </div>

          <div className="box meals-box">
            <div className="meals-header">
              <div>
                <p>{(() => {
                if (today >= spring[0] && today <= spring[1]) return `Spring ${year}`;
                if (today >= summer[0] && today <= summer[1]) return `Summer ${year}`;
                if (today >= fall[0] && today <= fall[1]) return `Fall ${year}`;
                return `Winter ${year}`;
              })()}</p>
                <p>Week 3/23 - 3/28</p></div>
              <div className="meals-links">
                <a href="#">View My Meal Plan</a>
                <a href="/profile">View My Profile</a>
              </div>
            </div>

            <div className="meals-progress">
              <div className="circle-wrapper">
                <svg className="progress-ring" width="120" height="120">
                  <circle className="progress-ring__bg" stroke="#eee" strokeWidth="10" fill="transparent" r="50" cx="60" cy="60" />
                  <circle className="progress-ring__circle" stroke="#13D23A" strokeWidth="10" fill="transparent" r="50" cx="60" cy="60" strokeDasharray={circleCircumference} strokeDashoffset={progressOffset} />
                </svg>
                <div className="circle-center">
                  <span className="meals-number">{mealsLeft}</span>
                  <span className="meals-label">Meals Left</span>
                </div>
              </div>
            </div>

            <div className="meals-edit">
              <h3>Edit Meals:</h3>
              <div className="edit-controls">
                <button onClick={() => handleMealChange(-1)}>-</button>
                <span>{mealsLeft}</span>
                <button onClick={() => handleMealChange(1)}>+</button>

                {pendingMeals !== null && pendingMeals !== accountData.meal_swipe_balance && (
                  <button className="confirm-btn" onClick={handleConfirmMeals}>
                    ✓
                  </button>
                )}
              </div>
            </div>


            <p className="meals-note">
              Meal swipes can be used in Cafeteria, C-Store, Daily Grind, or Dusty’s.
            </p>
          </div>
        </div>

        <div className="column column-2">
          <div className="box flex-box">
            <div className="flex-top">
              <p className="flex-term">{(() => {
                const today = new Date();
                const year = today.getFullYear();
                const spring = [new Date(year, 0, 1), new Date(year, 4, 1)];
                const summer = [new Date(year, 4, 2), new Date(year, 7, 11)];
                const fall = [new Date(year, 7, 12), new Date(year, 11, 20)];

                if (today >= spring[0] && today <= spring[1]) return `Spring ${year}`;
                if (today >= summer[0] && today <= summer[1]) return `Summer ${year}`;
                if (today >= fall[0] && today <= fall[1]) return `Fall ${year}`;
                return `Winter ${year}`;
              })()}</p>
              <p className="flex-amount">${Number(accountData.flex_dollars).toFixed(2)}</p>
              <p className="flex-label">Flex Money Left</p>
            </div>

            <div className="flex-edit">
              <h3>Edit Flex:</h3>
              <input
                type="number"
                min="0"
                max={accountData.flex_dollars}
                placeholder="Enter amount"
                value={flexAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    setFlexAmount(value);
                    setShowFlexConfirm(value !== '' && parseFloat(value) > 0 && parseFloat(value) <= Number(accountData.flex_dollars));
                  }
                }}
              />
              {showFlexConfirm && (
                <button
                  id="flex-confirm-btn"
                  onClick={async () => {
                    const updatedFlex = accountData.flex_dollars - flexAmount;
                    const token = localStorage.getItem('access');
                    const response = await fetch('http://localhost:8000/api/my-account/', {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ flex_dollars: updatedFlex }),
                    });
                    if (response.ok) {
                      const data = await response.json();
                      setAccountData(data);
                      setFlexAmount(0);
                      setShowFlexConfirm(false);
                    }
                  }}
                >
                  ✓
                </button>
              )}
            </div>

            <p className="flex-note">Flex can be used at Dusty’s, Daily Grind, C-Store, and Cafeteria.</p>
          </div>

          <div className="box transaction-box">[ Transaction History Box]</div>

        </div>

        <div className="column column-3">
          <div className="box links-box">[ Useful Links Box ]</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
