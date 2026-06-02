import React, { useState, useEffect } from "react";
import { getAllPrograms, getDiplomas } from "../api/api";

export default function FeeStructure() {
  const [tab,          setTab]      = useState("professional");
  const [professional, setPro]      = useState([]);
  const [short,        setShort]    = useState([]);
  const [diplomas,     setDiplomas] = useState([]);
  const [loading,      setLoading]  = useState(true);
  const [error,        setError]    = useState("");

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
          setPro(all.filter(p => p.category === "professional"));
          setShort(all.filter(p => p.category === "short"));
        }
        if (dipRes.status === "fulfilled") {
          setDiplomas(dipRes.value || []);
        }
      } catch {
        setError("Failed to load fee structure.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const TABS = [
    { key: "professional", label: "Professional Courses", rows: professional },
    { key: "short",        label: "Short Courses",        rows: short },
    { key: "diplomas",     label: "Diplomas",             rows: diplomas },
  ];

  const activeRows = TABS.find(t => t.key === tab)?.rows || [];
  const isDiploma  = tab === "diplomas";

  const formatFee = (item) => {
    if (item.price === 0) return "Free";
    if (item.price) return `PKR ${Number(item.price).toLocaleString()}`;
    return "—";
  };

  return (
    <div style={{ padding: "24px 16px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 20, color: "#111" }}>
        Fee Structure
      </h2>

      {/* Tabs — horizontally scrollable */}
      <div style={{
        display: "flex",
        borderBottom: "2px solid #ddd",
        marginBottom: 20,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
        {TABS.map(({ key, label, rows }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "9px 18px",
            border: "none",
            background: "none",
            fontFamily: "Arial, sans-serif",
            fontSize: "0.85rem",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            color: tab === key ? "#22013a" : "#888",
            borderBottom: tab === key ? "2px solid #22013a" : "2px solid transparent",
            marginBottom: -2,
          }}>
            {label} ({rows.length})
          </button>
        ))}
      </div>

      {loading && <p style={{ color: "#888" }}>Loading…</p>}
      {error   && <p style={{ color: "red"  }}>{error}</p>}
      {!loading && !error && activeRows.length === 0 && (
        <p style={{ color: "#888" }}>No records found.</p>
      )}

      {/* Horizontally scrollable table wrapper */}
      {!loading && !error && activeRows.length > 0 && (
        <div style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: 8,
          border: "1px solid #e0e0e0",
        }}>
          <table style={{
            width: "100%",
            minWidth: 520,         
            borderCollapse: "collapse",
            fontSize: "0.88rem",
          }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ ...th, width: 46 }}>#</th>
                <th style={{ ...th, textAlign: "left", minWidth: 180 }}>Program Name</th>
                <th style={{ ...th, minWidth: 100 }}>Duration</th>
                {isDiploma ? (
                  <th style={{ ...th, minWidth: 120 }}>Fee</th>
                ) : (
                  <>
                    <th style={{ ...th, minWidth: 130 }}>Installment Fee</th>
                    <th style={{ ...th, minWidth: 130 }}>Discounted Fee</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {activeRows.map((item, i) => (
                <tr key={item._id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ ...td, textAlign: "center", color: "#999" }}>{i + 1}</td>
                  <td style={td}>{item.title}</td>
                  <td style={{ ...td, textAlign: "center" }}>{item.duration || "—"}</td>
                  {isDiploma ? (
                    <td style={{ ...td, textAlign: "center", fontWeight: 700 }}>{formatFee(item)}</td>
                  ) : (
                    <>
                      <td style={{ ...td, textAlign: "center", fontWeight: 700 }}>
                        {item.installmentFee || "—"}
                      </td>
                      <td style={{ ...td, textAlign: "center", fontWeight: 700, color: "#22013a" }}>
                        {item.discountedFee || "—"}
                      </td>
                    </>
                  )}
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
};