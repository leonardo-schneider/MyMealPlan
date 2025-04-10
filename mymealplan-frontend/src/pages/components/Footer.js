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
            <li><a href="/about">About</a></li>
            <li><a href="/login">Log In</a></li>
            <li><a href="/register">Sign Up</a></li>
          </ul>
          <ul>
            <li><a href="https://selfservice.usao.edu/Student/" target="_blank">USAO Self-Service</a></li>
            <li><a href="https://usao.edu/financial-aid/cost-of-attendance.html" target="_blank">Cost of Attendance</a></li>
            <li><a href="https://online.usao.edu/tuition-and-fees/" target="_blank">USAO Online Tuition and Fees</a></li>
            <li><a href="https://hbui.usao.edu/student" target="_blank">Student Refund Options</a></li>
          </ul>
          <ul>
            <li><a href="https://usao.edu/" target="_blank">Official Website</a></li>
            <li><a href="https://www.usaoathletics.com/landing/index" target="_blank">Athletics Website</a></li>
            <li><a href="https://usao.erezlife.com" target="_blank">eRez Life</a></li>
            <li><a href="https://usao.onelogin.com/" target="_blank">Canvas</a></li>
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
