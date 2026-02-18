import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEvents, useEvent } from "../hooks/useContentful";
import "./Events.css";

const Events: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (id) {
    return <EventDetail id={id} />;
  }

  return <EventsList />;
};

const EventsList: React.FC = () => {
  const [filter, setFilter] = useState<"upcoming" | "past" | "all">("upcoming");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { data: upcomingEvents, loading: upcomingLoading } = useEvents(false);
  const { data: allEvents, loading: allLoading } = useEvents(true);

  const loading = filter === "upcoming" ? upcomingLoading : allLoading;
  const events = filter === "upcoming" ? upcomingEvents : allEvents;

  const categories = [...new Set(allEvents?.map((e) => e.category) || [])];

  const filteredEvents =
    events
      ?.filter((event) => {
        if (filter === "past") {
          return event.isPast;
        }
        if (filter === "upcoming") {
          return !event.isPast;
        }
        return true;
      })
      .filter((event) => {
        if (categoryFilter === "all") return true;
        return event.category === categoryFilter;
      }) || [];

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="hero-bg-pattern"></div>
        <div className="container">
          <div className="events-hero-content fade-in-up">
            <span className="page-tag">Events</span>
            <h1>Gaming Events & Tournaments</h1>
            <p>Join our exciting events and compete with fellow gamers</p>
          </div>
        </div>
      </section>

      <section className="events-content section">
        <div className="container">
          {/* Filters */}
          <div className="events-filters fade-in-up">
            <div className="filter-tabs">
              <button
                className={`filter-tab ${
                  filter === "upcoming" ? "active" : ""
                }`}
                onClick={() => setFilter("upcoming")}
              >
                Upcoming
              </button>
              <button
                className={`filter-tab ${filter === "past" ? "active" : ""}`}
                onClick={() => setFilter("past")}
              >
                Past Events
              </button>
              <button
                className={`filter-tab ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All Events
              </button>
            </div>

            {categories.length > 0 && (
              <div className="category-filters">
                <button
                  className={`category-btn ${
                    categoryFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => setCategoryFilter("all")}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-btn ${
                      categoryFilter === cat ? "active" : ""
                    }`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="events-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="event-card skeleton"></div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="no-events fade-in-up">
              <span className="no-events-icon">📅</span>
              <h3>No events found</h3>
              <p>Check back later for upcoming events!</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event, index) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className={`event-card fade-in-up ${
                    event.isPast ? "past" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="event-image">
                    {event.image ? (
                      <img
                        src={event.image.fields.file.url}
                        alt={event.title}
                      />
                    ) : (
                      <div className="event-placeholder">🏆</div>
                    )}
                    <div className="event-category">{event.category}</div>
                    {event.isPast && (
                      <div className="event-past-badge">Completed</div>
                    )}
                  </div>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="event-meta">
                      <div className="meta-item">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
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
                        <span>{event.time}</span>
                      </div>
                    </div>
                    {!event.isPast &&
                      event.registrationOpen &&
                      event.capacity && (
                        <div className="event-spots">
                          <div className="spots-bar">
                            <div
                              className="spots-fill"
                              style={{
                                width: `${
                                  ((event.registeredCount || 0) /
                                    event.capacity) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span>
                            {event.capacity - (event.registeredCount || 0)}{" "}
                            spots left
                          </span>
                        </div>
                      )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const EventDetail: React.FC<{ id: string }> = ({ id }) => {
  const { data: event, loading } = useEvent(id);
  const navigate = useNavigate();
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = async () => {
    setRegistering(true);
    // Simulate registration API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRegistered(true);
    setRegistering(false);
  };

  if (loading) {
    return (
      <div className="event-detail-page">
        <div className="page-loader">
          <div className="loader-ring"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Event Not Found</h2>
            <p>The event you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/events")}
              className="btn btn-primary"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      <section className="event-detail-hero">
        <div className="hero-bg-pattern"></div>
        <div className="container">
          <button onClick={() => navigate("/events")} className="back-btn">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Events
          </button>

          <div className="event-detail-header fade-in-up">
            <span className="event-category-tag">{event.category}</span>
            <h1>{event.title}</h1>
          </div>
        </div>
      </section>

      <section className="event-detail-content section">
        <div className="container">
          <div className="event-detail-grid">
            <div className="event-main fade-in-up">
              <div className="event-image-large">
                {event.image ? (
                  <img src={event.image.fields.file.url} alt={event.title} />
                ) : (
                  <div className="event-placeholder-large">🏆</div>
                )}
              </div>

              {/* Event Images Gallery */}
              {event.eventImages && event.eventImages.length > 0 && (
                <div className="event-images-gallery">
                  <h2>Event Gallery</h2>
                  <div className="event-images-grid">
                    {event.eventImages.map((img, index) => (
                      <div key={index} className="event-gallery-item">
                        <img
                          src={
                            img?.fields?.file?.url ||
                            "https://via.placeholder.com/300x200?text=No+Image"
                          }
                          alt={`${event.title} - Image ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="event-description">
                <h2>About This Event</h2>
                <p>{event.description}</p>
              </div>
            </div>

            <div className="event-sidebar fade-in-up delay-1">
              <div className="sidebar-card">
                <h3>Event Details</h3>

                <div className="detail-item">
                  <div className="detail-icon">
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
                  </div>
                  <div className="detail-text">
                    <span className="label">Date</span>
                    <span className="value">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="detail-text">
                    <span className="label">Time</span>
                    <span className="value">{event.time}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="detail-text">
                    <span className="label">Location</span>
                    <span className="value">{event.location}</span>
                  </div>
                </div>

                {event.capacity && (
                  <div className="detail-item">
                    <div className="detail-icon">
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
                    <div className="detail-text">
                      <span className="label">Capacity</span>
                      <span className="value">
                        {event.registeredCount || 0} / {event.capacity}{" "}
                        registered
                      </span>
                    </div>
                  </div>
                )}

               
                {event.isPast && (
                  <div className="past-event-notice">
                    <span>This event has ended</span>
                  </div>
                )}
              </div>

              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
