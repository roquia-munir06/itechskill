import React, { useState, useEffect } from 'react';
import {
  getAdminInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getInquiryStats
} from '../api/api';
import { FaWhatsapp } from 'react-icons/fa';
import {
  FiMail, FiEye, FiTrash2,
  FiClipboard, FiClock, FiPhone, FiDollarSign, FiXCircle
} from 'react-icons/fi';
import AdminSidebar from '../components/Sidebar';

const STATUS_COLORS = {
  Pending:   { bg: '#fff8e1', color: '#b45309', border: '#fcd34d' },
  Contacted: { bg: '#eff6ff', color: '#1d4ed8', border: '#93c5fd' },
  Paid:      { bg: '#f0fdf4', color: '#166534', border: '#86efac' },
  Cancelled: { bg: '#fff1f2', color: '#be123c', border: '#fca5a5' },
};

const STATUS_ORDER = ['Pending', 'Contacted', 'Paid', 'Cancelled'];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries]             = useState([]);
  const [stats, setStats]                     = useState({});
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState('');
  const [filterStatus, setFilterStatus]       = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [updatingId, setUpdatingId]           = useState(null);
  const [deletingId, setDeletingId]           = useState(null);
  const [notesMap, setNotesMap]               = useState({});

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [inqRes, statsRes] = await Promise.all([
        getAdminInquiries({ status: filterStatus, search }),
        getInquiryStats()
      ]);
      setInquiries(inqRes.data || []);
      setStats(statsRes.data || {});
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [filterStatus, search]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateInquiryStatus(id, { status: newStatus, adminNotes: notesMap[id] || '' });
      await fetchAll();
      if (selectedInquiry?._id === id)
        setSelectedInquiry(p => ({ ...p, status: newStatus }));
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry permanently?')) return;
    setDeletingId(id);
    try {
      await deleteInquiry(id);
      setInquiries(p => p.filter(i => i._id !== id));
      if (selectedInquiry?._id === id) setSelectedInquiry(null);
      const r = await getInquiryStats();
      setStats(r.data || {});
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveNotes = async (id) => {
    try {
      await updateInquiryStatus(id, { adminNotes: notesMap[id] || '' });
      alert('Notes saved!');
    } catch (err) {
      console.error('Notes save error:', err);
    }
  };

  const fmt = (d) => d
    ? new Date(d).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  const waLink = (inq, msg) =>
    `https://wa.me/92${inq.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(msg)}`;

  const mailLink = (inq) =>
    `mailto:${inq.email}?subject=Your ITechSkill Application for ${inq.program}`;

  return (
    <div style={S.layout}>
      <AdminSidebar />

      <div style={S.main}>
        <style>{CSS}</style>

        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Enrollment Inquiries</h1>
            <p style={S.subtitle}>Manage all student enrollment applications</p>
          </div>
          <button style={S.refreshBtn} onClick={fetchAll}>Refresh</button>
        </div>

        {/* Stats — 4 cards only */}
        <div style={S.statsGrid}>
          {[
            { label: 'Total',     value: stats.Total     || 0, icon: <FiClipboard size={20} />, color: '#22013a', bg: '#f3f0ff' },
            { label: 'Pending',   value: stats.Pending   || 0, icon: <FiClock size={20} />,     color: '#b45309', bg: '#fff8e1' },
            { label: 'Contacted', value: stats.Contacted || 0, icon: <FiPhone size={20} />,     color: '#1d4ed8', bg: '#eff6ff' },
            { label: 'Paid',      value: stats.Paid      || 0, icon: <FiDollarSign size={20} />,color: '#166534', bg: '#f0fdf4' },
            { label: 'Cancelled', value: stats.Cancelled || 0, icon: <FiXCircle size={20} />,   color: '#be123c', bg: '#fff1f2' },
          ].map(s => (
            <div key={s.label} style={S.statCard}>
              <div style={{ ...S.statIconBox, background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={S.filters}>
          <input
            style={S.searchInput}
            placeholder="Search by name, email, phone, program..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={S.statusTabs}>
            {['All', ...STATUS_ORDER].map(s => (
              <button
                key={s}
                style={{ ...S.tab, ...(filterStatus === s ? S.tabActive : {}) }}
                onClick={() => setFilterStatus(s)}
              >
                {s}{s !== 'All' && stats[s] !== undefined ? ` (${stats[s]})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={S.content}>

          {/* Table */}
          <div style={S.tableWrap}>
            {loading ? (
              <div style={S.loading}>
                <div style={S.spinner} />
                <p>Loading inquiries...</p>
              </div>
            ) : inquiries.length === 0 ? (
              <div style={S.empty}>
                <FiClipboard size={40} style={{ color: '#ddd5f0', marginBottom: '12px' }} />
                <p>No inquiries found</p>
              </div>
            ) : (
              <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>Student</th>
                    <th style={S.th}>Program</th>
                    <th style={S.th}>Fee</th>
                    <th style={S.th}>Date</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq, i) => (
                    <tr
                      key={inq._id}
                      style={{
                        ...S.tr,
                        background: selectedInquiry?._id === inq._id
                          ? '#faf5ff' : i % 2 === 0 ? '#fff' : '#fafafa',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedInquiry(inq)}
                    >
                      <td style={S.td}>
                        <div style={S.studentName}>{inq.name}</div>
                        <div style={S.studentSub}>{inq.email}</div>
                        <div style={S.studentSub}>{inq.phone}</div>
                      </td>
                      <td style={S.td}>
                        <div style={S.program}>{inq.program}</div>
                        <div style={S.studentSub}>{inq.interestedIn}</div>
                      </td>
                      <td style={S.td}>
                        <span style={S.fee}>{inq.programFee || '—'}</span>
                      </td>
                      <td style={S.td}>
                        <span style={S.date}>{fmt(inq.createdAt)}</span>
                      </td>
                      <td style={S.td} onClick={e => e.stopPropagation()}>
                        <select
                          style={{
                            ...S.statusSelect,
                            background:  STATUS_COLORS[inq.status]?.bg     || '#f9f9f9',
                            color:       STATUS_COLORS[inq.status]?.color  || '#333',
                            borderColor: STATUS_COLORS[inq.status]?.border || '#ddd',
                          }}
                          value={inq.status}
                          onChange={e => handleStatusChange(inq._id, e.target.value)}
                          disabled={updatingId === inq._id}
                        >
                          {STATUS_ORDER.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {updatingId === inq._id && (
                          <span style={S.updating}>saving...</span>
                        )}
                      </td>
                      <td style={S.td} onClick={e => e.stopPropagation()}>
                        <div style={S.actionBtns}>
                          <a
                            href={waLink(inq, `Hi ${inq.name}! Regarding your application for *${inq.program}* at ITechSkill.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={S.waBtn}
                            title="WhatsApp"
                          >
                            <FaWhatsapp size={15} />
                          </a>
                          <a
                            href={mailLink(inq)}
                            style={S.mailBtn}
                            title="Email"
                          >
                            <FiMail size={15} />
                          </a>
                          <button
                            style={S.detailBtn}
                            onClick={() => setSelectedInquiry(inq)}
                            title="View Details"
                          >
                            <FiEye size={15} />
                          </button>
                          <button
                            style={S.deleteBtn}
                            onClick={() => handleDelete(inq._id)}
                            disabled={deletingId === inq._id}
                            title="Delete"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Detail Panel */}
          {selectedInquiry && (
            <div style={S.detail}>
              <div style={S.detailHeader}>
                <h3 style={S.detailTitle}>Student Details</h3>
                <button style={S.closeBtn} onClick={() => setSelectedInquiry(null)}>✕</button>
              </div>
              <div style={S.detailBody}>

                <div style={{
                  ...S.statusBadge,
                  background: STATUS_COLORS[selectedInquiry.status]?.bg    || '#f9f9f9',
                  color:      STATUS_COLORS[selectedInquiry.status]?.color || '#333',
                  border: `1px solid ${STATUS_COLORS[selectedInquiry.status]?.border || '#ddd'}`,
                }}>
                  {selectedInquiry.status}
                </div>

                {/* Status guide */}
                <div style={S.statusGuide}>
                  {[
                    { s: 'Pending',   desc: 'Needs to be called' },
                    { s: 'Contacted', desc: 'Called, discussing' },
                    { s: 'Paid',      desc: 'Payment received' },
                    { s: 'Cancelled', desc: 'Not interested' },
                  ].map(({ s, desc }) => (
                    <div key={s} style={{
                      ...S.guideItem,
                      background: selectedInquiry.status === s
                        ? STATUS_COLORS[s]?.bg : 'transparent',
                      border: `1px solid ${selectedInquiry.status === s
                        ? STATUS_COLORS[s]?.border : '#f3f4f6'}`,
                    }}>
                      <span style={{ ...S.guideDot, background: STATUS_COLORS[s]?.border }} />
                      <div>
                        <span style={{ ...S.guideStatus, color: STATUS_COLORS[s]?.color }}>{s}</span>
                        <span style={S.guideDesc}>{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {[
                  ['Name',      selectedInquiry.name],
                  ['Email',     selectedInquiry.email],
                  ['Phone',     selectedInquiry.phone],
                  ['Age',       selectedInquiry.age],
                  ['Gender',    selectedInquiry.gender],
                  ['Country',   selectedInquiry.country],
                  ['Type',      selectedInquiry.interestedIn],
                  ['Program',   selectedInquiry.program],
                  ['Fee',       selectedInquiry.programFee || '—'],
                  ['Applied',   fmt(selectedInquiry.createdAt)],
                  ['Contacted', fmt(selectedInquiry.contactedAt)],
                  ['Paid On',   fmt(selectedInquiry.paidAt)],
                ].map(([label, value]) => (
                  <div key={label} style={S.infoRow}>
                    <span style={S.infoLabel}>{label}</span>
                    <span style={S.infoValue}>{value}</span>
                  </div>
                ))}

                {selectedInquiry.message && (
                  <div style={S.messageBox}>
                    <div style={S.infoLabel}>Message</div>
                    <p style={S.messageText}>{selectedInquiry.message}</p>
                  </div>
                )}

                {/* Admin Notes */}
                <div style={S.notesSection}>
                  <label style={S.notesLabel}>Admin Notes</label>
                  <textarea
                    style={S.notesTextarea}
                    placeholder="Add internal notes..."
                    value={notesMap[selectedInquiry._id] ?? selectedInquiry.adminNotes ?? ''}
                    onChange={e => setNotesMap(p => ({ ...p, [selectedInquiry._id]: e.target.value }))}
                    rows={3}
                  />
                  <button style={S.saveNotesBtn} onClick={() => handleSaveNotes(selectedInquiry._id)}>
                    Save Notes
                  </button>
                </div>

                {/* Update Status */}
                <div style={S.updateSection}>
                  <label style={S.notesLabel}>Update Status</label>
                  <div style={S.statusBtns}>
                    {STATUS_ORDER.map(s => (
                      <button
                        key={s}
                        style={{
                          ...S.statusBtn,
                          background:  STATUS_COLORS[s]?.bg    || '#f9f9f9',
                          color:       STATUS_COLORS[s]?.color || '#333',
                          border: `1.5px solid ${STATUS_COLORS[s]?.border || '#ddd'}`,
                          fontWeight:  selectedInquiry.status === s ? '800' : '500',
                          opacity:     selectedInquiry.status === s ? 1 : 0.65,
                          transform:   selectedInquiry.status === s ? 'scale(1.05)' : 'scale(1)',
                        }}
                        onClick={() => handleStatusChange(selectedInquiry._id, s)}
                        disabled={updatingId === selectedInquiry._id}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={S.quickActions}>
                  <a
                    href={waLink(selectedInquiry, `Hi ${selectedInquiry.name}! Regarding your *${selectedInquiry.program}* application at ITechSkill.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={S.quickWa}
                  >
                    <FaWhatsapp size={16} style={{ marginRight: '8px' }} />
                    WhatsApp Student
                  </a>
                  <a href={mailLink(selectedInquiry)} style={S.quickMail}>
                    <FiMail size={16} style={{ marginRight: '8px' }} />
                    Send Email
                  </a>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const S = {
  layout:       { display: 'flex', minHeight: '100vh', background: '#f5f4f0' },
  main:         { marginLeft: '280px', flex: 1, padding: '24px', fontFamily: "'Outfit', sans-serif", overflowX: 'hidden' },
  header:       { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title:        { fontSize: '1.6rem', fontWeight: '800', color: '#22013a', margin: 0 },
  subtitle:     { fontSize: '0.85rem', color: '#9b8db0', margin: '4px 0 0' },
  refreshBtn:   { padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #ddd5f0', background: '#fff', color: '#22013a', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' },
  statsGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' },
  statCard:     { background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #ede9f8', display: 'flex', alignItems: 'center', gap: '14px' },
  statIconBox:  { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statValue:    { fontSize: '1.5rem', fontWeight: '800', lineHeight: 1 },
  statLabel:    { fontSize: '0.72rem', color: '#9b8db0', marginTop: '3px', fontWeight: '600', textTransform: 'uppercase' },
  filters:      { background: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '20px', border: '1px solid #ede9f8' },
  searchInput:  { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.88rem', outline: 'none', marginBottom: '12px', boxSizing: 'border-box', fontFamily: 'inherit' },
  statusTabs:   { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tab:          { padding: '6px 14px', borderRadius: '20px', border: '1.5px solid #e5e7eb', background: '#f9f9f9', color: '#6b7280', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem' },
  tabActive:    { background: 'linear-gradient(135deg,#22013a,#7c1abd)', color: '#fff', borderColor: '#7c1abd' },
  content:      { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  tableWrap:    { flex: 1, background: '#fff', borderRadius: '12px', border: '1px solid #ede9f8', overflow: 'auto' },
  table:        { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  thead:        { background: 'linear-gradient(135deg,#22013a,#7c1abd)' },
  th:           { padding: '12px 16px', color: '#fff', fontWeight: '700', textAlign: 'left', fontSize: '0.78rem', whiteSpace: 'nowrap' },
  tr:           { borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' },
  td:           { padding: '12px 16px', verticalAlign: 'top' },
  studentName:  { fontWeight: '700', color: '#1a1228', fontSize: '0.88rem' },
  studentSub:   { fontSize: '0.75rem', color: '#9b8db0', marginTop: '2px' },
  program:      { fontWeight: '600', color: '#22013a', fontSize: '0.85rem' },
  fee:          { fontSize: '0.82rem', fontWeight: '700', color: '#8e5203' },
  date:         { fontSize: '0.78rem', color: '#6b7280' },
  statusSelect: { padding: '5px 8px', borderRadius: '8px', border: '1.5px solid', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', outline: 'none', width: '110px' },
  updating:     { fontSize: '0.7rem', color: '#9b8db0', display: 'block', marginTop: '2px' },
  actionBtns:   { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  waBtn:        { width: '30px', height: '30px', borderRadius: '6px', background: '#dcfce7', border: 'none', cursor: 'pointer', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' },
  mailBtn:      { width: '30px', height: '30px', borderRadius: '6px', background: '#eff6ff', border: 'none', cursor: 'pointer', color: '#1d4ed8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' },
  detailBtn:    { width: '30px', height: '30px', borderRadius: '6px', background: '#faf5ff', border: 'none', cursor: 'pointer', color: '#7c3aed', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  deleteBtn:    { width: '30px', height: '30px', borderRadius: '6px', background: '#fff1f2', border: 'none', cursor: 'pointer', color: '#e11d48', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  loading:      { padding: '60px', textAlign: 'center', color: '#9b8db0' },
  spinner:      { width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #ede9f8', borderTopColor: '#22013a', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' },
  empty:        { padding: '60px', textAlign: 'center', color: '#9b8db0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  detail:       { width: '340px', flexShrink: 0, background: '#fff', borderRadius: '12px', border: '1px solid #ede9f8', overflow: 'hidden', position: 'sticky', top: '24px' },
  detailHeader: { background: 'linear-gradient(135deg,#22013a,#7c1abd)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  detailTitle:  { color: '#fff', margin: 0, fontSize: '1rem', fontWeight: '700' },
  closeBtn:     { background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  detailBody:   { padding: '16px', maxHeight: '80vh', overflowY: 'auto' },
  statusBadge:  { display: 'inline-block', padding: '5px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '0.82rem', marginBottom: '12px' },

  statusGuide:  { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', padding: '10px', background: '#fafafa', borderRadius: '10px', border: '1px solid #f3f4f6' },
  guideItem:    { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '7px', transition: 'all 0.2s' },
  guideDot:     { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  guideStatus:  { fontSize: '0.78rem', fontWeight: '700', display: 'block' },
  guideDesc:    { fontSize: '0.7rem', color: '#9b8db0', display: 'block' },

  infoRow:      { display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6', gap: '8px' },
  infoLabel:    { fontSize: '0.75rem', color: '#9b8db0', fontWeight: '600', flexShrink: 0 },
  infoValue:    { fontSize: '0.8rem', color: '#1a1228', fontWeight: '600', textAlign: 'right', wordBreak: 'break-all' },
  messageBox:   { background: '#faf5ff', borderRadius: '8px', padding: '10px 12px', margin: '10px 0', border: '1px solid #ede9f8' },
  messageText:  { fontSize: '0.82rem', color: '#4b3f6b', margin: '6px 0 0', lineHeight: 1.6 },
  notesSection:  { marginTop: '14px' },
  notesLabel:    { fontSize: '0.78rem', fontWeight: '700', color: '#22013a', display: 'block', marginBottom: '6px' },
  notesTextarea: { width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.82rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' },
  saveNotesBtn:  { marginTop: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#22013a', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' },
  updateSection: { marginTop: '14px' },
  statusBtns:    { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' },
  statusBtn:     { padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.75rem', transition: 'all 0.15s' },
  quickActions:  { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
  quickWa:       { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px', borderRadius: '10px', background: '#25d366', color: '#fff', textDecoration: 'none', fontWeight: '700', fontSize: '0.88rem' },
  quickMail:     { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px', borderRadius: '10px', background: '#22013a', color: '#fff', textDecoration: 'none', fontWeight: '700', fontSize: '0.88rem' },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  table tr:hover { background: #faf5ff !important; }
  select:focus { border-color: #7c3aed !important; }
  textarea:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-thumb { background: #ede9f8; border-radius: 4px; }
  @media (max-width: 768px) {
    .main-content { margin-left: 0 !important; padding-top: 70px !important; }
  }
`;