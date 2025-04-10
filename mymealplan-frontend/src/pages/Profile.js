import React, { useEffect, useState } from 'react';
import './Profile.css';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Footer from '../pages/components/Footer';

import { useLocation } from 'react-router-dom';
import userImg from '../Images/images-homepage/user-img.webp';


export default function ProfilePage({ token, onMealPlanUpdate, mealPlan}) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accountData, setAccountData] = useState(null);

  const totalMeals = mealPlan || profile?.total_meal_swipes || '';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  useEffect(() => {
    fetch(`${API_BASE_URL}/my-account/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load profile');
        return res.json();
      })
      .then(data => {
        console.log("Fetched profile:", data);
        console.log("Profile pic path:", data.profile_pic); // Add this
        setProfile(data);
        setForm(data);
      })
      .catch(err => {
        console.error(err);
        alert("Could not load your profile.");
      });
  }, [token, API_BASE_URL, location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setShowConfirm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm(prev => ({ ...prev, profile_pic: file }));
    setPreview(URL.createObjectURL(file));
    setShowConfirm(true);
  };

  const getProfileImage = () => {
    if (preview) return preview;
  
    // Construct full image URL from relative path
    if (profile?.profile_pic) {
      return profile.profile_pic.startsWith('http')
        ? profile.profile_pic
        : `${API_BASE_URL}${profile.profile_pic}`;
    }
  
    return userImg; // Fallback to default
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', form.username || '');
    formData.append('first_name', form.first_name || '');
    formData.append('last_name', form.last_name || '');
    formData.append('meal_plan_option', form.meal_plan_option);
    if (form.profile_pic instanceof File) {
      formData.append('profile_pic', form.profile_pic);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/my-account/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Profile update failed');
      const data = await response.json();
      setProfile(data);
      setShowConfirm(false);
      alert("Profile updated successfully!");

      if (onMealPlanUpdate) {
        onMealPlanUpdate(data.meal_plan_option);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  if (!profile) return <div>Loading profile...</div>;

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
              <Link to="/dashboard">Dashboard</Link>
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
    <div className="profile-container">
      <h2 className="profile-heading">My Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Profile Picture</label>
          <img
            src={getProfileImage()}
            alt="Profile"
            className="profile-pic-preview"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = userImg;
            }}
          />

          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="input-group">
          <label className="input-label">First Name</label>
          <input
            name="first_name"
            type="text"
            className="profile-input"
            value={form.first_name || ''}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Last Name</label>
          <input
            name="last_name"
            type="text"
            className="profile-input"
            value={form.last_name || ''}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Choose Meal Plan</label>
          <p>Current: {totalMeals} Meals</p>
          <select
            name="meal_plan_option"
            className="profile-select"
            value={form.meal_plan_option}
            onChange={handleChange}
          >
            <option value="" disabled hidden>Select Meal Plan...</option>
            <option value="1">5 Meals</option>
            <option value="2">12 Meals</option>
            <option value="3">18 Meals</option>
          </select>
        </div>

        {showConfirm && (
          <button type="submit" className="confirm-button">
            Confirm Changes
          </button>
        )}
      </form>
    </div>

    {/* Footer */}
    <Footer />
  </>
  );
}
