// import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
// import {
//   getAllBlogsAdmin,
//   createBlog,
//   updateBlog,
//   deleteBlog,
//   toggleFeaturedBlog,
// } from "../api/api";
// import Sidebar from "../components/Sidebar";
// import {
//   FaEdit, FaTrash, FaStar, FaPlus, FaSearch, FaEye, FaTimes,
//   FaBold, FaItalic, FaLink, FaImage, FaVideo, FaYoutube, FaFileVideo
// } from "react-icons/fa";

// const COLORS = {
//   sidebarDark: "#1a1d2e",
//   deepPurple: "#3D1A5B",
//   headerPurple: "#4B2D7A",
//   brightGreen: "#00D9A3",
//   goldBadge: "#D4A745",
//   roleBg: "#E8DFF5",
//   white: "#FFFFFF",
//   bgGray: "#F9FAFB",
//   lightGray: "#F3F4F6",
//   darkGray: "#6B7280",
//   textGray: "#4B5563",
//   danger: "#EF4444",
//   warning: "#F59E0B",
//   info: "#3B82F6",
//   orange: "#3D1A5B"
// };

// const Modal = ({ children, onClose }) => (
//   <div style={{
//     position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
//     display: "flex", justifyContent: "center", alignItems: "center",
//     zIndex: 1000, padding: "16px",
//   }}>
//     <div style={{
//       background: COLORS.white, padding: "24px", borderRadius: "12px",
//       width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto",
//       boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//     }}>
//       {children}
//     </div>
//   </div>
// );

// // ========== VideoInsertModal ==========
// const VideoInsertModal = ({ onInsert, onClose }) => {
//   const [tab, setTab] = useState("url"); // "url" | "file"
//   const [urlInput, setUrlInput] = useState("");
//   const [urlError, setUrlError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef(null);

//   // Converts YouTube / Vimeo watch URLs → embed URLs
//   const parseVideoUrl = (raw) => {
//     const url = raw.trim();

//     // YouTube: youtu.be/ID or youtube.com/watch?v=ID or youtube.com/embed/ID
//     const ytShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
//     const ytWatch = url.match(/youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/);
//     const ytEmbed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
//     const ytId = (ytShort || ytWatch || ytEmbed)?.[1];
//     if (ytId) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${ytId}` };

//     // Vimeo: vimeo.com/ID or player.vimeo.com/video/ID
//     const vmMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
//     if (vmMatch) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vmMatch[1]}` };

//     // Direct mp4 / webm / ogg link
//     if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { type: "direct", embedUrl: url };

//     return null;
//   };

//   const handleUrlInsert = () => {
//     setUrlError("");
//     if (!urlInput.trim()) { setUrlError("Please enter a video URL."); return; }
//     const parsed = parseVideoUrl(urlInput);
//     if (!parsed) {
//       setUrlError("Unsupported URL. Paste a YouTube, Vimeo, or direct .mp4/.webm link.");
//       return;
//     }

//     let html = "";
//     if (parsed.type === "direct") {
//       html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:20px 0;border-radius:10px;">
//         <video controls style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:10px;" src="${parsed.embedUrl}"></video>
//       </div>`;
//     } else {
//       html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:20px 0;border-radius:10px;">
//         <iframe src="${parsed.embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:10px;" allowfullscreen allow="autoplay; encrypted-media"></iframe>
//       </div>`;
//     }
//     onInsert(html);
//     onClose();
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!file.type.startsWith("video/")) { alert("Please select a video file."); return; }
//     if (file.size > 500 * 1024 * 1024) { alert("Video must be under 500MB."); return; }

//     try {
//       setUploading(true);
//       // createObjectURL is instant, works for any size, and plays natively in browser
//       const objectUrl = URL.createObjectURL(file);
//       const html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:20px 0;border-radius:10px;">
//         <video controls style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:10px;background:#000;" src="${objectUrl}"></video>
//       </div>`;
//       onInsert(html);
//       setUploading(false);
//       onClose();
//     } catch (err) {
//       alert("Failed to load video file. Please try again.");
//       setUploading(false);
//     }
//   };

//   const tabStyle = (active) => ({
//     flex: 1, padding: "10px", border: "none", cursor: "pointer",
//     fontWeight: "600", fontSize: "13px",
//     background: active ? COLORS.deepPurple : COLORS.lightGray,
//     color: active ? COLORS.white : COLORS.textGray,
//     borderRadius: active === "url" ? "6px 0 0 6px" : "0 6px 6px 0",
//     transition: "all 0.2s",
//   });

//   return (
//     <div
//       style={{
//         position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
//         display: "flex", alignItems: "center", justifyContent: "center",
//         zIndex: 2000, padding: "16px",
//       }}
//       onClick={(e) => e.stopPropagation()}
//       onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); }}
//     >
//       <div
//         style={{
//           background: COLORS.white, borderRadius: "12px", padding: "24px",
//           width: "100%", maxWidth: "480px",
//           boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: COLORS.deepPurple, display: "flex", alignItems: "center", justifyContent: "center" }}>
//               <FaVideo size={16} color={COLORS.white} />
//             </div>
//             <div>
//               <h3 style={{ margin: 0, color: COLORS.deepPurple, fontSize: "16px", fontWeight: "700" }}>Insert Video</h3>
//               <p style={{ margin: 0, fontSize: "12px", color: COLORS.darkGray }}>YouTube, Vimeo, or upload a file</p>
//             </div>
//           </div>
//           <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.darkGray, fontSize: "20px", padding: "4px", display: "flex", alignItems: "center" }}>
//             <FaTimes />
//           </button>
//         </div>

//         {/* Tabs */}
//         <div style={{ display: "flex", borderRadius: "6px", overflow: "hidden", marginBottom: "20px", border: `1px solid ${COLORS.lightGray}` }}>
//           <button type="button" style={tabStyle(tab === "url")} onClick={() => setTab("url")}>
//             <FaYoutube style={{ marginRight: "6px" }} /> URL / Embed
//           </button>
//           <button type="button" style={tabStyle(tab === "file")} onClick={() => setTab("file")}>
//             <FaFileVideo style={{ marginRight: "6px" }} /> Upload File
//           </button>
//         </div>

//         {tab === "url" ? (
//           <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//             <div style={{ padding: "12px", background: "#FFF8E1", borderRadius: "8px", border: "1px solid #FFE082", fontSize: "12px", color: "#7B5E00" }}>
//               <strong>Supported formats:</strong><br />
//               • YouTube: <code>youtube.com/watch?v=...</code> or <code>youtu.be/...</code><br />
//               • Vimeo: <code>vimeo.com/123456789</code><br />
//               • Direct: <code>example.com/video.mp4</code>
//             </div>
//             <input
//               type="text"
//               value={urlInput}
//               onChange={(e) => { setUrlInput(e.target.value); setUrlError(""); }}
//               onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleUrlInsert(); } }}
//               placeholder="Paste video URL here..."
//               autoFocus
//               style={{
//                 padding: "12px", borderRadius: "8px",
//                 border: `1px solid ${urlError ? COLORS.danger : "#D1D5DB"}`,
//                 fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box",
//               }}
//             />
//             {urlError && <p style={{ margin: 0, color: COLORS.danger, fontSize: "12px" }}>{urlError}</p>}
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button type="button" onClick={onClose}
//                 style={{ flex: 1, padding: "11px", background: COLORS.lightGray, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: COLORS.textGray }}>
//                 Cancel
//               </button>
//               <button type="button" onClick={handleUrlInsert}
//                 style={{ flex: 2, padding: "11px", background: COLORS.deepPurple, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: COLORS.white }}>
//                 Insert Video
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//             <div style={{ padding: "12px", background: "#E8F4FD", borderRadius: "8px", border: "1px solid #B3D9F5", fontSize: "12px", color: "#1565C0" }}>
//               <strong>How it works:</strong> Video plays from your device in the editor. For permanent embedding, host on YouTube/Vimeo and use the URL tab — local files only work on this device/session.
//             </div>
//             <input type="file" ref={fileInputRef} accept="video/*" onChange={handleFileUpload} style={{ display: "none" }} />
//             <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
//               style={{
//                 padding: "32px 20px", background: COLORS.lightGray,
//                 border: `2px dashed ${COLORS.darkGray}`, borderRadius: "8px",
//                 cursor: uploading ? "not-allowed" : "pointer", color: COLORS.textGray,
//                 display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
//                 opacity: uploading ? 0.7 : 1, transition: "all 0.2s",
//               }}>
//               <FaFileVideo size={32} color={COLORS.deepPurple} />
//               <span style={{ fontWeight: "600", fontSize: "14px" }}>{uploading ? "Loading video..." : "Click to select video file"}</span>
//               <span style={{ fontSize: "12px", color: COLORS.darkGray }}>MP4, WebM, OGG — Up to 500MB</span>
//             </button>
//             <button type="button" onClick={onClose}
//               style={{ padding: "11px", background: COLORS.lightGray, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: COLORS.textGray }}>
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ========== ImageUpload Component ==========
// const ImageUpload = ({ onImageUpload, currentImage, onRemove }) => {
//   const fileInputRef = useRef(null);
//   const [uploading, setUploading] = useState(false);

//   const compressImage = (base64, maxWidth = 800, quality = 0.7) => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.src = base64;
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         let width = img.width;
//         let height = img.height;
//         if (width > maxWidth) { height = (maxWidth * height) / width; width = maxWidth; }
//         canvas.width = width; canvas.height = height;
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0, width, height);
//         resolve(canvas.toDataURL('image/jpeg', quality));
//       };
//     });
//   };

