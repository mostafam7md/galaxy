import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGalleryItems, useGalleryItem } from "../hooks/useContentful";
import "./Gallery.css";

const Gallery: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (id) {
    return <GalleryDetail id={id} />;
  }

  return <GalleryList />;
};

const GalleryList: React.FC = () => {
  const { data: items, loading } = useGalleryItems();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();

  const categories = [
    "all",
    ...new Set(items?.map((i) => i.category).filter(Boolean) || []),
  ];

  const filteredItems =
    items?.filter((item) => {
      if (selectedCategory === "all") return true;
      return item.category === selectedCategory;
    }) || [];

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="hero-bg-pattern"></div>
        <div className="container">
          <div className="gallery-hero-content fade-in-up">
            <span className="page-tag">Gallery</span>
            <h1>Moments & Memories</h1>
            <p>
              Explore photos from our events, tournaments, and community
              gatherings
            </p>
          </div>
        </div>
      </section>

      <section className="gallery-content section">
        <div className="container">
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="gallery-filters fade-in-up">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${
                    selectedCategory === cat ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat || "all")}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          )}

          {/* Gallery Grid */}
          {loading ? (
            <div className="gallery-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="gallery-item skeleton"></div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="no-items fade-in-up">
              <span className="no-items-icon">📷</span>
              <h3>No photos yet</h3>
              <p>Check back later for new gallery items!</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="gallery-item fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/gallery/${item.id}`)}
                >
                  <div className="gallery-image">
                    <img
                      src={
                        item.coverImage?.fields?.file?.url ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={item.title || "Gallery image"}
                    />
                    <div className="gallery-overlay">
                      <div className="overlay-content">
                        <h3>{item.title}</h3>
                        {item.date && (
                          <span className="gallery-date">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        <div className="photo-count">
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
                          <span>{item.photos.length + 1} photos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {item.category && (
                    <span className="item-category">{item.category}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const GalleryDetail: React.FC<{ id: string }> = ({ id }) => {
  const { data: item, loading } = useGalleryItem(id);
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="gallery-detail-page">
        <div className="page-loader">
          <div className="loader-ring"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="gallery-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Gallery Item Not Found</h2>
            <p>The gallery item you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate("/gallery")}
              className="btn btn-primary"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allPhotos = [
    item.coverImage,
    ...(item.galleryImages || item.photos || []),
  ].filter(Boolean);

  return (
    <div className="gallery-detail-page">
      <section className="gallery-detail-hero">
        <div className="hero-bg-pattern"></div>
        <div className="container">
          <button onClick={() => navigate("/gallery")} className="back-btn">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Gallery
          </button>

          <div className="gallery-detail-header fade-in-up">
            {item.category && (
              <span className="gallery-category-tag">{item.category}</span>
            )}
            <h1>{item.title}</h1>
            {item.date && (
              <span className="gallery-date-tag">
                {new Date(item.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="gallery-detail-content section">
        <div className="container">
          {item.description && (
            <p className="gallery-description fade-in-up">{item.description}</p>
          )}

          <div className="photos-grid">
            {allPhotos.map((photo, index) => (
              <div
                key={index}
                className={`photo-item fade-in-up ${
                  index === 0 ? "featured" : ""
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedPhoto(index)}
              >
                <img
                  src={
                    photo?.fields?.file?.url ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={`${item.title} - Photo ${index + 1}`}
                />
                <div className="photo-overlay">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div className="lightbox" onClick={() => setSelectedPhoto(null)}>
          <button
            className="lightbox-close"
            onClick={() => setSelectedPhoto(null)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            className="lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto((prev) =>
                prev !== null
                  ? prev === 0
                    ? allPhotos.length - 1
                    : prev - 1
                  : 0
              );
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                allPhotos[selectedPhoto]?.fields?.file?.url ||
                "https://via.placeholder.com/800x600?text=No+Image"
              }
              alt={`${item.title} - Photo ${selectedPhoto + 1}`}
            />
            <div className="lightbox-info">
              <span>
                {selectedPhoto + 1} / {allPhotos.length}
              </span>
            </div>
          </div>

          <button
            className="lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhoto((prev) =>
                prev !== null
                  ? prev === allPhotos.length - 1
                    ? 0
                    : prev + 1
                  : 0
              );
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
