// Home page
// Exemplo em Home.js
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { Link, useNavigate } from 'react-router-dom';

import './Home.css';
import Footer from '../pages/components/Footer';

import dashboardImg from "../Images/images-homepage/dashboard.webp";
import userImg from "../Images/images-homepage/user-img.webp";
import campusImg from '../Images/images-about/campus-about.webp';

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
    <div className="hero">
      {/*This is a left side of Hero Section*/}
      <div className="hero-content">

        {/*This is navigation*/}
        <div className="navigation">
          <Link to="/home" id="logo">MyMealPlan</Link>
          <ul>
            <Link to="/dashboard"><li>Dashboard</li></Link>
            <Link to="/about"><li>About</li></Link>
            <Link to="/login"><li>Log In/Sign Up</li></Link>
          </ul>
        </div>

        <div className="h-content">
          <h1>Stay on Top of Your Campus Dining – Anytime, Anywhere!</h1>
          <p>Track your remaining swipes, check your flex balance, explore meal plan options, 
            and review your transaction history—all in one place.</p>
          <div className="h-buttons">
            <Link to="/register"><button id="btn1">CREATE ACCOUNT</button></Link>
            <Link to="/login"><button id="btn2">SIGN IN</button></Link>
          </div>
        </div>

        <p id="h-bottom">Trusted by the University of Science and Arts of Oklahoma</p>

      </div>
      <div className="hero-img"></div>
    </div>

    <div className="section1">
        <h2>Why Use Our Meal Tracker?</h2>
        <div className="card-container">
            <div className="card">
                <h3>Never Be Caught Off Guard</h3>
                <p>There’s nothing worse than realizing you’re out of meal swipes when you’re hungry. 
                  With our real-time tracking, you’ll always know how many swipes and flex dollars you 
                  have left, so you can plan your meals without stress.</p>
            </div>
            <div className="card">
                <h3>Smart Budgeting</h3>
                <p>Our tracker helps you monitor your spending habits so you don’t run out before the 
                  semester ends. Whether it’s grabbing a coffee or treating yourself to an extra meal, 
                  you’ll always be in control of your budget.</p>
            </div>
            <div className="card">
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

      <div className="about-story">
        <div className="story-text" id='about-text'>
          <h2>About The Project</h2>
          <p>Meal Plan Tracker was built by two students who were tired of asking, “How many swipes do I 
            have left?” We created this app to make campus dining easier, smarter, and stress-free. 
            Learn more about our story and vision for the future.</p>
          <Link to="/about"><button>READ MORE</button></Link>
        </div>
        <div className="story-image">
        <img src={campusImg} alt="USAO Building" />
        </div>
      </div>

      {/*Get Started Section*/}
      <div id="getStarted-section">
        <h2>Get Started in 3 Easy Steps</h2>
        <ul>
          <li>☑ Sign up with your USAO e-mail</li>
          <li>☑ Link your meal plan</li>
          <li>☑ Start tracking and managing your meals and flex</li>
        </ul>
        <Link to="/register"><button>GET STARTED NOW</button></Link>
      </div>
      
      {/* Footer */}
      <Footer />
  </>
  
  );
};

export default Home;
