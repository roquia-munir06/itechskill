import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPrograms, getDiplomas } from "../api/api";

export default function CourseOutline() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("professional");
  const [professional, setPro] = useState([]);
  const [short, setShort] = useState([]);
  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [progRes, dipRes] = await Promise.allSettled([
          getAllPrograms(),
          getDiplomas(),
        ]);
        if (progRes.status === "fulfilled") {
          const all = progRes.value?.data || progRes.value || [];
          setPro(all.filter((p) => p.category === "professional"));
          setShort(all.filter((p) => p.category === "short"));
        }
        if (dipRes.status === "fulfilled") {
          setDiplomas(dipRes.value || []);
        }
      } catch {
        setError("Failed to load course outlines.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const TABS = [
    { key: "professional", label: "Professional Courses", rows: professional },
    { key: "short", label: "Short Courses", rows: short },
    { key: "diplomas", label: "Diplomas", rows: diplomas },
  ];

  const isDiploma = tab === "diplomas";

  const activeRows = (TABS.find((t) => t.key === tab)?.rows || []).filter(
    (item) =>
      !search ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewOutline = (item) => {
    if (isDiploma) {
      navigate(`/course-outline/diploma/${item.slug}`);
    } else {
      navigate(`/course-outline/program/${item.slug}`);
    }
  };

  const hasOutline = (item) => {
    if (isDiploma) return !!item.description;
    return !!(item.outline || item.curriculum?.length > 0);
  };

  return (
    <div style={{ padding: "24px 16px", fontFamily: "Arial, sans-serif" }}>
      <h2
        style={{
          fontSize: "1.3rem",
          fontWeight: 700,
          marginBottom: 6,
          color: "#111",
        }}
      >
        Course Outlines
      </h2>
      <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: 20 }}>
        Click "View Outline" on any program to see the full course breakdown.
      </p>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #ddd",
          marginBottom: 16,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {TABS.map(({ key, label, rows }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setSearch(""); }}
            style={{
              padding: "9px 18px",
              border: "none",
              background: "none",
              fontFamily: "Arial, sans-serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              color: tab === key ? "#22013a" : "#888",
              borderBottom:
                tab === key ? "2px solid #22013a" : "2px solid transparent",
              marginBottom: -2,
            }}
          >
            {label} ({rows.length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16, maxWidth: 360 }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #D1D5DB",
            width: "100%",
            fontSize: "0.85rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {loading && <p style={{ color: "#888" }}>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && activeRows.length === 0 && (
        <p style={{ color: "#888" }}>No records found.</p>
      )}

      {!loading && !error && activeRows.length > 0 && (
        <div
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: 8,
            border: "1px solid #e0e0e0",
          }}
        >
          <table
            style={{
              width: "100%",
              minWidth: 560,
              borderCollapse: "collapse",
              fontSize: "0.88rem",
            }}
          >
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ ...th, width: 46 }}>#</th>
                <th style={{ ...th, textAlign: "left", minWidth: 200 }}>
                  Program Name
                </th>
                <th style={{ ...th, minWidth: 100 }}>Duration</th>
                <th style={{ ...th, minWidth: 120 }}>Technologies</th>
                <th style={{ ...th, minWidth: 120, textAlign: "center" }}>
                  Outline
                </th>
              </tr>
            </thead>
            <tbody>
              {activeRows.map((item, i) => (
                <tr
                  key={item._id}
                  style={{
                    background: i % 2 === 0 ? "#fff" : "#fafafa",
                    borderBottom: "1px solid #efefef",
                  }}
                >
                  <td style={{ ...td, textAlign: "center", color: "#999" }}>
                    {i + 1}
                  </td>
                  <td style={td}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#22013a",
                        marginBottom: 2,
                      }}
                    >
                      {item.title}
                    </div>
                    {!isDiploma && item.projects && (
                      <div style={{ fontSize: "0.75rem", color: "#aaa" }}>
                        {item.projects}
                      </div>
                    )}
                  </td>
                  <td style={{ ...td, textAlign: "center" }}>
                    {item.duration || "—"}
                  </td>
                  <td style={{ ...td }}>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: 4 }}
                    >
                      {(item.technologies || []).slice(0, 3).map((t, ti) => (
                        <span
                          key={ti}
                          style={{
                            background: "rgba(34,1,58,0.06)",
                            border: "1px solid rgba(34,1,58,0.12)",
                            color: "#22013a",
                            padding: "2px 7px",
                            borderRadius: 4,
                            fontSize: "0.72rem",
                            fontWeight: 500,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                      {(item.technologies || []).length > 3 && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "#888",
                            padding: "2px 4px",
                          }}
                        >
                          +{item.technologies.length - 3} more
                        </span>
                      )}
                      {(item.technologies || []).length === 0 && (
                        <span style={{ color: "#ccc", fontSize: "0.78rem" }}>
                          —
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ ...td, textAlign: "center" }}>
                    {hasOutline(item) ? (
                      <button
                        onClick={() => handleViewOutline(item)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 6,
                          border: "1px solid #22013a",
                          background: "#22013a",
                          color: "#fff",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View Outline →
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.78rem", color: "#ccc" }}>
                        Not added yet
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = {
  padding: "11px 14px",
  fontWeight: 700,
  fontSize: "0.78rem",
  color: "#333",
  borderBottom: "2px solid #ddd",
  borderRight: "1px solid #e0e0e0",
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
};

const td = {
  padding: "11px 14px",
  borderBottom: "1px solid #efefef",
  borderRight: "1px solid #efefef",
  color: "#222",
  verticalAlign: "middle",
};