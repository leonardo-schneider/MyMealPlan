import React, { useState } from 'react';
import menuData from '../data/cafeteriaMenu.json';
import './WeeklyMenu.css';

const days = Object.keys(menuData.menu);

const WeeklyMenu = () => {
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const meals = menuData.menu[selectedDay];

  return (
    <div className="weekly-menu-section">
      <div className="menu-left">
        <div className="menu-heading">
            <h2>Weekly Menu<br />at Cafeteria</h2>
            <p className="week-range">Week {menuData.week}</p>
        </div>
        <div className="menu-dropdown">
            <label>Pick a day to see the menu for that day:</label>
            <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            >
            {days.map(day => (
                <option key={day} value={day}>{day}</option>
            ))}
            </select>
        </div>
        <div className="hours">
          <h3>Hours</h3>
          <div id="hours-columns">
            <div>
                <strong className="hours-label">Monday–Friday</strong><br />
                Breakfast: 7 - 9 AM<br />
                Lunch: 11 AM - 1 PM<br />
                Dinner: 5 - 7 PM
            </div>
            <div>
                <strong className="hours-label">Weekends</strong><br />
                Brunch: 11:30 AM - 1 PM<br />
                Dinner: 5 - 7 PM
            </div>
          </div>
        </div>
      </div>

      <div className="menu-right">
        {['breakfast', 'lunch', 'dinner'].map(meal => (
          <div key={meal} className="meal-block">
            <h3>{meal.charAt(0).toUpperCase() + meal.slice(1)}</h3>
            <div className="menu-content">
                <ul>
                {meals[meal].items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
                </ul>
                <div className="action-menu">
                    <strong>Action:</strong>
                    <p>{meals[meal].action}</p>
                </div>
                <div className="madeToOrder-menu"><p><strong>Made to Order:</strong></p>
                <ul>
                {meals[meal].madeToOrder.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
                </ul></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyMenu;
