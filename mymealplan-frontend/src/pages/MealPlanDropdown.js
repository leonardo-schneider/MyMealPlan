import React from 'react';

const MealPlanDropdown = ({ name, value, onChange, options }) => {
  return (
    <select name={name} value={value} onChange={onChange} required>
      <option value="" disabled>
        Your Meal Plan
      </option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default MealPlanDropdown;
