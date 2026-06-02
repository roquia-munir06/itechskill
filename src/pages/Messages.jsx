import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUsersForMessaging,
  sendMessage,
  getMessages,
  markMessagesAsRead,
  clearChatMessages,
  deleteMessage,
} from "../api/api";
import socket from "../socket";
import Sidebar from "../components/Sidebar"; // handles all roles internally
import {
  FaSearch, FaTrash, FaPaperPlane, FaUserCircle, FaUsers,
  FaCommentDots, FaArrowLeft, FaCheckDouble, FaInfoCircle,
} from "react-icons/fa";

/* ─── Role colour tokens ─── */
const ROLE_THEME = {
  admin:   { primary: "#3D1A5B", accent: "#4B2D7A", highlight: "#00D9A3", msgBg: "#4B2D7A" },
  teacher: { primary: "#065f46", accent: "#047857", highlight: "#34d399", msgBg: "#047857" },
  manager: { primary: "#92400e", accent: "#b45309", highlight: "#fbbf24", msgBg: "#b45309" },
  student: { primary: "#1e3a5f", accent: "#1d4ed8", highlight: "#60a5fa", msgBg: "#1d4ed8" },
};

const COLORS = {
  white:     "#FFFFFF",
  bgGray:    "#F9FAFB",
  lightGray: "#F3F4F6",
  darkGray:  "#6B7280",
  textGray:  "#4B5563",
  roleBg:    "#E8DFF5",
  danger:    "#EF4444",
  info:      "#3B82F6",
  blueLight: "#dbeafe",
  typingBlue:"#3B82F6",
};

/* ─── Role label helper ─── */
const ROLE_LABEL = {
  admin:   "Admin",
  teacher: "Teacher",
  manager: "Manager",
  student: "Student",
};

