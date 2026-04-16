import React, { useEffect, useState, useMemo,useRef, useCallback } from "react";
import {
  getDiplomas,
  createDiploma,
  updateDiploma,
  deleteDiploma,
} from "../api/api";
import Sidebar from "../components/Sidebar";
import {
  FaEdit, FaTrash, FaPlus, FaSearch, FaEye, FaTimes,FaBold, FaItalic, FaLink, FaImage, FaVideo, FaYoutube, FaFileVideo,
  FaClock, FaSignal, FaDollarSign,
} from "react-icons/fa";

const COLORS = {
  sidebarDark: "#1a1d2e",
  deepPurple: "#3D1A5B",
  headerPurple: "#4B2D7A",
  brightGreen: "#00D9A3",
  goldBadge: "#D4A745",
  white: "#FFFFFF",
  bgGray: "#F9FAFB",
  lightGray: "#F3F4F6",
  darkGray: "#6B7280",
  textGray: "#4B5563",
  danger: "#EF4444",
  warning: "#F59E0B",
  orange: "#3D1A5B"
};

const Modal = ({ children, onClose }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 1000, padding: "16px",
  }}>
    <div style={{
      background: COLORS.white, padding: "24px", borderRadius: "12px",
      width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    }}>
      {children}
    </div>
  </div>
);


