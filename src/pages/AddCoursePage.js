import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const COLORS = {
  sidebarDark: '#1a1d2e',
  deepPurple: '#3D1A5B',
  headerPurple: '#4B2D7A',
  brightGreen: '#00D9A3',
  goldBadge: '#D4A745',
  white: '#FFFFFF',
  bgGray: '#F9FAFB',
  lightGray: '#F3F4F6',
  darkGray: '#6B7280',
  textGray: '#4B5563',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  orange: '#3D1A5B',
};

const COLOR_PRESETS = ['#22013a', '#8e5203', '#0a3d62', '#006266', '#1B1464', '#6F1E51'];

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet', 'indent',
  'blockquote',
];

const EMPTY_FORM = {
  title: '',
  category: 'professional',
  installmentFee: '',
  installmentDollar: '',
  discountedFee: '',
  discountedDollar: '',
  duration: '',
  color: '#22013a',
  technologies: '',
  projects: '5 Capstone Projects',
  description: '',
  overview: '',
  learningOutcomes: '',
  targetAudience: '',
  prerequisites: 'No prior experience required',
  curriculum: [],
  careerPaths: '',
  certification: 'Certificate of Completion issued by ITechSkill',
  additionalNotes: '',
  instructor: { name: '', bio: '', photo: '' },
  coverImage: '',
  isActive: true,
  displayOrder: 0,
};

const Modal = ({ children, onClose }) => (
  <div style={{
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000, padding: '16px',
  }}>
    <div style={{
      background: COLORS.white,
      borderRadius: '16px',
      width: '100%',
      maxWidth: '680px',
      maxHeight: '92vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(61,26,91,0.18)',
    }}>
      {children}
    </div>
  </div>
);

const inputStyle = (err) => ({
  padding: '10px 14px',
  borderRadius: '8px',
  border: `1.5px solid ${err ? COLORS.danger : '#D1D5DB'}`,
  width: '100%',
  boxSizing: 'border-box',
  fontSize: '14px',
  outline: 'none',
  background: COLORS.white,
  color: COLORS.textGray,
  transition: 'border-color 0.2s',
});

const labelStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: COLORS.textGray,
  marginBottom: '5px',
  display: 'block',
};

const sectionHeadStyle = {
  fontSize: '11px',
  fontWeight: '700',
  color: COLORS.deepPurple,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '14px',
  marginTop: '4px',
  paddingBottom: '8px',
  borderBottom: `2px solid #EDE9F4`,
};

