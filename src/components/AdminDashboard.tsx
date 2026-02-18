import React, { useState } from "react";
import { useActiveOffers, useCommunityStats } from "../hooks/useContentful";
import "./AdminDashboard.css";

interface AdminStats {
  totalMembers: number;
  activeEvents: number;
  newSignups: number;
  revenue: number;
}

const AdminDashboard: React.FC = () => {
  const { data: offers } = useActiveOffers();
  const { data: communityStats } = useCommunityStats();
  const [activeTab, setActiveTab] = useState<"overview" | "offers" | "content">(
    "overview"
  );

  // Mock admin stats
  const adminStats: AdminStats = {
    totalMembers: communityStats?.totalMembers || 2500,
    activeEvents: 12,
    newSignups: 48,
    revenue: 12450,
  };

  // Mock recent activity
  const recentActivity = [
    {
      id: "1",
      type: "signup",
      message: "New member signup: Alex Johnson",
      time: "5 mins ago",
    },
    {
      id: "2",
      type: "event",
      message: "Tournament registration: 24 new participants",
      time: "15 mins ago",
    },
    {
      id: "3",
      type: "purchase",
      message: "Monthly membership purchased",
      time: "32 mins ago",
    },
    {
      id: "4",
      type: "feedback",
      message: "New 5-star feedback received",
      time: "1 hour ago",
    },
    {
      id: "5",
      type: "signup",
      message: "New member signup: Sarah Chen",
      time: "2 hours ago",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "signup":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        );
      case "event":
        return (
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
        );
      case "purchase":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
        );
      case "feedback":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <section className="admin-hero">
        <div className="container">
          <div className="admin-hero-content fade-in-up">
            <span className="page-tag">Admin Panel</span>
            <h1>Dashboard</h1>
            <p>Manage your gaming club</p>
          </div>
        </div>
      </section>

      <section className="admin-content section">
        <div className="container">
          {/* Tab Navigation */}
          <div className="admin-tabs fade-in-up">
            <button
              className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === "offers" ? "active" : ""}`}
              onClick={() => setActiveTab("offers")}
            >
              Offers
            </button>
            <button
              className={`tab-btn ${activeTab === "content" ? "active" : ""}`}
              onClick={() => setActiveTab("content")}
            >
              Content
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="tab-content">
              {/* Stats Cards */}
              <div className="stats-grid fade-in-up">
                <div className="stat-card">
                  <div className="stat-icon members">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Total Members</span>
                    <span className="stat-value">
                      {adminStats.totalMembers.toLocaleString()}
                    </span>
                    <span className="stat-change positive">
                      +12% this month
                    </span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon events">
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
                  <div className="stat-info">
                    <span className="stat-label">Active Events</span>
                    <span className="stat-value">
                      {adminStats.activeEvents}
                    </span>
                    <span className="stat-change positive">3 upcoming</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon signups">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">New Signups</span>
                    <span className="stat-value">{adminStats.newSignups}</span>
                    <span className="stat-change positive">This week</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon revenue">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Monthly Revenue</span>
                    <span className="stat-value">
                      ${adminStats.revenue.toLocaleString()}
                    </span>
                    <span className="stat-change positive">
                      +8% from last month
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="activity-section fade-in-up delay-1">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className={`activity-icon ${activity.type}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="activity-info">
                        <p>{activity.message}</p>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === "offers" && (
            <div className="tab-content">
              <div className="offers-section fade-in-up">
                <div className="section-header-inline">
                  <h3>Active Offers</h3>
                  <button className="btn btn-primary btn-sm">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Offer
                  </button>
                </div>

                <div className="offers-table">
                  <div className="table-header">
                    <span>Title</span>
                    <span>Discount</span>
                    <span>Valid Until</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>
                  {offers?.map((offer) => (
                    <div key={offer.id} className="table-row">
                      <span className="offer-title">{offer.title}</span>
                      <span className="offer-discount">
                        {offer.discountPercentage}%
                      </span>
                      <span className="offer-date">
                        {new Date(offer.validUntil).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <span className="offer-status active">Active</span>
                      <div className="offer-actions">
                        <button className="action-btn edit" title="Edit">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button className="action-btn delete" title="Delete">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="tab-content">
              <div className="content-section fade-in-up">
                <h3>Content Management</h3>
                <p className="content-description">
                  Manage your website content directly from Contentful CMS.
                  Click on any section to edit its content.
                </p>

                <div className="content-cards">
                  <div className="content-card">
                    <div className="content-card-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <h4>Home Page</h4>
                    <p>Hero section, offers, stats</p>
                    <a
                      href="https://app.contentful.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Edit in Contentful
                    </a>
                  </div>

                  <div className="content-card">
                    <div className="content-card-icon">
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
                    </div>
                    <h4>Events</h4>
                    <p>Tournaments, gaming nights</p>
                    <a
                      href="https://app.contentful.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Edit in Contentful
                    </a>
                  </div>

                  <div className="content-card">
                    <div className="content-card-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="10 8 16 12 10 16 10 8" />
                      </svg>
                    </div>
                    <h4>Games</h4>
                    <p>Game library, featured</p>
                    <a
                      href="https://app.contentful.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Edit in Contentful
                    </a>
                  </div>

                  <div className="content-card">
                    <div className="content-card-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                    <h4>Gallery</h4>
                    <p>Photos, event images</p>
                    <a
                      href="https://app.contentful.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Edit in Contentful
                    </a>
                  </div>

                  <div className="content-card">
                    <div className="content-card-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                      </svg>
                    </div>
                    <h4>Pricing</h4>
                    <p>Plans, features, FAQs</p>
                    <a
                      href="https://app.contentful.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Edit in Contentful
                    </a>
                  </div>

                  <div className="content-card">
                    <div className="content-card-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                    </div>
                    <h4>Contact Info</h4>
                    <p>Address, hours, social</p>
                    <a
                      href="https://app.contentful.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      Edit in Contentful
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
