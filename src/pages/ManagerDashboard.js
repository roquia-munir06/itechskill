// import React, { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import { getCurrentUser } from "../api/api";

// /* ─── stat card ─── */
// const StatCard = ({ icon, label, value, sub, accent }) => (
//   <div style={{ ...card, borderTop: `3px solid ${accent}` }}>
//     <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
//     <div style={{ fontSize: 32, fontWeight: 800, color: "#1e1b2e", letterSpacing: -1 }}>{value}</div>
//     <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginTop: 2 }}>{label}</div>
//     {sub && <div style={{ fontSize: 11, color: accent, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
//   </div>
// );

// /* ─── table row ─── */
// const Row = ({ cols }) => (
//   <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
//     {cols.map((c, i) => (
//       <td key={i} style={{ padding: "10px 14px", fontSize: 13, color: i === 0 ? "#1e1b2e" : "#6b7280", fontWeight: i === 0 ? 600 : 400 }}>
//         {c}
//       </td>
//     ))}
//   </tr>
// );

// /* ─── empty ─── */
// const Empty = ({ msg }) => (
//   <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af", fontSize: 14 }}>{msg}</div>
// );

// /* ─── loading screen ─── */
// const LoadingScreen = ({ isMobile, title }) => (
//   <div style={page}>
//     <Sidebar />
//     <div style={{ ...main, marginLeft: isMobile ? 0 : 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={spinner} />
//         <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
//         <p style={{ color: "#6b7280", marginTop: 16 }}>Loading {title}...</p>
//       </div>
//     </div>
//   </div>
// );

// const ManagerDashboard = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [diplomas, setDiplomas] = useState([]);
//   const [programs, setPrograms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   const user = getCurrentUser();

//   useEffect(() => {
//     const onResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         setLoading(true);
//         const api = await import("../api/api");
//         const [blg, dip, prg] = await Promise.all([
//           api.getAllBlogsAdmin ? api.getAllBlogsAdmin().catch(() => []) : Promise.resolve([]),
//           api.getDiplomas ? api.getDiplomas().catch(() => []) : Promise.resolve([]),
//           api.getAllProgramsAdmin ? api.getAllProgramsAdmin().catch(() => []) : Promise.resolve([]),
//         ]);
//         setBlogs(Array.isArray(blg) ? blg : blg?.blogs || []);
//         setDiplomas(Array.isArray(dip) ? dip : []);
//         setPrograms(Array.isArray(prg) ? prg : []);
//       } catch (err) {
//         console.error("ManagerDashboard Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   const published = blogs.filter(b => b.status === "published" || b.status === "Published");
//   const drafts = blogs.filter(b => b.status === "draft" || b.status === "Draft");
//   const activeDip = diplomas.filter(d => d.status === "Active" || d.isActive);
//   const activePrg = programs.filter(p => p.isActive !== false);

//   const recentBlogs = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
//   const recentDiplomas = [...diplomas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

//   if (loading) return <LoadingScreen isMobile={isMobile} title="Manager Dashboard" />;

//   return (
//     <div style={page}>
//       <Sidebar />
//       <div style={{ ...main, marginLeft: isMobile ? 0 : 280, padding: isMobile ? "80px 16px 32px" : "36px 32px" }}>

//         <div style={header}>
//           <div>
//             <div style={roleChip("#f59e0b")}>📋 Manager</div>
//             <h1 style={title}>Content Management Hub</h1>
//             <p style={subtitle}>Welcome back, {user?.fullName || user?.name || "Manager"}</p>
//           </div>
//           <div style={timeBadge}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
//         </div>

//         <div style={grid4}>
//           <StatCard icon="📝" label="Total Blogs" value={blogs.length} sub={`${published.length} published · ${drafts.length} drafts`} accent="#f59e0b" />
//           <StatCard icon="🎓" label="Diploma Programs" value={diplomas.length} sub={`${activeDip.length} active`} accent="#7c3aed" />
//           <StatCard icon="📚" label="Programs" value={programs.length} sub={`${activePrg.length} active`} accent="#10b981" />
//           <StatCard icon="✅" label="Published Blogs" value={published.length} sub="Live on platform" accent="#3b82f6" />
//         </div>

