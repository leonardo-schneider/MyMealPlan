import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>MyMealPlan</h2>
        </div>

        <div className="footer-links">
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/login">Log In</a></li>
            <li><a href="/register">Sign Up</a></li>
          </ul>
          <ul>
            <li><a href="#">USAO Self-Service</a></li>
            <li><a href="#">Cost of Attendance</a></li>
            <li><a href="#">USAO Online Tuition and Fees</a></li>
            <li><a href="#">Student Refund Options</a></li>
          </ul>
          <ul>
            <li><a href="#">Official Website</a></li>
            <li><a href="#">Athletics Website</a></li>
            <li><a href="#">eRez Life</a></li>
            <li><a href="#">Canvas</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>University of Science and Arts of Oklahoma 2025 | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