//   const handleFileSelect = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) { alert("Please select an image file"); return; }
//     if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5MB"); return; }
//     setUploading(true);
//     const reader = new FileReader();
//     reader.onload = async (readerEvent) => {
//       try {
//         const compressed = await compressImage(readerEvent.target.result, 800, 0.7);
//         onImageUpload(compressed);
//       } catch { alert('Failed to compress image'); }
//       finally { setUploading(false); }
//     };
//     reader.onerror = () => { alert('Failed to read image file'); setUploading(false); };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div>
//       <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" style={{ display: 'none' }} />
//       {currentImage ? (
//         <div style={{ position: 'relative', marginTop: '8px', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.lightGray}` }}>
//           <img src={currentImage} alt="Cover" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
//           <button type="button" onClick={onRemove} style={{ position: 'absolute', top: '8px', right: '8px', background: COLORS.danger, color: COLORS.white, border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Remove</button>
//         </div>
//       ) : (
//         <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
//           style={{ width: '100%', padding: '20px', background: COLORS.lightGray, border: `2px dashed ${COLORS.darkGray}`, borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer', color: COLORS.textGray, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: uploading ? 0.7 : 1 }}>
//           <FaImage size={24} color={COLORS.darkGray} />
//           <span>{uploading ? 'Compressing...' : 'Click to upload cover image'}</span>
//           <span style={{ fontSize: '12px', color: COLORS.darkGray }}>Max size: 5MB (will be compressed)</span>
//         </button>
//       )}
//     </div>
//   );
// };

// // ========== RichTextEditor Component ==========
// const RichTextEditor = ({ value, onChange, placeholder }) => {
//   const editorRef = useRef(null);
//   const savedRangeRef = useRef(null);
//   const isInitializedRef = useRef(false);
//   const [showVideoModal, setShowVideoModal] = useState(false);

//   useEffect(() => {
//     if (editorRef.current && !isInitializedRef.current) {
//       editorRef.current.innerHTML = value || '';
//       isInitializedRef.current = true;
//     }
//   }, []);

//   useEffect(() => {
//     if (editorRef.current && value === '') {
//       editorRef.current.innerHTML = '';
//       isInitializedRef.current = false;
//     }
//   }, [value]);

//   const saveSelection = () => {
//     const sel = window.getSelection();
//     if (sel && sel.rangeCount > 0) {
//       const range = sel.getRangeAt(0);
//       if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
//         savedRangeRef.current = range.cloneRange();
//       }
//     }
//   };

//   const restoreSelection = () => {
//     if (savedRangeRef.current) {
//       const sel = window.getSelection();
//       if (sel) { sel.removeAllRanges(); sel.addRange(savedRangeRef.current); }
//     }
//   };

//   const execCmd = useCallback((command, val = null) => {
//     restoreSelection();
//     if (editorRef.current) editorRef.current.focus();
//     document.execCommand(command, false, val);
//     saveSelection();
//     if (editorRef.current) onChange(editorRef.current.innerHTML);
//   }, [onChange]);

//   const handleHeading = (level) => {
//     if (!level) return;
//     restoreSelection();
//     if (editorRef.current) editorRef.current.focus();
//     document.execCommand('formatBlock', false, level === 'p' ? 'p' : `h${level}`);
//     saveSelection();
//     if (editorRef.current) onChange(editorRef.current.innerHTML);
//   };

//   const handleFontSize = (size) => {
//     if (!size) return;
//     restoreSelection();
//     if (editorRef.current) editorRef.current.focus();
//     document.execCommand('fontSize', false, size);
//     saveSelection();
//     if (editorRef.current) onChange(editorRef.current.innerHTML);
//   };

//   const handleFontName = (font) => {
//     if (!font) return;
//     restoreSelection();
//     if (editorRef.current) editorRef.current.focus();
//     document.execCommand('fontName', false, font);
//     saveSelection();
//     if (editorRef.current) onChange(editorRef.current.innerHTML);
//   };

//   const handleColor      = (c) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('foreColor', false, c); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
//   const handleBackColor  = (c) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('hiliteColor', false, c); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
//   const handleAlign      = (a) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand(`justify${a}`, false, null); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
//   const handleList       = (t) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand(t === 'ol' ? 'insertOrderedList' : 'insertUnorderedList', false, null); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
//   const handleIndent     = (t) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand(t === 'in' ? 'indent' : 'outdent', false, null); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
//   const handleScript     = (t) => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand(t, false, null); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };
//   const handleUndo       = () => { if (editorRef.current) editorRef.current.focus(); document.execCommand('undo', false, null); if (editorRef.current) onChange(editorRef.current.innerHTML); };
//   const handleRedo       = () => { if (editorRef.current) editorRef.current.focus(); document.execCommand('redo', false, null); if (editorRef.current) onChange(editorRef.current.innerHTML); };
//   const handleHorizontalRule = () => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('insertHorizontalRule', false, null); if (editorRef.current) onChange(editorRef.current.innerHTML); };

//   const handleInsertSpecialChar = () => {
//     const char = prompt("Enter special character:", "©");
//     if (char) { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('insertText', false, char); if (editorRef.current) onChange(editorRef.current.innerHTML); }
//   };

//   const handleLink = () => {
//     const url = prompt("Enter link URL:", "https://");
//     if (url) { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('createLink', false, url); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); }
//   };

//   const handleUnlink = () => { restoreSelection(); if (editorRef.current) editorRef.current.focus(); document.execCommand('unlink', false, null); saveSelection(); if (editorRef.current) onChange(editorRef.current.innerHTML); };

//   // ── Image upload (existing) ──
//   const handleImageUpload = () => {
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file'; fileInput.accept = 'image/*';
//     fileInput.onchange = (e) => {
//       const file = e.target.files[0];
//       if (!file) return;
//       if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
//       if (file.size > 5 * 1024 * 1024) { alert('Image size should be less than 5MB'); return; }
//       const reader = new FileReader();
//       reader.onload = (ev) => {
//         restoreSelection();
//         if (editorRef.current) editorRef.current.focus();
//         const img = document.createElement('img');
//         img.src = ev.target.result;
//         img.style.cssText = 'max-width:100%;height:auto;border-radius:4px;margin:8px 0;';
//         const sel = window.getSelection();
//         if (sel && sel.rangeCount > 0) {
//           const range = sel.getRangeAt(0);
//           range.deleteContents(); range.insertNode(img);
//           range.setStartAfter(img); range.collapse(true);
//           sel.removeAllRanges(); sel.addRange(range);
//         }
//         if (editorRef.current) onChange(editorRef.current.innerHTML);
//       };
//       reader.readAsDataURL(file);
//     };
//     fileInput.click();
//   };

//   // ── Video insert callback from modal ──
//   const handleVideoInsert = (html) => {
//     if (!editorRef.current) return;
//     editorRef.current.focus();
//     restoreSelection();

//     // Insert the video HTML at cursor position
//     const sel = window.getSelection();
//     if (sel && sel.rangeCount > 0) {
//       const range = sel.getRangeAt(0);
//       range.deleteContents();
//       // Create a temporary wrapper to parse HTML
//       const wrapper = document.createElement('div');
//       wrapper.innerHTML = html;
//       const frag = document.createDocumentFragment();
//       let lastNode = null;
//       while (wrapper.firstChild) {
//         lastNode = wrapper.firstChild;
//         frag.appendChild(lastNode);
//       }
//       range.insertNode(frag);
//       if (lastNode) {
//         const newRange = document.createRange();
//         newRange.setStartAfter(lastNode);
//         newRange.collapse(true);
//         sel.removeAllRanges();
//         sel.addRange(newRange);
//       }
//     } else {
//       // Fallback: append at end
//       editorRef.current.innerHTML += html;
//     }
//     onChange(editorRef.current.innerHTML);
//   };

//   const toolbarMouseDown = (e, handler) => {
//     saveSelection();
//     e.preventDefault();
//     handler();
//   };

//   const btnStyle = {
//     padding: "5px 9px", background: COLORS.white, border: `1px solid #D1D5DB`,
//     borderRadius: "4px", cursor: "pointer", color: COLORS.textGray,
//     display: "inline-flex", alignItems: "center", justifyContent: "center",
//     gap: "4px", fontSize: "13px", minWidth: "30px",
//     userSelect: "none", WebkitUserSelect: "none",
//   };

//   const videoBtnStyle = {
//     ...btnStyle,
//     background: COLORS.deepPurple,
//     color: COLORS.white,
//     border: `1px solid ${COLORS.deepPurple}`,
//     gap: "5px",
//     padding: "5px 10px",
//   };

//   const selectStyle = {
//     padding: "5px 7px", background: COLORS.white, border: `1px solid #D1D5DB`,
//     borderRadius: "4px", cursor: "pointer", color: COLORS.textGray,
//     fontSize: "13px", outline: "none", userSelect: "none",
//   };

//   const divider = <div style={{ width: "1px", height: "24px", background: "#D1D5DB", margin: "0 3px" }} />;

//   return (
//     <>
//       {showVideoModal && (
//         <VideoInsertModal
//           onInsert={handleVideoInsert}
//           onClose={() => setShowVideoModal(false)}
//         />
//       )}

//       <div style={{ border: `1px solid #D1D5DB`, borderRadius: "8px", overflow: "hidden" }}>
//         {/* Toolbar */}
//         <div style={{
//           display: "flex", gap: "2px", padding: "8px",
//           background: COLORS.lightGray, borderBottom: `1px solid #D1D5DB`,
//           flexWrap: "wrap", alignItems: "center"
//         }}>
//           {/* Undo / Redo */}
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleUndo)} style={btnStyle} title="Undo">↩</button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleRedo)} style={btnStyle} title="Redo">↪</button>
//           {divider}

//           {/* Block Format */}
//           <select onMouseDown={() => saveSelection()} onChange={(e) => { handleHeading(e.target.value); e.target.value = ""; }} style={selectStyle} defaultValue="">
//             <option value="" disabled>Block</option>
//             <option value="p">Paragraph</option>
//             <option value="1">Heading 1</option>
//             <option value="2">Heading 2</option>
//             <option value="3">Heading 3</option>
//             <option value="4">Heading 4</option>
//             <option value="5">Heading 5</option>
//             <option value="6">Heading 6</option>
//           </select>
//           {divider}

