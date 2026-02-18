import React from "react";
import { Link } from "react-router-dom";
import { useHeroContent } from "../hooks/useContentful";
import "./Hero.css";

const Hero: React.FC = () => {
  const { data: heroContent, loading } = useHeroContent();

  if (loading) {
    return (
      <section className="hero hero-loading">
        <div className="hero-loader">
          <div className="loader-ring"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-gradient"></div>
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
        <div className="hero-grid"></div>
      </div>

      <div className="hero-content">
        <div className="hero-badge fade-in-up">
          <span className="badge-glow"></span>
          <span>🎮 #1 Gaming Destination</span>
        </div>

        <h1 className="hero-title fade-in-up delay-1">
          {heroContent?.title || "Welcome to Galaxy Gaming Club"}
        </h1>

        <p className="hero-subtitle fade-in-up delay-2">
          {heroContent?.subtitle ||
            "Your Ultimate Gaming Destination - Join our community of passionate gamers"}
        </p>

        <div className="hero-actions fade-in-up delay-3">
          <Link
            to={heroContent?.ctaLink || "/pricing"}
            className="btn btn-primary btn-glow"
          >
            <span>{heroContent?.ctaText || "Join Now"}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          {heroContent?.secondaryCta && (
            <Link
              to={heroContent.secondaryCtaLink || "/events"}
              className="btn btn-secondary"
            >
              <span>{heroContent.secondaryCta}</span>
            </Link>
          )}
        </div>

        <div className="hero-features fade-in-up delay-4">
          <div className="hero-feature">
            <div className="feature-icon">🎯</div>
            <span>Pro Gaming PCs</span>
          </div>
          <div className="hero-feature">
            <div className="feature-icon">🕹️</div>
            <span>Latest Consoles</span>
          </div>
          <div className="hero-feature">
            <div className="feature-icon">🥽</div>
            <span>VR Experience</span>
          </div>
          <div className="hero-feature">
            <div className="feature-icon">🏆</div>
            <span>Tournaments</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

export default Hero;
