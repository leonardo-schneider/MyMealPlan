// Home page
// Exemplo em Home.js
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import dashboardImg from "../Images/images-homepage/dashboard.webp";
import userImg from "../Images/images-homepage/user-img.webp";
import './Home.css';
import Footer from './components/Footer';

const testimonials = [
  {
    img: "/images/user1.jpg",
    name: "John Doe",
    occupation: "Junior",
    quote: "This platform has completely changed how I track my meal swipes!",
  },
  {
    img: "/images/user2.jpg",
    name: "Jane Smith",
    occupation: "Freshman",
    quote: "I love how easy it is to monitor my spending with this app.",
  },
  {
    img: "/images/user3.jpg",
    name: "Alex Johnson",
    occupation: "Senior",
    quote: "The insights and notifications help me stay on top of my finances!",
  },
];

const Home = () => {
  return (
  <>
    <div class="hero">
      {/*This is a left side of Hero Section*/}
      <div class="hero-content">

        {/*This is navigation*/}
        <div class="navigation">
          <a href="home" id="logo">MyMealPlan</a>
          <ul>
            <a href="dashboard"><li>Dashboard</li></a>
            <a href="about"><li>About</li></a>
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

    {/*This is Dashboard Overview Section*/}
    <div id="dashboard-overview">
      <div id="dashboard-content">
        <h2>Dashboard<br/>Overview</h2>
        <p>The Meal Plan Tracker Dashboard is your all-in-one hub for managing your campus dining. 
          With a clean and intuitive design, you can quickly check your meal balance, review spending 
          habits, and make informed decisions about your dining options.</p>
        <ul>
          <li>✅ Meal Swipes at a Glance</li>
          <li>💰 Flex Balance Tracking</li>
          <li>📜 Transaction History</li>
          <li>🍽 Meal Plan Options & Upgrades</li>
          <li>📈 Spending Insights</li>
          <li>🔔 Alerts & Notifications</li>
        </ul>
      </div>
      <img src={dashboardImg} alt="Dashboard" id="dashboard-img"/>
    </div>

    {/* Testimonial Section */}
    <div className="testimonial-section">
        <h2>What Students Are Saying</h2>
        <Swiper
          modules={[Navigation]}
          spaceBetween={-30}
          slidesPerView={3}
          centeredSlides={true}
          navigation
          loop={false}
          breakpoints={{
            768: { slidesPerView: 3 },
            480: { slidesPerView: 1 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card">
                <img src={userImg} alt={testimonial.name} className="user-img" />
                <h3>{testimonial.name}</h3>
                <p className="occupation">{testimonial.occupation}</p>
                <span className="quote-mark">“ ”</span>
                <p className="quote">{testimonial.quote}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/*Get Started Section*/}
      <div id="getStarted-section">
        <h2>Get Started in 3 Easy Steps</h2>
        <ul>
          <li>☑ Sign up with your USAO e-mail</li>
          <li>☑ Link your meal plan</li>
          <li>☑ Start tracking and managing your meals and flex</li>
        </ul>
        <a href="register"><button>GET STARTED NOW</button></a>
      </div>
      
      {/* Footer */}
      <Footer />
  </>
  
  );
};

export default Home;
