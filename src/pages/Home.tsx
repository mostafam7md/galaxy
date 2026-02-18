import React from "react";
import Hero from "../components/Hero";
import {
  useGames,
  useCommunityStats,
  useEvents,
  useActiveOffers,
  useTestimonials,
} from "../hooks/useContentful";
import { Link } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  const { data: games, loading: gamesLoading } = useGames();
  const { data: stats } = useCommunityStats();
  const { data: events } = useEvents();
  const { data: offers } = useActiveOffers();
  const { data: testimonials } = useTestimonials();

  const featuredGames = games?.filter((g) => g.featured).slice(0, 6) || [];
  const upcomingEvent = events?.[0];

  return (
    <div className="home-page">
      <Hero />

      {/* Active Offers */}
      {offers && offers.length > 0 && (
        <section className="offers-section section">
          <div className="container">
            <div className="offers-slider">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="offer-card"
                  style={{
                    background: `linear-gradient(135deg, ${
                      offer.backgroundColor || "#B84CFF"
                    }, ${
                      offer.backgroundColor
                        ? offer.backgroundColor + "80"
                        : "#D66BFF"
                    })`,
                  }}
                >
                  <div className="offer-content">
                    <span className="offer-badge">{offer.discount}% OFF</span>
                    <h3>{offer.title}</h3>
                    <p>{offer.description}</p>
                    {offer.code && (
                      <div className="offer-code">
                        <span>Use code:</span>
                        <code>{offer.code}</code>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Activities Grid */}
      <section className="activities-section section">
        <div className="container">
          <div className="section-header fade-in-up">
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Gaming Activities</h2>
            <p className="section-subtitle">
              Experience the best gaming equipment and services
            </p>
          </div>

          <div className="activities-grid">
            {gamesLoading
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="activity-card skeleton"></div>
                ))
              : featuredGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="activity-card fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="activity-image">
                      {game.image ? (
                        <img src={game.image.fields.file.url} alt={game.name} />
                      ) : (
                        <div className="activity-placeholder">
                          <span>🎮</span>
                        </div>
                      )}
                      <div className="activity-category">{game.category}</div>
                    </div>
                    <div className="activity-content">
                      <h3>{game.name}</h3>
                      <p>{game.description}</p>
                      {game.platforms && (
                        <div className="activity-platforms">
                          {game.platforms.map((p) => (
                            <span key={p} className="platform-tag">
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
          </div>

          <div className="section-cta">
            <Link to="/games" className="btn btn-secondary">
              View All Games
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {upcomingEvent && (
        <section className="featured-event-section section">
          <div className="container">
            <div className="featured-event-card">
              <div className="event-glow"></div>
              <div className="event-image">
                {upcomingEvent.image ? (
                  <img
                    src={upcomingEvent.image.fields.file.url}
                    alt={upcomingEvent.title}
                  />
                ) : (
                  <div className="event-placeholder">🏆</div>
                )}
              </div>
              <div className="event-content">
                <span className="event-tag">{upcomingEvent.category}</span>
                <h3>{upcomingEvent.title}</h3>
                <p>{upcomingEvent.description}</p>
                <div className="event-meta">
                  <div className="meta-item">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>
                      {new Date(upcomingEvent.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="meta-item">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{upcomingEvent.time}</span>
                  </div>
                  <div className="meta-item">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{upcomingEvent.location}</span>
                  </div>
                </div>
                {upcomingEvent.registrationOpen && (
                  <div className="event-capacity">
                    <div className="capacity-bar">
                      <div
                        className="capacity-fill"
                        style={{
                          width: `${
                            ((upcomingEvent.registeredCount || 0) /
                              (upcomingEvent.capacity || 1)) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span>
                      {upcomingEvent.registeredCount || 0}/
                      {upcomingEvent.capacity} spots filled
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Community Stats */}
      <section className="stats-section section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card fade-in-up">
              <div className="stat-icon">👥</div>
              <div className="stat-value">
                {stats?.members?.toLocaleString() || "2,500"}+
              </div>
              <div className="stat-label">Active Members</div>
            </div>
            <div className="stat-card fade-in-up delay-1">
              <div className="stat-icon">🎮</div>
              <div className="stat-value">
                {stats?.games?.toLocaleString() || "500"}+
              </div>
              <div className="stat-label">Games Available</div>
            </div>
            <div className="stat-card fade-in-up delay-2">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">
                {stats?.events?.toLocaleString() || "150"}+
              </div>
              <div className="stat-label">Events Hosted</div>
            </div>
            <div className="stat-card fade-in-up delay-3">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">
                {stats?.hoursPlayed?.toLocaleString() || "100,000"}+
              </div>
              <div className="stat-label">Hours Played</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="testimonials-section section">
          <div className="container">
            <div className="section-header fade-in-up">
              <span className="section-tag">What Gamers Say</span>
              <h2 className="section-title">Testimonials</h2>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="testimonial-card fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar.fields.file.url}
                          alt={testimonial.name}
                        />
                      ) : (
                        <span>{testimonial.name[0]}</span>
                      )}
                    </div>
                    <div className="testimonial-info">
                      <h4>{testimonial.name}</h4>
                      {testimonial.role && <span>{testimonial.role}</span>}
                    </div>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${
                          i < testimonial.rating ? "filled" : ""
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="testimonial-quote">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Level Up Your Gaming?</h2>
              <p>
                Join Galaxy Gaming Club today and become part of our amazing
                community
              </p>
              <div className="cta-buttons">
                <Link to="/pricing" className="btn btn-primary btn-glow">
                  <span>Get Started</span>
                </Link>
                <Link to="/contact" className="btn btn-secondary">
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