// ========== VideoInsertModal ==========
const VideoInsertModal = ({ onInsert, onClose }) => {
  const [tab, setTab] = useState("url"); // "url" | "file"
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Converts YouTube / Vimeo watch URLs → embed URLs
  const parseVideoUrl = (raw) => {
    const url = raw.trim();

    // YouTube: youtu.be/ID or youtube.com/watch?v=ID or youtube.com/embed/ID
    const ytShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    const ytWatch = url.match(/youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/);
    const ytEmbed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    const ytId = (ytShort || ytWatch || ytEmbed)?.[1];
    if (ytId) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${ytId}` };

    // Vimeo: vimeo.com/ID or player.vimeo.com/video/ID
    const vmMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vmMatch) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vmMatch[1]}` };

    // Direct mp4 / webm / ogg link
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { type: "direct", embedUrl: url };

    return null;
  };

  const handleUrlInsert = () => {
    setUrlError("");
    if (!urlInput.trim()) { setUrlError("Please enter a video URL."); return; }
    const parsed = parseVideoUrl(urlInput);
    if (!parsed) {
      setUrlError("Unsupported URL. Paste a YouTube, Vimeo, or direct .mp4/.webm link.");
      return;
    }

    let html = "";
    if (parsed.type === "direct") {
      html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:20px 0;border-radius:10px;">
        <video controls style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:10px;" src="${parsed.embedUrl}"></video>
      </div>`;
    } else {
      html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:20px 0;border-radius:10px;">
        <iframe src="${parsed.embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:10px;" allowfullscreen allow="autoplay; encrypted-media"></iframe>
      </div>`;
    }
    onInsert(html);
    onClose();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) { alert("Please select a video file."); return; }
    if (file.size > 500 * 1024 * 1024) { alert("Video must be under 500MB."); return; }

    try {
      setUploading(true);
      // createObjectURL is instant, works for any size, and plays natively in browser
      const objectUrl = URL.createObjectURL(file);
      const html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:20px 0;border-radius:10px;">
        <video controls style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:10px;background:#000;" src="${objectUrl}"></video>
      </div>`;
      onInsert(html);
      setUploading(false);
      onClose();
    } catch (err) {
      alert("Failed to load video file. Please try again.");
      setUploading(false);
    }
  };

  const tabStyle = (active) => ({
    flex: 1, padding: "10px", border: "none", cursor: "pointer",
    fontWeight: "600", fontSize: "13px",
    background: active ? COLORS.deepPurple : COLORS.lightGray,
    color: active ? COLORS.white : COLORS.textGray,
    borderRadius: active === "url" ? "6px 0 0 6px" : "0 6px 6px 0",
    transition: "all 0.2s",
  });

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2000, padding: "16px",
      }}
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      <div
        style={{
          background: COLORS.white, borderRadius: "12px", padding: "24px",
          width: "100%", maxWidth: "480px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: COLORS.deepPurple, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaVideo size={16} color={COLORS.white} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: COLORS.deepPurple, fontSize: "16px", fontWeight: "700" }}>Insert Video</h3>
              <p style={{ margin: 0, fontSize: "12px", color: COLORS.darkGray }}>YouTube, Vimeo, or upload a file</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.darkGray, fontSize: "20px", padding: "4px", display: "flex", alignItems: "center" }}>
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderRadius: "6px", overflow: "hidden", marginBottom: "20px", border: `1px solid ${COLORS.lightGray}` }}>
          <button type="button" style={tabStyle(tab === "url")} onClick={() => setTab("url")}>
            <FaYoutube style={{ marginRight: "6px" }} /> URL / Embed
          </button>
          <button type="button" style={tabStyle(tab === "file")} onClick={() => setTab("file")}>
            <FaFileVideo style={{ marginRight: "6px" }} /> Upload File
          </button>
        </div>

        {tab === "url" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "12px", background: "#FFF8E1", borderRadius: "8px", border: "1px solid #FFE082", fontSize: "12px", color: "#7B5E00" }}>
              <strong>Supported formats:</strong><br />
              • YouTube: <code>youtube.com/watch?v=...</code> or <code>youtu.be/...</code><br />
              • Vimeo: <code>vimeo.com/123456789</code><br />
              • Direct: <code>example.com/video.mp4</code>
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleUrlInsert(); } }}
              placeholder="Paste video URL here..."
              autoFocus
              style={{
                padding: "12px", borderRadius: "8px",
                border: `1px solid ${urlError ? COLORS.danger : "#D1D5DB"}`,
                fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box",
              }}
            />
            {urlError && <p style={{ margin: 0, color: COLORS.danger, fontSize: "12px" }}>{urlError}</p>}
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={onClose}
                style={{ flex: 1, padding: "11px", background: COLORS.lightGray, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: COLORS.textGray }}>
                Cancel
              </button>
              <button type="button" onClick={handleUrlInsert}
                style={{ flex: 2, padding: "11px", background: COLORS.deepPurple, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: COLORS.white }}>
                Insert Video
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "12px", background: "#E8F4FD", borderRadius: "8px", border: "1px solid #B3D9F5", fontSize: "12px", color: "#1565C0" }}>
              <strong>How it works:</strong> Video plays from your device in the editor. For permanent embedding, host on YouTube/Vimeo and use the URL tab — local files only work on this device/session.
            </div>
            <input type="file" ref={fileInputRef} accept="video/*" onChange={handleFileUpload} style={{ display: "none" }} />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
              style={{
                padding: "32px 20px", background: COLORS.lightGray,
                border: `2px dashed ${COLORS.darkGray}`, borderRadius: "8px",
                cursor: uploading ? "not-allowed" : "pointer", color: COLORS.textGray,
                display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
                opacity: uploading ? 0.7 : 1, transition: "all 0.2s",
              }}>
              <FaFileVideo size={32} color={COLORS.deepPurple} />
              <span style={{ fontWeight: "600", fontSize: "14px" }}>{uploading ? "Loading video..." : "Click to select video file"}</span>
              <span style={{ fontSize: "12px", color: COLORS.darkGray }}>MP4, WebM, OGG — Up to 500MB</span>
            </button>
            <button type="button" onClick={onClose}
              style={{ padding: "11px", background: COLORS.lightGray, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: COLORS.textGray }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== RichTextEditor Component ==========
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const isInitializedRef = useRef(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isInitializedRef.current) {
      editorRef.current.innerHTML = value || '';
      isInitializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (editorRef.current && value === '') {
      editorRef.current.innerHTML = '';
      isInitializedRef.current = false;
    }
  }, [value]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) { sel.removeAllRanges(); sel.addRange(savedRangeRef.current); }
    }
  };

  const execCmd = useCallback((command, val = null) => {
    restoreSelection();
    if (editorRef.current) editorRef.current.focus();
    document.execCommand(command, false, val);
    saveSelection();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const handleHeading = (level) => {
    if (!level) return;
    restoreSelection();
    if (editorRef.current) editorRef.current.focus();
    document.execCommand('formatBlock', false, level === 'p' ? 'p' : `h${level}`);
    saveSelection();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleFontSize = (size) => {
    if (!size) return;
    restoreSelection();
    if (editorRef.current) editorRef.current.focus();
    document.execCommand('fontSize', false, size);
    saveSelection();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleFontName = (font) => {
    if (!font) return;
    restoreSelection();
    if (editorRef.current) editorRef.current.focus();
    document.execCommand('fontName', false, font);
    saveSelection();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleColor      = (c) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('foreColor', false, c); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
  const handleBackColor  = (c) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('hiliteColor', false, c); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
  const handleAlign      = (a) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand(`justify${a}`, false, null); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
  const handleList       = (t) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand(t === 'ol' ? 'insertOrderedList' : 'insertUnorderedList', false, null); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
  const handleIndent     = (t) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand(t === 'in' ? 'indent' : 'outdent', false, null); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
  const handleScript     = (t) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand(t, false, null); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
  const handleUndo       = () => { if (editorRef.current) editorRef.current.focus(); document.execCommand('undo', false, null); if (editorRef.current) onChange(editorRef.current.innerHTML); };
  const handleRedo       = () => { if (editorRef.current) editorRef.current.focus(); document.execCommand('redo', false, null); if (editorRef.current) onChange(editorRef.current.innerHTML); };
  const handleHorizontalRule = () => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('insertHorizontalRule', false, null); if (editorRef.current) onChange(editorRef.current.innerHTML); };

  const handleInsertSpecialChar = () => {
    const char = prompt("Enter special character:", "©");
    if (char) { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('insertText', false, char); if (editorRef.current) onChange(editorRef.current.innerHTML); }
  };

  const handleLink = () => {
    const url = prompt("Enter link URL:", "https://");
    if (url) { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('createLink', false, url); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); }
  };

  const handleUnlink = () => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('unlink', false, null); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };

  // ── Image upload (existing) ──
  const handleImageUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
      if (file.size > 5 * 1024 * 1024) { alert('Image size should be less than 5MB'); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        restoreSelection();
        if (editorRef.current) editorRef.current.focus();
        const img = document.createElement('img');
        img.src = ev.target.result;
        img.style.cssText = 'max-width:100%;height:auto;border-radius:4px;margin:8px 0;';
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents(); range.insertNode(img);
          range.setStartAfter(img); range.collapse(true);
          sel.removeAllRanges(); sel.addRange(range);
        }
        if (editorRef.current) onChange(editorRef.current.innerHTML);
      };
      reader.readAsDataURL(file);
    };
    fileInput.click();
  };

  // ── Video insert callback from modal ──
  const handleVideoInsert = (html) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    // Insert the video HTML at cursor position
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      // Create a temporary wrapper to parse HTML
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      const frag = document.createDocumentFragment();
      let lastNode = null;
      while (wrapper.firstChild) {
        lastNode = wrapper.firstChild;
        frag.appendChild(lastNode);
      }
      range.insertNode(frag);
      if (lastNode) {
        const newRange = document.createRange();
        newRange.setStartAfter(lastNode);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
    } else {
      // Fallback: append at end
      editorRef.current.innerHTML += html;
    }
    onChange(editorRef.current.innerHTML);
  };

  const toolbarMouseDown = (e, handler) => {
    saveSelection();
    e.preventDefault();
    handler();
  };

  const btnStyle = {
    padding: "5px 9px", background: COLORS.white, border: `1px solid #D1D5DB`,
    borderRadius: "4px", cursor: "pointer", color: COLORS.textGray,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: "4px", fontSize: "13px", minWidth: "30px",
    userSelect: "none", WebkitUserSelect: "none",
  };

  const videoBtnStyle = {
    ...btnStyle,
    background: COLORS.deepPurple,
    color: COLORS.white,
    border: `1px solid ${COLORS.deepPurple}`,
    gap: "5px",
    padding: "5px 10px",
  };

  const selectStyle = {
    padding: "5px 7px", background: COLORS.white, border: `1px solid #D1D5DB`,
    borderRadius: "4px", cursor: "pointer", color: COLORS.textGray,
    fontSize: "13px", outline: "none", userSelect: "none",
  };

  const divider = <div style={{ width: "1px", height: "24px", background: "#D1D5DB", margin: "0 3px" }} />;

  return (
    <>
      {showVideoModal && (
        <VideoInsertModal
          onInsert={handleVideoInsert}
          onClose={() => setShowVideoModal(false)}
        />
      )}

      <div style={{ border: `1px solid #D1D5DB`, borderRadius: "8px", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{
          display: "flex", gap: "2px", padding: "8px",
          background: COLORS.lightGray, borderBottom: `1px solid #D1D5DB`,
          flexWrap: "wrap", alignItems: "center"
        }}>
          {/* Undo / Redo */}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleUndo)} style={btnStyle} title="Undo">↩</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleRedo)} style={btnStyle} title="Redo">↪</button>
          {divider}

          {/* Block Format */}
          <select onMouseDown={() => saveSelection()} onChange={(e) => { handleHeading(e.target.value); e.target.value = ""; }} style={selectStyle} defaultValue="">
            <option value="" disabled>Block</option>
            <option value="p">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
          </select>
          {divider}

          {/* Font Size */}
          <select onMouseDown={() => saveSelection()} onChange={(e) => { handleFontSize(e.target.value); e.target.value = ""; }} style={{ ...selectStyle, minWidth: "70px" }} defaultValue="">
            <option value="" disabled>Size</option>
            <option value="1">8pt</option>
            <option value="2">10pt</option>
            <option value="3">12pt</option>
            <option value="4">14pt</option>
            <option value="5">18pt</option>
            <option value="6">24pt</option>
            <option value="7">36pt</option>
          </select>
          {divider}

          {/* Font Family */}
          <select onMouseDown={() => saveSelection()} onChange={(e) => { handleFontName(e.target.value); e.target.value = ""; }} style={{ ...selectStyle, minWidth: "130px" }} defaultValue="">
            <option value="" disabled>Font</option>
            <optgroup label="Sans-Serif">
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Calibri">Calibri</option>
              <option value="Segoe UI">Segoe UI</option>
            </optgroup>
            <optgroup label="Serif">
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Garamond">Garamond</option>
              <option value="Palatino Linotype">Palatino</option>
              <option value="Cambria">Cambria</option>
            </optgroup>
            <optgroup label="Monospace">
              <option value="Courier New">Courier New</option>
              <option value="Consolas">Consolas</option>
              <option value="Monaco">Monaco</option>
              <option value="Menlo">Menlo</option>
            </optgroup>
            <optgroup label="Display">
              <option value="Impact">Impact</option>
              <option value="Comic Sans MS">Comic Sans</option>
              <option value="Copperplate">Copperplate</option>
            </optgroup>
          </select>
          {divider}

          {/* Text Formatting */}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('bold'))} style={btnStyle} title="Bold"><FaBold size={13} /></button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('italic'))} style={btnStyle} title="Italic"><FaItalic size={13} /></button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('underline'))} style={btnStyle} title="Underline"><u>U</u></button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('strikethrough'))} style={btnStyle} title="Strikethrough"><s>S</s></button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleScript('superscript'))} style={btnStyle} title="Superscript">x²</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleScript('subscript'))} style={btnStyle} title="Subscript">x₂</button>
          {divider}

          {/* Colors */}
          <label style={{ ...btnStyle, cursor: "pointer", padding: "3px" }} title="Text Color">
            <span style={{ fontSize: "11px" }}>A</span>
            <input type="color" onMouseDown={() => saveSelection()} onChange={(e) => handleColor(e.target.value)} style={{ width: "20px", height: "20px", border: "none", padding: 0, cursor: "pointer" }} />
          </label>
          <label style={{ ...btnStyle, cursor: "pointer", padding: "3px" }} title="Highlight Color">
            <span style={{ fontSize: "11px", background: "#ff0", padding: "0 2px" }}>A</span>
            <input type="color" onMouseDown={() => saveSelection()} onChange={(e) => handleBackColor(e.target.value)} style={{ width: "20px", height: "20px", border: "none", padding: 0, cursor: "pointer" }} />
          </label>
          {divider}

          {/* Alignment */}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Left'))} style={btnStyle} title="Align Left">≡L</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Center'))} style={btnStyle} title="Center">≡C</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Right'))} style={btnStyle} title="Align Right">≡R</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Full'))} style={btnStyle} title="Justify">≡J</button>
          {divider}

          {/* Lists */}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleList('ul'))} style={btnStyle} title="Bullet List">• List</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleList('ol'))} style={btnStyle} title="Numbered List">1. List</button>
          {divider}

          {/* Indent */}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleIndent('in'))} style={btnStyle} title="Indent">→</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleIndent('out'))} style={btnStyle} title="Outdent">←</button>
          {divider}

          {/* Links */}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleLink)} style={btnStyle} title="Insert Link"><FaLink size={13} /></button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleUnlink)} style={btnStyle} title="Remove Link">🔗✕</button>
          {divider}

          {/* ── MEDIA: Image + Video (grouped together) ── */}
          <button
            type="button"
            onMouseDown={(e) => toolbarMouseDown(e, handleImageUpload)}
            style={{ ...btnStyle, color: COLORS.deepPurple, borderColor: COLORS.deepPurple }}
            title="Insert Image"
          >
            <FaImage size={13} /> <span style={{ fontSize: "12px" }}>Image</span>
          </button>

          <button
            type="button"
            onMouseDown={(e) => { saveSelection(); e.preventDefault(); setShowVideoModal(true); }}
            style={videoBtnStyle}
            title="Insert Video (YouTube, Vimeo, or upload)"
          >
            <FaVideo size={13} /> <span style={{ fontSize: "12px" }}>Video</span>
          </button>
          {divider}

          {/* Misc */}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleHorizontalRule)} style={btnStyle} title="Horizontal Rule">—</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleInsertSpecialChar)} style={btnStyle} title="Special Character">Ω</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('removeFormat'))} style={btnStyle} title="Clear Formatting">T✕</button>
        </div>

        {/* Editor Area */}
        <div
          ref={editorRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          dir="ltr" lang="en" spellCheck={true}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          onSelect={saveSelection}
          onFocus={saveSelection}
          data-placeholder={placeholder}
          style={{
            minHeight: "300px", maxHeight: "500px", padding: "16px",
            outline: "none", fontSize: "15px", lineHeight: "1.8",
            color: COLORS.textGray, backgroundColor: COLORS.white,
            overflowY: "auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            direction: "ltr", textAlign: "left", unicodeBidi: "embed",
            wordBreak: "break-word", whiteSpace: "pre-wrap",
          }}
        />

        <style>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9CA3AF; font-style: italic; pointer-events: none;
          }
          [contenteditable] * { direction: ltr !important; unicode-bidi: embed !important; }
          [contenteditable] img { max-width: 100%; height: auto; border-radius: 4px; margin: 8px 0; }
          [contenteditable] iframe { max-width: 100%; border-radius: 8px; }
          [contenteditable] video { max-width: 100%; border-radius: 8px; }
          [contenteditable] a { color: ${COLORS.deepPurple}; text-decoration: underline; }
          [contenteditable]:focus { outline: none; }
        `}</style>
      </div>
    </>
  );
};

const AdminDiplomas = () => {
  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("12 Months");
  const [level, setLevel] = useState("All Levels");
  const [price, setPrice] = useState(0);
  

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

const resetForm = () => {
  setEditingId(null);
  setTitle("");
  // DELETE: setShortTitle("");
  setDescription("");
  setCategory("");
  setDuration("12 Months");
  setLevel("All Levels");
  setPrice(0);
  // DELETE: setLearningOutcomes([""]);
  // DELETE: setRequirements([""]);
};

  const fetchDiplomas = async () => {
    try {
      setLoading(true);
      const data = await getDiplomas();
      setDiplomas(data);
    } catch (err) {
      showToast(err.message || "Failed to load diplomas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDiplomas(); }, []);

  const handleArrayChange = (array, setArray, index, value) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const addArrayField = (array, setArray) => setArray([...array, ""]);

  const removeArrayField = (array, setArray, index) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !category.trim()) {
      showToast("Title, description, and category are required.", "error");
      return;
    }

   const STATIC_LEARNING_OUTCOMES = [
  "Gain industry-relevant skills recognized by top employers",
  "Build real-world projects to strengthen your portfolio",
  "Master tools and technologies used by professionals",
  "Understand core concepts through hands-on practice",
  "Develop problem-solving and analytical thinking skills",
  "Earn a globally recognized diploma certificate",
  "Get mentorship from experienced industry instructors",
  "Prepare for professional certifications in your field",
];

const payload = {
  title,
  shortTitle: title.substring(0, 30), // DELETE shortTitle state, derive from title
  description,
  category,
  duration,
  level,
  price: Number(price),
  learningOutcomes: STATIC_LEARNING_OUTCOMES, // ← static, always same
  requirements: [],                            // ← empty, removed
  status: "Active",
  isFeatured: false,
};

    try {
      setSubmitting(true);
      if (editingId) {
        await updateDiploma(editingId, payload);
        showToast("Diploma updated successfully.");
      } else {
        await createDiploma(payload);
        showToast("Diploma created successfully.");
      }
      setFormVisible(false);
      resetForm();
      await fetchDiplomas();
    } catch (err) {
      showToast(err.message || "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this diploma?")) return;
    try {
      await deleteDiploma(id);
      showToast("Diploma deleted.");
      fetchDiplomas();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

const handleEdit = (diploma) => {
  setEditingId(diploma._id);
  setTitle(diploma.title || "");
  // DELETE: setShortTitle(...)
  setDescription(diploma.description || "");
  setCategory(diploma.category || "");
  setDuration(diploma.duration || "12 Months");
  setLevel(diploma.level || "All Levels");
  setPrice(diploma.price || 0);
  // DELETE: setLearningOutcomes(...)
  // DELETE: setRequirements(...)
  setFormVisible(true);
};

  const handleAdd = () => { resetForm(); setFormVisible(true); };
  const handleViewDetails = (diploma) => setSelectedDiploma(diploma);

  const filtered = useMemo(() => diplomas.filter((d) => {
    return (
      d.title?.toLowerCase().includes(search.toLowerCase()) ||
      d.category?.toLowerCase().includes(search.toLowerCase()) ||
      d.shortTitle?.toLowerCase().includes(search.toLowerCase())
    );
  }), [diplomas, search]);

  return (
    <div style={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, overflowX: "hidden", marginLeft: isMobile ? "0" : "280px", padding: isMobile ? "80px 16px 32px 16px" : "32px" }}>
        {/* Toast */}
        {toast && (
          <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "12px 24px", borderRadius: "8px", background: toast.type === "success" ? COLORS.brightGreen : COLORS.danger, color: toast.type === "success" ? COLORS.deepPurple : COLORS.white, fontWeight: "600", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", animation: "slideIn 0.3s ease" }}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: isMobile ? "24px" : "28px", fontWeight: "700", color: COLORS.deepPurple, margin: 0, marginBottom: "8px" }}> Diploma Management</h1>
              <p style={{ color: COLORS.textGray, margin: 0, fontSize: "14px" }}>Create, edit & manage all diploma programs</p>
            </div>
            <div style={{ background: "linear-gradient(135deg, rgba(61,26,91,0.1) 0%, rgba(94,66,123,0.1) 100%)", border: "1px solid rgba(61,26,91,0.2)", borderRadius: "8px", padding: "12px 16px" }}>
              <p style={{ color: COLORS.deepPurple, fontSize: "14px", fontWeight: "600", margin: 0 }}>Total Diplomas: {filtered.length}</p>
            </div>
          </div>

          {/* Search & Add */}
          <div style={{ display: "flex", gap: isMobile ? "12px" : "20px", marginBottom: isMobile ? "24px" : "30px", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: isMobile ? "100%" : "500px" }}>
              <FaSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: COLORS.darkGray, fontSize: "16px" }} />
              <input type="text" placeholder="Search by title, category, or short title..." value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ padding: isMobile ? "12px 16px 12px 48px" : "14px 16px 14px 48px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", fontSize: "15px", background: COLORS.white, boxSizing: "border-box", outline: "none" }} />
            </div>
            <button onClick={handleAdd}
              style={{ background: COLORS.orange, color: COLORS.white, border: "none", padding: isMobile ? "12px 24px" : "14px 28px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", whiteSpace: "nowrap" }}>
              <FaPlus /> Add New Diploma
            </button>
          </div>

          {/* Table */}
          <div style={{ background: COLORS.white, borderRadius: "12px", overflow: isMobile ? "auto" : "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            {loading ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <div style={{ width: "40px", height: "40px", border: "3px solid #f3f3f3", borderTop: `3px solid ${COLORS.deepPurple}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <p style={{ color: COLORS.textGray }}>Loading diplomas...</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "900px" : "auto" }}>
                <thead>
                  <tr style={{ background: COLORS.headerPurple, color: COLORS.white }}>
                    {["#", "Title", "Short Title", "Category", "Duration", "Level", "Price", "Actions"].map((h, i) => (
                      <th key={i} style={{ padding: isMobile ? "14px 16px" : "18px 24px", textAlign: i === 7 ? "center" : "left", fontSize: isMobile ? "13px" : "15px", fontWeight: "700" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map((diploma, index) => (
                    <tr key={diploma._id} style={{ borderBottom: `1px solid ${COLORS.lightGray}`, background: index % 2 === 0 ? COLORS.white : COLORS.bgGray }}>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px", color: COLORS.textGray, fontWeight: "600", fontSize: isMobile ? "13px" : "15px" }}>{index + 1}</td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px", color: COLORS.deepPurple, fontWeight: "600", fontSize: isMobile ? "13px" : "15px" }}>{diploma.title}</td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px", color: COLORS.textGray, fontSize: isMobile ? "13px" : "15px" }}>{diploma.shortTitle || "—"}</td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                        <span style={{ background: COLORS.goldBadge, color: "#3D2817", padding: "4px 12px", borderRadius: "6px", fontSize: isMobile ? "12px" : "13px", fontWeight: "600" }}>{diploma.category}</span>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: COLORS.textGray, fontSize: isMobile ? "13px" : "14px" }}>
                          <FaClock size={12} /> {diploma.duration}
                        </span>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: COLORS.textGray, fontSize: isMobile ? "13px" : "14px" }}>
                          <FaSignal size={12} /> {diploma.level}
                        </span>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                       <span style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: "600", color: diploma.price === 0 ? COLORS.brightGreen : COLORS.textGray, fontSize: isMobile ? "13px" : "14px" }}>
  {diploma.price === 0 ? "Free" : `PKR ${Number(diploma.price).toLocaleString()}`}
</span>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? "6px" : "8px" }}>
                          {[
                            { onClick: () => handleViewDetails(diploma), icon: <FaEye size={isMobile ? 12 : 14} />, bg: "#10B981", title: "View" },
                            { onClick: () => handleEdit(diploma), icon: <FaEdit size={isMobile ? 12 : 14} />, bg: COLORS.warning, title: "Edit" },
                            { onClick: () => handleDelete(diploma._id), icon: <FaTrash size={isMobile ? 12 : 14} />, bg: COLORS.danger, title: "Delete" },
                          ].map((btn, i) => (
                            <button key={i} onClick={btn.onClick} title={btn.title}
                              style={{ background: btn.bg, color: COLORS.white, border: "none", padding: isMobile ? "6px 8px" : "8px 10px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                              {btn.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="8" style={{ padding: "40px", textAlign: "center", color: COLORS.darkGray }}>No diploma programs found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {formVisible && (
        <Modal onClose={() => setFormVisible(false)}>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: "16px" }}>
              <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>{editingId ? " Edit Diploma" : " Create New Diploma"}</h3>
              <button onClick={() => { setFormVisible(false); resetForm(); }} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px" }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter diploma title" required
                  style={{ padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", boxSizing: "border-box", fontSize: "14px", outline: "none" }} />
              </div>

              

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Category *</label>
                <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Web Development, AI, Data Science" required
                  style={{ padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", boxSizing: "border-box", fontSize: "14px", outline: "none" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Duration</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)}
                    style={{ padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", fontSize: "14px", outline: "none" }}>
                    <option value="6 Months">6 Months</option>
                    <option value="12 Months">12 Months</option>
                    <option value="18 Months">18 Months</option>
                    <option value="24 Months">24 Months</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Level</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)}
                    style={{ padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", fontSize: "14px", outline: "none" }}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Price (PKR)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01"
                  style={{ padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", boxSizing: "border-box", fontSize: "14px", outline: "none" }} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Description *</label>
                <RichTextEditor
  key={formVisible ? (editingId || 'new') : 'hidden'}
  value={description}
  onChange={setDescription}
  placeholder="Describe the diploma program..."
/>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button type="button" onClick={() => { setFormVisible(false); resetForm(); }}
                  style={{ flex: 1, padding: "14px", background: COLORS.lightGray, color: COLORS.textGray, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600" }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  style={{ flex: 2, padding: "14px", background: submitting ? COLORS.darkGray : COLORS.brightGreen, color: submitting ? COLORS.white : COLORS.deepPurple, border: "none", borderRadius: "8px", cursor: submitting ? "not-allowed" : "pointer", fontSize: "15px", fontWeight: "600", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Saving..." : editingId ? "Update Diploma" : "Create Diploma"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* View Details Modal */}
      {selectedDiploma && (
        <Modal onClose={() => setSelectedDiploma(null)}>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: "16px" }}>
              <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>👁 Diploma Details</h3>
              <button onClick={() => setSelectedDiploma(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px" }}><FaTimes /></button>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {[
                { label: "Title", value: selectedDiploma.title },
                { label: "Short Title", value: selectedDiploma.shortTitle || "—" },
                { label: "Category", value: selectedDiploma.category },
                { label: "Duration", value: selectedDiploma.duration },
                { label: "Level", value: selectedDiploma.level },
                { label: "Price", value: selectedDiploma.price === 0 ? "Free" : `PKR ${Number(selectedDiploma.price).toLocaleString()}` },
                { label: "Description", value: selectedDiploma.description },
                { label: "Learning Outcomes", value: selectedDiploma.learningOutcomes?.length ? (
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {selectedDiploma.learningOutcomes.map((o, i) => <li key={i} style={{ color: COLORS.textGray, fontSize: "14px" }}>{o}</li>)}
                  </ul>
                ) : "—" },
                { label: "Requirements", value: selectedDiploma.requirements?.length ? (
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {selectedDiploma.requirements.map((r, i) => <li key={i} style={{ color: COLORS.textGray, fontSize: "14px" }}>{r}</li>)}
                  </ul>
                ) : "—" },
              ].map((item, index) => (
                <div key={index} style={{ padding: "12px", background: index % 2 === 0 ? COLORS.lightGray : COLORS.white, borderRadius: "8px", borderLeft: `3px solid ${COLORS.deepPurple}` }}>
                  <strong style={{ color: COLORS.textGray, display: "block", marginBottom: "4px", fontSize: "14px" }}>{item.label}</strong>
                  <div style={{ color: COLORS.deepPurple, fontSize: "14px" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default AdminDiplomas;