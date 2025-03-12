// src/pages/RegisterPage.js
import React, { useState } from 'react';
import api from '../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MealPlanDropdown from '../components/MealPlanDropdown'; // Import the dropdown component

/**
 * RegisterPage Component
 *
 * Renders a registration form that includes a dropdown for selecting a meal plan.
 * On form submission, it sends the data to the backend to register a new user.
 */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    meal_plan_option_id: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle changes for all input fields.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the registration form.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await api.post('register/', formData);
      console.log("User registered:", response.data);
      // Redirect to login page after successful registration.
      navigate('/login');
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register New User</h2>
      {error && <p style={{ color: 'red' }}>{JSON.stringify(error)}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div>
          <label>Meal Plan Option:</label>
          {/* Use the MealPlanDropdown component to render the dropdown */}
          <MealPlanDropdown
            value={formData.meal_plan_option_id}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
