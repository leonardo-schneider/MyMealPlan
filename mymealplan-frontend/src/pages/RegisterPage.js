import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import uniLogo from "../Images/Assets/uni-logo.webp";
import api from '../services/api';
import MealPlanDropdown from '../components/MealPlanDropdown';
import Footer from './components/Footer';
import './RegisterPage.css';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    meal_plan_option_id: '',
  });
  const [mealPlanOptions, setMealPlanOptions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "password" && error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('register/', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="left-panel">
          <div className="navigation-register">
            <Link to="/home" id="logo">MyMealPlan</Link>
            <ul>
              <Link to="/dashboard"><li>Dashboard</li></Link>
              <Link to="/about"><li>About</li></Link>
              <Link to="/login"><li>Log In</li></Link>
            </ul>
          </div>
          <img src={uniLogo} alt="University Logo" id="uni-logo-register" />
        </div>

        <div className="right-panel">
          <div className="form-wrapper">
            <h2>Create Account</h2>
            {error && <p className="error-msg">{JSON.stringify(error)}</p>}
            <form onSubmit={handleSubmit} className="step-form">

              {/* STEP 1 */}
              <div className={`step ${step === 1 ? 'active' : ''}`}>
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="e.g. John"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />

                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="e.g. Doe"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />

                <div className="button-group">
                  <button
                    type="button"
                    className="next-btn"
                    onClick={() => {
                      if (!formData.first_name.trim() || !formData.last_name.trim()) {
                        setError("Please enter both first and last name.");
                        return;
                      }
                      setError('');
                      setStep(2);
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* STEP 2 */}
              <div className={`step ${step === 2 ? 'active' : ''}`}>
                <label>School E-mail</label>
                <input
                  type="email"
                  placeholder="e.g. jdoe0000@usao.edu"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label>Create Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='*********'
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </span>
                </div>

                <ul className="password-rules">
                  <li>✔ At least 8 characters</li>
                  <li>✔ One uppercase & lowercase</li>
                  <li>✔ One number</li>
                  <li>✔ One special character</li>
                </ul>

                <div className="button-group">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => setStep(step - 1)}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="next-btn"
                    onClick={() => {
                      if (!validatePassword(formData.password)) {
                        setError("Password does not meet all requirements.");
                        return;
                      }
                      setStep(3);
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* STEP 3 */}
              <div className={`step ${step === 3 ? 'active' : ''}`}>
                <label>Select Your Meal Plan</label>
                <MealPlanDropdown
                  name="meal_plan_option_id"
                  value={formData.meal_plan_option_id}
                  onChange={handleChange}
                  options={mealPlanOptions}
                />

                <div className="button-group">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => setStep(step - 1)}
                  >
                    ← Back
                  </button>
                  <button type="submit" className="next-btn">
                    CREATE ACCOUNT
                  </button>
                </div>
              </div>
            </form>

            <p className="signin-link">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RegisterPage;
