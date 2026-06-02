import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import EnrollmentModal from "../components/EnrollmentModal";
import { useCart } from "../context/CartContext";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!query.trim()) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const filteredResults =
    activeFilter === "all" ? results : results.filter((r) => r.type === activeFilter);

  const counts = {
    all: results.length,
    course: results.filter((r) => r.type === "course").length,
    diploma: results.filter((r) => r.type === "diploma").length,
    program: results.filter((r) => r.type === "program").length,
  };

  const handleViewDetails = (item) => {
    navigate(`/course/${item.slug || item._id}`);
  };

  // ── Fee helpers ────────────────────────────────────────────────
  // Extracts a plain numeric string from a dollar amount string e.g. "$1,200" → "1200"
  const extractDollar = (str) => {
    if (!str) return "0";
    const match = str.match(/\$([0-9,]+)/);
    return match ? match[1].replace(/,/g, "") : "0";
  };

  // Formats a raw number or string into "PKR X,XXX,XXX" — no duplicates, no trailing garbage
  const formatPKR = (value) => {
    if (value === undefined || value === null || value === "" || value === 0 || value === "0") {
      return "Free";
    }

    // If it's already a clean string like "PKR 75,000" just strip and reformat
    let raw = String(value);

    // Remove all "PKR" occurrences and extra symbols like "/- "
    raw = raw.replace(/PKR/gi, "").replace(/\/\-/g, "").replace(/,/g, "").trim();

    // Extract numeric part
    const num = parseFloat(raw);
    if (isNaN(num)) return String(value); // fallback: return as-is

    // Format with commas
    return `PKR ${num.toLocaleString("en-PK")}`;
  };

  // Formats a dollar amount string like "$1,200" into "~ $1,200"
  const formatDollar = (str) => {
    if (!str) return null;
    const match = str.match(/\$([0-9,]+(?:\.[0-9]+)?)/);
    if (!match) return null;
    return `~ $${match[1]}`;
  };

  const renderCards = (items) =>
    items.map((item) => {
      return (
        <div
          key={item._id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "transform 0.2s, box-shadow 0.2s",
            display: "flex",
            flexDirection: "column",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
          }}
        >
          {/* ── Card Header ── */}
          <div
            style={{
              background: "linear-gradient(135deg, #22013a 20%, #8e5203 50%, #f9f493 100%)",
              padding: "24px 20px",
              minHeight: "90px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: "700",
                textAlign: "center",
                margin: 0,
                lineHeight: 1.4,
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              {item.title}
            </h3>
          </div>

          {/* ── Card Body ── */}
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "7px", flex: 1 }}>

            {/* Type badge */}
            <span style={{
              background: "#f3f4f6", color: "#6b7280",
              fontSize: "12px", padding: "2px 8px",
              borderRadius: "4px", display: "inline-block", alignSelf: "flex-start",
            }}>
              {item.type === "diploma" ? "🎓 Diploma" : "📋 Program"}
            </span>

            {/* Category */}
            {item.category && (
              <span style={{
                background: "#f3f4f6", color: "#6b7280",
                fontSize: "12px", padding: "2px 8px",
                borderRadius: "4px", display: "inline-block", alignSelf: "flex-start",
              }}>
                {item.category}
              </span>
            )}

            {/* Description */}
            {(item.description || item.overview) && (() => {
              const raw = (item.description || item.overview)
                .replace(/<[^>]*>/g, " ")
                .replace(/&nbsp;/g, " ")
                .replace(/&amp;/g, "&")
                .replace(/\s+/g, " ")
                .trim();
              const match = raw.match(/[A-Z][a-z]+(?:\s+[a-zA-Z,.']+){3,}/);
              const clean = match ? raw.slice(raw.indexOf(match[0])) : raw;
              return clean.length > 15 ? (
                <p style={{
                  fontSize: "13px", color: "#6b7280", margin: 0,
                  lineHeight: 1.6, overflow: "hidden", textOverflow: "ellipsis",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>
                  {clean}
                </p>
              ) : null;
            })()}

            {/* ── Fees (installment path) ── */}
            {item.installmentFee && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#6b7280" }}>Total Fee (Installment):</span>
                  <span style={{ fontWeight: "600", color: "#22013a" }}>
                    {formatPKR(item.installmentFee)}
                  </span>
                </div>
                {formatDollar(item.installmentDollar) && (
                  <div style={{ fontSize: "12px", color: "#9ca3af", textAlign: "right" }}>
                    {formatDollar(item.installmentDollar)}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#6b7280" }}>Discounted Fee (Advance):</span>
                  <span style={{ fontWeight: "600", color: "#22013a" }}>
                    {formatPKR(item.discountedFee)}
                  </span>
                </div>
                {formatDollar(item.discountedDollar) && (
                  <div style={{ fontSize: "12px", color: "#9ca3af", textAlign: "right" }}>
                    {formatDollar(item.discountedDollar)}
                  </div>
                )}
              </>
            )}

            {/* ── Price fallback (no installmentFee) ── */}
            {!item.installmentFee && item.price !== undefined && (
              <div style={{ fontWeight: "700", color: "#22013a", fontSize: "14px" }}>
                {formatPKR(item.price)}
              </div>
            )}

            {/* Duration */}
            {item.duration && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#6b7280" }}>Course Duration:</span>
                <span style={{ fontWeight: "700", color: "#22013a" }}>{item.duration}</span>
              </div>
            )}

            {/* Projects */}
            {item.projects && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#6b7280" }}>Projects:</span>
                <span style={{ fontWeight: "500", color: "#374151" }}>{item.projects}</span>
              </div>
            )}

            {/* Technologies */}
            {item.technologies && item.technologies.length > 0 && (
              <div>
                <span style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "5px" }}>
                  Technologies Covered:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {item.technologies.map((tech, i) => (
                    <span key={i} style={{
                      background: "#f3f4f6", color: "#374151",
                      border: "1px solid #e5e7eb",
                      borderRadius: "20px", padding: "2px 10px", fontSize: "11px",
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "12px" }}>
              <button
                onClick={() => setSelectedCourse(item)}
                style={{
                  flex: 1, padding: "9px 0",
                  background: "#22013a", color: "#fff",
                  border: "none", borderRadius: "8px",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                }}
              >
                Apply Now
              </button>
              <button
                onClick={() => handleViewDetails(item)}
                style={{
                  flex: 1, padding: "9px 0",
                  background: "#fff", color: "#22013a",
                  border: "1.5px solid #22013a", borderRadius: "8px",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                }}
              >
                View Details
              </button>

            </div>
          </div>
        </div>
      );
    });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>

      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1a1d2e", display: "flex", alignItems: "center", gap: "12px" }}>
          <FiSearch /> Search Results
        </h1>
        <p style={{ color: "#6B7280", marginTop: "8px" }}>
          {loading ? "Searching..." : `${total} results for "${query}"`}
        </p>
      </div>

      {/* Filter Tabs */}
      {!loading && results.length > 0 && (
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
          {["all", "diploma", "program"].map((f) =>
            counts[f] > 0 ? (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "8px 20px", borderRadius: "20px", border: "none",
                  cursor: "pointer", fontWeight: "600", fontSize: "14px",
                  background: activeFilter === f ? "#3D1A5B" : "#F3F4F6",
                  color: activeFilter === f ? "#fff" : "#374151",
                  transition: "all 0.2s",
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </button>
            ) : null
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px", color: "#6B7280" }}>
          Searching...
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredResults.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", color: "#6B7280" }}>
          <FiSearch size={48} style={{ marginBottom: "16px", opacity: 0.3 }} />
          <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>No results found for "{query}"</h3>
          <p>Try different keywords like "web", "digital", "marketing"</p>
        </div>
      )}

      {/* Results Grid */}
      {!loading && filteredResults.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
        }}>
          {renderCards(filteredResults)}
        </div>
      )}

      {/* Enrollment Modal */}
      {selectedCourse && (
        <EnrollmentModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
};

export default SearchPage;