//           {/* Font Size */}
//           <select onMouseDown={() => saveSelection()} onChange={(e) => { handleFontSize(e.target.value); e.target.value = ""; }} style={{ ...selectStyle, minWidth: "70px" }} defaultValue="">
//             <option value="" disabled>Size</option>
//             <option value="1">8pt</option>
//             <option value="2">10pt</option>
//             <option value="3">12pt</option>
//             <option value="4">14pt</option>
//             <option value="5">18pt</option>
//             <option value="6">24pt</option>
//             <option value="7">36pt</option>
//           </select>
//           {divider}

//           {/* Font Family */}
//           <select onMouseDown={() => saveSelection()} onChange={(e) => { handleFontName(e.target.value); e.target.value = ""; }} style={{ ...selectStyle, minWidth: "130px" }} defaultValue="">
//             <option value="" disabled>Font</option>
//             <optgroup label="Sans-Serif">
//               <option value="Arial">Arial</option>
//               <option value="Verdana">Verdana</option>
//               <option value="Tahoma">Tahoma</option>
//               <option value="Trebuchet MS">Trebuchet MS</option>
//               <option value="Helvetica">Helvetica</option>
//               <option value="Calibri">Calibri</option>
//               <option value="Segoe UI">Segoe UI</option>
//             </optgroup>
//             <optgroup label="Serif">
//               <option value="Times New Roman">Times New Roman</option>
//               <option value="Georgia">Georgia</option>
//               <option value="Garamond">Garamond</option>
//               <option value="Palatino Linotype">Palatino</option>
//               <option value="Cambria">Cambria</option>
//             </optgroup>
//             <optgroup label="Monospace">
//               <option value="Courier New">Courier New</option>
//               <option value="Consolas">Consolas</option>
//               <option value="Monaco">Monaco</option>
//               <option value="Menlo">Menlo</option>
//             </optgroup>
//             <optgroup label="Display">
//               <option value="Impact">Impact</option>
//               <option value="Comic Sans MS">Comic Sans</option>
//               <option value="Copperplate">Copperplate</option>
//             </optgroup>
//           </select>
//           {divider}

//           {/* Text Formatting */}
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('bold'))} style={btnStyle} title="Bold"><FaBold size={13} /></button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('italic'))} style={btnStyle} title="Italic"><FaItalic size={13} /></button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('underline'))} style={btnStyle} title="Underline"><u>U</u></button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('strikethrough'))} style={btnStyle} title="Strikethrough"><s>S</s></button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleScript('superscript'))} style={btnStyle} title="Superscript">x²</button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleScript('subscript'))} style={btnStyle} title="Subscript">x₂</button>
//           {divider}

//           {/* Colors */}
//           <label style={{ ...btnStyle, cursor: "pointer", padding: "3px" }} title="Text Color">
//             <span style={{ fontSize: "11px" }}>A</span>
//             <input type="color" onMouseDown={() => saveSelection()} onChange={(e) => handleColor(e.target.value)} style={{ width: "20px", height: "20px", border: "none", padding: 0, cursor: "pointer" }} />
//           </label>
//           <label style={{ ...btnStyle, cursor: "pointer", padding: "3px" }} title="Highlight Color">
//             <span style={{ fontSize: "11px", background: "#ff0", padding: "0 2px" }}>A</span>
//             <input type="color" onMouseDown={() => saveSelection()} onChange={(e) => handleBackColor(e.target.value)} style={{ width: "20px", height: "20px", border: "none", padding: 0, cursor: "pointer" }} />
//           </label>
//           {divider}

//           {/* Alignment */}
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Left'))} style={btnStyle} title="Align Left">≡L</button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Center'))} style={btnStyle} title="Center">≡C</button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Right'))} style={btnStyle} title="Align Right">≡R</button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Full'))} style={btnStyle} title="Justify">≡J</button>
//           {divider}

//           {/* Lists */}
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleList('ul'))} style={btnStyle} title="Bullet List">• List</button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleList('ol'))} style={btnStyle} title="Numbered List">1. List</button>
//           {divider}

//           {/* Indent */}
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleIndent('in'))} style={btnStyle} title="Indent">→</button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleIndent('out'))} style={btnStyle} title="Outdent">←</button>
//           {divider}

//           {/* Links */}
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleLink)} style={btnStyle} title="Insert Link"><FaLink size={13} /></button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleUnlink)} style={btnStyle} title="Remove Link">🔗✕</button>
//           {divider}

//           {/* ── MEDIA: Image + Video (grouped together) ── */}
//           <button
//             type="button"
//             onMouseDown={(e) => toolbarMouseDown(e, handleImageUpload)}
//             style={{ ...btnStyle, color: COLORS.deepPurple, borderColor: COLORS.deepPurple }}
//             title="Insert Image"
//           >
//             <FaImage size={13} /> <span style={{ fontSize: "12px" }}>Image</span>
//           </button>

//           <button
//             type="button"
//             onMouseDown={(e) => { saveSelection(); e.preventDefault(); setShowVideoModal(true); }}
//             style={videoBtnStyle}
//             title="Insert Video (YouTube, Vimeo, or upload)"
//           >
//             <FaVideo size={13} /> <span style={{ fontSize: "12px" }}>Video</span>
//           </button>
//           {divider}

//           {/* Misc */}
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleHorizontalRule)} style={btnStyle} title="Horizontal Rule">—</button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleInsertSpecialChar)} style={btnStyle} title="Special Character">Ω</button>
//           <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('removeFormat'))} style={btnStyle} title="Clear Formatting">T✕</button>
//         </div>

//         {/* Editor Area */}
//         <div
//           ref={editorRef}
//           contentEditable={true}
//           suppressContentEditableWarning={true}
//           dir="ltr" lang="en" spellCheck={true}
//           onInput={(e) => onChange(e.currentTarget.innerHTML)}
//           onKeyUp={saveSelection}
//           onMouseUp={saveSelection}
//           onSelect={saveSelection}
//           onFocus={saveSelection}
//           data-placeholder={placeholder}
//           style={{
//             minHeight: "300px", maxHeight: "500px", padding: "16px",
//             outline: "none", fontSize: "15px", lineHeight: "1.8",
//             color: COLORS.textGray, backgroundColor: COLORS.white,
//             overflowY: "auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//             direction: "ltr", textAlign: "left", unicodeBidi: "embed",
//             wordBreak: "break-word", whiteSpace: "pre-wrap",
//           }}
//         />

//         <style>{`
//           [contenteditable]:empty:before {
//             content: attr(data-placeholder);
//             color: #9CA3AF; font-style: italic; pointer-events: none;
//           }
//           [contenteditable] * { direction: ltr !important; unicode-bidi: embed !important; }
//           [contenteditable] img { max-width: 100%; height: auto; border-radius: 4px; margin: 8px 0; }
//           [contenteditable] iframe { max-width: 100%; border-radius: 8px; }
//           [contenteditable] video { max-width: 100%; border-radius: 8px; }
//           [contenteditable] a { color: ${COLORS.deepPurple}; text-decoration: underline; }
//           [contenteditable]:focus { outline: none; }
//         `}</style>
//       </div>
//     </>
//   );
// };

// // ========== MAIN COMPONENT ==========
// const AdminBlogs = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [search, setSearch] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [formVisible, setFormVisible] = useState(false);
//   const [selectedBlog, setSelectedBlog] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   const [editingId, setEditingId] = useState(null);
//   const [title, setTitle] = useState("");
//   const [excerpt, setExcerpt] = useState("");
//   const [category, setCategory] = useState("");
//   const [content, setContent] = useState("");
//   const [image, setImage] = useState(null);
//   const [status, setStatus] = useState("published");
//   const [featured, setFeatured] = useState(false);
//   const [author, setAuthor] = useState("iTechSkill.com");
//   const [blogCategories, setBlogCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   const [newCategoryInput, setNewCategoryInput] = useState("");
//   const [visibility, setVisibility] = useState("public");
//   const [publishedDate, setPublishedDate] = useState(new Date().toISOString().slice(0, 16));
//   const [aioseoScore, setAioseoScore] = useState(97);

//   const MAX_FEATURED = 3;

//   const canToggleFeatured = (blogId, newFeaturedStatus) => {
//     if (!newFeaturedStatus) return true;
//     return blogs.filter(b => b.featured && b._id !== blogId).length < MAX_FEATURED;
//   };

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3500);
//   };

//   const resetForm = () => {
//     setEditingId(null); setTitle(""); setExcerpt(""); setCategory(""); setContent("");
//     setImage(null); setStatus("published"); setFeatured(false); setAuthor("iTechSkill.com");
//     setVisibility("public"); setPublishedDate(new Date().toISOString().slice(0, 16));
//   };

