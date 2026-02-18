import React from "react";
import { Link } from "react-router-dom";
import { usePricingPlans } from "../hooks/useContentful";
import "./Pricing.css";

const Pricing: React.FC = () => {
  const { data: plans, loading } = usePricingPlans();

  const getDurationLabel = (duration: string) => {
    switch (duration) {
      case "hour":
        return "/hour";
      case "day":
        return "/day";
      case "month":
        return "/month";
      case "year":
        return "/year";
      default:
        return `/${duration}`;
    }
  };

  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <div className="hero-bg-pattern"></div>
        <div className="container">
          <div className="pricing-hero-content fade-in-up">
            <span className="page-tag">Pricing</span>
            <h1>Choose Your Plan</h1>
            <p>Flexible pricing options to suit your gaming needs</p>
          </div>
        </div>
      </section>

      <section className="pricing-content section">
        <div className="container">
          {loading ? (
            <div className="pricing-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="pricing-card skeleton"></div>
              ))}
            </div>
          ) : (
            <div className="pricing-grid">
              {plans?.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`pricing-card fade-in-up ${
                    plan.popular ? "popular" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && (
                    <div className="popular-badge">Most Popular</div>
                  )}
                  <div className="plan-header">
                    <h3>{plan.name}</h3>
                    <div className="plan-price">
                      <span className="currency">$</span>
                      <span className="amount">{plan.price}</span>
                      <span className="duration">
                        {getDurationLabel(plan.duration)}
                      </span>
                    </div>
                  </div>
                  <div className="plan-features">
                    <ul>
                      {(plan.features || []).map((feature, i) => (
                        <li key={i}>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="plan-action">
                    <Link
                      to="/contact"
                      className={`btn ${
                        plan.popular ? "btn-primary btn-glow" : "btn-secondary"
                      }`}
                    >
                      <span>Get Started</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="pricing-faq section">
        <div className="container">
          <div className="section-header fade-in-up">
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">Common Questions</h2>
          </div>

          <div className="faq-grid">
            <div className="faq-item fade-in-up">
              <h4>Can I upgrade my plan later?</h4>
              <p>
                Yes! You can upgrade your plan at any time. The difference will
                be prorated based on your remaining time.
              </p>
            </div>
            <div className="faq-item fade-in-up delay-1">
              <h4>Are there any hidden fees?</h4>
              <p>
                No hidden fees. The price you see is what you pay. All equipment
                and games are included.
              </p>
            </div>
            <div className="faq-item fade-in-up delay-2">
              <h4>Can I bring my own peripherals?</h4>
              <p>
                Absolutely! Feel free to bring your own keyboard, mouse, or
                controller for a personalized experience.
              </p>
            </div>
            <div className="faq-item fade-in-up delay-3">
              <h4>Do you offer group discounts?</h4>
              <p>
                Yes, we offer special rates for groups of 5 or more. Contact us
                for custom pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pricing-cta section">
        <div className="container">
          <div className="cta-card fade-in-up">
            <h2>Not sure which plan is right for you?</h2>
            <p>
              Contact us and we'll help you find the perfect plan for your
              gaming needs
            </p>
            <Link to="/contact" className="btn btn-primary btn-glow">
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
