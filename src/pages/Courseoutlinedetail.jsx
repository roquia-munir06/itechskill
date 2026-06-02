import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDiplomaBySlug, getProgramBySlug } from "../api/api";



const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function CourseOutlineDetail() {
  const { type, slug } = useParams(); // type = "program" | "diploma"
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

 useEffect(() => {
  (async () => {
    setLoading(true);
    setError("");
    try {
      if (type === "diploma") {
        const data = await getDiplomaBySlug(slug);
        if (data) setItem({ ...data, _type: "diploma" });
        else setError("Diploma not found.");
      } else {
        const data = await getProgramBySlug(slug);
        if (data?.success) setItem({ ...data.data, _type: "program" });
        else setError("Program not found.");
      }
    } catch {
      setError("Failed to load outline.");
    } finally {
      setLoading(false);
    }
  })();
}, [type, slug]);

  if (loading) {
    return (
      <div
        style={{
          padding: "60px 16px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid #f3f3f3",
            borderTop: "3px solid #22013a",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 12px",
          }}
        />
        <p style={{ color: "#888", fontSize: "0.88rem" }}>
          Loading outline…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "40px 16px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p style={{ color: "red" }}>{error}</p>
       
      </div>
    );
  }

  if (!item) return null;

  const isDiploma = item._type === "diploma";

  // For programs: outline field. For diplomas: description field.
  const outlineHTML = isDiploma ? item.description : item.outline;

  // Curriculum — programs use moduleTitle, diplomas use sectionTitle
  const curriculum = (item.curriculum || []).map((mod) => ({
    title: mod.moduleTitle || mod.sectionTitle || "Module",
    topics: mod.topics || [],
  }));

  const hasCurriculum = curriculum.length > 0;
  const hasOutlineHTML = !!outlineHTML && outlineHTML.trim() !== "" && outlineHTML !== "<p><br></p>";
  const technologies = item.technologies || [];

  return (
    <div style={{ padding: "24px 16px", fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "0 auto" }}>

     

      {/* Header card */}
      <div
        style={{
          background: "linear-gradient(135deg, #22013a 20%, #8e5203 50%, #f9f493 100%)",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 85% 20%, rgba(252,211,77,0.15) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "inline-block",
            background: "rgba(252,211,77,0.15)",
            border: "1px solid rgba(252,211,77,0.3)",
            color: "#fcd34d",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            padding: "3px 10px",
            borderRadius: 20,
            marginBottom: 10,
          }}
        >
          {isDiploma ? "Diploma" : item.category === "professional" ? "Professional Course" : "Short Course"}
        </div>
        <h1
          style={{
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: 700,
            margin: "0 0 8px",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {item.title}
        </h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {item.duration && <span>⏱ {item.duration}</span>}
          {item.projects && <span>🎯 {item.projects}</span>}
          {item.level && <span>📊 {item.level}</span>}
          {hasCurriculum && <span>📚 {curriculum.length} Modules</span>}
        </div>
      </div>

      {/* Technologies */}
      {technologies.length > 0 && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 16,
          }}
        >
          <p style={sectionLabelStyle}>Technologies Covered</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {technologies.map((tech, i) => (
              <span
                key={i}
                style={{
                  background: "rgba(34,1,58,0.06)",
                  border: "1px solid rgba(34,1,58,0.15)",
                  color: "#22013a",
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: "0.78rem",
                  fontWeight: 500,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum accordion — shown if curriculum array has data */}
      {hasCurriculum && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            marginBottom: 16,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #efefef",
              background: "#f9f9f9",
            }}
          >
            <p style={{ ...sectionLabelStyle, margin: 0 }}>
              Course Outline — {curriculum.length} Modules
            </p>
          </div>
          {curriculum.map((mod, i) => {
            const isOpen = expanded === i;
            return (
              <div
                key={i}
                style={{ borderBottom: i < curriculum.length - 1 ? "1px solid #efefef" : "none" }}
              >
                {/* Module header */}
                <div
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 20px",
                    cursor: "pointer",
                    background: isOpen ? "#f5f0ff" : "#fff",
                    borderLeft: isOpen ? "3px solid #22013a" : "3px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: isOpen ? "#22013a" : "#ede9f4",
                        color: isOpen ? "#fff" : "#22013a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: isOpen ? "#22013a" : "#222",
                      }}
                    >
                      {mod.title}
                    </span>
                    {mod.topics.length > 0 && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#aaa",
                          marginLeft: 4,
                        }}
                      >
                        {mod.topics.length} topics
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      color: "#22013a",
                      fontWeight: 700,
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </div>

                {/* Topics */}
                {isOpen && mod.topics.length > 0 && (
                  <div
                    style={{
                      padding: "10px 20px 14px 58px",
                      background: "#fdfcff",
                      borderTop: "1px solid #ede9f4",
                    }}
                  >
                    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                      {mod.topics.map((topic, ti) => (
                        <li
                          key={ti}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            padding: "4px 0",
                            fontSize: "0.85rem",
                            color: "#444",
                            lineHeight: 1.5,
                          }}
                        >
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: "#8e5203",
                              flexShrink: 0,
                              marginTop: 6,
                            }}
                          />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {isOpen && mod.topics.length === 0 && (
                  <div
                    style={{
                      padding: "10px 20px 14px 58px",
                      background: "#fdfcff",
                      borderTop: "1px solid #ede9f4",
                      fontSize: "0.82rem",
                      color: "#bbb",
                    }}
                  >
                    No topics listed for this module.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rich HTML outline — shown if outline/description HTML exists */}
      {hasOutlineHTML && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #efefef",
              background: "#f9f9f9",
            }}
          >
            <p style={{ ...sectionLabelStyle, margin: 0 }}>
              {hasCurriculum ? "Additional Outline Details" : "Course Outline"}
            </p>
          </div>
          <div
            style={{ padding: "20px 24px" }}
            dangerouslySetInnerHTML={{ __html: outlineHTML }}
          />
        </div>
      )}

      {/* Nothing available */}
      {!hasCurriculum && !hasOutlineHTML && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "40px 20px",
            textAlign: "center",
            color: "#aaa",
            fontSize: "0.88rem",
          }}
        >
          No outline has been added for this program yet.
        </div>
      )}

      {/* Quill HTML render styles */}
      <style>{`
        .outline-content h1 { font-size: 1.3rem; font-weight: 700; margin: 16px 0 8px; color: #22013a; }
        .outline-content h2 { font-size: 1.1rem; font-weight: 700; margin: 14px 0 6px; color: #22013a; }
        .outline-content h3 { font-size: 1rem; font-weight: 700; margin: 12px 0 6px; color: #333; }
        .outline-content p { margin: 0 0 8px; line-height: 1.7; color: #333; font-size: 0.9rem; }
        .outline-content ul, .outline-content ol { padding-left: 20px; margin: 0 0 10px; }
        .outline-content li { margin-bottom: 4px; line-height: 1.6; color: #444; font-size: 0.88rem; }
        .outline-content strong { color: #22013a; }
        .outline-content blockquote { border-left: 3px solid #22013a; margin: 10px 0; padding: 8px 14px; background: #f5f0ff; color: #555; font-size: 0.88rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const backBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 14px",
  borderRadius: 6,
  border: "1px solid #D1D5DB",
  background: "#fff",
  color: "#22013a",
  fontSize: "0.82rem",
  fontWeight: 600,
  cursor: "pointer",
  marginBottom: 20,
  fontFamily: "Arial, sans-serif",
};

const sectionLabelStyle = {
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#22013a",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 10,
};