//   const fetchBlogs = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllBlogsAdmin();
//       setBlogs(data);
//     } catch (err) {
//       showToast(err.message || "Failed to load blogs", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBlogCategories = async () => {
//     try {
//       setLoadingCategories(true);
//       const uniqueCategories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
//       setBlogCategories(uniqueCategories);
//     } catch (error) {
//       console.error("Error fetching blog categories:", error);
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   const handleAddCategory = () => {
//     if (!newCategoryInput.trim()) return;
//     if (!blogCategories.includes(newCategoryInput.trim())) {
//       setBlogCategories([...blogCategories, newCategoryInput.trim()]);
//       setCategory(newCategoryInput.trim());
//       setNewCategoryInput("");
//       showToast("Category added");
//     }
//   };

//   useEffect(() => { fetchBlogs(); }, []);
//   useEffect(() => { if (blogs.length > 0) fetchBlogCategories(); }, [blogs]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim() || !excerpt.trim() || !content.trim() || !category.trim()) {
//       showToast("Title, excerpt, category, and content are required.", "error");
//       return;
//     }
//     if (featured && !canToggleFeatured(editingId, true)) {
//       showToast(`Cannot feature more than ${MAX_FEATURED} articles.`, "error");
//       return;
//     }
//     const payload = {
//       title, excerpt, category, content, status, featured, author,
//       publishedAt: new Date(publishedDate).toISOString(),
//     };
//     if (image) payload.image = image;
//     try {
//       setSubmitting(true);
//       if (editingId) {
//         await updateBlog(editingId, payload);
//         showToast("Blog updated successfully.");
//       } else {
//         await createBlog(payload);
//         showToast("Blog created successfully.");
//       }
//       resetForm(); setFormVisible(false); fetchBlogs();
//     } catch (err) {
//       showToast(err.message || "Operation failed", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Permanently delete this blog post?")) return;
//     try {
//       await deleteBlog(id);
//       showToast("Blog deleted.");
//       fetchBlogs();
//     } catch (err) {
//       showToast(err.message || "Delete failed", "error");
//     }
//   };

//   const handleEdit = (blog) => {
//     setEditingId(blog._id); setTitle(blog.title || ""); setExcerpt(blog.excerpt || "");
//     setCategory(blog.category || ""); setContent(blog.content || "");
//     setImage(blog.image || null); setStatus(blog.status || "published");
//     setFeatured(blog.featured || false); setAuthor(blog.author || "iTechSkill.com");
//     setVisibility(blog.visibility || "public");
//     setPublishedDate(blog.publishedAt ? blog.publishedAt.slice(0, 16) : new Date().toISOString().slice(0, 16));
//     setFormVisible(true);
//   };

//   const handleAdd       = () => { resetForm(); setFormVisible(true); };
//   const handleViewDetails = (blog) => setSelectedBlog(blog);

//   const handleToggleFeatured = async (id) => {
//     const blog = blogs.find(b => b._id === id);
//     if (!blog) return;
//     if (!blog.featured && !canToggleFeatured(id, true)) {
//       showToast(`Cannot feature more than ${MAX_FEATURED} articles.`, "error");
//       return;
//     }
//     try {
//       await toggleFeaturedBlog(id);
//       showToast("Featured status updated.");
//       fetchBlogs();
//     } catch (err) {
//       showToast(err.message || "Toggle failed", "error");
//     }
//   };

//   const filtered = useMemo(() => blogs.filter((b) => {
//     const matchSearch =
//       b.title?.toLowerCase().includes(search.toLowerCase()) ||
//       b.category?.toLowerCase().includes(search.toLowerCase()) ||
//       b.excerpt?.toLowerCase().includes(search.toLowerCase());
//     return matchSearch && (filterStatus === "all" || b.status === filterStatus);
//   }), [blogs, search, filterStatus]);

//   return (
//     <div style={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
//       <Sidebar />

//       <div style={{ flex: 1, overflowX: "hidden", marginLeft: isMobile ? "0" : "280px", padding: isMobile ? "80px 16px 32px 16px" : "32px" }}>
//         {/* Toast */}
//         {toast && (
//           <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "12px 24px", borderRadius: "8px", background: toast.type === "success" ? COLORS.brightGreen : COLORS.danger, color: toast.type === "success" ? COLORS.deepPurple : COLORS.white, fontWeight: "600", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", animation: "slideIn 0.3s ease" }}>
//             {toast.msg}
//           </div>
//         )}

//         {/* Header */}
//         <div style={{ marginBottom: "32px" }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
//             <div>
//               <h1 style={{ fontSize: isMobile ? "24px" : "28px", fontWeight: "700", color: COLORS.deepPurple, margin: 0, marginBottom: "8px" }}>📝 Blog Management</h1>
//               <p style={{ color: COLORS.textGray, margin: 0, fontSize: "14px" }}>Create, edit & manage all blog posts</p>
//             </div>
//             <div style={{ background: "linear-gradient(135deg, rgba(61,26,91,0.1) 0%, rgba(94,66,123,0.1) 100%)", border: "1px solid rgba(61,26,91,0.2)", borderRadius: "8px", padding: "12px 16px" }}>
//               <p style={{ color: COLORS.deepPurple, fontSize: "14px", fontWeight: "600", margin: 0 }}>Total Posts: {filtered.length}</p>
//             </div>
//           </div>

//           {/* Search & Filter */}
//           <div style={{ display: "flex", gap: isMobile ? "12px" : "20px", marginBottom: isMobile ? "24px" : "30px", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center" }}>
//             <div style={{ position: "relative", flex: 1, maxWidth: isMobile ? "100%" : "500px" }}>
//               <FaSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: COLORS.darkGray, fontSize: "16px" }} />
//               <input type="text" placeholder="Search by title, category, or excerpt..." value={search} onChange={(e) => setSearch(e.target.value)}
//                 style={{ padding: isMobile ? "12px 16px 12px 48px" : "14px 16px 14px 48px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", fontSize: "15px", background: COLORS.white, boxSizing: "border-box", outline: "none" }} />
//             </div>
//             <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
//               style={{ padding: isMobile ? "12px 16px" : "14px 20px", borderRadius: "8px", border: `1px solid #D1D5DB`, fontSize: "15px", background: COLORS.white, color: COLORS.textGray, minWidth: isMobile ? "100%" : "150px", cursor: "pointer", outline: "none" }}>
//               <option value="all">All Status</option>
//               <option value="published">Published</option>
//               <option value="draft">Draft</option>
//             </select>
//             <button onClick={handleAdd}
//               style={{ background: COLORS.orange, color: COLORS.white, border: "none", padding: isMobile ? "12px 24px" : "14px 28px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", whiteSpace: "nowrap" }}>
//               <FaPlus /> Add New Post
//             </button>
//           </div>

//           {/* Table */}
//           <div style={{ background: COLORS.white, borderRadius: "12px", overflow: isMobile ? "auto" : "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
//             {loading ? (
//               <div style={{ padding: "60px 20px", textAlign: "center" }}>
//                 <div style={{ width: "40px", height: "40px", border: "3px solid #f3f3f3", borderTop: `3px solid ${COLORS.deepPurple}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
//                 <p style={{ color: COLORS.textGray }}>Loading posts...</p>
//               </div>
//             ) : (
//               <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "1000px" : "auto" }}>
//                 <thead>
//                   <tr style={{ background: COLORS.headerPurple, color: COLORS.white }}>
//                     {["#", "Title", "Excerpt", "Category", "Status", "Actions"].map((h, i) => (
//                       <th key={i} style={{ padding: isMobile ? "14px 16px" : "18px 24px", textAlign: i === 5 ? "center" : "left", fontSize: isMobile ? "13px" : "15px", fontWeight: "700" }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.length > 0 ? filtered.map((blog, index) => (
//                     <tr key={blog._id} style={{ borderBottom: `1px solid ${COLORS.lightGray}`, background: index % 2 === 0 ? COLORS.white : COLORS.bgGray }}>
//                       <td style={{ padding: isMobile ? "14px 16px" : "18px 24px", color: COLORS.textGray, fontWeight: "600", fontSize: isMobile ? "13px" : "15px" }}>{index + 1}</td>
//                       <td style={{ padding: isMobile ? "14px 16px" : "18px 24px", color: COLORS.deepPurple, fontWeight: "600", fontSize: isMobile ? "13px" : "15px" }}>{blog.title}</td>
//                       <td style={{ padding: isMobile ? "14px 16px" : "18px 24px", color: COLORS.textGray, fontSize: isMobile ? "13px" : "15px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{blog.excerpt}</td>
//                       <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
//                         <span style={{ background: COLORS.goldBadge, color: "#3D2817", padding: "4px 12px", borderRadius: "6px", fontSize: isMobile ? "12px" : "13px", fontWeight: "600" }}>{blog.category}</span>
//                       </td>
//                       <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
//                         <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
//                           <span style={{ background: blog.status === "published" ? COLORS.brightGreen : COLORS.darkGray, color: blog.status === "published" ? COLORS.deepPurple : COLORS.white, padding: isMobile ? "4px 12px" : "6px 16px", borderRadius: "6px", fontSize: isMobile ? "12px" : "13px", fontWeight: "600", display: "inline-block" }}>{blog.status}</span>
//                           {blog.featured && <span style={{ background: COLORS.goldBadge, color: "#3D2817", padding: isMobile ? "4px 12px" : "6px 16px", borderRadius: "6px", fontSize: isMobile ? "12px" : "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}><FaStar size={12} /> Featured</span>}
//                         </div>
//                       </td>
//                       <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
//                         <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? "6px" : "8px", flexWrap: "wrap" }}>
//                           {[
//                             { onClick: () => handleViewDetails(blog), icon: <FaEye size={isMobile ? 12 : 14} />, bg: "#10B981", color: COLORS.white, title: "View" },
//                             { onClick: () => handleEdit(blog), icon: <FaEdit size={isMobile ? 12 : 14} />, bg: COLORS.warning, color: COLORS.white, title: "Edit" },
//                             { onClick: () => handleToggleFeatured(blog._id), icon: <FaStar size={isMobile ? 12 : 14} />, bg: blog.featured ? COLORS.darkGray : COLORS.goldBadge, color: blog.featured ? COLORS.white : "#3D2817", title: blog.featured ? "Unfeature" : "Feature" },
//                             { onClick: () => handleDelete(blog._id), icon: <FaTrash size={isMobile ? 12 : 14} />, bg: COLORS.danger, color: COLORS.white, title: "Delete" },
//                           ].map((btn, i) => (
//                             <button key={i} onClick={btn.onClick} title={btn.title}
//                               style={{ background: btn.bg, color: btn.color, border: "none", padding: isMobile ? "6px 8px" : "8px 10px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                               {btn.icon}
//                             </button>
//                           ))}
//                         </div>
//                       </td>
//                     </tr>
//                   )) : (
//                     <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: COLORS.darkGray }}>No blog posts found</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Modal */}
//       {formVisible && (
//         <Modal onClose={() => setFormVisible(false)}>
//           <div style={{ width: "100%" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: "16px" }}>
//               <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>{editingId ? "✏️ Edit Blog Post" : "📝 Create New Blog Post"}</h3>
//               <button onClick={() => { setFormVisible(false); resetForm(); }} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px", display: "flex", alignItems: "center", padding: "4px" }}>
//                 <FaTimes />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//               <div>
//                 <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Title *</label>
//                 <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter blog title" required
//                   style={{ padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", boxSizing: "border-box", fontSize: "14px", outline: "none" }} />
//               </div>

//               <div>
//                 <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Meta Description *</label>
//                 <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short description shown in listings" required rows="3"
//                   style={{ padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", boxSizing: "border-box", fontSize: "14px", fontFamily: "inherit", resize: "vertical", outline: "none" }} />
//               </div>

//               <div>
//                 <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Author *</label>
//                 <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter author name" required
//                   style={{ padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", boxSizing: "border-box", fontSize: "14px", outline: "none" }} />
//               </div>

//               <div style={{ marginTop: "20px", borderTop: `1px solid ${COLORS.lightGray}`, paddingTop: "20px" }}>
//                 <h4 style={{ color: COLORS.deepPurple, margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>Category *</h4>
//                 <select value={category} onChange={(e) => setCategory(e.target.value)} required
//                   style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, fontSize: "14px", marginBottom: "12px", outline: "none" }}>
//                   <option value="">Select a category</option>
//                   {blogCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
//                 </select>
//                 <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                   <input type="text" value={newCategoryInput} onChange={(e) => setNewCategoryInput(e.target.value)} placeholder="New category name"
//                     style={{ flex: 1, padding: "10px 12px", borderRadius: "6px", border: `1px solid #D1D5DB`, fontSize: "14px", outline: "none" }}
//                     onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }} />
//                   <button type="button" onClick={handleAddCategory}
//                     style={{ padding: "10px 16px", background: COLORS.orange, color: COLORS.white, border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap" }}>
//                     Add
//                   </button>
//                 </div>
//                 <p style={{ fontSize: "12px", color: COLORS.darkGray, marginTop: "8px" }}>New categories will appear in the dropdown</p>
//               </div>

//               <div>
//                 <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Content *</label>
//                 <RichTextEditor
//                   key={formVisible ? (editingId || 'new') : 'hidden'}
//                   value={content}
//                   onChange={setContent}
//                   placeholder="Write your blog content here..."
//                 />
//               </div>

//               <div>
//                 <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Featured Image</label>
//                 <ImageUpload onImageUpload={setImage} currentImage={image} onRemove={() => setImage(null)} />
//               </div>

//               {/* Publish Box */}
//               <div style={{ background: COLORS.lightGray, borderRadius: "8px", padding: "16px", marginTop: "20px", border: `1px solid ${COLORS.darkGray}20` }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
//                   <h4 style={{ color: COLORS.deepPurple, margin: 0, fontSize: "16px", fontWeight: "600" }}>Publish</h4>
//                   <button type="button" style={{ background: "none", border: `1px solid ${COLORS.darkGray}`, padding: "4px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer", color: COLORS.textGray }}>Preview Changes</button>
//                 </div>
//                 <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
//                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                     <span style={{ color: COLORS.textGray }}>Status:</span>
//                     <span>
//                       <strong>{status === "published" ? "Published" : "Draft"}</strong>
//                       <button type="button" onClick={() => setStatus(status === "published" ? "draft" : "published")}
//                         style={{ background: "none", border: "none", color: COLORS.deepPurple, cursor: "pointer", marginLeft: "8px", fontSize: "12px" }}>Edit</button>
//                     </span>
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                     <span style={{ color: COLORS.textGray }}>Visibility:</span>
//                     <span>
//                       <strong>{visibility === "public" ? "Public" : "Private"}</strong>
//                       <button type="button" onClick={() => setVisibility(visibility === "public" ? "private" : "public")}
//                         style={{ background: "none", border: "none", color: COLORS.deepPurple, cursor: "pointer", marginLeft: "8px", fontSize: "12px" }}>Edit</button>
//                     </span>
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between" }}>
//                     <span style={{ color: COLORS.textGray }}>Published on:</span>
//                     <input type="datetime-local" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)}
//                       style={{ border: `1px solid ${COLORS.darkGray}`, borderRadius: "4px", padding: "2px 4px", fontSize: "12px", maxWidth: "180px" }} />
//                   </div>
//                   <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
//                     <input type="checkbox" id="noModified" style={{ width: "16px", height: "16px" }} />
//                     <label htmlFor="noModified" style={{ fontSize: "12px", color: COLORS.textGray }}>Don't update the modified date</label>
//                   </div>
//                   <div style={{ marginTop: "12px", padding: "8px", background: COLORS.white, borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                     <span style={{ color: COLORS.textGray }}>AIOSEO Score:</span>
//                     <span style={{ background: aioseoScore >= 90 ? "#4CAF50" : aioseoScore >= 70 ? "#FF9800" : "#F44336", color: "white", padding: "4px 12px", borderRadius: "20px", fontWeight: "600", fontSize: "13px" }}>
//                       {aioseoScore}/100
//                     </span>
//                   </div>
//                 </div>
//                 <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
//                   <button type="button"
//                     onClick={() => { if (window.confirm("Move to trash?")) { if (editingId) { handleDelete(editingId); setFormVisible(false); } } }}
//                     style={{ padding: "8px 16px", background: COLORS.danger, color: COLORS.white, border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", flex: 1 }}>
//                     Move to Trash
//                   </button>
//                   <button type="submit" disabled={submitting}
//                     style={{ padding: "8px 16px", background: submitting ? COLORS.darkGray : COLORS.brightGreen, color: submitting ? COLORS.white : COLORS.deepPurple, border: "none", borderRadius: "6px", cursor: submitting ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "600", flex: 1, opacity: submitting ? 0.7 : 1 }}>
//                     {submitting ? "Saving..." : editingId ? "Update" : "Publish"}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </Modal>
//       )}

//       {/* View Details Modal */}
//       {selectedBlog && (
//         <Modal onClose={() => setSelectedBlog(null)}>
//           <div style={{ width: "100%" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: "16px" }}>
//               <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>👁 Blog Post Details</h3>
//               <button onClick={() => setSelectedBlog(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px", display: "flex", alignItems: "center", padding: "4px" }}><FaTimes /></button>
//             </div>
//             {selectedBlog.image && (
//               <div style={{ marginBottom: "20px", textAlign: "center" }}>
//                 <img src={selectedBlog.image} alt={selectedBlog.title} onError={(e) => { e.target.style.display = "none"; }}
//                   style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px", objectFit: "cover", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }} />
//               </div>
//             )}
//             <div style={{ display: "grid", gap: "12px" }}>
//               {[
//                 { label: "Title", value: selectedBlog.title },
//                 { label: "Category", value: selectedBlog.category },
//                 { label: "Status", value: <span style={{ background: selectedBlog.status === "published" ? COLORS.brightGreen : COLORS.darkGray, color: selectedBlog.status === "published" ? COLORS.deepPurple : COLORS.white, padding: "4px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", display: "inline-block" }}>{selectedBlog.status}</span> },
//                 { label: "Featured", value: selectedBlog.featured ? <span style={{ background: COLORS.goldBadge, color: "#3D2817", padding: "4px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}><FaStar size={12} /> Featured</span> : "No" },
//                 { label: "Excerpt", value: selectedBlog.excerpt },
//                 { label: "Content", value: <div style={{ maxHeight: "300px", overflowY: "auto", background: COLORS.lightGray, padding: "16px", borderRadius: "8px", fontSize: "14px", lineHeight: "1.8" }}><div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} style={{ color: COLORS.textGray }} /></div> },
//                 { label: "Published At", value: selectedBlog.publishedAt ? new Date(selectedBlog.publishedAt).toLocaleDateString() : "N/A" },
//                 { label: "Last Updated", value: selectedBlog.updatedAt ? new Date(selectedBlog.updatedAt).toLocaleDateString() : "N/A" },
//               ].map((item, index) => (
//                 <div key={index} style={{ padding: "12px", background: index % 2 === 0 ? COLORS.lightGray : COLORS.white, borderRadius: "8px", borderLeft: `3px solid ${COLORS.deepPurple}` }}>
//                   <strong style={{ color: COLORS.textGray, display: "block", marginBottom: "4px", fontSize: "14px" }}>{item.label}</strong>
//                   <div style={{ color: COLORS.deepPurple, fontSize: "14px" }}>{item.value}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Modal>
//       )}

//       <style>{`
//         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
//         @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
//       `}</style>
//     </div>
//   );
// };

// export default AdminBlogs;
























import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleFeaturedBlog,
} from "../api/api";
import Sidebar from "../components/Sidebar";
import {
  FaEdit, FaTrash, FaStar, FaPlus, FaSearch, FaEye, FaTimes,
  FaBold, FaItalic, FaLink, FaImage, FaVideo, FaYoutube, FaFileVideo
} from "react-icons/fa";

