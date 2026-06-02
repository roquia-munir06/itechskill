import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAward, FiEye, FiEyeOff } from 'react-icons/fi';
import AdminSidebar from '../components/Sidebar';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EMPTY_FORM = {
  title: '',
  categories: '',
  description: '',
  image: '',
  logoWidth: '200px',
  color: '#22013a',
  isActive: true,
  order: 0,
    price: '',
  discountedPrice: '',
  currency: 'USD',
  examVoucherIncluded: false,
};

export default function AdminVendorCertifications() {
  const [certs, setCerts]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState(null);   // for detail panel
  const [showForm, setShowForm]         = useState(false);  // add/edit modal
  const [editingId, setEditingId]       = useState(null);   // null = create
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [deletingId, setDeletingId]     = useState(null);
  const [togglingId, setTogglingId]     = useState(null);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');

  /* ── fetch all ── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/vendor-certifications`);
      const data = await res.json();
      // fetch ALL (including inactive) for admin — backend returns isActive:true only
      // so we do a separate admin fetch; for now use same endpoint
      setCerts(data.data || []);
    } catch (e) {
      setError('Failed to load certifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ── helpers ── */
  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3500); }
    else         { setSuccess(msg); setTimeout(() => setSuccess(''), 3500); }
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

const openEdit = (cert) => {
  setForm({
    title:               cert.title,
    categories:          cert.categories,
    description:         cert.description    || '',
    image:               cert.image          || '',
    logoWidth:           cert.logoWidth      || '200px',
    color:               cert.color          || '#22013a',
    isActive:            cert.isActive,
    order:               cert.order          || 0,
    price:               cert.price > 0 ? cert.price : '',   // ← show blank if 0
    discountedPrice:     cert.discountedPrice > 0 ? cert.discountedPrice : '',
    currency:            cert.currency       || 'USD',
    examVoucherIncluded: cert.examVoucherIncluded || false,
  });
  setEditingId(cert._id);
  setShowForm(true);
};
const handleSave = async () => {
  if (!form.title.trim() || !form.categories.trim()) {
    flash('Title and Categories are required.', true);
    return;
  }
  setSaving(true);
  try {
    const url    = editingId
      ? `${API_BASE}/vendor-certifications/${editingId}`
      : `${API_BASE}/vendor-certifications`;
    const method = editingId ? 'PUT' : 'POST';

    const payload = {
      ...form,
      price: form.price === '' ? 0 : Number(form.price),
      discountedPrice: form.discountedPrice === '' ? null : Number(form.discountedPrice),
    };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    flash(editingId ? 'Updated successfully!' : 'Created successfully!');
    setShowForm(false);
    fetchAll();
  } catch (e) {
    flash(e.message || 'Save failed.', true);
  } finally {
    setSaving(false);
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification permanently?')) return;
    setDeletingId(id);
    try {
      const res  = await fetch(`${API_BASE}/vendor-certifications/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      flash('Deleted successfully!');
      setCerts(p => p.filter(c => c._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (e) {
      flash(e.message || 'Delete failed.', true);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (cert) => {
    setTogglingId(cert._id);
    try {
      const res  = await fetch(`${API_BASE}/vendor-certifications/${cert._id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ isActive: !cert.isActive }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      flash(`${cert.title} ${!cert.isActive ? 'activated' : 'deactivated'}`);
      fetchAll();
    } catch (e) {
      flash(e.message || 'Toggle failed.', true);
    } finally {
      setTogglingId(null);
    }
  };

  /* ── stats ── */
  const total    = certs.length;
  const active   = certs.filter(c => c.isActive).length;
  const inactive = total - active;

  return (
    <div style={S.layout}>
      <AdminSidebar />

      <div style={S.main}>
        <style>{CSS}</style>

        {/* Flash messages */}
        {error   && <div style={S.flashError}>{error}</div>}
        {success && <div style={S.flashSuccess}>{success}</div>}

        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Vendor Certifications</h1>
            <p style={S.subtitle}>Manage Microsoft, AWS, PMI and other partner logos shown on homepage</p>
          </div>
          <button style={S.addBtn} onClick={openCreate}>
            <FiPlus size={16} style={{ marginRight: 6 }} />
            Add Certification
          </button>
        </div>

        {/* Stats */}
        <div style={S.statsGrid}>
          {[
            { label: 'Total',    value: total,    color: '#22013a', bg: '#f3f0ff' },
            { label: 'Active',   value: active,   color: '#166534', bg: '#f0fdf4' },
            { label: 'Inactive', value: inactive, color: '#be123c', bg: '#fff1f2' },
          ].map(s => (
            <div key={s.label} style={S.statCard}>
              <div style={{ ...S.statIconBox, background: s.bg }}>
                <FiAward size={20} color={s.color} />
              </div>
              <div>
                <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Content: table + detail panel */}
        <div style={S.content}>

          {/* Table */}
          <div style={S.tableWrap}>
            {loading ? (
              <div style={S.loading}>
                <div style={S.spinner} />
                <p>Loading...</p>
              </div>
            ) : certs.length === 0 ? (
              <div style={S.empty}>
                <FiAward size={40} style={{ color: '#ddd5f0', marginBottom: 12 }} />
                <p>No certifications yet. Click "Add Certification" to start.</p>
              </div>
            ) : (
              <table style={S.table}>
                <thead>
                  <tr style={S.thead}>
                    <th style={S.th}>Logo</th>
                    <th style={S.th}>Title</th>
                    <th style={S.th}>Categories</th>
                    <th style={S.th}>Order</th>
                    <th style={S.th}>Status</th>
                    <th style={S.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certs.map((cert, i) => (
                    <tr
                      key={cert._id}
                      style={{
                        ...S.tr,
                        background: selected?._id === cert._id
                          ? '#faf5ff' : i % 2 === 0 ? '#fff' : '#fafafa',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelected(cert)}
                    >
                      {/* Logo */}
                      <td style={S.td}>
                        {cert.image ? (
                          <img
                            src={cert.image}
                            alt={cert.title}
                            style={{ width: 60, height: 40, objectFit: 'contain', borderRadius: 6, border: '1px solid #ede9f8' }}
                          />
                        ) : (
                          <div style={{ width: 60, height: 40, background: '#f3f0ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiAward size={20} color="#ddd5f0" />
                          </div>
                        )}
                      </td>

                      {/* Title */}
                      <td style={S.td}>
                        <div style={S.certTitle}>{cert.title}</div>
                        {cert.description && (
                          <div style={S.certSub}>{cert.description.slice(0, 50)}…</div>
                        )}
                      </td>

                      {/* Categories */}
                      <td style={S.td}>
                        <div style={S.categories}>{cert.categories}</div>
                      </td>

                      {/* Order */}
                      <td style={S.td}>
                        <span style={S.orderBadge}>{cert.order}</span>
                      </td>

                      {/* Status */}
                      <td style={S.td}>
                        <span style={{ ...S.statusBadge, ...(cert.isActive ? S.statusActive : S.statusInactive) }}>
                          {cert.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                     {/* Actions */}
<td style={S.td} onClick={e => e.stopPropagation()}>
  <div style={S.actionBtns}>

    {/* View — opens detail panel */}
    <button
      style={S.viewBtn}
      onClick={() => setSelected(cert)}
      title="View Details"
    >
      <FiEye size={14} />
    </button>

    {/* Edit */}
    <button
      style={S.editBtn}
      onClick={() => openEdit(cert)}
      title="Edit"
    >
      <FiEdit2 size={14} />
    </button>

    {/* Delete */}
    <button
      style={S.deleteBtn}
      onClick={() => handleDelete(cert._id)}
      disabled={deletingId === cert._id}
      title="Delete"
    >
      <FiTrash2 size={14} />
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
          {selected && (
            <div style={S.detail}>
              <div style={S.detailHeader}>
                <h3 style={S.detailTitle}>Details</h3>
                <button style={S.closeBtn} onClick={() => setSelected(null)}>✕</button>
              </div>
              <div style={S.detailBody}>

                {/* Logo preview */}
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  {selected.image ? (
                    <img
                      src={selected.image}
                      alt={selected.title}
                      style={{ maxWidth: selected.logoWidth || '200px', maxHeight: 80, objectFit: 'contain' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: 80, background: '#f3f0ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiAward size={32} color="#ddd5f0" />
                    </div>
                  )}
                </div>

                {/* Status badge */}
                <div style={{ textAlign: 'center', marginBottom: 14 }}>
                  <span style={{ ...S.statusBadge, ...(selected.isActive ? S.statusActive : S.statusInactive), fontSize: '0.85rem', padding: '6px 18px' }}>
                    {selected.isActive ? '● Active' : '● Inactive'}
                  </span>
                </div>

                {/* Info rows */}
                {[
                  ['Title',       selected.title],
                  ['Categories',  selected.categories],
                  ['Description', selected.description || '—'],
                  ['Image URL',   selected.image       || '—'],
                  ['Logo Width',  selected.logoWidth   || '200px'],
                  ['Color',       selected.color       || '#22013a'],
                  ['Display Order', selected.order],
                  ['Price',            selected.price ? `${selected.currency} ${selected.price}` : '—'],
['Discounted Price', selected.discountedPrice ? `${selected.currency} ${selected.discountedPrice}` : '—'],
['Exam Voucher',     selected.examVoucherIncluded ? 'Included ✓' : 'Not included'],
                ].map(([label, value]) => (
                  <div key={label} style={S.infoRow}>
                    <span style={S.infoLabel}>{label}</span>
                    <span style={S.infoValue}>{value}</span>
                  </div>
                ))}

                {/* Color swatch */}
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: selected.color || '#22013a', border: '1px solid #ede9f8' }} />
                  <span style={{ fontSize: '0.78rem', color: '#9b8db0' }}>{selected.color}</span>
                </div>

                {/* Action buttons */}
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    style={S.detailEditBtn}
                    onClick={() => { openEdit(selected); }}
                  >
                    <FiEdit2 size={15} style={{ marginRight: 8 }} />
                    Edit Certification
                  </button>
                  <button
                    style={S.detailDeleteBtn}
                    onClick={() => handleDelete(selected._id)}
                  >
                    <FiTrash2 size={15} style={{ marginRight: 8 }} />
                    Delete Certification
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div style={S.modalOverlay} onClick={() => setShowForm(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>

            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>
                {editingId ? 'Edit Certification' : 'Add New Certification'}
              </h2>
              <button style={S.closeBtn} onClick={() => setShowForm(false)}>
                <FiX size={16} />
              </button>
            </div>

            <div style={S.modalBody}>

              {/* Title */}
              <div style={S.fieldGroup}>
                <label style={S.label}>Title <span style={{ color: '#e11d48' }}>*</span></label>
                <input
                  style={S.input}
                  placeholder="e.g. Microsoft"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                />
              </div>

              {/* Categories */}
              <div style={S.fieldGroup}>
                <label style={S.label}>Categories <span style={{ color: '#e11d48' }}>*</span></label>
                <input
                  style={S.input}
                  placeholder="e.g. Cloud, Networking, Cybersecurity"
                  value={form.categories}
                  onChange={e => setForm(p => ({ ...p, categories: e.target.value }))}
                />
              </div>

              {/* Description */}
              <div style={S.fieldGroup}>
                <label style={S.label}>Description</label>
                <textarea
                  style={{ ...S.input, resize: 'vertical', minHeight: 70 }}
                  placeholder="Short description shown on hover or detail view"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                />
              </div>

            {/* Image Upload */}
<div style={S.fieldGroup}>
  <label style={S.label}>Logo Image</label>

  {/* Drop zone */}
  <div
    style={{
      border: '2px dashed #c4b5fd',
      borderRadius: 10,
      padding: '18px 12px',
      textAlign: 'center',
      cursor: 'pointer',
      background: '#faf5ff',
      transition: 'border-color 0.2s',
      position: 'relative',
    }}
    onClick={() => document.getElementById('logo-upload-input').click()}
    onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#7c3aed'; }}
    onDragLeave={e => { e.currentTarget.style.borderColor = '#c4b5fd'; }}
    onDrop={e => {
      e.preventDefault();
      e.currentTarget.style.borderColor = '#c4b5fd';
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = ev => setForm(p => ({ ...p, image: ev.target.result }));
        reader.readAsDataURL(file);
      }
    }}
  >
    <input
      id="logo-upload-input"
      type="file"
      accept="image/*"
      style={{ display: 'none' }}
      onChange={e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => setForm(p => ({ ...p, image: ev.target.result }));
        reader.readAsDataURL(file);
      }}
    />

    {form.image ? (
      <>
        <img
          src={form.image}
          alt="preview"
          style={{ maxHeight: 70, maxWidth: '100%', objectFit: 'contain', marginBottom: 8 }}
        />
        <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>
          Click or drop to replace
        </div>
      </>
    ) : (
      <>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#7c3aed' }}>
          Click to upload or drag & drop
        </div>
        <div style={{ fontSize: '0.72rem', color: '#9b8db0', marginTop: 4 }}>
          PNG, JPG, SVG, WEBP — max 2 MB
        </div>
      </>
    )}
  </div>

  {/* Also allow URL fallback */}
  <input
    style={{ ...S.input, marginTop: 8, fontSize: '0.78rem', color: '#9b8db0' }}
    placeholder="…or paste an image URL"
    value={form.image?.startsWith('data:') ? '' : (form.image || '')}
    onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
  />
</div>

              {/* Logo Width + Color + Order in a row */}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ ...S.fieldGroup, flex: 1 }}>
                  <label style={S.label}>Logo Width</label>
                  <input
                    style={S.input}
                    placeholder="200px"
                    value={form.logoWidth}
                    onChange={e => setForm(p => ({ ...p, logoWidth: e.target.value }))}
                  />
                </div>
                <div style={{ ...S.fieldGroup, flex: 1 }}>
                  <label style={S.label}>Color</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={form.color}
                      onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                      style={{ width: 44, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2 }}
                    />
                    <input
                      style={{ ...S.input, flex: 1 }}
                      value={form.color}
                      onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ ...S.fieldGroup, width: 90 }}>
                  <label style={S.label}>Order</label>
                  <input
                    type="number"
                    style={S.input}
                    value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                  />
                </div>
              </div>
{/* ── Pricing ── */}
<div style={{ borderTop: '1.5px dashed #ede9f8', paddingTop: 14 }}>
  <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#22013a', marginBottom: 10 }}>
    💰 Pricing
  </div>

  <div style={{ display: 'flex', gap: 12 }}>

    {/* Original Price */}
    <div style={{ ...S.fieldGroup, flex: 1 }}>
      <label style={S.label}>Original Price</label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '0.85rem', color: '#9b8db0', fontWeight: 700,
        }}>
          {form.currency === 'USD' ? '$' : form.currency === 'PKR' ? '₨' : '€'}
        </span>
        <input
          type="number"
          min="0"
          style={{ ...S.input, paddingLeft: 28 }}
          placeholder="0"
          value={form.price}
          onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
        />
      </div>
    </div>

    {/* Discounted Price */}
    <div style={{ ...S.fieldGroup, flex: 1 }}>
      <label style={S.label}>Discounted Price</label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '0.85rem', color: '#9b8db0', fontWeight: 700,
        }}>
          {form.currency === 'USD' ? '$' : form.currency === 'PKR' ? '₨' : '€'}
        </span>
        <input
          type="number"
          min="0"
          style={{ ...S.input, paddingLeft: 28 }}
          placeholder="Leave empty if no discount"
          value={form.discountedPrice}
          onChange={e => setForm(p => ({ ...p, discountedPrice: e.target.value }))}
        />
      </div>
    </div>

    {/* Currency */}
    <div style={{ ...S.fieldGroup, width: 90 }}>
      <label style={S.label}>Currency</label>
      <select
        style={{ ...S.input, cursor: 'pointer' }}
        value={form.currency}
        onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}
      >
        <option value="USD">USD</option>
        <option value="PKR">PKR</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
      </select>
    </div>

  </div>

  {/* Exam Voucher toggle */}
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
    <label style={{ ...S.label, margin: 0 }}>Exam Voucher Included</label>
    <div
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
        background: form.examVoucherIncluded ? '#22013a' : '#e5e7eb',
        position: 'relative', transition: 'background 0.2s',
      }}
      onClick={() => setForm(p => ({ ...p, examVoucherIncluded: !p.examVoucherIncluded }))}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: form.examVoucherIncluded ? 22 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
      }} />
    </div>
    <span style={{ fontSize: '0.8rem', color: form.examVoucherIncluded ? '#166534' : '#9b8db0', fontWeight: 600 }}>
      {form.examVoucherIncluded ? 'Yes — voucher included' : 'No'}
    </span>
  </div>
</div>
              {/* isActive toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <label style={{ ...S.label, margin: 0 }}>Show on homepage</label>
                <div
                  style={{
                    width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
                    background: form.isActive ? '#22013a' : '#e5e7eb',
                    position: 'relative', transition: 'background 0.2s',
                  }}
                  onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                >
                  <div style={{
                    position: 'absolute', top: 3,
                    left: form.isActive ? 22 : 3,
                    width: 18, height: 18, borderRadius: '50%',
                    background: '#fff', transition: 'left 0.2s',
                  }} />
                </div>
                <span style={{ fontSize: '0.8rem', color: form.isActive ? '#166534' : '#9b8db0', fontWeight: 600 }}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

            </div>

            <div style={S.modalFooter}>
              <button style={S.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={S.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : (
                  <><FiCheck size={15} style={{ marginRight: 6 }} />{editingId ? 'Update' : 'Create'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Styles ── */
const S = {
  layout:        { display: 'flex', minHeight: '100vh', background: '#f5f4f0' },
  main:          { marginLeft: '280px', flex: 1, padding: '24px', fontFamily: "'Outfit', sans-serif", overflowX: 'hidden' },
  header:        { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title:         { fontSize: '1.6rem', fontWeight: '800', color: '#22013a', margin: 0 },
  subtitle:      { fontSize: '0.85rem', color: '#9b8db0', margin: '4px 0 0' },
  addBtn:        { display: 'flex', alignItems: 'center', padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#22013a,#7c1abd)', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem' },

  statsGrid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' },
  statCard:      { background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #ede9f8', display: 'flex', alignItems: 'center', gap: '14px' },
  statIconBox:   { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statValue:     { fontSize: '1.5rem', fontWeight: '800', lineHeight: 1 },
  statLabel:     { fontSize: '0.72rem', color: '#9b8db0', marginTop: '3px', fontWeight: '600', textTransform: 'uppercase' },

  content:       { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  tableWrap:     { flex: 1, background: '#fff', borderRadius: '12px', border: '1px solid #ede9f8', overflow: 'auto' },
  table:         { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  thead:         { background: 'linear-gradient(135deg,#22013a,#7c1abd)' },
  th:            { padding: '12px 16px', color: '#fff', fontWeight: '700', textAlign: 'left', fontSize: '0.78rem', whiteSpace: 'nowrap' },
  tr:            { borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' },
  td:            { padding: '12px 16px', verticalAlign: 'middle' },

  certTitle:     { fontWeight: '700', color: '#1a1228', fontSize: '0.88rem' },
  certSub:       { fontSize: '0.75rem', color: '#9b8db0', marginTop: '2px' },
  categories:    { fontSize: '0.8rem', color: '#22013a', fontWeight: '600' },
  orderBadge:    { background: '#f3f0ff', color: '#7c1abd', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem' },
  statusBadge:   { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '0.75rem' },
  statusActive:  { background: '#f0fdf4', color: '#166534', border: '1px solid #86efac' },
  statusInactive:{ background: '#fff1f2', color: '#be123c', border: '1px solid #fca5a5' },

  actionBtns:    { display: 'flex', gap: '6px', alignItems: 'center' },
  editBtn:       { width: 30, height: 30, borderRadius: 6, background: '#faf5ff', border: 'none', cursor: 'pointer', color: '#7c3aed', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  deleteBtn:     { width: 30, height: 30, borderRadius: 6, background: '#fff1f2', border: 'none', cursor: 'pointer', color: '#e11d48', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
viewBtn: { 
  width: 30, height: 30, borderRadius: 6, 
  background: '#eff6ff', border: 'none', 
  cursor: 'pointer', color: '#1d4ed8', 
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center' 
},
  loading:       { padding: '60px', textAlign: 'center', color: '#9b8db0' },
  spinner:       { width: 36, height: 36, borderRadius: '50%', border: '3px solid #ede9f8', borderTopColor: '#22013a', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' },
  empty:         { padding: '60px', textAlign: 'center', color: '#9b8db0', display: 'flex', flexDirection: 'column', alignItems: 'center' },

  detail:        { width: '320px', flexShrink: 0, background: '#fff', borderRadius: '12px', border: '1px solid #ede9f8', overflow: 'hidden', position: 'sticky', top: '24px' },
  detailHeader:  { background: 'linear-gradient(135deg,#22013a,#7c1abd)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  detailTitle:   { color: '#fff', margin: 0, fontSize: '1rem', fontWeight: '700' },
  closeBtn:      { background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  detailBody:    { padding: '16px', maxHeight: '80vh', overflowY: 'auto' },
  infoRow:       { display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f3f4f6', gap: '8px' },
  infoLabel:     { fontSize: '0.75rem', color: '#9b8db0', fontWeight: '600', flexShrink: 0 },
  infoValue:     { fontSize: '0.8rem', color: '#1a1228', fontWeight: '600', textAlign: 'right', wordBreak: 'break-all' },
  detailEditBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px', borderRadius: '10px', background: '#22013a', color: '#fff', border: 'none', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', width: '100%' },
  detailDeleteBtn:{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px', borderRadius: '10px', background: '#fff1f2', color: '#e11d48', border: '1px solid #fca5a5', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', width: '100%' },

  /* Modal */
  modalOverlay:  { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal:         { background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '560px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' },
  modalHeader:   { background: 'linear-gradient(135deg,#22013a,#7c1abd)', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle:    { color: '#fff', margin: 0, fontSize: '1.1rem', fontWeight: '800' },
  modalBody:     { padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' },
  modalFooter:   { padding: '16px 24px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#fafafa' },

  fieldGroup:    { display: 'flex', flexDirection: 'column', gap: '6px' },
  label:         { fontSize: '0.78rem', fontWeight: '700', color: '#22013a' },
  input:         { padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' },

  cancelBtn:     { padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#fff', color: '#6b7280', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' },
  saveBtn:       { display: 'flex', alignItems: 'center', padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#22013a,#7c1abd)', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' },

  flashError:    { position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#fff1f2', color: '#be123c', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 20px', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  flashSuccess:  { position: 'fixed', top: 20, right: 20, zIndex: 9999, background: '#f0fdf4', color: '#166534', border: '1px solid #86efac', borderRadius: '10px', padding: '12px 20px', fontWeight: '700', fontSize: '0.88rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
  @keyframes spin { to { transform: rotate(360deg); } }
  table tr:hover { background: #faf5ff !important; }
  input:focus, textarea:focus, select:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-thumb { background: #ede9f8; border-radius: 4px; }
  @media (max-width: 768px) {
    div[style*="marginLeft: 280px"] { margin-left: 0 !important; padding-top: 70px !important; }
  }
`;