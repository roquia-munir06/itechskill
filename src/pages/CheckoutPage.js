import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  FiCheckCircle, FiUpload, FiCopy, FiChevronDown, FiChevronUp,
  FiShield, FiClock, FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { loginUser, registerUser, submitOrder } from "../api/api";




const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .co-page { font-family: 'Outfit', sans-serif; background: #f4f4f6; min-height: 100vh; color: #1a1228; }

  .co-header { background: #fff; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 100; }
  .co-header-inner { max-width: 1120px; margin: 0 auto; padding: 0 32px; height: 60px; display: flex; align-items: center; gap: 12px; }
  .co-brand { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; background: linear-gradient(135deg,#22013a,#7c1abd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .co-header-title { font-size: 0.9rem; font-weight: 600; color: #6b7280; flex: 1; }
  .co-user-pill { display: flex; align-items: center; gap: 5px; background: #f3e8ff; color: #7c3aed; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; white-space: nowrap; }
  .co-back-btn { background: none; border: 1px solid #e5e7eb; border-radius: 8px; padding: 7px 14px; font-size: 0.82rem; font-weight: 600; color: #7c3aed; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; white-space: nowrap; }
  .co-back-btn:hover { border-color: #7c3aed; background: #faf8ff; }

  .co-progress-bar { height: 3px; background: #e5e7eb; position: sticky; top: 60px; z-index: 99; }
  .co-progress-fill { height: 100%; background: linear-gradient(90deg,#22013a,#7c1abd); transition: width 0.5s ease; }

  .co-body { max-width: 1120px; margin: 0 auto; padding: 28px 32px 80px; display: grid; grid-template-columns: 1fr 340px; gap: 28px; align-items: start; }
  .co-left { display: flex; flex-direction: column; gap: 14px; }

  .co-card { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; transition: box-shadow 0.2s, opacity 0.2s; }
  .co-card:hover { box-shadow: 0 2px 18px rgba(0,0,0,0.06); }
  .co-card-locked { opacity: 0.4; pointer-events: none; filter: grayscale(0.3); }
  .co-card-animate { animation: fadeSlideIn 0.25s ease; }
  @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

  .co-card-head { display: flex; align-items: flex-start; gap: 14px; padding: 18px 20px 0; }
  .co-card-body { padding: 14px 20px 20px; }
  .co-step-badge { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 800; flex-shrink: 0; margin-top: 2px; transition: all 0.3s; }
  .co-card-title { font-size: 0.95rem; font-weight: 700; color: #1a1228; line-height: 1.3; margin-bottom: 2px; }
  .co-card-subtitle { font-size: 0.78rem; color: #9ca3af; }

  /* Auth */
  .co-auth-tabs { display: flex; margin-bottom: 16px; border: 1.5px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
  .co-auth-tab { flex: 1; padding: 11px; border: none; background: #f9fafb; font-family: 'Outfit', sans-serif; font-size: 0.85rem; font-weight: 700; color: #6b7280; cursor: pointer; transition: all 0.2s; }
  .co-auth-tab.active { background: linear-gradient(135deg,#22013a,#7c1abd); color: #fff; }

  .co-auth-form { display: flex; flex-direction: column; gap: 10px; }
  .co-field-wrap { position: relative; display: flex; align-items: center; }
  .co-field-icon { position: absolute; left: 12px; color: #9b8db0; display: flex; align-items: center; pointer-events: none; z-index: 1; }
  .co-field-input { width: 100%; padding: 11px 40px 11px 38px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 0.88rem; font-family: 'Outfit', sans-serif; color: #1a1228; background: #fff; outline: none; transition: border-color 0.2s; }
  .co-field-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }
  .co-field-input::placeholder { color: #c4b5d8; }
  .co-field-right { position: absolute; right: 10px; display: flex; align-items: center; }
  .co-eye-btn { background: none; border: none; cursor: pointer; color: #9b8db0; display: flex; align-items: center; padding: 4px; }
  .co-eye-btn:hover { color: #7c3aed; }
  .co-auth-error { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-size: 0.8rem; padding: 9px 12px; font-weight: 500; }
  .co-auth-submit { width: 100%; padding: 13px; border-radius: 10px; border: none; background: linear-gradient(135deg,#22013a,#7c1abd); color: #fff; font-size: 0.9rem; font-weight: 800; cursor: pointer; font-family: 'Outfit', sans-serif; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px; transition: all 0.2s; box-shadow: 0 3px 12px rgba(124,26,189,0.25); }
  .co-auth-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(124,26,189,0.35); }
  .co-auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .co-logged-in-box { display: flex; align-items: center; gap: 12px; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 12px 16px; }
  .co-logged-in-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg,#22013a,#7c1abd); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; flex-shrink: 0; }
  .co-logged-in-name { font-size: 0.88rem; font-weight: 700; color: #166534; }
  .co-logged-in-email { font-size: 0.75rem; color: #15803d; margin-top: 1px; }
  .co-logout-btn { margin-left: auto; background: none; border: 1px solid #86efac; border-radius: 6px; color: #166534; font-size: 0.75rem; font-weight: 600; padding: 5px 10px; cursor: pointer; font-family: 'Outfit', sans-serif; white-space: nowrap; }
  .co-logout-btn:hover { background: #dcfce7; }

  .co-methods-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .co-method-btn { padding: 14px 10px 12px; border-radius: 10px; border: 1.5px solid #e5e7eb; background: #fff; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.18s; font-family: 'Outfit', sans-serif; position: relative; }
  .co-method-btn:hover { border-color: #c4b5fd; background: #faf8ff; }
  .co-method-label { font-size: 0.72rem; font-weight: 700; color: #374151; }
  .co-method-check { position: absolute; top: 7px; right: 7px; width: 17px; height: 17px; border-radius: 50%; color: #fff; font-size: 0.6rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }

  .co-details-box { border: 1.5px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin-bottom: 12px; background: #fafafa; }
  .co-detail-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; border-bottom: 1px solid #f3f4f6; }
  .co-detail-row:last-child { border-bottom: none; }
  .co-detail-label { font-size: 0.77rem; color: #6b7280; font-weight: 500; }
  .co-detail-val-wrap { display: flex; align-items: center; gap: 8px; }
  .co-detail-val { font-size: 0.85rem; font-weight: 700; color: #1a1228; }
  .co-copy-btn { display: flex; align-items: center; gap: 4px; background: #f3f4f6; border: none; cursor: pointer; padding: 4px 9px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; color: #6b7280; font-family: 'Outfit', sans-serif; transition: all 0.18s; }
  .co-copy-btn:hover { background: #e9d5ff; color: #7c3aed; }
  .co-amount-chip { display: inline-flex; align-items: center; gap: 7px; color: #fff; font-size: 0.85rem; font-weight: 700; padding: 9px 18px; border-radius: 8px; margin-bottom: 10px; }
  .co-details-note { font-size: 0.75rem; color: #b45309; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 7px; padding: 9px 12px; line-height: 1.5; }

  .co-proof-tabs { display: flex; gap: 10px; margin-bottom: 14px; }
  .co-proof-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 11px 14px; border-radius: 10px; border: 1.5px solid #e5e7eb; background: #f9fafb; font-family: 'Outfit', sans-serif; font-size: 0.82rem; font-weight: 700; color: #6b7280; cursor: pointer; transition: all 0.18s; }
  .co-proof-tab:hover { border-color: #c4b5fd; background: #faf8ff; color: #7c3aed; }
  .co-proof-tab.active { border-color: #7c3aed; background: #faf5ff; color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
  .co-proof-tab-wa:hover { border-color: #25d366; background: #f0fdf4; color: #16a34a; }
  .co-proof-tab-wa.active-wa { border-color: #25d366; background: #f0fdf4; color: #16a34a; box-shadow: 0 0 0 3px rgba(37,211,102,0.12); }

  .co-wa-box { border: 1.5px solid #bbf7d0; border-radius: 10px; background: #f0fdf4; padding: 20px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
  .co-wa-icon { width: 56px; height: 56px; border-radius: 50%; background: #dcfce7; display: flex; align-items: center; justify-content: center; }
  .co-wa-title { font-size: 0.92rem; font-weight: 800; color: #166534; }
  .co-wa-desc { font-size: 0.78rem; color: #15803d; line-height: 1.6; max-width: 340px; }
  .co-wa-number { font-size: 0.9rem; font-weight: 700; color: #14532d; background: #bbf7d0; padding: 6px 16px; border-radius: 20px; }

  .co-upload-zone { display: block; border: 2px dashed #d8d0f0; border-radius: 10px; cursor: pointer; transition: all 0.2s; margin-bottom: 12px; overflow: hidden; }
  .co-upload-zone:hover { border-color: #7c3aed; background: #faf8ff; }
  .co-upload-zone.has-preview { border-style: solid; border-color: #059669; }
  .co-upload-inner { display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 28px 20px; }
  .co-upload-icon-wrap { width: 44px; height: 44px; border-radius: 10px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #9ca3af; }
  .co-upload-text { font-size: 0.85rem; font-weight: 600; color: #4b3f6b; }
  .co-upload-hint { font-size: 0.72rem; color: #c4b5d8; }
  .co-preview-wrap { position: relative; }
  .co-preview-img { width: 100%; max-height: 210px; object-fit: contain; display: block; border-radius: 8px; }
  .co-preview-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: #fff; font-size: 0.8rem; font-weight: 600; opacity: 0; transition: opacity 0.2s; border-radius: 8px; }
  .co-upload-zone:hover .co-preview-overlay { opacity: 1; }

  .co-input { width: 100%; padding: 11px 14px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 0.88rem; font-family: 'Outfit', sans-serif; color: #1a1228; background: #fff; outline: none; transition: border-color 0.2s; }
  .co-input:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.08); }
  .co-input::placeholder { color: #c4b5d8; }

  .co-checkbox-label { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; margin-bottom: 16px; }
  .co-checkbox { width: 16px; height: 16px; margin-top: 2px; accent-color: #7c3aed; flex-shrink: 0; cursor: pointer; }
  .co-checkbox-text { font-size: 0.82rem; color: #4b3f6b; line-height: 1.55; }
  .co-link { color: #7c3aed; text-decoration: underline; text-underline-offset: 2px; }

  .co-error { display: flex; align-items: center; gap: 8px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-size: 0.82rem; padding: 10px 14px; margin-bottom: 12px; }

  .co-submit-btn { width: 100%; padding: 14px; border-radius: 10px; border: none; background: linear-gradient(135deg,#22013a,#7c1abd); color: #fff; font-size: 0.95rem; font-weight: 800; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.2s; box-shadow: 0 3px 14px rgba(124,26,189,0.28); display: flex; align-items: center; justify-content: center; gap: 8px; }
  .co-submit-btn:hover:not(.disabled) { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(124,26,189,0.38); }
  .co-submit-btn.disabled { opacity: 0.45; cursor: not-allowed; }
  .co-submit-btn.loading { pointer-events: none; }
  .co-submit-btn.co-submit-wa { background: linear-gradient(135deg,#128C7E,#25d366); box-shadow: 0 3px 14px rgba(37,211,102,0.3); }
  .co-submit-btn.co-submit-wa:hover:not(.disabled) { box-shadow: 0 6px 22px rgba(37,211,102,0.45); }

  .co-spinner { width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid rgba(255,255,255,0.35); border-top-color: #fff; animation: co-spin 0.65s linear infinite; display: inline-block; }
  @keyframes co-spin { to { transform: rotate(360deg); } }

  .co-trust-row { display: flex; gap: 20px; justify-content: center; margin-top: 12px; font-size: 0.73rem; color: #9b8db0; font-weight: 500; }
  .co-trust-row span { display: flex; align-items: center; gap: 4px; }

  .co-summary { background: #fff; border-radius: 14px; border: 1px solid #e5e7eb; position: sticky; top: 84px; overflow: hidden; }
  .co-summary-toggle { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; cursor: pointer; border: none; background: none; width: 100%; font-family: 'Outfit', sans-serif; }
  .co-summary-title { display: flex; align-items: center; gap: 8px; font-family: 'Playfair Display', serif; font-size: 0.95rem; font-weight: 700; color: #1a1228; }
  .co-summary-count { font-family: 'Outfit', sans-serif; font-size: 0.72rem; font-weight: 600; color: #7c3aed; background: #f3e8ff; padding: 2px 8px; border-radius: 20px; }
  .co-summary-items { display: flex; flex-direction: column; gap: 12px; padding: 0 18px 14px; }
  .co-summary-item { display: flex; align-items: flex-start; gap: 10px; }
  .co-thumb { width: 52px; height: 38px; border-radius: 6px; overflow: hidden; background: linear-gradient(135deg,#22013a,#5c3600); flex-shrink: 0; }
  .co-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .co-thumb-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
  .co-summary-item-info { flex: 1; min-width: 0; }
  .co-summary-item-title { font-size: 0.77rem; font-weight: 700; color: #1a1228; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .co-summary-item-instructor { font-size: 0.68rem; color: #9b8db0; margin-top: 2px; }
  .co-summary-item-price { font-size: 0.8rem; font-weight: 700; color: #1a1228; flex-shrink: 0; }
  .co-divider { height: 1px; background: #f3f4f6; margin: 8px 18px; }
  .co-price-row { display: flex; justify-content: space-between; padding: 4px 18px; margin-bottom: 2px; }
  .co-price-label { font-size: 0.8rem; color: #6b7280; }
  .co-price-val { font-size: 0.85rem; font-weight: 600; color: #1a1228; }
  .co-discount-val { font-size: 0.8rem; font-weight: 600; color: #059669; }
  .co-total-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 18px 14px; }
  .co-total-label { font-size: 0.88rem; font-weight: 700; color: #1a1228; }
  .co-total-val { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #1a1228; }
  .co-secure-badge { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 18px; border-top: 1px solid #f3f4f6; font-size: 0.72rem; color: #9b8db0; font-weight: 500; background: #fafafa; }

  .co-success-bg { min-height: 100vh; background: #f4f4f6; display: flex; align-items: center; justify-content: center; padding: 40px 20px; font-family: 'Outfit', sans-serif; }
  .co-success-card { background: #fff; border-radius: 18px; padding: 44px 40px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 10px 50px rgba(26,18,40,0.10); border: 1px solid #ede9f8; }
  .co-success-ring { width: 80px; height: 80px; border-radius: 50%; background: #d1fae5; color: #059669; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 0 10px #ecfdf5; }
  .co-success-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: #1a1228; margin-bottom: 14px; }
  .co-success-body { font-size: 0.88rem; color: #6b7280; line-height: 1.7; margin-bottom: 20px; }
  .co-success-meta { display: flex; gap: 20px; justify-content: center; font-size: 0.76rem; color: #9b8db0; font-weight: 500; margin-bottom: 26px; }
  .co-success-meta span { display: flex; align-items: center; gap: 5px; }
  .co-success-btn { padding: 14px 32px; border-radius: 10px; border: none; background: linear-gradient(135deg,#22013a,#7c1abd); color: #fff; font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'Outfit', sans-serif; box-shadow: 0 4px 18px rgba(124,26,189,0.28); transition: all 0.2s; }
  .co-success-btn:hover { transform: translateY(-1px); }

  @media (max-width: 900px) {
    .co-body { grid-template-columns: 1fr; padding: 20px 16px 60px; }
    .co-summary { position: static; }
    .co-header-inner { padding: 0 16px; }
  }
  @media (max-width: 500px) {
    .co-methods-row { grid-template-columns: 1fr; }
    .co-success-card { padding: 32px 24px; }
    .co-proof-tabs { flex-direction: column; }
  }
`;






// ── Token helpers ─────────────────────────────────────────────────────────────
const getToken = () => {
  try {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      JSON.parse(localStorage.getItem("userInfo") || "null")?.token ||
      null
    );
  } catch {
    return localStorage.getItem("token") || null;
  }
};

const getUser = () => {
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveAuth = (data) => {
  if (data.token) localStorage.setItem("token", data.token);
  if (data.token) localStorage.setItem("authToken", data.token);
  const userInfo = data.user || data;
  localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, token: data.token }));
};

// ── Brand logos ───────────────────────────────────────────────────────────────
const JazzCashLogo = () => (
  <svg width="56" height="28" viewBox="0 0 56 28" fill="none">
    <rect width="56" height="28" rx="5" fill="#CC0000"/>
    <text x="28" y="11" textAnchor="middle" fill="white" fontSize="6" fontWeight="800" fontFamily="Arial,sans-serif">JAZZ</text>
    <text x="28" y="22" textAnchor="middle" fill="#FFD700" fontSize="8" fontWeight="900" fontFamily="Arial,sans-serif">Cash</text>
  </svg>
);
const EasypaisaLogo = () => (
  <svg width="56" height="28" viewBox="0 0 56 28" fill="none">
    <rect width="56" height="28" rx="5" fill="#00A550"/>
    <circle cx="12" cy="14" r="7" fill="#FFD700"/>
    <text x="12" y="18" textAnchor="middle" fill="#00A550" fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif">e</text>
    <text x="36" y="11" textAnchor="middle" fill="white" fontSize="5.5" fontWeight="800" fontFamily="Arial,sans-serif">easy</text>
    <text x="36" y="21" textAnchor="middle" fill="#FFD700" fontSize="6.5" fontWeight="900" fontFamily="Arial,sans-serif">paisa</text>
  </svg>
);
const HBLLogo = () => (
  <svg width="56" height="28" viewBox="0 0 56 28" fill="none">
    <rect width="56" height="28" rx="5" fill="#003087"/>
    <text x="28" y="12" textAnchor="middle" fill="white" fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="2">HBL</text>
    <text x="28" y="22" textAnchor="middle" fill="#C8A84B" fontSize="5" fontWeight="600" fontFamily="Arial,sans-serif" letterSpacing="0.5">BANK</text>
  </svg>
);

const PAYMENT_METHODS = [
  {
    id: "JazzCash", label: "JazzCash", accentColor: "#CC0000", bgLight: "#fff5f5", Logo: JazzCashLogo,
    details: [{ label: "Account Number", value: "03445004983" }, { label: "Account Name", value: "Muhammad Altaf Khan" }],
  },
  {
    id: "Easypaisa", label: "Easypaisa", accentColor: "#00A550", bgLight: "#f0fdf4", Logo: EasypaisaLogo,
    details: [{ label: "Account Number", value: "03445004983" }, { label: "Account Name", value: "Muhammad Altaf Khan" }],
  },
  {
    id: "BankTransfer", label: "Bank Transfer", accentColor: "#003087", bgLight: "#eff6ff", Logo: HBLLogo,
    details: [
      { label: "Bank Name",     value: "Meezan Bank" },
      { label: "Account No",   value: "03120111697815" },
            { label: "Account Name", value: "Arte Analytics" },
    ],
  },
];

const WHATSAPP_NUMBER = "923485896082";

// ── Step badge ────────────────────────────────────────────────────────────────
const StepBadge = ({ number, active, done }) => (
  <div className="co-step-badge" style={
    done   ? { background: "#059669", color: "#fff" } :
    active ? { background: "linear-gradient(135deg,#22013a,#7c1abd)", color: "#fcd34d" } :
             { background: "#f3f4f6", color: "#9ca3af" }
  }>
    {done ? "✓" : number}
  </div>
);

// ── Input field ───────────────────────────────────────────────────────────────
const Field = ({ icon, type = "text", placeholder, value, onChange, rightEl }) => (
  <div className="co-field-wrap">
    <span className="co-field-icon">{icon}</span>
    <input
      className="co-field-input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete="off"
    />
    {rightEl && <span className="co-field-right">{rightEl}</span>}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartOriginalTotal, clearCart } = useCart();

  // ── Auth state ─────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(getUser);
  const [authTab,     setAuthTab]     = useState("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError,   setAuthError]   = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [showPass2,   setShowPass2]   = useState(false);
  const [loginForm,   setLoginForm]   = useState({ email: "", password: "" });
  const [regForm,     setRegForm]     = useState({ name: "", email: "", phone: "", password: "", confirm: "" });

  // ── Checkout state ─────────────────────────────────────────────────────────
  const [selectedMethod,    setSelectedMethod]    = useState(null);
  const [transactionId,     setTransactionId]     = useState("");
  const [screenshot,        setScreenshot]        = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [agreed,            setAgreed]            = useState(false);
  const [submitting,        setSubmitting]        = useState(false);
  const [success,           setSuccess]           = useState(false);
  const [error,             setError]             = useState("");
  const [copiedKey,         setCopiedKey]         = useState(null);
  const [summaryOpen,       setSummaryOpen]       = useState(true);
  const [proofMode,         setProofMode]         = useState("upload");

  const isLoggedIn      = !!currentUser;
  const discountPercent = cartOriginalTotal > 0
    ? Math.round((1 - cartTotal / cartOriginalTotal) * 100) : 0;

  // step unlock logic
  const stepTwoActive   = isLoggedIn;
  const stepThreeActive = isLoggedIn && !!selectedMethod;
  const stepFourActive  = isLoggedIn && !!selectedMethod && (proofMode === "whatsapp" || !!screenshot);

  // progress %
  const progressPct = !isLoggedIn ? 10 : !selectedMethod ? 30 : (!screenshot && proofMode === "upload") ? 60 : !agreed ? 80 : 100;

  // ── Auth handlers ──────────────────────────────────────────────────────────
const handleLogin = async (e) => {
  e.preventDefault();
  setAuthError("");
  if (!loginForm.email || !loginForm.password)
    return setAuthError("Please fill in all fields.");
  setAuthLoading(true);
  try {
    const data = await loginUser({
      email: loginForm.email,
      password: loginForm.password,
    });
    saveAuth(data);
    setCurrentUser(data.user || data);
  } catch (err) {
    setAuthError(err.response?.data?.message || err.message || "Login failed.");
  } finally {
    setAuthLoading(false);
  }
};

const handleRegister = async (e) => {
  e.preventDefault();
  setAuthError("");
  if (!regForm.name || !regForm.email || !regForm.password || !regForm.confirm)
    return setAuthError("Please fill in all required fields.");
  if (regForm.password !== regForm.confirm)
    return setAuthError("Passwords do not match.");
  if (regForm.password.length < 6)
    return setAuthError("Password must be at least 6 characters.");
  setAuthLoading(true);
  try {
    const data = await registerUser({
      fullName: regForm.name,         // ← was "name", backend wants "fullName"
      email: regForm.email,
      phone: regForm.phone,
      password: regForm.password,
      confirmPassword: regForm.confirm, // ← was missing, backend requires it
    });
    saveAuth(data);
    setCurrentUser(data.user || data);
  } catch (err) {
    setAuthError(err.response?.data?.message || err.message || "Registration failed.");
  } finally {
    setAuthLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    setCurrentUser(null);
    setSelectedMethod(null);
    setScreenshot(null);
    setScreenshotPreview(null);
    setAgreed(false);
  };

  // ── Checkout handlers ──────────────────────────────────────────────────────
  const handleCopy = (value, key) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleScreenshot = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError("Screenshot must be under 5MB.");
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
    setError("");
  };

  const buildWAMessage = () => {
    const courseList = cartItems.map(c => `• ${c.title}`).join("\n");
    return encodeURIComponent(
      `Hi ITechSkill! 👋\n\nI have made payment for:\n${courseList}\n\nPayment Method: ${selectedMethod || "—"}\nTotal: $${cartTotal}\nName: ${currentUser?.name || "—"}\n\nPlease find my payment screenshot attached.`
    );
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  if (!selectedMethod) return setError("Please select a payment method.");

  if (proofMode === "whatsapp") {
    if (!agreed) return setError("Please confirm and agree to the terms.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWAMessage()}`, "_blank");
    clearCart();
    setSuccess(true);
    return;
  }

  if (!screenshot) return setError("Please upload your payment screenshot.");
  if (!agreed)     return setError("Please confirm and agree to the terms.");

  setSubmitting(true);
  try {
    const formData = new FormData();
    formData.append("screenshot",    screenshot);
    formData.append("paymentMethod", selectedMethod);
    formData.append("transactionId", transactionId);
    formData.append("totalAmount",   `$${cartTotal}`);
    formData.append("courses", JSON.stringify(
      cartItems.map(c => ({
        _id:       c._id,
        courseRef: c.courseRef || "",
        title:     c.title,
        price:     c.price,
        thumbnail: c.thumbnail || "",
      }))
    ));

    await submitOrder(formData); // ✅ uses Axios with x-device-id header
    clearCart();
    setSuccess(true);
  } catch (err) {
    setError(err.response?.data?.message || err.message || "Something went wrong");
  } finally {
    setSubmitting(false);
  }
};

  // ── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <>
        <style>{CSS}</style>
        <div className="co-success-bg">
          <div className="co-success-card">
            <div className="co-success-ring"><FiCheckCircle size={40} strokeWidth={1.5} /></div>
            <h1 className="co-success-title">Order Submitted!</h1>
            <p className="co-success-body">
              {proofMode === "whatsapp"
                ? "WhatsApp has opened with your order details. Please attach your payment screenshot and send it. Our team will activate your enrollment once verified."
                : "Your payment proof has been received. You'll get confirmation once your enrollment is approved — usually within a few hours."
              }
            </p>
            <div className="co-success-meta">
              <span><FiClock size={13} /> Reviewed within a few hours</span>
              <span><FiShield size={13} /> Verified by ITechSkill</span>
            </div>
            <button className="co-success-btn" onClick={() => navigate("/student/dashboard")}>
              Go to Dashboard →
            </button>
          </div>
        </div>
      </>
    );
  }

  const activeMethod = PAYMENT_METHODS.find(m => m.id === selectedMethod);

  return (
    <>
      <style>{CSS}</style>
      <div className="co-page">

        {/* ── Header ── */}
        <header className="co-header">
          <div className="co-header-inner">
            <span className="co-brand">ITechSkill</span>
            <span className="co-header-title">Checkout</span>
            {isLoggedIn && (
              <span className="co-user-pill">
                <FiUser size={12} /> {currentUser?.name || currentUser?.email}
              </span>
            )}
            <button className="co-back-btn" onClick={() => navigate("/cart")}>← Back to Cart</button>
          </div>
        </header>

        {/* ── Progress bar ── */}
        <div className="co-progress-bar">
          <div className="co-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="co-body">
          <div className="co-left">

            {/* ══ STEP 1 — Account ══ */}
            <div className="co-card">
              <div className="co-card-head">
                <StepBadge number="1" active={!isLoggedIn} done={isLoggedIn} />
                <div>
                  <h2 className="co-card-title">
                    {isLoggedIn ? `Signed in as ${currentUser?.name || currentUser?.email}` : "Sign In or Create Account"}
                  </h2>
                  <p className="co-card-subtitle">
                    {isLoggedIn ? "You're all set — proceed to payment below" : "Required to complete your order"}
                  </p>
                </div>
              </div>

              {isLoggedIn ? (
                <div className="co-card-body">
                  <div className="co-logged-in-box">
                    <div className="co-logged-in-avatar">
                      {(currentUser?.name || currentUser?.email || "U")[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="co-logged-in-name">{currentUser?.name}</div>
                      <div className="co-logged-in-email">{currentUser?.email}</div>
                    </div>
                    <button className="co-logout-btn" onClick={handleLogout}>Sign out</button>
                  </div>
                </div>
              ) : (
                <div className="co-card-body">
                  <div className="co-auth-tabs">
                    <button className={`co-auth-tab ${authTab === "login" ? "active" : ""}`}
                      onClick={() => { setAuthTab("login"); setAuthError(""); }}>
                      Sign In
                    </button>
                    <button className={`co-auth-tab ${authTab === "register" ? "active" : ""}`}
                      onClick={() => { setAuthTab("register"); setAuthError(""); }}>
                      Create Account
                    </button>
                  </div>

                  {authTab === "login" && (
                    <form onSubmit={handleLogin} className="co-auth-form">
                      <Field icon={<FiMail size={15}/>} type="email" placeholder="Email address"
                        value={loginForm.email} onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} />
                      <Field icon={<FiLock size={15}/>} type={showPass ? "text" : "password"} placeholder="Password"
                        value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                        rightEl={<button type="button" className="co-eye-btn" onClick={() => setShowPass(p => !p)}>
                          {showPass ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
                        </button>} />
                      {authError && <div className="co-auth-error">⚠️ {authError}</div>}
                      <button type="submit" className="co-auth-submit" disabled={authLoading}>
                        {authLoading ? <><span className="co-spinner"/> Signing in…</> : "Sign In & Continue →"}
                      </button>
                    </form>
                  )}

                  {authTab === "register" && (
                    <form onSubmit={handleRegister} className="co-auth-form">
                      <Field icon={<FiUser size={15}/>} placeholder="Full name"
                        value={regForm.name} onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))} />
                      <Field icon={<FiMail size={15}/>} type="email" placeholder="Email address"
                        value={regForm.email} onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))} />
                      <Field icon={<FiPhone size={15}/>} placeholder="Phone number (optional)"
                        value={regForm.phone} onChange={e => setRegForm(p => ({ ...p, phone: e.target.value }))} />
                      <Field icon={<FiLock size={15}/>} type={showPass ? "text" : "password"} placeholder="Password"
                        value={regForm.password} onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                        rightEl={<button type="button" className="co-eye-btn" onClick={() => setShowPass(p => !p)}>
                          {showPass ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
                        </button>} />
                      <Field icon={<FiLock size={15}/>} type={showPass2 ? "text" : "password"} placeholder="Confirm password"
                        value={regForm.confirm} onChange={e => setRegForm(p => ({ ...p, confirm: e.target.value }))}
                        rightEl={<button type="button" className="co-eye-btn" onClick={() => setShowPass2(p => !p)}>
                          {showPass2 ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
                        </button>} />
                      {authError && <div className="co-auth-error">⚠️ {authError}</div>}
                      <button type="submit" className="co-auth-submit" disabled={authLoading}>
                        {authLoading ? <><span className="co-spinner"/> Creating account…</> : "Create Account & Continue →"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* ══ STEP 2 — Choose Payment Method ══ */}
            <div className={`co-card ${!stepTwoActive ? "co-card-locked" : ""}`}>
              <div className="co-card-head">
                <StepBadge number="2" active={stepTwoActive && !selectedMethod} done={!!selectedMethod} />
                <div>
                  <h2 className="co-card-title">Choose Payment Method</h2>
                  <p className="co-card-subtitle">{!stepTwoActive ? "Sign in first to continue" : "Select how you'd like to pay"}</p>
                </div>
              </div>
              <div className="co-card-body">
                <div className="co-methods-row">
                  {PAYMENT_METHODS.map(m => {
                    const sel = selectedMethod === m.id;
                    return (
                      <button key={m.id} className={`co-method-btn ${sel ? "selected" : ""}`}
                        style={sel ? { borderColor: m.accentColor, background: m.bgLight, boxShadow: `0 0 0 3px ${m.accentColor}22` } : {}}
                        onClick={() => { setSelectedMethod(m.id); setError(""); }}>
                        <m.Logo />
                        <span className="co-method-label">{m.label}</span>
                        {sel && <span className="co-method-check" style={{ background: m.accentColor }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Payment details (shows when method selected) */}
            {activeMethod && (
              <div className="co-card co-card-animate">
                <div className="co-card-head">
                  <StepBadge number="2" done />
                  <div>
                    <h2 className="co-card-title">
                      Send <span style={{ color: activeMethod.accentColor }}>${cartTotal}</span> via {activeMethod.label}
                    </h2>
                    <p className="co-card-subtitle">Copy the details and complete your transfer</p>
                  </div>
                </div>
                <div className="co-card-body">
                  <div className="co-details-box" style={{ borderColor: activeMethod.accentColor + "40" }}>
                    {activeMethod.details.map((d, i) => {
                      const copyKey = `${activeMethod.id}-${i}`;
                      return (
                        <div key={i} className="co-detail-row">
                          <span className="co-detail-label">{d.label}</span>
                          <div className="co-detail-val-wrap">
                            <span className="co-detail-val">{d.value}</span>
                            <button className="co-copy-btn"
                              onClick={() => handleCopy(d.value, copyKey)}
                              style={copiedKey === copyKey ? { color: "#059669", background: "#d1fae5" } : {}}>
                              {copiedKey === copyKey ? <><span>✓</span> Copied</> : <><FiCopy size={11}/> Copy</>}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="co-amount-chip" style={{ background: activeMethod.accentColor }}>
                    💳 Send exactly: <strong>${cartTotal}</strong>
                  </div>
                  <p className="co-details-note">
                    ⚠️ Sending a different amount may delay verification. Include your name or phone in the transfer note.
                  </p>
                </div>
              </div>
            )}

            {/* ══ STEP 3 — Send Proof ══ */}
            <div className={`co-card ${!stepThreeActive ? "co-card-locked" : ""}`}>
              <div className="co-card-head">
                <StepBadge number="3" active={stepThreeActive} done={stepFourActive} />
                <div>
                  <h2 className="co-card-title">Send Payment Proof</h2>
                  <p className="co-card-subtitle">
                    {!stepTwoActive ? "Sign in first" : !stepThreeActive ? "Select a payment method first" : "Choose how to send your screenshot"}
                  </p>
                </div>
              </div>
              <div className="co-card-body">
                <div className="co-proof-tabs">
                  <button className={`co-proof-tab ${proofMode === "upload" ? "active" : ""}`}
                    onClick={() => { setProofMode("upload"); setError(""); }}>
                    <FiUpload size={14}/> Upload Here
                  </button>
                  <button className={`co-proof-tab co-proof-tab-wa ${proofMode === "whatsapp" ? "active-wa" : ""}`}
                    onClick={() => { setProofMode("whatsapp"); setError(""); setScreenshot(null); setScreenshotPreview(null); }}>
                    <FaWhatsapp size={15}/> Send via WhatsApp
                  </button>
                </div>

                {proofMode === "upload" && (
                  <>
                    <label className={`co-upload-zone ${screenshotPreview ? "has-preview" : ""}`}>
                      <input type="file" accept="image/*" onChange={handleScreenshot} style={{ display: "none" }} />
                      {screenshotPreview ? (
                        <div className="co-preview-wrap">
                          <img src={screenshotPreview} alt="Payment proof" className="co-preview-img" />
                          <div className="co-preview-overlay"><FiUpload size={18}/><span>Change screenshot</span></div>
                        </div>
                      ) : (
                        <div className="co-upload-inner">
                          <div className="co-upload-icon-wrap"><FiUpload size={22}/></div>
                          <span className="co-upload-text">Click or drag to upload screenshot</span>
                          <span className="co-upload-hint">JPG, PNG — max 5 MB</span>
                        </div>
                      )}
                    </label>
                    <input className="co-input" placeholder="Transaction ID (optional but recommended)"
                      value={transactionId} onChange={e => setTransactionId(e.target.value)} />
                  </>
                )}

                {proofMode === "whatsapp" && (
                  <div className="co-wa-box">
                    <div className="co-wa-icon"><FaWhatsapp size={32} color="#25d366"/></div>
                    <p className="co-wa-title">We'll open WhatsApp for you</p>
                    <p className="co-wa-desc">
                      After confirming below and tapping <strong>Send via WhatsApp</strong>,
                      WhatsApp will open with your order details pre-filled.
                      Just attach your payment screenshot and hit send.
                    </p>
                    <div className="co-wa-number">📱 <strong>03309998880</strong></div>
                  </div>
                )}
              </div>
            </div>

            {/* ══ STEP 4 — Confirm & Submit ══ */}
            <div className={`co-card ${!stepFourActive ? "co-card-locked" : ""}`}>
              <div className="co-card-head">
                <StepBadge number="4" active={stepFourActive} />
                <div>
                  <h2 className="co-card-title">Confirm &amp; Submit</h2>
                  <p className="co-card-subtitle">Review and place your order</p>
                </div>
              </div>
              <div className="co-card-body">
                <label className="co-checkbox-label">
                  <input type="checkbox" checked={agreed}
                    onChange={e => { setAgreed(e.target.checked); setError(""); }} className="co-checkbox" />
                  <span className="co-checkbox-text">
                    I confirm I have sent the exact payment amount
                    {proofMode === "upload" ? " and the screenshot above is accurate" : " and I will send my screenshot on WhatsApp"}.
                    I agree to the <a href="#terms" className="co-link">Terms of Use</a>.
                  </span>
                </label>

                {error && <div className="co-error" role="alert"><span>⚠️</span> {error}</div>}

                <button
                  className={`co-submit-btn ${submitting ? "loading" : ""} ${!agreed ? "disabled" : ""} ${proofMode === "whatsapp" ? "co-submit-wa" : ""}`}
                  onClick={handleSubmit} disabled={!agreed || submitting}>
                  {submitting
                    ? <><span className="co-spinner"/> Processing…</>
                    : proofMode === "whatsapp"
                      ? <><FaWhatsapp size={18}/> Send via WhatsApp</>
                      : "Submit Order →"
                  }
                </button>

                <div className="co-trust-row">
                  <span><FiShield size={12}/> Admin-verified enrollment</span>
                  <span><FiClock size={12}/> Access within a few hours</span>
                </div>
              </div>
            </div>

          </div>

          {/* ══ Order Summary ══ */}
          <aside className="co-summary">
            <button className="co-summary-toggle" onClick={() => setSummaryOpen(o => !o)}>
              <span className="co-summary-title">
                Order Summary
                <span className="co-summary-count">{cartItems.length} {cartItems.length === 1 ? "course" : "courses"}</span>
              </span>
              {summaryOpen ? <FiChevronUp size={15}/> : <FiChevronDown size={15}/>}
            </button>
            {summaryOpen && (
              <>
                <div className="co-summary-items">
                  {cartItems.map(item => (
                    <div key={item._id} className="co-summary-item">
                      <div className="co-thumb">
                        {item.thumbnail ? <img src={item.thumbnail} alt={item.title}/> : <div className="co-thumb-fallback">📚</div>}
                      </div>
                      <div className="co-summary-item-info">
                        <p className="co-summary-item-title">{item.title}</p>
                        {item.instructor && <p className="co-summary-item-instructor">{item.instructor}</p>}
                      </div>
                      <span className="co-summary-item-price">${item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="co-divider"/>
                <div className="co-price-row">
                  <span className="co-price-label">Original price</span>
                  <span className="co-price-val">${cartOriginalTotal}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="co-price-row">
                    <span className="co-price-label">Discount</span>
                    <span className="co-discount-val">−{discountPercent}% off</span>
                  </div>
                )}
                <div className="co-divider"/>
                <div className="co-total-row">
                  <span className="co-total-label">Total</span>
                  <span className="co-total-val">${cartTotal}</span>
                </div>
              </>
            )}
            <div className="co-secure-badge"><FiShield size={13}/><span>Manually verified by ITechSkill</span></div>
          </aside>
        </div>
      </div>
    </>
  );
}