//         <div style={grid2}>
//           <div style={tableBox}>
//             <div style={tableHeader}>
//               <span style={tableTitle}>📝 Recent Blogs</span>
//               <span style={{ ...chip, background: "#fef3c7", color: "#f59e0b" }}>{blogs.length} total</span>
//             </div>
//             {recentBlogs.length === 0 ? <Empty msg="No blogs found" /> :
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead><tr style={{ background: "#fafafa" }}>{["Title", "Category", "Status", "Date"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
//                 <tbody>
//                   {recentBlogs.map((b, i) => (
//                     <Row key={i} cols={[b.title || "—", b.category || "—", b.status || "—", b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"]} />
//                   ))}
//                 </tbody>
//               </table>
//             }
//           </div>

//           <div style={tableBox}>
//             <div style={tableHeader}>
//               <span style={tableTitle}>🎓 Diploma Programs</span>
//               <span style={{ ...chip, background: "#ede9fe", color: "#7c3aed" }}>{diplomas.length} total</span>
//             </div>
//             {recentDiplomas.length === 0 ? <Empty msg="No diploma programs found" /> :
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead><tr style={{ background: "#fafafa" }}>{["Title", "Status", "Enrollment", "Date"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
//                 <tbody>
//                   {recentDiplomas.map((d, i) => (
//                     <Row key={i} cols={[d.title || "—", d.status || "—", d.enrollmentOpen ? "Open" : "Closed", d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—"]} />
//                   ))}
//                 </tbody>
//               </table>
//             }
//           </div>
//         </div>

//         <div style={{ ...tableBox, marginTop: 24 }}>
//           <div style={tableHeader}>
//             <span style={tableTitle}>📚 All Programs</span>
//             <span style={{ ...chip, background: "#d1fae5", color: "#10b981" }}>{programs.length} total</span>
//           </div>
//           {programs.length === 0 ? <Empty msg="No programs found" /> :
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead><tr style={{ background: "#fafafa" }}>{["Title", "Category", "Status", "Date"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
//               <tbody>
//                 {programs.slice(0, 8).map((p, i) => (
//                   <Row key={i} cols={[p.title || p.name || "—", p.category || "—", p.isActive !== false ? "Active" : "Inactive", p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"]} />
//                 ))}
//               </tbody>
//             </table>
//           }
//         </div>

//         <div style={restrictionBox}>
//           <div style={{ fontSize: 18, marginBottom: 8 }}>🔒 Your Access Scope</div>
//           <div style={restrictionGrid}>
//             {[
//               { label: "✅ Create & Manage Blogs", allowed: true },
//               { label: "✅ Delete Blogs", allowed: true },
//               { label: "✅ Manage Diploma Programs", allowed: true },
//               { label: "✅ Manage Programs", allowed: true },
//               { label: "✅ Update Enrollment Status", allowed: true },
//               { label: "❌ Manage Users", allowed: false },
//               { label: "❌ Manage Lectures/Exams", allowed: false },
//               { label: "❌ Admin Controls", allowed: false },
//             ].map((item, i) => (
//               <div key={i} style={{ ...restrictionItem, background: item.allowed ? "#f0fdf4" : "#fef2f2", color: item.allowed ? "#15803d" : "#dc2626" }}>
//                 {item.label}
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// /* ─── shared styles ─── */
// const page = { display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" };
// const main = { flex: 1, overflowX: "hidden" };
// const header = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28 };
// const title = { fontSize: 26, fontWeight: 800, color: "#1e1b2e", margin: "6px 0 4px", letterSpacing: -0.5 };
// const subtitle = { color: "#6b7280", fontSize: 14, margin: 0 };
// const timeBadge = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#374151", fontWeight: 600 };
// const roleChip = (color) => ({ display: "inline-block", background: color + "20", color, border: `1px solid ${color}40`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, marginBottom: 4 });
// const grid4 = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 24 };
// const grid2 = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 20 };
// const card = { background: "#fff", borderRadius: 12, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,.07)" };
// const tableBox = { background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.07)", overflowX: "auto" };
// const tableHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 };
// const tableTitle = { fontSize: 15, fontWeight: 700, color: "#1e1b2e" };
// const th = { padding: "8px 14px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", textAlign: "left", letterSpacing: 0.5 };
// const chip = { fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 };
// const restrictionBox = { marginTop: 24, background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.07)", fontSize: 14, fontWeight: 600, color: "#374151" };
// const restrictionGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, marginTop: 12 };
// const restrictionItem = { padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600 };
// const spinner = { width: 44, height: 44, border: "3px solid #e5e7eb", borderTop: "3px solid #3D1A5B", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" };

// export default ManagerDashboard;














import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getCurrentUser } from "../api/api";

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

const ManagerDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [diplomas, setDiplomas] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [error, setError] = useState(null);

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
        setError(null);
        
        const api = await import("../api/api");
        
        // ✅ Use manager-specific APIs instead of admin APIs
        const [blg, dip, prg] = await Promise.all([
          // For blogs - use getAllBlogsAdmin (works for manager too)
          api.getAllBlogsAdmin ? api.getAllBlogsAdmin().catch(() => []) : Promise.resolve([]),
          
          // For diplomas - use getManagerDiplomaPrograms for manager
          api.getManagerDiplomaPrograms ? api.getManagerDiplomaPrograms().catch(() => []) : Promise.resolve([]),
          
          // For programs - use getAllPrograms (public) or handle appropriately
          api.getAllProgramsAdmin ? api.getAllProgramsAdmin().catch(() => []) : Promise.resolve([])
        ]);
        
        setBlogs(Array.isArray(blg) ? blg : blg?.blogs || []);
        setDiplomas(Array.isArray(dip) ? dip : []);
        setPrograms(Array.isArray(prg) ? prg : []);
        
      } catch (err) {
        console.error("ManagerDashboard Error:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAll();
  }, []);

  const published = blogs.filter(b => b.status === "published" || b.status === "Published");
  const drafts = blogs.filter(b => b.status === "draft" || b.status === "Draft");
  const activeDip = diplomas.filter(d => d.status === "Active" || d.isActive);
  const activePrg = programs.filter(p => p.isActive !== false);

  const recentBlogs = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentDiplomas = [...diplomas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  if (loading) return <LoadingScreen isMobile={isMobile} title="Manager Dashboard" />;

  if (error) {
    return (
      <div style={page}>
        <Sidebar />
        <div style={{ ...main, marginLeft: isMobile ? 0 : 280, padding: isMobile ? "80px 16px 32px" : "36px 32px" }}>
          <div style={{ 
            background: "#fee2e2", 
            color: "#dc2626", 
            padding: "20px", 
            borderRadius: "12px",
            textAlign: "center"
          }}>
            <h3>Error Loading Dashboard</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <Sidebar />
      <div style={{ ...main, marginLeft: isMobile ? 0 : 280, padding: isMobile ? "80px 16px 32px" : "36px 32px" }}>

        <div style={header}>
          <div>
            <div style={roleChip("#f59e0b")}>📋 Manager</div>
            <h1 style={title}>Content Management Hub</h1>
            <p style={subtitle}>Welcome back, {user?.fullName || user?.name || "Manager"}</p>
          </div>
          <div style={timeBadge}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
        </div>

        <div style={grid4}>
          <StatCard icon="📝" label="Total Blogs" value={blogs.length} sub={`${published.length} published · ${drafts.length} drafts`} accent="#f59e0b" />
          <StatCard icon="🎓" label="Diploma Programs" value={diplomas.length} sub={`${activeDip.length} active`} accent="#7c3aed" />
          <StatCard icon="📚" label="Programs" value={programs.length} sub={`${activePrg.length} active`} accent="#10b981" />
          <StatCard icon="✅" label="Published Blogs" value={published.length} sub="Live on platform" accent="#3b82f6" />
        </div>

        <div style={grid2}>
          <div style={tableBox}>
            <div style={tableHeader}>
              <span style={tableTitle}>📝 Recent Blogs</span>
              <span style={{ ...chip, background: "#fef3c7", color: "#f59e0b" }}>{blogs.length} total</span>
            </div>
            {recentBlogs.length === 0 ? <Empty msg="No blogs found" /> :
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#fafafa" }}>{["Title", "Category", "Status", "Date"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {recentBlogs.map((b, i) => (
                    <Row key={i} cols={[b.title || "—", b.category || "—", b.status || "—", b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "—"]} />
                  ))}
                </tbody>
              </table>
            }
          </div>

          <div style={tableBox}>
            <div style={tableHeader}>
              <span style={tableTitle}>🎓 Diploma Programs</span>
              <span style={{ ...chip, background: "#ede9fe", color: "#7c3aed" }}>{diplomas.length} total</span>
            </div>
            {recentDiplomas.length === 0 ? <Empty msg="No diploma programs found" /> :
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#fafafa" }}>{["Title", "Status", "Enrollment", "Date"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {recentDiplomas.map((d, i) => (
                    <Row key={i} cols={[d.title || "—", d.status || "—", d.enrollmentOpen ? "Open" : "Closed", d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "—"]} />
                  ))}
                </tbody>
              </table>
            }
          </div>
        </div>

        <div style={{ ...tableBox, marginTop: 24 }}>
          <div style={tableHeader}>
            <span style={tableTitle}>📚 All Programs</span>
            <span style={{ ...chip, background: "#d1fae5", color: "#10b981" }}>{programs.length} total</span>
          </div>
          {programs.length === 0 ? <Empty msg="No programs found" /> :
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#fafafa" }}>{["Title", "Category", "Status", "Date"].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>
                {programs.slice(0, 8).map((p, i) => (
                  <Row key={i} cols={[p.title || p.name || "—", p.category || "—", p.isActive !== false ? "Active" : "Inactive", p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"]} />
                ))}
              </tbody>
            </table>
          }
        </div>

        <div style={restrictionBox}>
          <div style={{ fontSize: 18, marginBottom: 8 }}>🔒 Your Access Scope</div>
          <div style={restrictionGrid}>
            {[
              { label: "✅ Create & Manage Blogs", allowed: true },
              { label: "✅ Delete Blogs", allowed: true },
              { label: "✅ Manage Diploma Programs", allowed: true },
              { label: "✅ Manage Programs", allowed: true },
              { label: "✅ Update Enrollment Status", allowed: true },
              { label: "❌ Manage Users", allowed: false },
              { label: "❌ Manage Lectures/Exams", allowed: false },
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

export default ManagerDashboard;