const Messages = () => {
  const { user } = useAuth();
  const role     = (user?.role || "student").toLowerCase();
  const theme    = ROLE_THEME[role] || ROLE_THEME.admin;

  const [contacts,          setContacts]          = useState([]);
  const [selectedId,        setSelectedId]        = useState(null);
  const [selectedName,      setSelectedName]      = useState("");
  const [messages,          setMessages]          = useState([]);
  const [selectedMessages,  setSelectedMessages]  = useState([]);
  const [text,              setText]              = useState("");
  const [loading,           setLoading]           = useState(false);
  const [searchQuery,       setSearchQuery]       = useState("");
  const [isMobile,          setIsMobile]          = useState(window.innerWidth <= 768);
  const [showChatList,      setShowChatList]      = useState(true);
  const [typingStatus,      setTypingStatus]      = useState({});
  const messagesEndRef = useRef(null);
  const currentUserId  = user?._id || user?.id;

  /* ── responsive ── */
  useEffect(() => {
    const onResize = () => {
      const m = window.innerWidth <= 768;
      setIsMobile(m);
      if (!m) setShowChatList(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── scroll to bottom ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── fetch contact list ── */
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await getUsersForMessaging();
      setContacts(data.users || []);
    } catch (err) {
      console.error("fetchContacts error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ── fetch messages with selected user ── */
  const fetchMessages = async (userId) => {
    try {
      setLoading(true);
      const data = await getMessages(userId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("fetchMessages error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  /* ── socket: join room ── */
  useEffect(() => {
    if (!currentUserId) return;
    if (!socket.connected) socket.connect();
    socket.emit("join", currentUserId);
    const onConnect = () => socket.emit("join", currentUserId);
    socket.on("connect", onConnect);
    return () => socket.off("connect", onConnect);
  }, [currentUserId]);

  /* ── socket: receive messages ── */
  useEffect(() => {
    const handleReceive = (message) => {
      const senderId   = message.senderId   || message.sender?._id   || message.sender;
      const receiverId = message.receiverId || message.receiver?._id || message.receiver;

      if (String(senderId) === String(currentUserId)) return; // ignore own echo

      if (
        (String(senderId) === String(selectedId) && String(receiverId) === String(currentUserId)) ||
        (String(senderId) === String(currentUserId) && String(receiverId) === String(selectedId))
      ) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === message._id);
          return exists ? prev : [...prev, message];
        });
      } else {
        setContacts((prev) => {
          const updated = prev.map((c) =>
            String(c._id) === String(senderId)
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessage: message.text, lastMessageTime: message.createdAt }
              : c
          );
          return updated.sort((a, b) => {
            if (!a.lastMessageTime) return 1;
            if (!b.lastMessageTime) return -1;
            return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
          });
        });
      }
    };

    const handleTyping = (data) => {
      if (String(data.userId) === String(selectedId)) {
        setTypingStatus((prev) => ({ ...prev, [selectedId]: data.isTyping }));
      }
    };

    socket.on("receive_message", handleReceive);
    socket.on("typing",          handleTyping);
    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("typing",          handleTyping);
    };
  }, [currentUserId, selectedId]);

  /* ── select a contact ── */
  const selectContact = async (contact) => {
    setSelectedId(contact._id);
    setSelectedName(contact.fullName || contact.email);
    setMessages([]);
    setSelectedMessages([]);
    fetchMessages(contact._id);

    try {
      await markMessagesAsRead(contact._id);
      setContacts((prev) =>
        prev.map((c) => (c._id === contact._id ? { ...c, unreadCount: 0 } : c))
      );
    } catch (_) {}

    if (isMobile) setShowChatList(false);
    setTypingStatus((prev) => ({ ...prev, [contact._id]: false }));
  };

  /* ── typing indicator ── */
  const emitTyping = (isTyping) => {
    if (selectedId) {
      socket.emit("typing", { userId: currentUserId, receiverId: selectedId, isTyping });
    }
  };

  /* ── send message ── */
  const handleSend = async () => {
    if (!text.trim() || !selectedId) return;

    const tempId = "temp_" + Date.now();
    const optimistic = {
      _id: tempId,
      sender:   { _id: currentUserId },
      receiver: { _id: selectedId },
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");
    emitTyping(false);

    try {
      const res = await sendMessage({ to: selectedId, text: optimistic.text });
      const msg = res.data || res;
      setMessages((prev) => prev.map((m) => (m._id === tempId ? msg : m)));

      socket.emit("send_message", {
        senderId:  String(msg.sender?._id  || msg.sender),
        receiverId: String(msg.receiver?._id || msg.receiver),
        text:      msg.text,
        _id:       msg._id,
        createdAt: msg.createdAt,
      });

      // update contact list preview
      setContacts((prev) => {
        const updated = prev.map((c) =>
          String(c._id) === String(selectedId)
            ? { ...c, lastMessage: msg.text, lastMessageTime: msg.createdAt }
            : c
        );
        return updated.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        });
      });
    } catch (err) {
      console.error("Send error:", err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      alert("Message send failed");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };
  const handleKeyUp = () => {
    emitTyping(true);
    setTimeout(() => emitTyping(false), 1000);
  };

  /* ── delete selected messages ── */
  const deleteSelectedMessages = async () => {
    if (!selectedMessages.length) return;
    if (!window.confirm("Delete selected messages?")) return;
    try {
      await Promise.all(selectedMessages.map((id) => deleteMessage(id)));
      setMessages((prev) => prev.filter((m) => !selectedMessages.includes(m._id)));
      setSelectedMessages([]);
    } catch { alert("Failed to delete messages"); }
  };

  /* ── clear chat ── */
  const clearChat = async () => {
    if (!selectedId) return;
    if (!window.confirm("Clear all messages? This cannot be undone.")) return;
    try {
      await clearChatMessages(selectedId);
      setMessages([]);
      setContacts((prev) =>
        prev.map((c) => (c._id === selectedId ? { ...c, lastMessage: null, lastMessageTime: null } : c))
      );
    } catch { alert("Failed to clear chat"); }
  };

  /* ── time formatters ── */
  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const formatDate = (d) => {
    const date = new Date(d), today = new Date(), yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString())     return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
  };

  const formatPreviewTime = (d) => {
    if (!d) return "";
    const date = new Date(d), now = new Date();
    const diffMins  = Math.floor((now - date) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays  = Math.floor(diffHours / 24);
    if (diffMins  <  1) return "Just now";
    if (diffMins  < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays  <  7) return `${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  /* ── group messages by date ── */
  const groupByDate = () => {
    const groups = {};
    messages.forEach((m) => {
      const key = new Date(m.createdAt).toDateString();
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return groups;
  };

  const filteredContacts  = contacts.filter((c) =>
    c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedContactObj = contacts.find((c) => c._id === selectedId);
  const messageGroups      = groupByDate();

  /* ─────────────── role badge colour per contact ─────────────── */
  const roleBadgeColor = (r) => {
    const rr = r?.toLowerCase();
    if (rr === "admin")   return { bg: "#ede9fe", color: "#5b21b6" };
    if (rr === "teacher") return { bg: "#d1fae5", color: "#065f46" };
    if (rr === "manager") return { bg: "#fef3c7", color: "#92400e" };
    return                       { bg: "#dbeafe", color: "#1e3a8a" };
  };

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */
  return (
    <div style={{ display: "flex", backgroundColor: COLORS.bgGray, minHeight: "100vh", overflow: "hidden" }}>
      {/* Sidebar handles role internally */}
      <Sidebar />

      <div style={{
        flex: 1,
        marginLeft: isMobile ? "0" : "280px",
        padding:    isMobile ? "80px 0 0 0" : "32px",
        height:     "100vh",
      }}>
        <div style={{
          display:      "flex",
          height:       isMobile ? "calc(100vh - 80px)" : "calc(100vh - 64px)",
          background:   COLORS.white,
          borderRadius: isMobile ? "0" : "12px",
          overflow:     "hidden",
          boxShadow:    isMobile ? "none" : "0 1px 3px rgba(0,0,0,0.1)",
        }}>

          {/* ══════════ CONTACT LIST PANEL ══════════ */}
          <div style={{
            width:      isMobile ? "100%" : "360px",
            height:     "100%",
            background: COLORS.white,
            borderRight:`1px solid ${COLORS.lightGray}`,
            display:    isMobile && !showChatList ? "none" : "flex",
            flexDirection: "column",
            position:   isMobile ? "absolute" : "relative",
            zIndex:     100,
          }}>
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
              padding:    isMobile ? "24px 20px 20px" : "28px 24px 24px",
              color:      COLORS.white,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div style={{
                  width: "50px", height: "50px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.2)", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: "22px",
                }}>
                  <FaCommentDots />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Messages</h2>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.85 }}>
                    {ROLE_LABEL[role]} · {contacts.length} contacts
                  </p>
                </div>
              </div>

              {/* Search */}
              <div style={{ position: "relative" }}>
                <FaSearch style={{
                  position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)", color: COLORS.white, opacity: 0.75,
                }} />
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 14px 12px 42px",
                    background: "rgba(255,255,255,0.15)", border: "none",
                    borderRadius: "10px", fontSize: "14px", outline: "none",
                    boxSizing: "border-box", color: COLORS.white,
                  }}
                />
              </div>
            </div>

            {/* Contact list */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {loading && contacts.length === 0 ? (
                <div style={{ padding: "60px 20px", textAlign: "center", color: COLORS.darkGray }}>
                  Loading contacts…
                </div>
              ) : filteredContacts.length === 0 ? (
                <div style={{ padding: "60px 20px", textAlign: "center", color: COLORS.darkGray }}>
                  <FaUsers style={{ fontSize: "48px", opacity: 0.3, marginBottom: "12px" }} />
                  <p style={{ margin: 0 }}>No contacts found</p>
                </div>
              ) : (
                filteredContacts.map((c) => {
                  const isSelected = selectedId === c._id;
                  const badge      = roleBadgeColor(c.role);
                  return (
                    <div
                      key={c._id}
                      onClick={() => selectContact(c)}
                      style={{
                        display:      "flex",
                        alignItems:   "center",
                        gap:          "12px",
                        padding:      "16px 20px",
                        cursor:       "pointer",
                        background:   isSelected
                          ? `linear-gradient(90deg, ${theme.primary}15 0%, ${theme.accent}10 100%)`
                          : COLORS.white,
                        borderBottom: `1px solid ${COLORS.lightGray}`,
                        borderLeft:   isSelected ? `4px solid ${theme.highlight}` : "4px solid transparent",
                        transition:   "all 0.2s ease",
                        position:     "relative",
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = COLORS.bgGray; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = COLORS.white;  }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: "46px", height: "46px", borderRadius: "12px", flexShrink: 0,
                        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: COLORS.white, fontWeight: "700", fontSize: "18px",
                        boxShadow: `0 4px 8px ${theme.primary}30`,
                      }}>
                        {(c.fullName || c.email || "?").charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontWeight: "600", fontSize: "14px", color: theme.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {c.fullName || c.email || "Unknown"}
                          </span>
                          <span style={{ fontSize: "11px", color: COLORS.darkGray, flexShrink: 0, marginLeft: "8px" }}>
                            {formatPreviewTime(c.lastMessageTime)}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{
                            background: badge.bg, color: badge.color,
                            padding: "2px 8px", borderRadius: "4px",
                            fontSize: "10px", fontWeight: "700", flexShrink: 0,
                          }}>
                            {c.role}
                          </span>
                          <span style={{
                            fontSize: "12px", color: COLORS.darkGray,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>
                            {c.lastMessage || "Start a conversation"}
                          </span>
                        </div>
                      </div>

                      {/* Unread badge */}
                      {c.unreadCount > 0 && (
                        <div style={{
                          background: theme.highlight, color: COLORS.white,
                          fontSize: "11px", fontWeight: "700",
                          padding: "3px 8px", borderRadius: "12px",
                          minWidth: "20px", height: "20px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {c.unreadCount}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: "14px 20px", borderTop: `1px solid ${COLORS.lightGray}`,
              background: COLORS.bgGray, display: "flex", alignItems: "center", gap: "8px",
              fontSize: "12px", color: COLORS.darkGray,
            }}>
              <FaInfoCircle size={11} />
              Logged in as <strong>{user?.fullName || user?.email}</strong> · {ROLE_LABEL[role]}
            </div>
          </div>

          {/* ══════════ CHAT AREA ══════════ */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            background: COLORS.white, height: "100%", overflow: "hidden",
          }}>
            {selectedId ? (
              <>
                {/* Chat Header */}
                <div style={{
                  background: "linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)",
                  padding:    isMobile ? "16px 20px" : "18px 24px",
                  display:    "flex", alignItems: "center", justifyContent: "space-between",
                  borderBottom: `1px solid ${COLORS.lightGray}`,
                  boxShadow:    "0 1px 3px rgba(0,0,0,0.05)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {isMobile && (
                      <button
                        onClick={() => setShowChatList(true)}
                        style={{
                          background: theme.primary, color: COLORS.white,
                          border: "none", width: "38px", height: "38px",
                          borderRadius: "10px", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <FaArrowLeft />
                      </button>
                    )}
                    <div style={{
                      width: "46px", height: "46px", borderRadius: "12px",
                      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: COLORS.white, fontWeight: "700", fontSize: "18px",
                    }}>
                      {selectedName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: theme.primary }}>
                        {selectedName}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
                        {selectedContactObj?.role && (() => {
                          const badge = roleBadgeColor(selectedContactObj.role);
                          return (
                            <span style={{
                              background: badge.bg, color: badge.color,
                              padding: "2px 10px", borderRadius: "6px",
                              fontSize: "11px", fontWeight: "700",
                            }}>
                              {selectedContactObj.role}
                            </span>
                          );
                        })()}
                        <span style={{ fontSize: "12px", color: COLORS.darkGray }}>
                          <FaUserCircle style={{ marginRight: "4px", verticalAlign: "middle" }} />
                          {selectedContactObj?.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {selectedMessages.length > 0 && (
                      <button
                        onClick={deleteSelectedMessages}
                        style={{
                          background: COLORS.danger, color: COLORS.white,
                          border: "none", padding: "9px 18px", borderRadius: "8px",
                          cursor: "pointer", display: "flex", alignItems: "center",
                          gap: "7px", fontSize: "13px", fontWeight: "600",
                        }}
                      >
                        <FaTrash /> Delete ({selectedMessages.length})
                      </button>
                    )}
                    <button
                      onClick={clearChat}
                      title="Clear chat"
                      style={{
                        background: "transparent", border: `1px solid ${COLORS.danger}`,
                        color: COLORS.danger, width: "40px", height: "40px",
                        borderRadius: "10px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.danger; e.currentTarget.style.color = COLORS.white; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.danger; }}
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1, overflowY: "auto",
                  padding: isMobile ? "16px" : "24px",
                  background: `linear-gradient(135deg, ${COLORS.bgGray} 0%, #FFFFFF 100%)`,
                }}>
                  {Object.entries(messageGroups).map(([date, msgs]) => (
                    <React.Fragment key={date}>
                      {/* Date divider */}
                      <div style={{ textAlign: "center", margin: "20px 0" }}>
                        <span style={{
                          background: COLORS.white, color: theme.primary,
                          padding: "6px 18px", borderRadius: "20px",
                          fontSize: "12px", fontWeight: "600",
                          border: `1px solid ${COLORS.lightGray}`,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}>
                          {formatDate(date)}
                        </span>
                      </div>

                      {msgs.map((m) => {
                        const isMe       = String(m.sender?._id || m.sender) === String(currentUserId);
                        const isSelected = selectedMessages.includes(m._id);

                        return (
                          <div
                            key={m._id}
                            onClick={() => setSelectedMessages((prev) =>
                              prev.includes(m._id) ? prev.filter((id) => id !== m._id) : [...prev, m._id]
                            )}
                            style={{
                              display:       "flex",
                              justifyContent: isMe ? "flex-end" : "flex-start",
                              marginBottom:  "14px",
                              cursor:        "pointer",
                              padding:       "4px",
                              borderRadius:  "10px",
                              background:    isSelected ? `${COLORS.blueLight}80` : "transparent",
                              transition:    "all 0.2s ease",
                            }}
                          >
                            <div style={{
                              maxWidth: isMobile ? "88%" : "72%",
                              display: "flex", flexDirection: "column",
                              alignItems: isMe ? "flex-end" : "flex-start",
                            }}>
                              {/* Sender name (others only) */}
                              {!isMe && (
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px", marginLeft: "6px" }}>
                                  <div style={{
                                    width: "24px", height: "24px", borderRadius: "6px",
                                    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: COLORS.white, fontSize: "11px", fontWeight: "700",
                                  }}>
                                    {(m.sender?.fullName || contacts.find((c) => String(c._id) === String(m.sender?._id || m.sender))?.fullName || "?").charAt(0)}
                                  </div>
                                  <span style={{ fontSize: "12px", color: theme.primary, fontWeight: "600" }}>
                                    {m.sender?.fullName || contacts.find((c) => String(c._id) === String(m.sender?._id || m.sender))?.fullName || "Unknown"}
                                  </span>
                                </div>
                              )}

                              {/* Bubble */}
                              <div style={{
                                background:   isMe ? theme.msgBg : "#E8DFF5",
                                color:        isMe ? COLORS.white : theme.primary,
                                borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                padding:      "12px 16px",
                                boxShadow:    "0 3px 10px rgba(0,0,0,0.08)",
                                border:       isMe ? "none" : `1px solid ${COLORS.lightGray}`,
                                wordBreak:    "break-word",
                              }}>
                                <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5 }}>{m.text}</p>
                                <div style={{
                                  fontSize: "11px", marginTop: "6px",
                                  color: isMe ? "rgba(255,255,255,0.65)" : COLORS.darkGray,
                                  display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px",
                                }}>
                                  {formatTime(m.createdAt)}
                                  {isMe && <FaCheckDouble style={{ fontSize: "11px" }} />}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}

                  {/* Typing indicator */}
                  {typingStatus[selectedId] && (
                    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "14px" }}>
                      <div style={{
                        background: "#E8DFF5", borderRadius: "18px 18px 18px 4px",
                        padding: "12px 18px", border: `1px solid ${COLORS.lightGray}`,
                      }}>
                        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                          {[0, 0.2, 0.4].map((delay, i) => (
                            <div key={i} style={{
                              width: "7px", height: "7px", borderRadius: "50%",
                              background: COLORS.typingBlue,
                              animation: `bounce 1.4s infinite ${delay}s`,
                            }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} style={{ height: "16px" }} />
                </div>

                {/* Input */}
                <div style={{
                  display:    "flex", alignItems: "center", gap: "14px",
                  padding:    isMobile ? "16px" : "20px 24px",
                  borderTop:  `1px solid ${COLORS.lightGray}`,
                  background: "linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)",
                }}>
                  <div style={{
                    flex: 1, position: "relative",
                    background: COLORS.white, borderRadius: "24px",
                    border: `2px solid ${COLORS.lightGray}`,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  }}>
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyUp}
                      placeholder="Type a message… (Enter to send)"
                      style={{
                        width: "100%", padding: "13px 18px",
                        borderRadius: "22px", border: "none",
                        outline: "none", fontSize: "14px",
                        background: "transparent", boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    style={{
                      width: "50px", height: "50px", borderRadius: "14px", border: "none",
                      background: text.trim()
                        ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`
                        : COLORS.lightGray,
                      color:     COLORS.white,
                      cursor:    text.trim() ? "pointer" : "not-allowed",
                      display:   "flex", alignItems: "center", justifyContent: "center",
                      fontSize:  "18px", transition: "all 0.2s ease",
                      boxShadow: text.trim() ? `0 4px 12px ${theme.primary}40` : "none",
                    }}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </>
            ) : (
              /* Empty state */
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "20px", padding: "40px", textAlign: "center",
                background: `linear-gradient(135deg, ${COLORS.bgGray} 0%, #FFFFFF 100%)`,
              }}>
                <div style={{
                  width: "120px", height: "120px", borderRadius: "24px",
                  background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.accent}10 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "52px", color: theme.primary,
                  border: `1px solid ${theme.primary}15`,
                  boxShadow: `0 8px 32px ${theme.primary}10`,
                }}>
                  <FaCommentDots />
                </div>
                <div>
                  <h3 style={{ fontSize: "24px", color: theme.primary, fontWeight: "700", margin: "0 0 10px" }}>
                    Welcome to Messages
                  </h3>
                  <p style={{ color: COLORS.textGray, fontSize: "15px", maxWidth: "420px", lineHeight: 1.6, margin: 0 }}>
                    Select a contact from the sidebar to start a conversation.
                  </p>
                </div>
                {isMobile && (
                  <button
                    onClick={() => setShowChatList(true)}
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
                      color: COLORS.white, border: "none",
                      padding: "14px 32px", borderRadius: "12px",
                      cursor: "pointer", fontSize: "15px", fontWeight: "600",
                      display: "flex", alignItems: "center", gap: "10px",
                      boxShadow: `0 6px 20px ${theme.primary}30`,
                    }}
                  >
                    <FaUsers /> View Contacts
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default Messages;