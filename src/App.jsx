import "./App.css";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Factory,
  Leaf,
  MapPin,
  Share2,
  ShieldCheck,
  X,
  Play,
} from "lucide-react";
import Header from "./components/header";
import Footer from "./components/footer";
import MapDisplay from "./components/MapDisplay";
import {
  fetchProductData,
  fetchProductionJourney,
  shareProductPassport,
} from "./services/api";

function App() {
  // State management
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPIP, setShowPIP] = useState(false);
  const [pipClosedManually, setPipClosedManually] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [journeyData, setJourneyData] = useState(null);
  const [sharingPassport, setSharingPassport] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [pipPosition, setPipPosition] = useState(() => {
    if (typeof window === "undefined") {
      return { x: 24, y: 24 };
    }

    const pipWidth = 320;
    const pipHeight = 240;
    return {
      x: Math.max(12, window.innerWidth - pipWidth - 24),
      y: Math.max(12, window.innerHeight - pipHeight - 24),
    };
  });
  const [pipSnapMode, setPipSnapMode] = useState("horizontal");
  const [isDraggingPip, setIsDraggingPip] = useState(false);

  // Refs for scroll detection and video sync
  const videoSectionRef = useRef(null);
  const mainVideoRef = useRef(null);
  const pipVideoRef = useRef(null);
  const pipDragStartRef = useRef({ x: 0, y: 0, originX: 0, originY: 0 });

  // Get product ID from URL parameters (from QR code scan)
  const getProductIdFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || params.get("productId") || "BGS-SR-0145"; // Default for testing
  };

  // Fetch product data on component mount
  useEffect(() => {
    const productId = getProductIdFromURL();
    loadProductData(productId);
  }, []);

  // Load product data
  const loadProductData = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductData(productId);
      setProductData(data);
    } catch (err) {
      setError(err.message || "Failed to load product data");
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll detection for PiP video behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!videoSectionRef.current) return;

      const videoSection = videoSectionRef.current;
      const rect = videoSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (!pipClosedManually && !isInView && !showPIP) {
        setShowPIP(true);
      }

      if (isInView && showPIP) {
        setShowPIP(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showPIP, pipClosedManually]);

  useEffect(() => {
    const mainVideo = mainVideoRef.current;
    const pipVideo = pipVideoRef.current;

    if (!mainVideo || !pipVideo) return;

    if (showPIP) {
      pipVideo.currentTime = mainVideo.currentTime || 0;
      pipVideo.play().catch(() => {});
      mainVideo.pause();
    } else {
      mainVideo.currentTime = pipVideo.currentTime || 0;
      mainVideo.play().catch(() => {});
      pipVideo.pause();
    }
  }, [showPIP]);

  useEffect(() => {
    if (!isDraggingPip) return;

    const handlePointerMove = (event) => {
      const deltaX = event.clientX - pipDragStartRef.current.x;
      const deltaY = event.clientY - pipDragStartRef.current.y;

      setPipPosition((prev) => ({
        x: Math.min(
          window.innerWidth - 320,
          Math.max(12, pipDragStartRef.current.originX + deltaX),
        ),
        y: Math.min(
          window.innerHeight - 240,
          Math.max(12, pipDragStartRef.current.originY + deltaY),
        ),
      }));
    };

    const handlePointerUp = () => {
      const width = 320;
      const height = 240;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const distanceToLeft = pipPosition.x;
      const distanceToRight = viewportWidth - (pipPosition.x + width);
      const distanceToTop = pipPosition.y;
      const distanceToBottom = viewportHeight - (pipPosition.y + height);

      const nearestHorizontal =
        distanceToLeft <= distanceToRight ? "left" : "right";
      const nearestVertical =
        distanceToTop <= distanceToBottom ? "top" : "bottom";

      setPipPosition((prev) => {
        const nextX =
          pipSnapMode === "horizontal"
            ? nearestHorizontal === "left"
              ? 12
              : viewportWidth - width - 12
            : prev.x;
        const nextY =
          pipSnapMode === "vertical"
            ? nearestVertical === "top"
              ? 12
              : viewportHeight - height - 12
            : prev.y;

        return {
          x: Math.min(viewportWidth - width - 12, Math.max(12, nextX)),
          y: Math.min(viewportHeight - height - 12, Math.max(12, nextY)),
        };
      });
      setIsDraggingPip(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDraggingPip, pipPosition.x, pipPosition.y]);

  const handlePipPointerDown = (event) => {
    if (event.target.closest(".pip-close-btn")) return;

    pipDragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      originX: pipPosition.x,
      originY: pipPosition.y,
    };
    setIsDraggingPip(true);
  };

  // Handle production journey button click
  const handleViewJourney = async () => {
    if (!productData) return;

    try {
      const data = await fetchProductionJourney(productData.id);
      setJourneyData(data);
      setShowJourneyModal(true);
    } catch (err) {
      console.error("Error loading journey:", err);
    }
  };

  // Handle share passport
  const handleSharePassport = async () => {
    if (!productData) return;

    try {
      setSharingPassport(true);
      const result = await shareProductPassport(productData.id, {
        timestamp: new Date().toISOString(),
      });
      console.log("Passport shared:", result);
      alert("Passport shared successfully!");
    } catch (err) {
      console.error("Error sharing passport:", err);
      alert("Failed to share passport");
    } finally {
      setSharingPassport(false);
    }
  };

  const toggleSection = (sectionKey) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <main className="content-shell">
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading product data...</p>
          </div>
        </main>
      );
    }

    if (error) {
      return (
        <main className="content-shell">
          <div className="error-state">
            <p className="error-message">Error: {error}</p>
            <button
              onClick={() => loadProductData(getProductIdFromURL())}
              className="primary-action"
            >
              Try Again
            </button>
          </div>
        </main>
      );
    }

    if (!productData) {
      return (
        <main className="content-shell">
          <div className="error-state">
            <p>No product data available</p>
          </div>
        </main>
      );
    }

    return (
      <>
        <div className="page-status-wrap">
          <div className="verified-pill" aria-label="Product ID verified">
            <span className="verified-dot" aria-hidden="true" />
            <span>Product ID verified</span>
          </div>
        </div>

        <main className="content-shell">
          <section className="hero-section">
            <div className="hero-visual" aria-label="Product image preview">
              <img
                src={productData.imageUrl}
                alt={productData.name}
                className="product-image"
              />
              <div className="hero-fabric-pattern" />
              <span className="khadi-pill">KHADI INDIA</span>
            </div>

            <div className="hero-copy">
              <div className="eyebrow">DIGITAL PRODUCT ID</div>
              <h1>{productData.name}</h1>
              <p>{productData.description}</p>

              <div className="meta-row">
                <div className="meta-item">
                  <span>PRODUCT ID</span>
                  <strong>{productData.id}</strong>
                </div>
                <div className="meta-item origin-item">
                  <span>ORIGIN</span>
                  <strong>{productData.origin}</strong>
                </div>
              </div>

              <div className="hero-actions">
                <button
                  type="button"
                  className="primary-action"
                  onClick={handleViewJourney}
                >
                  <span>View production journey</span>
                  <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={handleSharePassport}
                  disabled={sharingPassport}
                >
                  <Share2 size={18} strokeWidth={2.2} aria-hidden="true" />
                  <span>
                    {sharingPassport ? "Sharing..." : "Share passport"}
                  </span>
                </button>
              </div>

              <div className="update-note">
                Last updated {productData.lastUpdatedDate}
              </div>
            </div>
          </section>

          <section
            className={`info-card institution-card ${
              collapsedSections.institution ? "collapsed" : ""
            }`}
          >
            <div
              className="card-header"
              onClick={() => toggleSection("institution")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleSection("institution");
                }
              }}
              role="button"
              tabIndex={0}
            >
              <span className="card-number">01</span>
              <h2>Khadi institution information</h2>
              <button
                type="button"
                className="close-button"
                aria-label={
                  collapsedSections.institution
                    ? "Expand section"
                    : "Collapse section"
                }
                onClick={(event) => {
                  event.stopPropagation();
                  toggleSection("institution");
                }}
              >
                {collapsedSections.institution ? (
                  <span aria-hidden="true">+</span>
                ) : (
                  <X size={26} strokeWidth={2.2} aria-hidden="true" />
                )}
              </button>
            </div>

            <div
              className={`section-content ${
                collapsedSections.institution ? "collapsed" : ""
              }`}
            >
              <div className="section-inner">
                <div className="section-divider" />

                <div className="institution-grid">
                  <div className="institution-box">
                    <span className="small-label">KHADI INSTITUTION</span>
                    <h3>{productData.institution.name}</h3>
                    <p>{productData.institution.description}</p>

                    <div className="badge-row">
                      {productData.institution.badges.map((item) => (
                        <span key={item} className="info-badge">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="map-box">
                    <span className="small-label">GEO-LOCATION</span>
                    {productData.institution.geoLocation ? (
                      <MapDisplay
                        latitude={productData.institution.geoLocation.latitude}
                        longitude={
                          productData.institution.geoLocation.longitude
                        }
                        address={productData.institution.geoLocation.address}
                      />
                    ) : (
                      <div
                        className="map-surface"
                        aria-label="Map showing location"
                      >
                        <div className="map-pin-wrap">
                          <MapPin
                            size={20}
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                        </div>
                        <span className="map-text">
                          Location data not available
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="section-divider" />

                <div className="certificate-row">
                  {productData.institution.certificates.map((cert, idx) => (
                    <div
                      key={idx}
                      className={`certificate-box ${cert.status ? "status-box" : ""}`}
                    >
                      <span>{cert.type}</span>
                      <strong>{cert.value}</strong>
                      {cert.link ? (
                        <a href={cert.link}>
                          <span>View certificate</span>
                          <ArrowRight
                            size={16}
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                        </a>
                      ) : null}
                      {cert.status ? (
                        <div className="status-inline">
                          <ShieldCheck
                            size={16}
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                          <span>{cert.status}</span>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            className={`info-card product-card ${
              collapsedSections.product ? "collapsed" : ""
            }`}
          >
            <div
              className="card-header"
              onClick={() => toggleSection("product")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleSection("product");
                }
              }}
              role="button"
              tabIndex={0}
            >
              <span className="card-number">02</span>
              <h2>Product information</h2>
              <button
                type="button"
                className="close-button"
                aria-label={
                  collapsedSections.product
                    ? "Expand section"
                    : "Collapse section"
                }
                onClick={(event) => {
                  event.stopPropagation();
                  toggleSection("product");
                }}
              >
                {collapsedSections.product ? (
                  <span aria-hidden="true">+</span>
                ) : (
                  <X size={26} strokeWidth={2.2} aria-hidden="true" />
                )}
              </button>
            </div>

            <div
              className={`section-content ${
                collapsedSections.product ? "collapsed" : ""
              }`}
            >
              <div className="section-inner">
                <div className="section-divider" />

                <div className="product-grid">
                  <div className="product-item">
                    <span className="small-label">PRODUCT CATEGORY</span>
                    <div className="feature-inline">
                      <BadgeCheck
                        size={16}
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                      <strong>{productData.category}</strong>
                    </div>
                  </div>
                  <div className="product-item">
                    <span className="small-label">RAW MATERIAL DETAILS</span>
                    <div className="feature-inline">
                      <Leaf size={16} strokeWidth={2.2} aria-hidden="true" />
                      <strong>{productData.material}</strong>
                    </div>
                  </div>
                  <div className="product-item">
                    <span className="small-label">PRODUCT SPECIFICATIONS</span>
                    <div className="feature-inline">
                      <Factory size={16} strokeWidth={2.2} aria-hidden="true" />
                      <strong>{productData.specifications}</strong>
                    </div>
                  </div>
                  <div className="product-item">
                    <span className="small-label">WEIGHT</span>
                    <strong>{productData.weight}</strong>
                  </div>
                  <div className="product-item">
                    <span className="small-label">SPINNING DETAILS</span>
                    <strong>{productData.spinningDetails}</strong>
                  </div>
                  <div className="product-item">
                    <span className="small-label">WEAVE DETAILS</span>
                    <strong>{productData.weaveDetails}</strong>
                  </div>
                  <div className="product-item wide-item">
                    <span className="small-label">STYLE</span>
                    <strong>{productData.style}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className={`info-card production-card ${
              collapsedSections.production ? "collapsed" : ""
            }`}
          >
            <div
              className="card-header"
              onClick={() => toggleSection("production")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleSection("production");
                }
              }}
              role="button"
              tabIndex={0}
            >
              <span className="card-number">03</span>
              <h2>Production &amp; traceability information</h2>
              <button
                type="button"
                className="close-button"
                aria-label={
                  collapsedSections.production
                    ? "Expand section"
                    : "Collapse section"
                }
                onClick={(event) => {
                  event.stopPropagation();
                  toggleSection("production");
                }}
              >
                {collapsedSections.production ? (
                  <span aria-hidden="true">+</span>
                ) : (
                  <X size={26} strokeWidth={2.2} aria-hidden="true" />
                )}
              </button>
            </div>

            <div
              className={`section-content ${
                collapsedSections.production ? "collapsed" : ""
              }`}
            >
              <div className="section-inner">
                <div className="section-divider" />

                <div className="production-meta">
                  <div className="meta-block-row">
                    <span className="small-label">PRODUCTION LOCATION</span>
                    <strong>{productData.productionLocation}</strong>
                  </div>
                  <div className="meta-block-row">
                    <span className="small-label">PRODUCTION DATE</span>
                    <strong>{productData.productionDate}</strong>
                  </div>
                </div>

                <div className="section-divider" />

                <div className="stepper" aria-label="Production flow timeline">
                  {productData.productionSteps.map((step) => (
                    <div key={step.id} className="step-item">
                      <div className="step-circle">{step.id}</div>
                      <div className="step-copy">
                        <h4>{step.label}</h4>
                        <p>{step.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="section-divider" />

                <div className="story-layout">
                  <div
                    className="video-panel"
                    ref={videoSectionRef}
                    aria-label="Product video"
                  >
                    <div className="video-box">
                      <video
                        ref={mainVideoRef}
                        controls
                        playsInline
                        className="full-video"
                        src={productData.videoUrl}
                        onTimeUpdate={() => {
                          if (showPIP && pipVideoRef.current) {
                            pipVideoRef.current.currentTime =
                              mainVideoRef.current?.currentTime || 0;
                          }
                        }}
                        onPlay={() => {
                          if (showPIP && pipVideoRef.current) {
                            pipVideoRef.current.currentTime =
                              mainVideoRef.current?.currentTime || 0;
                            pipVideoRef.current.play().catch(() => {});
                          }
                        }}
                      >
                        <div className="video-fallback">
                          <Play size={48} />
                          <span>Production Video</span>
                        </div>
                      </video>
                    </div>
                  </div>

                  <aside className="story-panel">
                    <span className="small-label">PRODUCTION STORY</span>
                    <h3>How this Khadi product is made.</h3>
                    <p>{productData.productionStory}</p>
                  </aside>
                </div>
              </div>
            </div>
          </section>
        </main>

        {showPIP && productData?.videoUrl && (
          <div
            className="pip-video-container"
            style={{ left: `${pipPosition.x}px`, top: `${pipPosition.y}px` }}
          >
            <div
              className={`pip-video-box ${isDraggingPip ? "dragging" : ""}`}
              onPointerDown={handlePipPointerDown}
              onDoubleClick={() =>
                setPipSnapMode((prev) =>
                  prev === "horizontal" ? "vertical" : "horizontal",
                )
              }
            >
              <button
                type="button"
                className="pip-close-btn"
                aria-label="Close picture-in-picture video"
                onClick={() => {
                  setShowPIP(false);
                  setPipClosedManually(true);
                }}
              >
                <X size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
              <video
                ref={pipVideoRef}
                className="pip-video"
                src={productData.videoUrl}
                playsInline
                muted={false}
                controls
                autoPlay
              />
            </div>
          </div>
        )}

        {/* Production Journey Modal */}
        {showJourneyModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowJourneyModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Production Journey</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowJourneyModal(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                {journeyData && (
                  <>
                    <div className="journey-steps">
                      {journeyData.steps.map((step) => (
                        <div key={step.id} className="journey-step">
                          <div className="journey-step-number">{step.id}</div>
                          <div className="journey-step-content">
                            <h4>{step.label}</h4>
                            <p>{step.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="journey-story">
                      <h3>Production Story</h3>
                      <p>{journeyData.story}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="page-root">
      <Header />
      {renderContent()}
      <Footer />
    </div>
  );
}

export default App;
