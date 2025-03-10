// src/components/MealPlanDropdown.js
import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Your Axios instance

/**
 * MealPlanDropdown Component
 * 
 * Fetches available meal plan options from the API and displays them
 * in a select dropdown. The selected value is controlled by the parent
 * component via props.
 *
 * Props:
 * - value: The currently selected meal plan option ID.
 * - onChange: A function to call when the selection changes.
 */
const MealPlanDropdown = ({ value, onChange }) => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch meal plan options once when the component mounts.
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await api.get('meal-plans/');
        setMealPlans(response.data);
      } catch (err) {
        setError("Failed to fetch meal plans");
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, []);

  if (loading) return <div>Loading meal plans...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <select
      name="meal_plan_option_id"
      value={value}
      onChange={onChange}
      required
    >
      <option value="">Select a meal plan</option>
      {mealPlans.map((plan) => (
        <option key={plan.id} value={plan.id}>
          {plan.name} - {plan.meal_swipes} swipes, ${plan.flex_dollars} flex
        </option>
      ))}
    </select>
  );
};

export default MealPlanDropdown;
