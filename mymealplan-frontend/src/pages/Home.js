// Home page
// Exemplo em Home.js
import React from 'react';
import './Home.css';

const Home = () => {
  return (
  <body>
    <div class="hero">
      {/*This is a left side of Hero Section*/}
      <div class="hero-content">

        {/*This is navigation*/}
        <div class="navigation">
          <a href="home" id="logo">MyMealPlan</a>
          <ul>
            <a href="dashboard"><li>Dashboard</li></a>
            <a href="#"><li>Profile</li></a>
            <a href="login"><li>Log In/Sign Up</li></a>
          </ul>
        </div>

        <div class="h-content">
          <h1>Stay on Top of Your Campus Dining – Anytime, Anywhere!</h1>
          <p>Track your remaining swipes, check your flex balance, explore meal plan options, 
            and review your transaction history—all in one place.</p>
          <div class="h-buttons">
            <a href="register"><button id="btn1">CREATE ACCOUNT</button></a>
            <a href="login"><button id="btn2">SIGN IN</button></a>
          </div>
        </div>

        <p id="h-bottom">Trusted by the University of Science and Arts of Oklahoma</p>

      </div>
      <div class="hero-img"></div>
    </div>

    <div class="section1">
        <h2>Why Use Our Meal Tracker?</h2>
        <div class="card-container">
            <div class="card">
                <h3>Never Be Caught Off Guard</h3>
                <p>There’s nothing worse than realizing you’re out of meal swipes when you’re hungry. 
                  With our real-time tracking, you’ll always know how many swipes and flex dollars you 
                  have left, so you can plan your meals without stress.</p>
            </div>
            <div class="card">
                <h3>Smart Budgeting</h3>
                <p>Our tracker helps you monitor your spending habits so you don’t run out before the 
                  semester ends. Whether it’s grabbing a coffee or treating yourself to an extra meal, 
                  you’ll always be in control of your budget.</p>
            </div>
            <div class="card">
                <h3>Fast & Secure</h3>
                <p>Easy logins, clear dashboards—student-friendly platform designed for ease of use. 
                  Plus, your account information stays private and secure, so you can focus on enjoying 
                  your meals without worry.</p>
            </div>
        </div>
    </div>

  </body>
  
  );
};

export default Home;
