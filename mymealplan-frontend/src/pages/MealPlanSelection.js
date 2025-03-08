// src/pages/MealPlanSelection.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const MealPlanSelection = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await api.get('meal-plans/');
        setMealPlans(response.data);
      } catch (err) {
        setError(err.response?.data || "Failed to load meal plans");
      }
    };
    fetchMealPlans();
  }, []);

  const handleSelectPlan = async (planId) => {
    try {
      // Send a POST request to select the plan.
      const response = await api.post(`meal-plans/${planId}/select_plan/`);
      // You can show a success message or refresh user data on the dashboard.
      alert("Meal plan updated!");
    } catch (err) {
      alert("Failed to update meal plan: " + JSON.stringify(err.response?.data));
    }
  };

  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (!mealPlans.length) return <div>Loading meal plans...</div>;

  return (
    <div>
      <h2>Select a Meal Plan</h2>
      <ul>
        {mealPlans.map((plan) => (
          <li key={plan.id}>
            {plan.name} - {plan.meal_swipes} swipes, ${plan.flex_dollars} flex
            <button onClick={() => handleSelectPlan(plan.id)}>Select</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MealPlanSelection;
