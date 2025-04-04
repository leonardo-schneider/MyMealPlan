import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import  MealPlanDropdown  from '../components/MealPlanDropdown';
import uniLogo from "../Images/Assets/uni-logo.webp";
import './RegisterPage.css';
import Footer from './Footer.js';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    meal_plan_option_id: '',
  });
  const [error, setError] = useState(null);
  const [mealPlanOptions, setMealPlanOptions] = useState([]);
  const navigate = useNavigate();

  // Função de validação da senha
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Busca as opções de meal plan do back-end
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await api.get('meal-plans/');
        setMealPlanOptions(response.data);
      } catch (err) {
        console.error('Error fetching meal plan options:', err);
      }
    };

    fetchMealPlans();
  }, []);

  // Atualiza os dados do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envia os dados de registro para o back-end
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação da senha
    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long, include at least one uppercase letter and one special character."
      );
      return;
    }

    try {
      const response = await api.post('register/', formData);
      console.log("User registered:", response.data);
      navigate('/login');
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <>
    <div className="container">
      <div className="side-image-register">
        {/*This is navigation*/}
        <div class="navigation-register">
          <a href="home" id="logo">MyMealPlan</a>
          <ul>
            <a href="login"><li>Dashboard</li></a>
            <a href="#"><li>Profile</li></a>
            <a href="login"><li>Log In/Sign Up</li></a>
          </ul>
        </div>
        <img src={uniLogo} alt="University Logo" id="uni-logo"/>
      </div>
      <div className="side-form">
        <div className="registration-box">
          <h2>Create Account</h2>
          {error && <p style={{ color: 'red' }}>{JSON.stringify(error)}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
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
              <label>Create Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <ul className="password-rules">
                <li>✔ At least 8 characters long</li>
                <li>✔ Include at least one uppercase letter (A–Z)</li>
                <li>✔ Include at least one lowercase letter (a–z)</li>
                <li>✔ Include at least one number (0–9)</li>
                <li>✔ Include at least one special character (@#$%^&*)</li>
                <li className="note">Keep your password secure and don't share it!</li>
              </ul>
            </div>

            <div>
              <label>Your Meal Plan:</label>
              <MealPlanDropdown
                name="meal_plan_option_id"
                value={formData.meal_plan_option_id}
                onChange={handleChange}
                options={mealPlanOptions}
              />
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>

    {/* Footer */}
    <Footer />
  </>
  );
};

export default RegisterPage;
