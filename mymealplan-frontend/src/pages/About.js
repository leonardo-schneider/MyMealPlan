import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './About.css';
import Footer from './components/Footer';

import campusImg from '../Images/images-about/campus-about.webp';
import teamImg from '../Images/images-about/teamImg.webp';

// For Smooth Transition Between Pages
import PageTransition from '../components/PageTransition';

const About = () => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
    {/*<PageTransition>*/}
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <Link to="/home" className="logo">MyMealPlan</Link>
        </div>
        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Log In</Link>
          {mobileMenuOpen && (
            <div className="mobile-only">
              <Link to="/profile">Go to Profile</Link>
              <button onClick={() => {
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                navigate('/login');
              }}>Sign Out</button>
            </div>
          )}
        </div>
        <div className="hamburger" onClick={() => setMobileMenuOpen(prev => !prev)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </nav>

      <div className="about-hero">
        <div className="about-hero-text">
          <h1>For Students, <br />By Students</h1>
          <p>
            The Meal Plan Tracker started with a simple, relatable question we found ourselves asking way too often: <br />
            <span className="highlight">"Wait... how many meal swipes do I have left?"</span>
          </p>
        </div>
      </div>

      <div className="about-story">
        <div className="story-text">
          <p>
            As students, we were constantly swiping our cards at the register just to check our balance—or squinting at receipts and forgetting the numbers an hour later. It didn’t take long to realize there had to be a better way. So, we decided to build one.
          </p>
          <p>
            This app was created with one goal in mind: <span className="bold">make campus life easier for students</span>. We wanted to modernize how meal plans are managed—no more guessing, no more awkward register moments, no more surprises. With this tool, students can track their meal swipes, flex money, and transaction history all in one place, anytime they need it.
          </p>
          <p>
            But we're not stopping there. In the future, we envision students being able to pay for meals directly through the app—<span className="bold">just scan a QR code and go</span>. Simple, fast, and student-friendly.
          </p>
        </div>
        <div className="story-image">
        <img src={campusImg} alt="USAO Building" />
        </div>
      </div>

      <div className="about-team">
        <h2>Who Are We?</h2>
        <div className="team-section">
          <div className="team-images">
          <img src={teamImg} alt="Images"/>
          </div>
          <div className="team-text">
            <p>
              We're <span>Matija</span> and <span>Leo</span>—two seniors studying Business Administration at the University of Science and Arts of Oklahoma. We both have a passion for tech and problem-solving, which led us to take on Computer Science minors. Matija also minors in Economics and Liberal Arts, bringing a broader systems-thinking approach to how we build solutions.
            </p>
            <p>
              We’re also teammates on the varsity men’s soccer team, and we work on campus—Leo in Admissions as a tour guide, and Matija as a Resident Assistant in Housing. Oh, and we both work in the cafeteria too—<span className="bold">so yes, we’ve seen the meal swipe struggle from every angle.</span>
            </p>
            <p><br/><br/>We've heard the same questions over and over:</p>
              <ul>
                <li>“How many swipes do I have left?”</li>
                <li>“Can you just swipe and tell me my balance?”</li>
                <li>“Wait, I thought I had more flex!”</li>
              </ul>
            <p>
              That’s when it clicked. We weren’t the only ones dealing with this confusion—every student was. So we decided to build something simple, helpful, and designed from the student perspective. We’re proud to be building something real for our community.
            </p>
          </div>
        </div>
      </div>

      <div className="mission-closing">
      <p>We built this because we live it.<br />
              We’re students building for students.<br />
              And we’re just getting started.</p>
      </div>

      {/* Footer */}
      <Footer />
    {/*<PageTransition>*/}
    </>
  );
};

export default About;
