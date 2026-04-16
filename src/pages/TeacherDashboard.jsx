import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import {
  getLectures,
  getAssignments,
  getAllExams,
  getCourses,
  getCurrentUser,
} from "../api/api";

/* ─── stat card ─── */
const StatCard = ({ icon, label, value, sub, accent }) => (
  <div style={{ ...card, borderTop: `3px solid ${accent}` }}>
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 32, fontWeight: 800, color: "#1e1b2e", letterSpacing: -1 }}>{value}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginTop: 2 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: accent, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
  </div>
);

/* ─── table row ─── */
const Row = ({ cols }) => (
  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
    {cols.map((c, i) => (
      <td key={i} style={{ padding: "10px 14px", fontSize: 13, color: i === 0 ? "#1e1b2e" : "#6b7280", fontWeight: i === 0 ? 600 : 400 }}>
        {c}
      </td>
    ))}
  </tr>
);

/* ─── empty ─── */
const Empty = ({ msg }) => (
  <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af", fontSize: 14 }}>{msg}</div>
);

/* ─── loading screen ─── */
const LoadingScreen = ({ isMobile, title }) => (
  <div style={page}>
    <Sidebar />
    <div style={{ ...main, marginLeft: isMobile ? 0 : 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={spinner} />
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
        <p style={{ color: "#6b7280", marginTop: 16 }}>Loading {title}...</p>
      </div>
    </div>
  </div>
);

const TeacherDashboard = () => {
  const [lectures, setLectures] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const user = getCurrentUser();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [lec, asgn, exm, crs] = await Promise.all([
          getLectures().catch(() => []),
          getAssignments().catch(() => []),
          getAllExams().catch(() => []),
          getCourses().catch(() => []),
        ]);
        setLectures(Array.isArray(lec) ? lec : lec?.lectures || []);
        setAssignments(Array.isArray(asgn) ? asgn : []);
        setExams(Array.isArray(exm) ? exm : exm?.exams || []);
        setCourses(Array.isArray(crs) ? crs : crs?.courses || []);
      } catch (err) {
        console.error("TeacherDashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const myLectures = useMemo(() => lectures.filter(l => l.uploadedBy?._id === user?._id || l.uploadedBy === user?._id), [lectures, user]);
  const myAssignments = useMemo(() => assignments.filter(a => a.uploadedBy?._id === user?._id || a.uploadedBy === user?._id), [assignments, user]);
  const myExams = useMemo(() => exams.filter(e => e.createdBy?._id === user?._id || e.createdBy === user?._id), [exams, user]);

  const recentLectures = [...myLectures].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentAssignments = [...myAssignments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  if (loading) return <LoadingScreen isMobile={isMobile} title="Teacher Dashboard" />;

  return (
    <div style={page}>
      <Sidebar />
      <div style={{ ...main, marginLeft: isMobile ? 0 : 280, padding: isMobile ? "80px 16px 32px" : "36px 32px" }}>

        <div style={header}>
          <div>
            <div style={roleChip("#10b981")}>🎓 Teacher</div>
            <h1 style={title}>My Teaching Hub</h1>
            <p style={subtitle}>Welcome back, {user?.fullName || user?.name || "Teacher"}</p>
          </div>
          <div style={timeBadge}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
        </div>

        <div style={grid4}>
          <StatCard icon="🎬" label="My Lectures" value={myLectures.length} sub={`${courses.length} courses available`} accent="#7c3aed" />
          <StatCard icon="📋" label="My Assignments" value={myAssignments.length} sub="Total created" accent="#10b981" />
          <StatCard icon="📝" label="My Exams" value={myExams.length} sub="Mock exams created" accent="#f59e0b" />
          <StatCard icon="📚" label="Total Courses" value={courses.length} sub="Available to assign" accent="#3b82f6" />
        </div>

        <div style={grid2}>
          <div style={tableBox}>
            <div style={tableHeader}>
              <span style={tableTitle}>🎬 Recent Lectures</span>
              <span style={{ ...chip, background: "#ede9fe", color: "#7c3aed" }}>{myLectures.length} total</span>
            </div>
            {recentLectures.length === 0 ? <Empty msg="No lectures uploaded yet" /> :
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#fafafa" }}>{["Title", "Course", "Type", "Date"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{recentLectures.map((l, i) => <Row key={i} cols={[l.title || "—", l.course?.title || "—", l.type || "—", l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "—"]} />)}</tbody>
              </table>
            }
          </div>

          <div style={tableBox}>
            <div style={tableHeader}>
              <span style={tableTitle}>📋 Recent Assignments</span>
              <span style={{ ...chip, background: "#d1fae5", color: "#10b981" }}>{myAssignments.length} total</span>
            </div>
            {recentAssignments.length === 0 ? <Empty msg="No assignments created yet" /> :
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#fafafa" }}>{["Title", "Course", "Due Date", "Marks"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>{recentAssignments.map((a, i) => <Row key={i} cols={[a.title || "—", a.course?.title || "—", a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "—", a.totalMarks || "—"]} />)}</tbody>
              </table>
            }
          </div>
        </div>

        <div style={{ ...tableBox, marginTop: 24 }}>
          <div style={tableHeader}>
            <span style={tableTitle}>📝 My Mock Exams</span>
            <span style={{ ...chip, background: "#fef3c7", color: "#f59e0b" }}>{myExams.length} total</span>
          </div>
          {myExams.length === 0 ? <Empty msg="No mock exams created yet" /> :
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#fafafa" }}>{["Title", "Course", "Duration", "Total Marks", "Date"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>{myExams.slice(0, 8).map((e, i) => <Row key={i} cols={[e.title || "—", e.course?.title || "—", e.duration ? `${e.duration} min` : "—", e.totalMarks || "—", e.createdAt ? new Date(e.createdAt).toLocaleDateString() : "—"]} />)}</tbody>
            </table>
          }
        </div>

        <div style={restrictionBox}>
          <div style={{ fontSize: 18, marginBottom: 8 }}>🔒 Your Access Scope</div>
          <div style={restrictionGrid}>
            {[
              { label: "✅ Upload Lectures", allowed: true },
              { label: "✅ Create Assignments", allowed: true },
              { label: "✅ Create Mock Exams", allowed: true },
              { label: "✅ View Courses", allowed: true },
              { label: "❌ Manage Users", allowed: false },
              { label: "❌ Manage Blogs", allowed: false },
              { label: "❌ Manage Diplomas", allowed: false },
              { label: "❌ Admin Controls", allowed: false },
            ].map((item, i) => (
              <div key={i} style={{ ...restrictionItem, background: item.allowed ? "#f0fdf4" : "#fef2f2", color: item.allowed ? "#15803d" : "#dc2626" }}>
                {item.label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

/* ─── shared styles ─── */
const page = { display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" };
const main = { flex: 1, overflowX: "hidden" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28 };
const title = { fontSize: 26, fontWeight: 800, color: "#1e1b2e", margin: "6px 0 4px", letterSpacing: -0.5 };
const subtitle = { color: "#6b7280", fontSize: 14, margin: 0 };
const timeBadge = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#374151", fontWeight: 600 };
const roleChip = (color) => ({ display: "inline-block", background: color + "20", color, border: `1px solid ${color}40`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, marginBottom: 4 });
const grid4 = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 24 };
const grid2 = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 20 };
const card = { background: "#fff", borderRadius: 12, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,.07)" };
const tableBox = { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.07)", overflowX: "auto" };
const tableHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 };
const tableTitle = { fontSize: 15, fontWeight: 700, color: "#1e1b2e" };
const th = { padding: "8px 14px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", textAlign: "left", letterSpacing: 0.5 };
const chip = { fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 };
const restrictionBox = { marginTop: 24, background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.07)", fontSize: 14, fontWeight: 600, color: "#374151" };
const restrictionGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, marginTop: 12 };
const restrictionItem = { padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600 };
const spinner = { width: 44, height: 44, border: "3px solid #e5e7eb", borderTop: "3px solid #3D1A5B", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" };

export default TeacherDashboard;