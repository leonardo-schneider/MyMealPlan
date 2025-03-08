// src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  // Form data state with default empty values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    meal_plan_option_id: '', // This will hold the selected plan's ID
  });

  // State to store the fetched meal plan options
  const [mealPlans, setMealPlans] = useState([]);
  // State to store any error messages
  const [error, setError] = useState(null);
  // useNavigate hook to redirect after successful registration
  const navigate = useNavigate();

  // Fetch meal plan options when the component mounts
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        // Adjust the URL if necessary; it should point to your API endpoint for meal plans
        const response = await axios.get('127.0.0.1:8000/api/meal-plans/');
        setMealPlans(response.data);
      } catch (err) {
        console.error("Error fetching meal plans:", err);
      }
    };

    fetchMealPlans();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post the registration data to the API
      const response = await axios.post('http://127.0.0.1:8000/api/register/', formData);
      console.log("User registered:", response.data);
      // Redirect to login page after successful registration
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
          <label>Meal Plan Option:</label>
          <select 
            name="meal_plan_option_id" 
            value={formData.meal_plan_option_id} 
            onChange={handleChange}
            required
          >
            <option value="">Select a meal plan</option>
            {mealPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - {plan.meal_swipes} swipes, ${plan.flex_dollars} flex
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