const COLORS = {
  sidebarDark: "#1a1d2e",
  deepPurple: "#3D1A5B",
  headerPurple: "#4B2D7A",
  brightGreen: "#00D9A3",
  goldBadge: "#D4A745",
  roleBg: "#E8DFF5",
  white: "#FFFFFF",
  bgGray: "#F9FAFB",
  lightGray: "#F3F4F6",
  darkGray: "#6B7280",
  textGray: "#4B5563",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
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
      width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    }}>
      {children}
    </div>
  </div>
);

// ========== VideoInsertModal ==========
const VideoInsertModal = ({ onInsert, onClose }) => {
  const [tab, setTab] = useState("url");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const parseVideoUrl = (raw) => {
    const url = raw.trim();
    const ytShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    const ytWatch = url.match(/youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/);
    const ytEmbed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    const ytId = (ytShort || ytWatch || ytEmbed)?.[1];
    if (ytId) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${ytId}` };
    const vmMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vmMatch) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vmMatch[1]}` };
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

// ========== ImageUpload Component (WebP only) ==========
const ImageUpload = ({ onImageUpload, currentImage, onRemove }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [webpError, setWebpError] = useState("");

  const compressImage = (base64, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) { height = (maxWidth * height) / width; width = maxWidth; }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // Output as WebP
        resolve(canvas.toDataURL('image/webp', quality));
      };
    });
  };

  const handleFileSelect = async (e) => {
    setWebpError("");
    const file = e.target.files[0];
    if (!file) return;

    // ── WebP-only validation ──
    const isWebP =
      file.type === "image/webp" ||
      file.name.toLowerCase().endsWith(".webp");

    if (!isWebP) {
      setWebpError("Only WebP images are allowed. Please convert your image to .webp format before uploading.");
      // Reset the input so the same file can be re-selected after fixing
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setWebpError("Image must be under 5MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (readerEvent) => {
      try {
        const compressed = await compressImage(readerEvent.target.result, 800, 0.8);
        onImageUpload(compressed);
      } catch {
        setWebpError("Failed to process image. Please try again.");
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setWebpError("Failed to read image file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {/* Accept only .webp */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/webp,.webp"
        style={{ display: 'none' }}
      />

      {currentImage ? (
        <div style={{ position: 'relative', marginTop: '8px', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.lightGray}` }}>
          <img src={currentImage} alt="Cover" style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />
          {/* WebP badge */}
          <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
            WebP
          </span>
          <button
            type="button"
            onClick={() => { onRemove(); setWebpError(""); }}
            style={{ position: 'absolute', top: '8px', right: '8px', background: COLORS.danger, color: COLORS.white, border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => { setWebpError(""); fileInputRef.current?.click(); }}
            disabled={uploading}
            style={{
              width: '100%', padding: '20px', background: COLORS.lightGray,
              border: `2px dashed ${webpError ? COLORS.danger : COLORS.darkGray}`,
              borderRadius: '8px', cursor: uploading ? 'not-allowed' : 'pointer',
              color: COLORS.textGray, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '8px', opacity: uploading ? 0.7 : 1,
            }}
          >
            <FaImage size={24} color={webpError ? COLORS.danger : COLORS.darkGray} />
            <span style={{ fontWeight: '600', fontSize: '14px' }}>
              {uploading ? 'Processing...' : 'Click to upload cover image'}
            </span>
            <span style={{
              fontSize: '12px',
              background: COLORS.deepPurple,
              color: COLORS.white,
              padding: '2px 10px',
              borderRadius: '4px',
              fontWeight: '700',
              letterSpacing: '0.5px',
            }}>
              WebP format only
            </span>
            <span style={{ fontSize: '11px', color: COLORS.darkGray }}>Max size: 5MB</span>
          </button>

          {webpError && (
            <div style={{
              marginTop: '8px', padding: '10px 14px',
              background: '#FEF2F2', border: `1px solid ${COLORS.danger}`,
              borderRadius: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px',
            }}>
              <span style={{ color: COLORS.danger, fontSize: '16px', lineHeight: 1 }}>⚠</span>
              <p style={{ margin: 0, color: COLORS.danger, fontSize: '13px', lineHeight: '1.5' }}>
                {webpError}
              </p>
            </div>
          )}
        </>
      )}
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

  const handleVideoInsert = (html) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      const frag = document.createDocumentFragment();
      let lastNode = null;
      while (wrapper.firstChild) { lastNode = wrapper.firstChild; frag.appendChild(lastNode); }
      range.insertNode(frag);
      if (lastNode) {
        const newRange = document.createRange();
        newRange.setStartAfter(lastNode); newRange.collapse(true);
        sel.removeAllRanges(); sel.addRange(newRange);
      }
    } else {
      editorRef.current.innerHTML += html;
    }
    onChange(editorRef.current.innerHTML);
  };

  const toolbarMouseDown = (e, handler) => { saveSelection(); e.preventDefault(); handler(); };

  const btnStyle = {
    padding: "5px 9px", background: COLORS.white, border: `1px solid #D1D5DB`,
    borderRadius: "4px", cursor: "pointer", color: COLORS.textGray,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: "4px", fontSize: "13px", minWidth: "30px",
    userSelect: "none", WebkitUserSelect: "none",
  };

  const videoBtnStyle = {
    ...btnStyle,
    background: COLORS.deepPurple, color: COLORS.white,
    border: `1px solid ${COLORS.deepPurple}`, gap: "5px", padding: "5px 10px",
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
        <VideoInsertModal onInsert={handleVideoInsert} onClose={() => setShowVideoModal(false)} />
      )}
      <div style={{ border: `1px solid #D1D5DB`, borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "2px", padding: "8px", background: COLORS.lightGray, borderBottom: `1px solid #D1D5DB`, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleUndo)} style={btnStyle} title="Undo">↩</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleRedo)} style={btnStyle} title="Redo">↪</button>
          {divider}
          <select onMouseDown={() => saveSelection()} onChange={(e) => { handleHeading(e.target.value); e.target.value = ""; }} style={selectStyle} defaultValue="">
            <option value="" disabled>Block</option>
            <option value="p">Paragraph</option>
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>Heading {n}</option>)}
          </select>
          {divider}
          <select onMouseDown={() => saveSelection()} onChange={(e) => { handleFontSize(e.target.value); e.target.value = ""; }} style={{ ...selectStyle, minWidth: "70px" }} defaultValue="">
            <option value="" disabled>Size</option>
            {[["1","8pt"],["2","10pt"],["3","12pt"],["4","14pt"],["5","18pt"],["6","24pt"],["7","36pt"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          {divider}
          <select onMouseDown={() => saveSelection()} onChange={(e) => { handleFontName(e.target.value); e.target.value = ""; }} style={{ ...selectStyle, minWidth: "130px" }} defaultValue="">
            <option value="" disabled>Font</option>
            <optgroup label="Sans-Serif">
              {["Arial","Verdana","Tahoma","Trebuchet MS","Helvetica","Calibri","Segoe UI"].map(f => <option key={f} value={f}>{f}</option>)}
            </optgroup>
            <optgroup label="Serif">
              {["Times New Roman","Georgia","Garamond","Palatino Linotype","Cambria"].map(f => <option key={f} value={f}>{f}</option>)}
            </optgroup>
            <optgroup label="Monospace">
              {["Courier New","Consolas","Monaco","Menlo"].map(f => <option key={f} value={f}>{f}</option>)}
            </optgroup>
            <optgroup label="Display">
              {["Impact","Comic Sans MS","Copperplate"].map(f => <option key={f} value={f}>{f}</option>)}
            </optgroup>
          </select>
          {divider}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('bold'))} style={btnStyle} title="Bold"><FaBold size={13} /></button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('italic'))} style={btnStyle} title="Italic"><FaItalic size={13} /></button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('underline'))} style={btnStyle} title="Underline"><u>U</u></button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('strikethrough'))} style={btnStyle} title="Strikethrough"><s>S</s></button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleScript('superscript'))} style={btnStyle} title="Superscript">x²</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleScript('subscript'))} style={btnStyle} title="Subscript">x₂</button>
          {divider}
          <label style={{ ...btnStyle, cursor: "pointer", padding: "3px" }} title="Text Color">
            <span style={{ fontSize: "11px" }}>A</span>
            <input type="color" onMouseDown={() => saveSelection()} onChange={(e) => handleColor(e.target.value)} style={{ width: "20px", height: "20px", border: "none", padding: 0, cursor: "pointer" }} />
          </label>
          <label style={{ ...btnStyle, cursor: "pointer", padding: "3px" }} title="Highlight Color">
            <span style={{ fontSize: "11px", background: "#ff0", padding: "0 2px" }}>A</span>
            <input type="color" onMouseDown={() => saveSelection()} onChange={(e) => handleBackColor(e.target.value)} style={{ width: "20px", height: "20px", border: "none", padding: 0, cursor: "pointer" }} />
          </label>
          {divider}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Left'))} style={btnStyle} title="Align Left">≡L</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Center'))} style={btnStyle} title="Center">≡C</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Right'))} style={btnStyle} title="Align Right">≡R</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleAlign('Full'))} style={btnStyle} title="Justify">≡J</button>
          {divider}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleList('ul'))} style={btnStyle} title="Bullet List">• List</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleList('ol'))} style={btnStyle} title="Numbered List">1. List</button>
          {divider}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleIndent('in'))} style={btnStyle} title="Indent">→</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => handleIndent('out'))} style={btnStyle} title="Outdent">←</button>
          {divider}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleLink)} style={btnStyle} title="Insert Link"><FaLink size={13} /></button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleUnlink)} style={btnStyle} title="Remove Link">🔗✕</button>
          {divider}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleImageUpload)} style={{ ...btnStyle, color: COLORS.deepPurple, borderColor: COLORS.deepPurple }} title="Insert Image">
            <FaImage size={13} /> <span style={{ fontSize: "12px" }}>Image</span>
          </button>
          <button type="button" onMouseDown={(e) => { saveSelection(); e.preventDefault(); setShowVideoModal(true); }} style={videoBtnStyle} title="Insert Video">
            <FaVideo size={13} /> <span style={{ fontSize: "12px" }}>Video</span>
          </button>
          {divider}
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleHorizontalRule)} style={btnStyle} title="Horizontal Rule">—</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, handleInsertSpecialChar)} style={btnStyle} title="Special Character">Ω</button>
          <button type="button" onMouseDown={(e) => toolbarMouseDown(e, () => execCmd('removeFormat'))} style={btnStyle} title="Clear Formatting">T✕</button>
        </div>
        <div
          ref={editorRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          dir="ltr" lang="en" spellCheck={true}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          onKeyUp={saveSelection} onMouseUp={saveSelection}
          onSelect={saveSelection} onFocus={saveSelection}
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
          [contenteditable]:empty:before { content: attr(data-placeholder); color: #9CA3AF; font-style: italic; pointer-events: none; }
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

// ========== MAIN COMPONENT ==========
const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [formVisible, setFormVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("published");
  const [featured, setFeatured] = useState(false);
  const [author, setAuthor] = useState("iTechSkill.com");
  const [blogCategories, setBlogCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().slice(0, 16));
  const [aioseoScore, setAioseoScore] = useState(97);
  // Confirm delete category dialog
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const MAX_FEATURED = 3;

  const canToggleFeatured = (blogId, newFeaturedStatus) => {
    if (!newFeaturedStatus) return true;
    return blogs.filter(b => b.featured && b._id !== blogId).length < MAX_FEATURED;
  };

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
    setEditingId(null); setTitle(""); setExcerpt(""); setCategory(""); setContent("");
    setImage(null); setStatus("published"); setFeatured(false); setAuthor("iTechSkill.com");
    setVisibility("public"); setPublishedDate(new Date().toISOString().slice(0, 16));
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogsAdmin();
      setBlogs(data);
    } catch (err) {
      showToast(err.message || "Failed to load blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogCategories = async () => {
    try {
      setLoadingCategories(true);
      const uniqueCategories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
      setBlogCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return;
    const trimmed = newCategoryInput.trim();
    if (!blogCategories.includes(trimmed)) {
      setBlogCategories([...blogCategories, trimmed]);
      setCategory(trimmed);
      setNewCategoryInput("");
      showToast("Category added");
    } else {
      showToast("Category already exists", "error");
    }
  };

  // ── Delete category handler ──
  const handleDeleteCategory = (catName) => {
    setCategoryToDelete(catName);
  };

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    const updated = blogCategories.filter(c => c !== categoryToDelete);
    setBlogCategories(updated);
    // Clear selection if the deleted category was selected
    if (category === categoryToDelete) setCategory("");
    showToast(`Category "${categoryToDelete}" removed`);
    setCategoryToDelete(null);
  };

  useEffect(() => { fetchBlogs(); }, []);
  useEffect(() => { if (blogs.length > 0) fetchBlogCategories(); }, [blogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim() || !category.trim()) {
      showToast("Title, excerpt, category, and content are required.", "error");
      return;
    }
    if (featured && !canToggleFeatured(editingId, true)) {
      showToast(`Cannot feature more than ${MAX_FEATURED} articles.`, "error");
      return;
    }
    const payload = {
      title, excerpt, category, content, status, featured, author,
      publishedAt: new Date(publishedDate).toISOString(),
    };
    if (image) payload.image = image;
    try {
      setSubmitting(true);
      if (editingId) {
        await updateBlog(editingId, payload);
        showToast("Blog updated successfully.");
      } else {
        await createBlog(payload);
        showToast("Blog created successfully.");
      }
      resetForm(); setFormVisible(false); fetchBlogs();
    } catch (err) {
      showToast(err.message || "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this blog post?")) return;
    try {
      await deleteBlog(id);
      showToast("Blog deleted.");
      fetchBlogs();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id); setTitle(blog.title || ""); setExcerpt(blog.excerpt || "");
    setCategory(blog.category || ""); setContent(blog.content || "");
    setImage(blog.image || null); setStatus(blog.status || "published");
    setFeatured(blog.featured || false); setAuthor(blog.author || "iTechSkill.com");
    setVisibility(blog.visibility || "public");
    setPublishedDate(blog.publishedAt ? blog.publishedAt.slice(0, 16) : new Date().toISOString().slice(0, 16));
    setFormVisible(true);
  };

  const handleAdd = () => { resetForm(); setFormVisible(true); };
  const handleViewDetails = (blog) => setSelectedBlog(blog);

  const handleToggleFeatured = async (id) => {
    const blog = blogs.find(b => b._id === id);
    if (!blog) return;
    if (!blog.featured && !canToggleFeatured(id, true)) {
      showToast(`Cannot feature more than ${MAX_FEATURED} articles.`, "error");
      return;
    }
    try {
      await toggleFeaturedBlog(id);
      showToast("Featured status updated.");
      fetchBlogs();
    } catch (err) {
      showToast(err.message || "Toggle failed", "error");
    }
  };

  const filtered = useMemo(() => blogs.filter((b) => {
    const matchSearch =
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filterStatus === "all" || b.status === filterStatus);
  }), [blogs, search, filterStatus]);

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
              <h1 style={{ fontSize: isMobile ? "24px" : "28px", fontWeight: "700", color: COLORS.deepPurple, margin: 0, marginBottom: "8px" }}>📝 Blog Management</h1>
              <p style={{ color: COLORS.textGray, margin: 0, fontSize: "14px" }}>Create, edit & manage all blog posts</p>
            </div>
            <div style={{ background: "linear-gradient(135deg, rgba(61,26,91,0.1) 0%, rgba(94,66,123,0.1) 100%)", border: "1px solid rgba(61,26,91,0.2)", borderRadius: "8px", padding: "12px 16px" }}>
              <p style={{ color: COLORS.deepPurple, fontSize: "14px", fontWeight: "600", margin: 0 }}>Total Posts: {filtered.length}</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div style={{ display: "flex", gap: isMobile ? "12px" : "20px", marginBottom: isMobile ? "24px" : "30px", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: isMobile ? "100%" : "500px" }}>
              <FaSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: COLORS.darkGray, fontSize: "16px" }} />
              <input type="text" placeholder="Search by title, category, or excerpt..." value={search} onChange={(e) => setSearch(e.target.value)}
                style={{ padding: isMobile ? "12px 16px 12px 48px" : "14px 16px 14px 48px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", fontSize: "15px", background: COLORS.white, boxSizing: "border-box", outline: "none" }} />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: isMobile ? "12px 16px" : "14px 20px", borderRadius: "8px", border: `1px solid #D1D5DB`, fontSize: "15px", background: COLORS.white, color: COLORS.textGray, minWidth: isMobile ? "100%" : "150px", cursor: "pointer", outline: "none" }}>
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button onClick={handleAdd}
              style={{ background: COLORS.orange, color: COLORS.white, border: "none", padding: isMobile ? "12px 24px" : "14px 28px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", whiteSpace: "nowrap" }}>
              <FaPlus /> Add New Post
            </button>
          </div>

          {/* Table */}
          <div style={{ background: COLORS.white, borderRadius: "12px", overflow: isMobile ? "auto" : "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            {loading ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <div style={{ width: "40px", height: "40px", border: "3px solid #f3f3f3", borderTop: `3px solid ${COLORS.deepPurple}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <p style={{ color: COLORS.textGray }}>Loading posts...</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "1000px" : "auto" }}>
                <thead>
                  <tr style={{ background: COLORS.headerPurple, color: COLORS.white }}>
                    {["#", "Title", "Excerpt", "Category", "Status", "Actions"].map((h, i) => (
                      <th key={i} style={{ padding: isMobile ? "14px 16px" : "18px 24px", textAlign: i === 5 ? "center" : "left", fontSize: isMobile ? "13px" : "15px", fontWeight: "700" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map((blog, index) => (
                    <tr key={blog._id} style={{ borderBottom: `1px solid ${COLORS.lightGray}`, background: index % 2 === 0 ? COLORS.white : COLORS.bgGray }}>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px", color: COLORS.textGray, fontWeight: "600", fontSize: isMobile ? "13px" : "15px" }}>{index + 1}</td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px", color: COLORS.deepPurple, fontWeight: "600", fontSize: isMobile ? "13px" : "15px" }}>{blog.title}</td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px", color: COLORS.textGray, fontSize: isMobile ? "13px" : "15px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{blog.excerpt}</td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                        <span style={{ background: COLORS.goldBadge, color: "#3D2817", padding: "4px 12px", borderRadius: "6px", fontSize: isMobile ? "12px" : "13px", fontWeight: "600" }}>{blog.category}</span>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <span style={{ background: blog.status === "published" ? COLORS.brightGreen : COLORS.darkGray, color: blog.status === "published" ? COLORS.deepPurple : COLORS.white, padding: isMobile ? "4px 12px" : "6px 16px", borderRadius: "6px", fontSize: isMobile ? "12px" : "13px", fontWeight: "600", display: "inline-block" }}>{blog.status}</span>
                          {blog.featured && <span style={{ background: COLORS.goldBadge, color: "#3D2817", padding: isMobile ? "4px 12px" : "6px 16px", borderRadius: "6px", fontSize: isMobile ? "12px" : "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}><FaStar size={12} /> Featured</span>}
                        </div>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "18px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: isMobile ? "6px" : "8px", flexWrap: "wrap" }}>
                          {[
                            { onClick: () => handleViewDetails(blog), icon: <FaEye size={isMobile ? 12 : 14} />, bg: "#10B981", color: COLORS.white, title: "View" },
                            { onClick: () => handleEdit(blog), icon: <FaEdit size={isMobile ? 12 : 14} />, bg: COLORS.warning, color: COLORS.white, title: "Edit" },
                            { onClick: () => handleToggleFeatured(blog._id), icon: <FaStar size={isMobile ? 12 : 14} />, bg: blog.featured ? COLORS.darkGray : COLORS.goldBadge, color: blog.featured ? COLORS.white : "#3D2817", title: blog.featured ? "Unfeature" : "Feature" },
                            { onClick: () => handleDelete(blog._id), icon: <FaTrash size={isMobile ? 12 : 14} />, bg: COLORS.danger, color: COLORS.white, title: "Delete" },
                          ].map((btn, i) => (
                            <button key={i} onClick={btn.onClick} title={btn.title}
                              style={{ background: btn.bg, color: btn.color, border: "none", padding: isMobile ? "6px 8px" : "8px 10px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {btn.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: COLORS.darkGray }}>No blog posts found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── Confirm Delete Category Dialog ── */}
      {categoryToDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, padding: "16px" }}>
          <div style={{ background: COLORS.white, borderRadius: "12px", padding: "28px 24px", maxWidth: "400px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FaTrash size={20} color={COLORS.danger} />
            </div>
            <h3 style={{ margin: "0 0 8px", color: COLORS.deepPurple, fontSize: "18px", fontWeight: "700" }}>Delete Category</h3>
            <p style={{ margin: "0 0 6px", color: COLORS.textGray, fontSize: "14px" }}>
              Are you sure you want to delete:
            </p>
            <p style={{ margin: "0 0 20px", fontWeight: "700", color: COLORS.deepPurple, fontSize: "15px", background: COLORS.lightGray, padding: "6px 14px", borderRadius: "6px", display: "inline-block" }}>
              "{categoryToDelete}"
            </p>
            <p style={{ margin: "0 0 24px", color: COLORS.darkGray, fontSize: "12px" }}>
              This removes it from the dropdown only. Existing posts with this category are not affected.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={() => setCategoryToDelete(null)}
                style={{ flex: 1, padding: "11px", background: COLORS.lightGray, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px", color: COLORS.textGray }}>
                Cancel
              </button>
              <button type="button" onClick={confirmDeleteCategory}
                style={{ flex: 1, padding: "11px", background: COLORS.danger, border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px", color: COLORS.white }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {formVisible && (
        <Modal onClose={() => setFormVisible(false)}>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: "16px" }}>
              <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>{editingId ? "✏️ Edit Blog Post" : "📝 Create New Blog Post"}</h3>
              <button onClick={() => { setFormVisible(false); resetForm(); }} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px", display: "flex", alignItems: "center", padding: "4px" }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter blog title" required
                  style={{ padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", boxSizing: "border-box", fontSize: "14px", outline: "none" }} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Meta Description *</label>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short description shown in listings" required rows="3"
                  style={{ padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", boxSizing: "border-box", fontSize: "14px", fontFamily: "inherit", resize: "vertical", outline: "none" }} />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Author *</label>
                <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter author name" required
                  style={{ padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", boxSizing: "border-box", fontSize: "14px", outline: "none" }} />
              </div>

              {/* ── Category Section with Delete ── */}
              <div style={{ marginTop: "20px", borderTop: `1px solid ${COLORS.lightGray}`, paddingTop: "20px" }}>
                <h4 style={{ color: COLORS.deepPurple, margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>Category *</h4>

                <select value={category} onChange={(e) => setCategory(e.target.value)} required
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid #D1D5DB`, fontSize: "14px", marginBottom: "12px", outline: "none" }}>
                  <option value="">Select a category</option>
                  {blogCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                {/* Existing categories list with delete buttons */}
                {blogCategories.length > 0 && (
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "12px", color: COLORS.darkGray, fontWeight: "600" }}>MANAGE CATEGORIES</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {blogCategories.map((cat) => (
                        <div
                          key={cat}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "6px",
                            background: category === cat ? COLORS.deepPurple : COLORS.lightGray,
                            color: category === cat ? COLORS.white : COLORS.textGray,
                            padding: "5px 10px 5px 12px", borderRadius: "20px",
                            fontSize: "13px", fontWeight: "500",
                            border: `1px solid ${category === cat ? COLORS.deepPurple : "#D1D5DB"}`,
                            transition: "all 0.15s",
                          }}
                        >
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => setCategory(cat)}
                          >
                            {cat}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            title={`Delete "${cat}" category`}
                            style={{
                              background: "none", border: "none", cursor: "pointer",
                              color: category === cat ? "rgba(255,255,255,0.8)" : COLORS.danger,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              padding: "2px", borderRadius: "50%",
                              lineHeight: 1,
                              transition: "opacity 0.15s",
                            }}
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add new category */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="Add new category..."
                    style={{ flex: 1, padding: "10px 12px", borderRadius: "6px", border: `1px solid #D1D5DB`, fontSize: "14px", outline: "none" }}
                    onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                  />
                  <button type="button" onClick={handleAddCategory}
                    style={{ padding: "10px 16px", background: COLORS.orange, color: COLORS.white, border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaPlus size={11} /> Add
                  </button>
                </div>
                <p style={{ fontSize: "12px", color: COLORS.darkGray, marginTop: "8px" }}>
                  Click × on a tag to remove it from the list. This doesn't affect existing posts.
                </p>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>Content *</label>
                <RichTextEditor
                  key={formVisible ? (editingId || 'new') : 'hidden'}
                  value={content}
                  onChange={setContent}
                  placeholder="Write your blog content here..."
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>
                  Featured Image <span style={{ background: COLORS.deepPurple, color: COLORS.white, fontSize: "11px", fontWeight: "700", padding: "2px 7px", borderRadius: "4px", marginLeft: "6px", letterSpacing: "0.5px" }}>WebP only</span>
                </label>
                <ImageUpload onImageUpload={setImage} currentImage={image} onRemove={() => setImage(null)} />
              </div>

              {/* Publish Box */}
              <div style={{ background: COLORS.lightGray, borderRadius: "8px", padding: "16px", marginTop: "20px", border: `1px solid ${COLORS.darkGray}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 style={{ color: COLORS.deepPurple, margin: 0, fontSize: "16px", fontWeight: "600" }}>Publish</h4>
                  <button type="button" style={{ background: "none", border: `1px solid ${COLORS.darkGray}`, padding: "4px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer", color: COLORS.textGray }}>Preview Changes</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: COLORS.textGray }}>Status:</span>
                    <span>
                      <strong>{status === "published" ? "Published" : "Draft"}</strong>
                      <button type="button" onClick={() => setStatus(status === "published" ? "draft" : "published")}
                        style={{ background: "none", border: "none", color: COLORS.deepPurple, cursor: "pointer", marginLeft: "8px", fontSize: "12px" }}>Edit</button>
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: COLORS.textGray }}>Visibility:</span>
                    <span>
                      <strong>{visibility === "public" ? "Public" : "Private"}</strong>
                      <button type="button" onClick={() => setVisibility(visibility === "public" ? "private" : "public")}
                        style={{ background: "none", border: "none", color: COLORS.deepPurple, cursor: "pointer", marginLeft: "8px", fontSize: "12px" }}>Edit</button>
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: COLORS.textGray }}>Published on:</span>
                    <input type="datetime-local" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)}
                      style={{ border: `1px solid ${COLORS.darkGray}`, borderRadius: "4px", padding: "2px 4px", fontSize: "12px", maxWidth: "180px" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <input type="checkbox" id="noModified" style={{ width: "16px", height: "16px" }} />
                    <label htmlFor="noModified" style={{ fontSize: "12px", color: COLORS.textGray }}>Don't update the modified date</label>
                  </div>
                  <div style={{ marginTop: "12px", padding: "8px", background: COLORS.white, borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: COLORS.textGray }}>AIOSEO Score:</span>
                    <span style={{ background: aioseoScore >= 90 ? "#4CAF50" : aioseoScore >= 70 ? "#FF9800" : "#F44336", color: "white", padding: "4px 12px", borderRadius: "20px", fontWeight: "600", fontSize: "13px" }}>
                      {aioseoScore}/100
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                  <button type="button"
                    onClick={() => { if (window.confirm("Move to trash?")) { if (editingId) { handleDelete(editingId); setFormVisible(false); } } }}
                    style={{ padding: "8px 16px", background: COLORS.danger, color: COLORS.white, border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", flex: 1 }}>
                    Move to Trash
                  </button>
                  <button type="submit" disabled={submitting}
                    style={{ padding: "8px 16px", background: submitting ? COLORS.darkGray : COLORS.brightGreen, color: submitting ? COLORS.white : COLORS.deepPurple, border: "none", borderRadius: "6px", cursor: submitting ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "600", flex: 1, opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? "Saving..." : editingId ? "Update" : "Publish"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* View Details Modal */}
      {selectedBlog && (
        <Modal onClose={() => setSelectedBlog(null)}>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: "16px" }}>
              <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>👁 Blog Post Details</h3>
              <button onClick={() => setSelectedBlog(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px", display: "flex", alignItems: "center", padding: "4px" }}><FaTimes /></button>
            </div>
            {selectedBlog.image && (
              <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <img src={selectedBlog.image} alt={selectedBlog.title} onError={(e) => { e.target.style.display = "none"; }}
                  style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px", objectFit: "cover", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }} />
              </div>
            )}
            <div style={{ display: "grid", gap: "12px" }}>
              {[
                { label: "Title", value: selectedBlog.title },
                { label: "Category", value: selectedBlog.category },
                { label: "Status", value: <span style={{ background: selectedBlog.status === "published" ? COLORS.brightGreen : COLORS.darkGray, color: selectedBlog.status === "published" ? COLORS.deepPurple : COLORS.white, padding: "4px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", display: "inline-block" }}>{selectedBlog.status}</span> },
                { label: "Featured", value: selectedBlog.featured ? <span style={{ background: COLORS.goldBadge, color: "#3D2817", padding: "4px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}><FaStar size={12} /> Featured</span> : "No" },
                { label: "Excerpt", value: selectedBlog.excerpt },
                { label: "Content", value: <div style={{ maxHeight: "300px", overflowY: "auto", background: COLORS.lightGray, padding: "16px", borderRadius: "8px", fontSize: "14px", lineHeight: "1.8" }}><div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} style={{ color: COLORS.textGray }} /></div> },
                { label: "Published At", value: selectedBlog.publishedAt ? new Date(selectedBlog.publishedAt).toLocaleDateString() : "N/A" },
                { label: "Last Updated", value: selectedBlog.updatedAt ? new Date(selectedBlog.updatedAt).toLocaleDateString() : "N/A" },
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

export default AdminBlogs;