export default function Addcoursepage() {
  const [isMobile, setIsMobile]       = useState(window.innerWidth <= 768);
  const [programs, setPrograms]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [search, setSearch]           = useState('');
  const [filterCat, setFilterCat]     = useState('all');
  const [formVisible, setFormVisible] = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [deleteId, setDeleteId]       = useState(null);
  const [toast, setToast]             = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [errors, setErrors]           = useState({});
  const [curriculumRows, setCurriculumRows] = useState([{ moduleTitle: '', topics: '' }]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/programs/admin/all`);
      const data = await res.json();
      if (data.success) setPrograms(data.data);
      else showToast('Failed to load programs', 'error');
    } catch { showToast('Cannot reach server', 'error'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchPrograms(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setCurriculumRows([{ moduleTitle: '', topics: '' }]);
    setErrors({});
    setFormVisible(true);
  };

  const openEdit = (prog) => {
    setEditTarget(prog);
    setForm({
      ...prog,
      technologies:     (prog.technologies    || []).join(', '),
      learningOutcomes: (prog.learningOutcomes || []).join('\n'),
      careerPaths:      (prog.careerPaths      || []).join(', '),
      instructor: prog.instructor || { name: '', bio: '', photo: '' },
      description: prog.description || '',
    });
    setCurriculumRows(
      (prog.curriculum || []).length
        ? prog.curriculum.map(m => ({ moduleTitle: m.moduleTitle, topics: (m.topics || []).join(', ') }))
        : [{ moduleTitle: '', topics: '' }]
    );
    setErrors({});
    setFormVisible(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('instructor.')) {
      const key = name.split('.')[1];
      setForm(p => ({ ...p, instructor: { ...p.instructor, [key]: value } }));
    } else {
      setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    }
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleCurriculumChange = (i, field, value) =>
    setCurriculumRows(p => p.map((row, idx) => idx === i ? { ...row, [field]: value } : row));

  const validate = () => {
    const errs = {};
    if (!form.title.trim())          errs.title          = 'Title is required';
    if (!form.installmentFee.trim()) errs.installmentFee = 'Installment fee is required';
    if (!form.discountedFee.trim())  errs.discountedFee  = 'Discounted fee is required';
    if (!form.duration.trim())       errs.duration       = 'Duration is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const payload = {
      ...form,
      curriculum: curriculumRows
        .filter(r => r.moduleTitle.trim())
        .map(r => ({
          moduleTitle: r.moduleTitle.trim(),
          topics: r.topics.split(',').map(t => t.trim()).filter(Boolean),
        })),
    };
    try {
      const method = editTarget ? 'PUT' : 'POST';
      const url    = editTarget ? `${API_BASE}/programs/${editTarget._id}` : `${API_BASE}/programs`;
      const res    = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editTarget ? 'Program updated!' : 'Program created!');
        await fetchPrograms();
        setFormVisible(false);
      } else { showToast(data.message || 'Something went wrong', 'error'); }
    } catch { showToast('Server error', 'error'); }
    finally { setSaving(false); }
  };

  const handleToggle = async (id) => {
    try {
      const res  = await fetch(`${API_BASE}/programs/${id}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setPrograms(p => p.map(x => x._id === id ? data.data : x));
      }
    } catch { showToast('Toggle failed', 'error'); }
  };

  const handleDelete = async () => {
    try {
      const res  = await fetch(`${API_BASE}/programs/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Program deleted');
        setPrograms(p => p.filter(x => x._id !== deleteId));
      } else { showToast(data.message || 'Delete failed', 'error'); }
    } catch { showToast('Server error', 'error'); }
    finally { setDeleteId(null); }
  };

  const filtered = programs.filter(p => {
    const matchCat    = filterCat === 'all' || p.category === filterCat;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', backgroundColor: COLORS.bgGray, minHeight: '100vh' }}>
      <Sidebar />

      {/* Quill global style overrides */}
      <style>{`
        .ql-container { font-size: 14px; font-family: 'Segoe UI', sans-serif; min-height: 180px; }
        .ql-editor { min-height: 180px; line-height: 1.7; color: #374151; }
        .ql-editor.ql-blank::before { color: #9ca3af; font-style: normal; }
        .ql-toolbar { border-radius: 8px 8px 0 0 !important; border-color: #D1D5DB !important; background: #fafafa; }
        .ql-container { border-radius: 0 0 8px 8px !important; border-color: #D1D5DB !important; }
        .ql-editor ul, .ql-editor ol { padding-left: 1.5em; }
        .ql-editor li { margin-bottom: 4px; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 99999,
          padding: '14px 20px', borderRadius: '10px', fontWeight: '600', fontSize: '14px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
          background: toast.type === 'success' ? '#ecfdf5' : '#fff1f2',
          color:      toast.type === 'success' ? '#065f46' : '#9f1239',
          border:     `1.5px solid ${toast.type === 'success' ? '#6ee7b7' : '#fda4af'}`,
        }}>
      {/* {toast.type === 'success'} {toast.msg}     */}


      {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <Modal onClose={() => setDeleteId(null)}>
          <div style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}></div>
            <h3 style={{ color: COLORS.deepPurple, margin: '0 0 8px' }}>Delete Program?</h3>
            <p style={{ color: COLORS.darkGray, fontSize: '14px', margin: '0 0 24px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={handleDelete} style={{
                padding: '10px 28px', borderRadius: '8px', border: 'none',
                background: COLORS.danger, color: COLORS.white, fontWeight: '600', cursor: 'pointer', fontSize: '14px',
              }}>Yes, Delete</button>
              <button onClick={() => setDeleteId(null)} style={{
                padding: '10px 28px', borderRadius: '8px', border: `1px solid #D1D5DB`,
                background: COLORS.white, color: COLORS.textGray, fontWeight: '600', cursor: 'pointer', fontSize: '14px',
              }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Main Content */}
      <div style={{
        flex: 1, overflowX: 'hidden',
        marginLeft: isMobile ? '0' : '280px',
        padding: isMobile ? '80px 16px 32px 16px' : '32px',
      }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: '24px', flexWrap: 'wrap', gap: '16px',
          }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: COLORS.deepPurple, margin: 0, marginBottom: '8px' }}>
                Programs Manager
              </h1>
              <p style={{ color: COLORS.textGray, margin: 0, fontSize: '14px' }}>
                Manage all courses and programs displayed on the website
              </p>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(61,26,91,0.1) 0%, rgba(94,66,123,0.1) 100%)',
              border: '1px solid rgba(61,26,91,0.2)', borderRadius: '8px', padding: '12px 16px',
            }}>
              <p style={{ color: COLORS.deepPurple, fontSize: '14px', fontWeight: '600', margin: 0 }}>
                Total Programs: {programs.length}
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex', gap: isMobile ? '12px' : '16px',
            marginBottom: '24px',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
          }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: isMobile ? '100%' : '400px' }}>
              <FaSearch style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                color: COLORS.darkGray, fontSize: '16px',
              }} />
              <input
                type="text" placeholder="Search programs..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle(), paddingLeft: '48px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'professional', 'short'].map(c => (
                <button key={c} onClick={() => setFilterCat(c)} style={{
                  padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: '600', fontSize: '13px', transition: 'all 0.2s',
                  border: `1px solid ${filterCat === c ? COLORS.deepPurple : '#D1D5DB'}`,
                  background: filterCat === c ? COLORS.deepPurple : COLORS.white,
                  color: filterCat === c ? COLORS.white : COLORS.textGray,
                }}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                  <span style={{
                    marginLeft: '6px', background: 'rgba(0,0,0,0.15)',
                    padding: '1px 7px', borderRadius: '99px', fontSize: '11px',
                  }}>
                    {c === 'all' ? programs.length : programs.filter(p => p.category === c).length}
                  </span>
                </button>
              ))}
            </div>

            <button onClick={openAdd} style={{
              background: COLORS.orange, color: COLORS.white, border: 'none',
              padding: isMobile ? '12px 24px' : '11px 24px',
              borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              whiteSpace: 'nowrap',
            }}>
              <FaPlus /> Add New Program
            </button>
          </div>

          <div style={{
            background: COLORS.white, borderRadius: '12px',
            overflow: isMobile ? 'auto' : 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: COLORS.darkGray }}>Loading programs...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '900px' : 'auto' }}>
                <thead>
                  <tr style={{ background: COLORS.headerPurple, color: COLORS.white }}>
                    {['#', 'Program Title', 'Category', 'Duration', 'Installment Fee', 'Discounted Fee', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: isMobile ? '14px 16px' : '18px 24px',
                        textAlign: h === 'Actions' ? 'center' : 'left',
                        fontSize: isMobile ? '13px' : '15px', fontWeight: '700',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map((prog, idx) => (
                    <tr key={prog._id} style={{
                      borderBottom: `1px solid ${COLORS.lightGray}`,
                      background: idx % 2 === 0 ? COLORS.white : COLORS.bgGray,
                      opacity: prog.isActive ? 1 : 0.5,
                    }}>
                      <td style={{ padding: isMobile ? '14px 16px' : '18px 24px', color: COLORS.textGray, fontWeight: '600', fontSize: isMobile ? '13px' : '15px' }}>{idx + 1}</td>
                      <td style={{ padding: isMobile ? '14px 16px' : '18px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: prog.color, flexShrink: 0, display: 'inline-block' }} />
                          <span style={{ color: COLORS.deepPurple, fontWeight: '600', fontSize: isMobile ? '13px' : '15px' }}>{prog.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: isMobile ? '14px 16px' : '18px 24px' }}>
                        <span style={{
                          background: prog.category === 'professional' ? '#E8DFF5' : '#fef3c7',
                          color: prog.category === 'professional' ? COLORS.deepPurple : '#92400e',
                          padding: '5px 14px', borderRadius: '6px',
                          fontSize: isMobile ? '12px' : '13px', fontWeight: '600',
                        }}>{prog.category}</span>
                      </td>
                      <td style={{ padding: isMobile ? '14px 16px' : '18px 24px', color: COLORS.textGray, fontSize: isMobile ? '13px' : '15px' }}>{prog.duration}</td>
                      <td style={{ padding: isMobile ? '14px 16px' : '18px 24px', color: COLORS.textGray, fontSize: isMobile ? '13px' : '15px' }}>{prog.installmentFee}</td>
                      <td style={{ padding: isMobile ? '14px 16px' : '18px 24px', color: '#059669', fontWeight: '600', fontSize: isMobile ? '13px' : '15px' }}>{prog.discountedFee}</td>
                      <td style={{ padding: isMobile ? '14px 16px' : '18px 24px' }}>
                        <button onClick={() => handleToggle(prog._id)} style={{
                          padding: '5px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                          fontSize: isMobile ? '12px' : '13px', fontWeight: '600',
                          background: prog.isActive ? COLORS.brightGreen : COLORS.danger,
                          color: COLORS.white, display: 'flex', alignItems: 'center', gap: '5px',
                        }}>
                          {prog.isActive ? <><FaToggleOn /> Active</> : <><FaToggleOff /> Inactive</>}
                        </button>
                      </td>
                      <td style={{ padding: isMobile ? '14px 16px' : '18px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '6px' : '8px' }}>
                          <button onClick={() => openEdit(prog)} style={{
                            background: '#F59E0B', color: COLORS.white, border: 'none',
                            padding: isMobile ? '6px 8px' : '8px 10px', borderRadius: '6px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}><FaEdit size={isMobile ? 12 : 14} /></button>
                          <button onClick={() => setDeleteId(prog._id)} style={{
                            background: COLORS.danger, color: COLORS.white, border: 'none',
                            padding: isMobile ? '6px 8px' : '8px 10px', borderRadius: '6px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}><FaTrash size={isMobile ? 12 : 14} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: COLORS.darkGray }}>No programs found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* â”€â”€ Add / Edit Modal â”€â”€ */}
      {formVisible && (
        <Modal onClose={() => setFormVisible(false)}>
          {/* Sticky Header */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 10,
            background: COLORS.white,
            padding: '20px 28px 16px',
            borderBottom: `1px solid ${COLORS.lightGray}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderRadius: '16px 16px 0 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #3D1A5B, #6B3FA0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px',
              }}>
                {/* {editTarget} */}



                {editTarget ? '✏️' : '➕'}
              </div>
              <div>
                <h3 style={{ color: COLORS.deepPurple, margin: 0, fontSize: '17px', fontWeight: '700' }}>
                  {editTarget ? 'Edit Program' : 'Add New Program'}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: COLORS.darkGray }}>Fill in the course details below</p>
              </div>
            </div>
            <button onClick={() => setFormVisible(false)} style={{
              background: COLORS.lightGray, border: 'none', cursor: 'pointer',
              color: COLORS.textGray, fontSize: '14px', borderRadius: '8px',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><FaTimes /></button>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* â”€â”€ Section 1: Basic Info â”€â”€ */}
            <div>
              <p style={sectionHeadStyle}>Basic Information</p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Course Title <span style={{ color: COLORS.danger }}>*</span></label>
                  <input name="title" placeholder="e.g. Data Science" value={form.title} onChange={handleChange}
                    style={inputStyle(errors.title)} />
                  {errors.title && <span style={{ fontSize: '12px', color: COLORS.danger }}>{errors.title}</span>}
                </div>

                <div>
                  <label style={labelStyle}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} style={inputStyle()}>
                    <option value="professional">Professional</option>
                    <option value="short">Short Course</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Duration <span style={{ color: COLORS.danger }}>*</span></label>
                  <input name="duration" placeholder="e.g. 3 Months" value={form.duration} onChange={handleChange}
                    style={inputStyle(errors.duration)} />
                  {errors.duration && <span style={{ fontSize: '12px', color: COLORS.danger }}>{errors.duration}</span>}
                </div>

                <div>
                  <label style={labelStyle}>Projects</label>
                  <input name="projects" value={form.projects} onChange={handleChange} style={inputStyle()} />
                </div>

                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange} style={inputStyle()} />
                </div>
              </div>

              <div style={{ marginTop: '14px' }}>
                <label style={labelStyle}>Card Header Color</label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #D1D5DB',
                  background: '#FAFAFA',
                }}>
                  <input type="color" name="color" value={form.color} onChange={handleChange}
                    style={{ width: '40px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '2px' }} />
                  <span style={{ fontSize: '13px', color: COLORS.darkGray, fontFamily: 'monospace' }}>{form.color}</span>
                  <div style={{ display: 'flex', gap: '6px', marginLeft: '4px' }}>
                    {COLOR_PRESETS.map(c => (
                      <button type="button" key={c} onClick={() => setForm(p => ({ ...p, color: c }))}
                        style={{
                          width: '22px', height: '22px', borderRadius: '5px',
                          border: form.color === c ? '2px solid #3D1A5B' : '2px solid transparent',
                          background: c, cursor: 'pointer', transition: 'border 0.15s',
                        }} />
                    ))}
                  </div>
                </div>
              </div>

              <label style={{
                display: 'flex', alignItems: 'center', gap: '9px',
                fontSize: '14px', fontWeight: '600', color: COLORS.textGray,
                cursor: 'pointer', marginTop: '12px',
              }}>
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange}
                  style={{ width: '16px', height: '16px', accentColor: COLORS.deepPurple, cursor: 'pointer' }} />
                Active (visible on frontend)
              </label>
            </div>

            {/* â”€â”€ Section 2: Fees â”€â”€ */}
            <div>
              <p style={sectionHeadStyle}>Fee Information</p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Installment Fee (PKR) <span style={{ color: COLORS.danger }}>*</span></label>
                  <input name="installmentFee" placeholder="50,000/- PKR" value={form.installmentFee} onChange={handleChange}
                    style={inputStyle(errors.installmentFee)} />
                  {errors.installmentFee && <span style={{ fontSize: '12px', color: COLORS.danger }}>{errors.installmentFee}</span>}
                </div>
                <div>
                  <label style={labelStyle}>Installment Fee (USD approx.)</label>
                  <input name="installmentDollar" placeholder="(Approx. $170)" value={form.installmentDollar} onChange={handleChange} style={inputStyle()} />
                </div>
                <div>
                  <label style={labelStyle}>Discounted Fee (PKR) <span style={{ color: COLORS.danger }}>*</span></label>
                  <input name="discountedFee" placeholder="46,000/- PKR" value={form.discountedFee} onChange={handleChange}
                    style={inputStyle(errors.discountedFee)} />
                  {errors.discountedFee && <span style={{ fontSize: '12px', color: COLORS.danger }}>{errors.discountedFee}</span>}
                </div>
                <div>
                  <label style={labelStyle}>Discounted Fee (USD approx.)</label>
                  <input name="discountedDollar" placeholder="(Approx. $160)" value={form.discountedDollar} onChange={handleChange} style={inputStyle()} />
                </div>
              </div>
            </div>

            <div>
              <p style={sectionHeadStyle}>Technologies Covered</p>
              <label style={labelStyle}>Technologies <span style={{ fontSize: '12px', color: COLORS.darkGray, fontWeight: '400' }}>(comma-separated)</span></label>
              <input name="technologies" placeholder="Python, SQL, TensorFlow, PowerBI, ..." value={form.technologies} onChange={handleChange} style={inputStyle()} />
            </div>

            <div>
              <p style={sectionHeadStyle}>Course Description</p>
              <label style={labelStyle}>
                Description / Details
                <span style={{ fontSize: '12px', color: COLORS.darkGray, fontWeight: '400' }}>  paste or type with full formatting support</span>
              </label>
              <ReactQuill
                theme="snow"
                value={form.description}
                onChange={(value) => setForm(p => ({ ...p, description: value }))}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
                placeholder="Paste or write your course description here” bullets, bold, headings, colors all supported..."
              />
            </div>

            {/* â”€â”€ Submit Buttons â”€â”€ */}
            <div style={{
              display: 'flex', gap: '12px', paddingTop: '4px',
              borderTop: `1px solid ${COLORS.lightGray}`, marginTop: '4px',
            }}>
              <button type="submit" disabled={saving} style={{
                flex: 1, padding: '13px 24px', borderRadius: '9px', border: 'none',
                background: saving
                  ? COLORS.darkGray
                  : 'linear-gradient(135deg, #3D1A5B 0%, #6B3FA0 100%)',
                color: COLORS.white, fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '15px', letterSpacing: '0.3px',
                boxShadow: saving ? 'none' : '0 4px 15px rgba(61,26,91,0.3)',
                transition: 'all 0.2s',
              }}>
                {saving ? 'Saving' : editTarget ? 'Update Program' : ' Create Program'}
              </button>
              <button type="button" onClick={() => setFormVisible(false)} style={{
                padding: '13px 20px', borderRadius: '9px',
                border: `1.5px solid #D1D5DB`,
                background: COLORS.white, color: COLORS.textGray,
                fontWeight: '600', cursor: 'pointer', fontSize: '14px',
              }}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}







