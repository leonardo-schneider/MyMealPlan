import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Footer from '../pages/components/Footer';

import TransactionModal from '../pages/components/Transaction-Modal';
import './components/Transaction-Modal.css';

import TransactionHistoryModal from '../pages/components/TransactionHistory-Modal';
import './components/TransactionHistory-Modal.css';


const Dashboard = ({ mealPlan }) => {
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

  const getCurrentWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + (6 - dayOfWeek));
  
    const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}`;
    return `Week ${formatDate(sunday)} - ${formatDate(saturday)}`;
  };
  

  {/*Transaction Modal Constants */}
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'meal' or 'flex'
  const [transactionLocation, setTransactionLocation] = useState('');
  const [transactions, setTransactions] = useState([]); // stores list of transactions

  {/*Function that opens the Transaction Modal*/}
  const openModal = (type) => {
    setModalType(type);
    setTransactionLocation('');
    setShowModal(true);
  };

  {/*Transaction History Popup Window Constants */}
  const [showHistoryModal, setShowHistoryModal] = useState(false);


  {/*Handling Modal Confirm and Update Balance */}
  const handleModalConfirm = async () => {
    const now = new Date();
    const timestamp = now.toISOString(); // ISO format for backend
    const token = localStorage.getItem('access');
  
    const transactionData = {
      type: modalType,
      amount: modalType === 'meal' ? 1 : parseFloat(flexAmount),
      location: transactionLocation,
      timestamp: timestamp
    };
  
    try {
      if (modalType === 'meal') {
        const updatedMeals = pendingMeals;
  
        const mealRes = await fetch('http://localhost:8000/api/my-account/', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ meal_swipe_balance: updatedMeals }),
        });
  
        if (!mealRes.ok) throw new Error('Failed to update meals');
        const updatedData = await mealRes.json();
        setAccountData(updatedData);
        setPendingMeals(null);
      }
  
      if (modalType === 'flex') {
        const floatAmount = parseFloat(flexAmount);
        const updatedFlex = parseFloat((accountData.flex_dollars - floatAmount).toFixed(2));

        const flexRes = await fetch('http://localhost:8000/api/my-account/', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ flex_dollars: updatedFlex }),
        });
  
        if (!flexRes.ok) throw new Error('Failed to update flex dollars');
        const updatedData = await flexRes.json();
        setAccountData(updatedData);
        setFlexAmount('');
        setShowFlexConfirm(false);
      }
  
      // ✅ POST transaction to backend
      const transactionRes = await fetch('http://localhost:8000/api/user-transactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });
  
      if (!transactionRes.ok) throw new Error('Failed to record transaction');
      const newTransaction = await transactionRes.json();
  
      // Add it to local state too so it shows in history
      setTransactions(prev => [newTransaction, ...prev]);
  
    } catch (err) {
      alert("Error processing transaction");
      console.error(err);
    }
  
    setShowModal(false);
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

  // 🆕 Add this after fetchAccountData
  useEffect(() => {
    if (showHistoryModal) {
      const fetchTransactions = async () => {
        try {
          const token = localStorage.getItem('access');
          const response = await fetch('http://localhost:8000/api/user-transactions/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) throw new Error('Failed to fetch transactions');
          const data = await response.json();
          setTransactions(data);
        } catch (err) {
          console.error('❌ Transaction fetch error:', err);
        }
      };

      fetchTransactions(); // 🔁 fetch when modal opens
    }
  }, [showHistoryModal]);

  useEffect(() => {
    if (showHistoryModal || showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showHistoryModal, showModal]);


  useEffect(() => {
    if (mealPlan) {
      setPendingMeals(null); // Reset pending edits when meal plan changes
    }
  }, [mealPlan]);

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
  const totalMeals = mealPlan || accountData.total_meal_swipes;
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
                <a href="/profile">Profile</a>
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
              <a href="/profile">Profile</a>
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
                <p id='meal-box-week'>{getCurrentWeekRange()}</p>
                </div>
              <div className="meals-links">
                <Link to="/profile">View My Meal Plan</Link>
                <Link to="/profile">View My Profile</Link>
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

                {pendingMeals !== null && pendingMeals !== accountData.meal_swipe_balance && (
                  <button className="confirm-btn" onClick={() => openModal('meal')}>✓</button>
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
                <button id="flex-confirm-btn" onClick={() => openModal('flex')}>✓</button>

              )}
            </div>

            <p className="flex-note">Flex can be used at Dusty’s, Daily Grind, C-Store, and Cafeteria.</p>
          </div>

          <div className="box transaction-box">
            <div className="transaction-top"></div>
            <div className="transaction-bottom">
              <h3>Transaction History</h3>
              <p onClick={() => setShowHistoryModal(true)} style={{ cursor: 'pointer' }}>View More</p>
            </div>
          </div>

        </div>

        <div className="column column-3">
          <div className="box links-box">
            <h3>Useful Links</h3>
            <ul>
              <li><a href="https://selfservice.usao.edu/Student/">Self-Service</a></li>
              <li><a href="https://usao.onelogin.com/">Canvas</a></li>
            </ul>
            <ul>
              <li><a href="https://usao.edu/financial-aid/cost-of-attendance.html">Cost of Attendance</a></li>
              <li><a href="https://online.usao.edu/tuition-and-fees/">Online Tuition and Fees</a></li>
              <li><a href="https://hbui.usao.edu/student">Student Refund Options</a></li>
              <li><a href="https://hbui.usao.edu/student">Payments And Plans</a></li>
            </ul>
            <ul>
              <li><a href="https://usao.erezlife.com">Housing Application</a></li>
              <li><a href="https://usao.erezlife.com/">eRez Life</a></li>
            </ul>
            <ul>
              <li><a href="https://usao.edu/">Official Website</a></li>
              <li><a href="https://www.usaoathletics.com/landing/index">Athletics Website</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="dashboard-section2">
        <h2>Dashboard Overview</h2>
        <p>✅ <b>Meal Swipes at a Glance</b> – Instantly see how many meal swipes you have left for the 
          week or semester. No more last-minute surprises at the dining hall!<br/><br/>
          💰 <b>Flex Balance Tracking</b> – Keep an eye on your remaining flex dollars and track where you’re 
          spending them, whether it's at cafés, vending machines, or campus restaurants.<br/><br/>
          📜 <b>Transaction History</b> – View a detailed breakdown of where and when you've used your swipes and flex 
          dollars. Filter transactions by date, location, or category.<br/><br/>
          🍽 <b>Meal Plan Options & Upgrades</b> – Explore different meal plans, compare their benefits, and see if upgrading or 
          adjusting your current plan makes sense for your lifestyle.<br/><br/>
          📈 <b>Spending Insights</b> – Visual charts help you analyze your meal spending habits, 
          ensuring you never run out too soon. Get weekly or monthly reports to budget better.<br/><br/>
          🔔 <b>Alerts & Notifications</b> – Get notified when your balance is running low, so you can 
          plan accordingly before your next meal.
        </p>
      </div>

      {/*Transaction Modal*/}
      {showModal && (
        <TransactionModal
          location={transactionLocation}
          setLocation={setTransactionLocation}
          onCancel={() => setShowModal(false)}
          onConfirm={handleModalConfirm}
        />
      )}

      {/*Transaction History Popup Window */}
      {showHistoryModal && (
        <TransactionHistoryModal
          firstName={accountData.first_name}
          transactions={transactions}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </>
  );
};


export default Dashboard;
