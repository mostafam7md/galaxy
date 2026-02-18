import React, { useState } from "react";
import { useGames } from "../hooks/useContentful";
import "./Games.css";

const Games: React.FC = () => {
  const { data: games, loading } = useGames();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "all",
    ...new Set(games?.map((g) => g.category).filter(Boolean) || []),
  ];

  const filteredGames =
    games?.filter((game) => {
      const matchesCategory =
        selectedCategory === "all" || game.category === selectedCategory;
      const matchesSearch =
        (game.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }) || [];

  return (
    <div className="games-page">
      <section className="games-hero">
        <div className="hero-bg-pattern"></div>
        <div className="container">
          <div className="games-hero-content fade-in-up">
            <span className="page-tag">Games & Services</span>
            <h1>Our Gaming Catalog</h1>
            <p>Explore our wide range of gaming experiences and equipment</p>
          </div>
        </div>
      </section>

      <section className="games-content section">
        <div className="container">
          {/* Search and Filters */}
          <div className="games-controls fade-in-up">
            <div className="search-box">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${
                    selectedCategory === cat ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Games Grid */}
          {loading ? (
            <div className="games-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="game-card skeleton"></div>
              ))}
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="no-games fade-in-up">
              <span className="no-games-icon">🎮</span>
              <h3>No games found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="games-grid">
              {filteredGames.map((game, index) => (
                <div
                  key={game.id}
                  className={`game-card fade-in-up ${
                    game.featured ? "featured" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {game.featured && (
                    <div className="featured-badge">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Featured
                    </div>
                  )}
                  <div className="game-image">
                    {game.image ? (
                      <img src={game.image.fields.file.url} alt={game.name} />
                    ) : (
                      <div className="game-placeholder">
                        {game.category === "Console" && "🎮"}
                        {game.category === "PC" && "💻"}
                        {game.category === "VR" && "🥽"}
                        {game.category === "Simulator" && "🏎️"}
                        {game.category === "Arcade" && "👾"}
                        {game.category === "Board Games" && "🎲"}
                        {![
                          "Console",
                          "PC",
                          "VR",
                          "Simulator",
                          "Arcade",
                          "Board Games",
                        ].includes(game.category) && "🎯"}
                      </div>
                    )}
                    <div className="game-category-tag">{game.category}</div>
                  </div>
                  <div className="game-content">
                    <h3>{game.name}</h3>
                    <p>{game.description}</p>
                    {game.platforms && game.platforms.length > 0 && (
                      <div className="game-platforms">
                        {game.platforms.map((platform) => (
                          <span key={platform} className="platform-tag">
                            {platform}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="game-action">
                    <button className="btn btn-outline">
                      <span>Learn More</span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="games-info section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card fade-in-up">
              <div className="info-icon">🖥️</div>
              <h3>High-End PCs</h3>
              <p>
                RTX 4080 graphics cards, latest processors, and 240Hz monitors
                for competitive gaming.
              </p>
            </div>
            <div className="info-card fade-in-up delay-1">
              <div className="info-icon">🎮</div>
              <h3>Latest Consoles</h3>
              <p>
                PlayStation 5, Xbox Series X, and Nintendo Switch with extensive
                game libraries.
              </p>
            </div>
            <div className="info-card fade-in-up delay-2">
              <div className="info-icon">🥽</div>
              <h3>VR Experience</h3>
              <p>
                Meta Quest 3, Valve Index, and PSVR2 with immersive gaming
                experiences.
              </p>
            </div>
            <div className="info-card fade-in-up delay-3">
              <div className="info-icon">🎧</div>
              <h3>Premium Audio</h3>
              <p>
                High-quality headsets and surround sound systems for immersive
                gameplay.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Games;
