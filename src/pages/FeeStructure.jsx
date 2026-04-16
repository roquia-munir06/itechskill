import React, { useState, useEffect } from "react";
import { getAllPrograms, getDiplomas } from "../api/api";

export default function FeeStructure() {
  const [tab,           setTab]      = useState("professional");
  const [professional,  setPro]      = useState([]);
  const [short,         setShort]    = useState([]);
  const [diplomas,      setDiplomas] = useState([]);
  const [loading,       setLoading]  = useState(true);
  const [error,         setError]    = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [progRes, dipRes] = await Promise.allSettled([
          getAllPrograms(),   // fetches all active programs from /api/programs
          getDiplomas(),      // fetches diplomas from /api/diplomas/admin/all
        ]);

        if (progRes.status === "fulfilled") {
          // getAllPrograms returns { success, count, data: [...] }
          const all = progRes.value?.data || progRes.value || [];
          setPro(all.filter(p => p.category === "professional"));
          setShort(all.filter(p => p.category === "short"));
        }

        if (dipRes.status === "fulfilled") {
          setDiplomas(dipRes.value || []);
        }
      } catch (e) {
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

  return (
    <div style={{ padding: "32px 40px", fontFamily: "Arial, sans-serif" }}>

      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 24, color: "#111" }}>
        Fee Structure
      </h2>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "2px solid #ddd", marginBottom: 24 }}>
        {TABS.map(({ key, label, rows }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "9px 22px",
            border: "none", background: "none",
            fontFamily: "Arial, sans-serif",
            fontSize: "0.9rem", fontWeight: 700,
            cursor: "pointer",
            color: tab === key ? "#22013a" : "#888",
            borderBottom: tab === key ? "2px solid #22013a" : "2px solid transparent",
            marginBottom: -2,
          }}>
            {label} ({rows.length})
          </button>
        ))}
      </div>

      {/* States */}
      {loading && <p style={{ color: "#888" }}>Loading…</p>}
      {error   && <p style={{ color: "red"  }}>{error}</p>}

      {!loading && !error && activeRows.length === 0 && (
        <p style={{ color: "#888" }}>No records found.</p>
      )}

      {/* Table */}
      {!loading && !error && activeRows.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={th}>#</th>
              <th style={{ ...th, textAlign: "left" }}>Program Name</th>
              <th style={th}>Duration</th>

              {/* Programs have installment + discounted fee */}
              {tab !== "diplomas" ? (
                <>
                  <th style={th}>Installment Fee</th>
                  <th style={th}>Discounted Fee</th>
                </>
              ) : (
                <th style={th}>Fee</th>
              )}
            </tr>
          </thead>
          <tbody>
            {activeRows.map((item, i) => (
              <tr key={item._id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>

                <td style={{ ...td, textAlign: "center", color: "#999", width: 50 }}>{i + 1}</td>

                <td style={td}>{item.title}</td>

                <td style={{ ...td, textAlign: "center" }}>{item.duration || "—"}</td>

                {tab !== "diplomas" ? (
                  <>
                    <td style={{ ...td, textAlign: "center", fontWeight: 700 }}>
                      {item.installmentFee || "—"}
                    </td>
                    <td style={{ ...td, textAlign: "center", fontWeight: 700, color: "#22013a" }}>
                      {item.discountedFee || "—"}
                    </td>
                  </>
                ) : (
                  <td style={{ ...td, textAlign: "center", fontWeight: 700 }}>
                    {item.price === 0
                      ? "Free"
                      : item.price
                      ? `PKR ${Number(item.price).toLocaleString()}`
                      : "—"}
                  </td>
                )}

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  padding: "11px 14px",
  fontWeight: 700,
  fontSize: "0.8rem",
  color: "#333",
  border: "1px solid #ddd",
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const td = {
  padding: "11px 14px",
  border: "1px solid #e8e8e8",
  color: "#222",
};