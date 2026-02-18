import React from "react";
import { useAboutContent, useTestimonials } from "../hooks/useContentful";
import "./About.css";

const About: React.FC = () => {
  const { data: aboutContent, loading } = useAboutContent();
  const { data: testimonials } = useTestimonials();

  if (loading) {
    return (
      <div className="about-page">
        <div className="page-loader">
          <div className="loader-ring"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-bg-pattern"></div>
        <div className="container">
          <div className="about-hero-content fade-in-up">
            <span className="page-tag">About Us</span>
            <h1>Your Gaming Home</h1>
            <p>
              Discover the story behind Galaxy Gaming Club and what makes us the
              ultimate gaming destination
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Community, Vision */}
      <section className="values-section section">
        <div className="container">
          <div className="values-grid">
            <div className="value-card fade-in-up">
              <div className="value-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h3>{aboutContent?.mission || "Our Mission"}</h3>
              <p>
                {aboutContent?.missionDescription ||
                  "To create an inclusive gaming community where players of all skill levels can connect, compete, and have fun together."}
              </p>
            </div>

            <div className="value-card featured fade-in-up delay-1">
              <div className="value-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>{aboutContent?.community || "Our Community"}</h3>
              <p>
                {aboutContent?.communityDescription ||
                  "We are a diverse group of gamers united by our passion for gaming. From casual players to competitive esports enthusiasts."}
              </p>
            </div>

            <div className="value-card fade-in-up delay-2">
              <div className="value-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3>{aboutContent?.vision || "Our Vision"}</h3>
              <p>
                {aboutContent?.visionDescription ||
                  "To become the premier gaming destination that fosters friendship, healthy competition, and unforgettable gaming experiences."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section">
        <div className="container">
          <div className="section-header fade-in-up">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-title">What Makes Us Different</h2>
          </div>

          <div className="features-grid">
            <div className="feature-item fade-in-up">
              <div className="feature-number">01</div>
              <h4>Premium Equipment</h4>
              <p>
                Top-of-the-line gaming PCs, latest consoles, and VR headsets for
                the best gaming experience.
              </p>
            </div>
            <div className="feature-item fade-in-up delay-1">
              <div className="feature-number">02</div>
              <h4>Community Events</h4>
              <p>
                Regular tournaments, gaming nights, and social events to connect
                with fellow gamers.
              </p>
            </div>
            <div className="feature-item fade-in-up delay-2">
              <div className="feature-number">03</div>
              <h4>Comfortable Space</h4>
              <p>
                Ergonomic seating, ambient lighting, and a welcoming atmosphere
                for hours of gaming.
              </p>
            </div>
            <div className="feature-item fade-in-up delay-3">
              <div className="feature-number">04</div>
              <h4>Expert Staff</h4>
              <p>
                Friendly and knowledgeable staff ready to help with game
                recommendations and technical support.
              </p>
            </div>
            <div className="feature-item fade-in-up delay-4">
              <div className="feature-number">05</div>
              <h4>Flexible Plans</h4>
              <p>
                Hourly, daily, and monthly options to suit your gaming needs and
                budget.
              </p>
            </div>
            <div className="feature-item fade-in-up delay-5">
              <div className="feature-number">06</div>
              <h4>Food & Drinks</h4>
              <p>
                Refreshments and snacks available to keep you fueled during your
                gaming sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Story Section */}
      <section className="story-section section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content fade-in-up">
              <span className="section-tag">Our Story</span>
              <h2>From Passion to Reality</h2>
              <p>
                Galaxy Gaming Club was founded in 2019 by a group of passionate
                gamers who dreamed of creating the ultimate gaming destination.
                What started as a small gaming room has grown into a thriving
                community hub for gamers of all ages and skill levels.
              </p>
              <p>
                Today, we're proud to offer state-of-the-art gaming equipment,
                regular community events, and a welcoming space where
                friendships are forged and memories are made. Our mission
                remains the same: to provide an inclusive environment where
                everyone can enjoy the magic of gaming.
              </p>
              <div className="story-stats">
                <div className="story-stat">
                  <span className="stat-num">2019</span>
                  <span className="stat-text">Founded</span>
                </div>
                <div className="story-stat">
                  <span className="stat-num">2500+</span>
                  <span className="stat-text">Members</span>
                </div>
                <div className="story-stat">
                  <span className="stat-num">150+</span>
                  <span className="stat-text">Events</span>
                </div>
              </div>
            </div>
            <div className="story-image fade-in-up delay-1">
              <img
                src="/story.jpg"
                alt="Galaxy Gaming Club Story"
                className="story-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      {testimonials && testimonials.length > 0 && (
        <section className="about-testimonials section">
          <div className="container">
            <div className="section-header fade-in-up">
              <span className="section-tag">Community Love</span>
              <h2 className="section-title">What Our Members Say</h2>
            </div>

            <div className="testimonials-row">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="testimonial-mini fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="testimonial-stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star">
                        ★
                      </span>
                    ))}
                  </div>
                  <p>"{testimonial.quote}"</p>
                  <div className="testimonial-author">
                    <span className="author-name">{testimonial.name}</span>
                    {testimonial.role && (
                      <span className="author-role">{testimonial.role}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
