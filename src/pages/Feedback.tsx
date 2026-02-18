import React, { useState, useEffect } from "react";
import "./Feedback.css";
import { submitFeedback, fetchApprovedFeedback } from "../services/contentful";
import type { FeedbackItem } from "../types/contentful";

interface FeedbackFormData {
  name: string;
  email: string;
  rating: number;
  comment: string;
}

const Feedback: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [existingFeedback, setExistingFeedback] = useState<FeedbackItem[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  // Fetch approved feedback on component mount
  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const feedback = await fetchApprovedFeedback();
        setExistingFeedback(feedback);
      } catch (error) {
        console.error("Error loading feedback:", error);
      } finally {
        setLoadingFeedback(false);
      }
    };
    loadFeedback();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(false);
    setSubmitMessage("");

    try {
      const result = await submitFeedback({
        name: formData.name,
        email: formData.email || undefined,
        rating: formData.rating,
        comment: formData.comment,
      });

      if (result.success) {
        setSubmitted(true);
        setSubmitMessage(result.message);
      } else {
        setSubmitError(true);
        setSubmitMessage(result.message);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitError(true);
      setSubmitMessage("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <section className="feedback-hero">
        <div className="hero-bg-pattern"></div>
        <div className="container">
          <div className="feedback-hero-content fade-in-up">
            <span className="page-tag">Feedback</span>
            <h1>Share Your Experience</h1>
            <p>Your feedback helps us improve and serve you better</p>
          </div>
        </div>
      </section>

      <section className="feedback-content section">
        <div className="container">
          <div className="feedback-grid">
            {/* Feedback Form */}
            <div className="feedback-form-container fade-in-up">
              <h2>Leave Your Feedback</h2>

              {submitted ? (
                <div className="success-message">
                  <div className="success-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3>Thank You!</h3>
                  <p>{submitMessage}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSubmitted(false);
                      setSubmitError(false);
                      setSubmitMessage("");
                      setFormData({
                        name: "",
                        email: "",
                        rating: 5,
                        comment: "",
                      });
                    }}
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="feedback-form">
                  {submitError && (
                    <div className="error-message">
                      <p>{submitMessage}</p>
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email (optional)</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Rating *</label>
                    <div className="rating-input">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${
                            star <= (hoverRating || formData.rating)
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, rating: star }))
                          }
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                        >
                          ★
                        </button>
                      ))}
                      <span className="rating-label">
                        {formData.rating === 5 && "Excellent!"}
                        {formData.rating === 4 && "Great!"}
                        {formData.rating === 3 && "Good"}
                        {formData.rating === 2 && "Fair"}
                        {formData.rating === 1 && "Poor"}
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment">Your Feedback *</label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us about your experience..."
                      rows={5}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-glow full-width"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="loading-spinner"></span>
                    ) : (
                      <span>Submit Feedback</span>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Existing Feedback */}
            <div className="feedback-list-container fade-in-up delay-1">
              <h2>What Others Say</h2>
              <div className="feedback-list">
                {loadingFeedback ? (
                  <div className="loading-feedback">
                    <span className="loading-spinner"></span>
                    <p>Loading feedback...</p>
                  </div>
                ) : existingFeedback.length === 0 ? (
                  <div className="no-feedback">
                    <p>No feedback yet. Be the first to share your experience!</p>
                  </div>
                ) : (
                  existingFeedback.map((feedback, index) => (
                  <div
                    key={feedback.id}
                    className="feedback-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="feedback-header">
                      <div className="feedback-avatar">{feedback.name[0]}</div>
                      <div className="feedback-info">
                        <h4>{feedback.name}</h4>
                        <span className="feedback-date">
                          {new Date(feedback.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="feedback-rating">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${
                            i < feedback.rating ? "filled" : ""
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="feedback-comment">{feedback.comment}</p>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
