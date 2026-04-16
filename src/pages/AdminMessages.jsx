import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";
import { getUsersForMessaging, sendMessage, getMessages } from "../api/api";
import { 
  FaSearch, 
  FaTrash, 
  FaPaperPlane, 
  FaUserCircle,
  FaUsers,
  FaCommentDots,
  FaChevronLeft,
  FaEllipsisV,
  FaArrowLeft,
  FaCheckDouble,
  FaTimes,
  FaVideo,
  FaPlus,
  FaDollarSign,
  FaLock,
  FaUnlock,
  FaRupeeSign,
  FaChartLine,
  FaGraduationCap,
  FaMoneyBillWave,
  FaArrowRight,
  FaSort,
  FaFilter,
  FaTags,
  FaEdit,
  FaPhone,
  FaInfoCircle
} from "react-icons/fa";

// Exact Color Theme from Courses Page
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
  orange: "#F97316",
  primaryButton: "#3D1A5B",
  formButton: "#3B82F6",
  cancelButton: "#6B7280",
  blueLight: "#dbeafe",
  greenLight: "#d1fae5",
  yellowLight: "#fef3c7",
  purpleLight: "#ede9fe",
  teal: "#0d9488",
  indigo: "#4f46e5",
  rose: "#f43f5e",
  myMessageBg: "#4B2D7A",
  theirMessageBg: "#E8DFF5",
  onlineGreen: "#10b981",
  offlineGray: "#9CA3AF",
  typingBlue: "#3B82F6"
};

const socket = io("http://localhost:5000", { autoConnect: false });

const AdminMessages = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showChatList, setShowChatList] = useState(true);
  const [typingStatus, setTypingStatus] = useState({});
  const [userStatus, setUserStatus] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentUserId = user?._id || user?.id;

  // Responsive handling - matching Courses screen
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowChatList(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersForMessaging();
      
      // Add mock last messages and timestamps for demo
      const usersWithDetails = (data.users || []).map(u => ({
        ...u,
        lastMessage: "Click to start conversation",
        lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unreadCount: Math.floor(Math.random() * 5), // Random unread count for demo
        isOnline: Math.random() > 0.3, // Random online status for demo
        lastSeen: new Date(Date.now() - Math.random() * 86400000).toLocaleString() // Random last seen
      }));
      
      setUsers(usersWithDetails);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      setLoading(true);
      const data = await getMessages(userId);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    if (!user?._id) return;

    socket.connect();
    socket.emit("join", user._id);

    const handleReceive = (message) => {
      if (!selectedUser) return;

      const senderId = message.sender?._id || message.sender;
      const receiverId = message.receiver?._id || message.receiver;

      if (
        (senderId === selectedUser && receiverId === user._id) ||
        (senderId === user._id && receiverId === selectedUser)
      ) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on("receive_message", handleReceive);
    
    // Handle typing events
    socket.on("typing", (data) => {
      if (data.userId === selectedUser) {
        setTypingStatus(prev => ({
          ...prev,
          [selectedUser]: data.isTyping
        }));
      }
    });
    
    // Handle user status
    socket.on("user_status", (data) => {
      setUserStatus(prev => ({
        ...prev,
        [data.userId]: data.status
      }));
    });

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("typing");
      socket.off("user_status");
    };
  }, [user?._id, selectedUser]);

  const selectUser = (u) => {
    setSelectedUser(u._id);
    setSelectedUserName(u.fullName || u.email);
    setMessages([]);
    setSelectedMessages([]);
    fetchMessages(u._id);
    if (isMobile) {
      setShowChatList(false);
    }
    // Clear typing status when switching users
    setTypingStatus(prev => ({ ...prev, [u._id]: false }));
  };

  const handleTyping = (isTyping) => {
    if (selectedUser) {
      socket.emit("typing", {
        userId: currentUserId,
        receiverId: selectedUser,
        isTyping
      });
    }
  };

  const handleSend = async () => {
    if (!text.trim() || !selectedUser) return;

    try {
      const res = await sendMessage({ to: selectedUser, text });
      const msg = res.data;

      socket.emit("send_message", {
        senderId: msg.sender._id || msg.sender,
        receiverId: msg.receiver._id || msg.receiver,
        text: msg.text,
        _id: msg._id,
        createdAt: msg.createdAt,
      });

      setMessages((prev) => [...prev, msg]);
      setText("");
      handleTyping(false);
    } catch (err) {
      console.error("Send message error:", err);
      alert("Message send failed");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleKeyUp = () => {
    handleTyping(true);
    // Clear typing status after 1 second of no typing
    setTimeout(() => handleTyping(false), 1000);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUserObj = users.find((u) => u._id === selectedUser);

  // Toggle message selection
  const toggleSelectMessage = (msgId) => {
    setSelectedMessages((prev) =>
      prev.includes(msgId) ? prev.filter((id) => id !== msgId) : [...prev, msgId]
    );
  };

  // Delete selected messages
  const deleteSelectedMessages = () => {
    if (selectedMessages.length === 0) return;
    const confirmed = window.confirm("Are you sure you want to delete selected messages?");
    if (!confirmed) return;

    setMessages((prev) => prev.filter((m) => !selectedMessages.includes(m._id)));
    setSelectedMessages([]);
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  // Clear all messages with user
  const clearChat = () => {
    if (!selectedUser) return;
    const confirmed = window.confirm("Clear all messages with this user?");
    if (!confirmed) return;
    setMessages([]);
  };

  // Mark all as read
  const markAllAsRead = () => {
    // In a real app, you would call an API to mark messages as read
    alert("All messages marked as read");
  };

  return (
    <div style={{ 
      display: "flex", 
      backgroundColor: COLORS.bgGray, 
      minHeight: "100vh",
      overflow: "hidden"
    }}>
      <Sidebar />

      <div style={{
        flex: 1,
        overflowX: "hidden",
        marginLeft: isMobile ? "0" : "280px",
        paddingTop: isMobile ? "80px" : "32px",
        padding: isMobile ? "80px 0 0 0" : "32px",
        height: "100vh",
      }}>
        {/* Main Container - Similar to Courses layout */}
        <div style={{ 
          display: "flex", 
          height: isMobile ? "calc(100vh - 80px)" : "calc(100vh - 64px)",
          background: COLORS.white,
          borderRadius: isMobile ? "0" : "12px",
          overflow: "hidden",
          boxShadow: isMobile ? "none" : "0 1px 3px rgba(0,0,0,0.1)",
        }}>
          {/* Chat List Panel - Similar to sidebar in Courses */}
          <div style={{ 
            width: isMobile ? "100%" : "380px", 
            height: "100%",
            background: COLORS.white, 
            borderRight: `1px solid ${COLORS.lightGray}`,
            display: (isMobile && !showChatList) ? "none" : "flex",
            flexDirection: "column",
            position: isMobile ? "absolute" : "relative",
            zIndex: 100,
            transform: isMobile && !showChatList ? "translateX(-100%)" : "translateX(0)",
            transition: "transform 0.3s ease",
            boxShadow: isMobile ? "0 0 20px rgba(0,0,0,0.1)" : "none"
          }}>
            {/* Chat List Header - Matching Courses header style */}
            <div style={{ 
              background: "linear-gradient(135deg, #3D1A5B 0%, #4B2D7A 100%)", 
              padding: isMobile ? "24px 20px 20px 20px" : "28px 24px 24px 24px",
              color: COLORS.white,
              borderBottom: `1px solid rgba(255,255,255,0.1)`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                <div style={{ 
                  width: "56px", 
                  height: "56px", 
                  borderRadius: "12px", 
                  background: "rgba(255,255,255,0.2)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: "24px",
                  backdropFilter: "blur(10px)"
                }}>
                  <FaCommentDots />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: isMobile ? "20px" : "22px", 
                    fontWeight: "700",
                    letterSpacing: "-0.5px"
                  }}>
                    Messages
                  </h2>
                  <p style={{ 
                    margin: 0, 
                    fontSize: "14px", 
                    opacity: 0.9,
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <span style={{
                      width: "8px",
                      height: "8px",
                      background: COLORS.brightGreen,
                      borderRadius: "50%",
                      display: "inline-block"
                    }}></span>
                    {users.filter(u => u.isOnline).length} online • {users.length} contacts
                  </p>
                </div>
              </div>

              {/* Search Bar - Matching Courses search style */}
              <div style={{ position: "relative" }}>
                <FaSearch style={{ 
                  position: "absolute", 
                  left: "16px", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  color: COLORS.white,
                  fontSize: "16px",
                  opacity: 0.8
                }} />
                <input
                  type="text"
                  placeholder="Search users by name, email or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "14px 16px 14px 48px", 
                    background: "rgba(255,255,255,0.15)", 
                    border: "none", 
                    borderRadius: "12px", 
                    fontSize: "14px", 
                    outline: "none",
                    boxSizing: "border-box",
                    color: COLORS.white,
                    backdropFilter: "blur(10px)"
                  }}
                />
              </div>
            </div>

            {/* Users List - Enhanced with better styling */}
            <div style={{ 
              flex: 1, 
              overflowY: "auto",
              paddingBottom: "20px"
            }}>
              {loading && users.length === 0 ? (
                <div style={{ 
                  padding: "60px 20px", 
                  textAlign: "center", 
                  color: COLORS.darkGray,
                  fontSize: "15px"
                }}>
                  <div style={{ 
                    width: "60px", 
                    height: "60px", 
                    borderRadius: "50%", 
                    background: COLORS.lightGray, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    margin: "0 auto 16px auto",
                    animation: "pulse 1.5s infinite"
                  }}>
                    <FaCommentDots size={24} color={COLORS.darkGray} />
                  </div>
                  Loading contacts...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div style={{ 
                  padding: "60px 20px", 
                  textAlign: "center", 
                  color: COLORS.darkGray
                }}>
                  <FaUsers style={{ 
                    fontSize: "64px", 
                    color: COLORS.lightGray, 
                    marginBottom: "20px",
                    opacity: 0.5
                  }} />
                  <h3 style={{ 
                    color: COLORS.deepPurple, 
                    margin: "0 0 8px 0", 
                    fontSize: "18px", 
                    fontWeight: "600" 
                  }}>
                    No users found
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: "14px", 
                    maxWidth: "300px", 
                    margin: "0 auto",
                    lineHeight: 1.5
                  }}>
                    Try adjusting your search or invite users to join
                  </p>
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = selectedUser === u._id;
                  const isOnline = u.isOnline;
                  
                  return (
                    <div 
                      key={u._id} 
                      onClick={() => selectUser(u)}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "14px", 
                        padding: "18px 20px", 
                        cursor: "pointer", 
                        background: isSelected ? "linear-gradient(90deg, rgba(61, 26, 91, 0.1) 0%, rgba(75, 45, 122, 0.08) 100%)" : COLORS.white, 
                        borderBottom: `1px solid ${COLORS.lightGray}`,
                        transition: "all 0.3s ease",
                        borderLeft: isSelected ? `4px solid ${COLORS.deepPurple}` : "none",
                        position: "relative",
                        ":hover": {
                          background: isSelected ? "linear-gradient(90deg, rgba(61, 26, 91, 0.1) 0%, rgba(75, 45, 122, 0.08) 100%)" : COLORS.bgGray
                        }
                      }}
                    >
                      {/* User Avatar */}
                      <div style={{ position: "relative" }}>
                        <div style={{ 
                          width: "52px", 
                          height: "52px", 
                          borderRadius: "12px", 
                          background: `linear-gradient(135deg, ${COLORS.deepPurple} 0%, ${COLORS.headerPurple} 100%)`, 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          color: COLORS.white, 
                          fontWeight: "600", 
                          fontSize: "20px",
                          flexShrink: 0,
                          boxShadow: "0 4px 8px rgba(61, 26, 91, 0.2)"
                        }}>
                          {u.fullName?.charAt(0) || u.email?.charAt(0) || "U"}
                        </div>
                        {/* Online Status Indicator */}
                        <div style={{
                          position: "absolute",
                          bottom: "-2px",
                          right: "-2px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: isOnline ? COLORS.onlineGreen : COLORS.offlineGray,
                          border: `2px solid ${COLORS.white}`,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}></div>
                      </div>
                      
                      {/* User Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "flex-start", 
                          marginBottom: "6px" 
                        }}>
                          <h3 style={{ 
                            fontWeight: "600", 
                            color: COLORS.deepPurple, 
                            margin: 0, 
                            fontSize: "15px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>
                            {u.fullName || u.email || "Unknown User"}
                          </h3>
                          <span style={{ 
                            fontSize: "12px", 
                            color: COLORS.darkGray,
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                            marginLeft: "8px"
                          }}>
                            {formatMessageTime(u.lastSeen)}
                          </span>
                        </div>
                        
                        <p style={{ 
                          fontSize: "13px", 
                          color: COLORS.darkGray, 
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px"
                        }}>
                          <span style={{
                            background: COLORS.roleBg,
                            color: COLORS.deepPurple,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "0.3px"
                          }}>
                            {u.role}
                          </span>
                          {u.lastMessage}
                        </p>
                        
                        <div style={{ 
                          fontSize: "12px", 
                          color: isOnline ? COLORS.brightGreen : COLORS.darkGray,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <div style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: isOnline ? COLORS.onlineGreen : COLORS.offlineGray
                          }}></div>
                          {isOnline ? "Online" : `Last seen ${formatMessageTime(u.lastSeen)}`}
                        </div>
                      </div>
                      
                      {/* Unread Count Badge */}
                      {u.unreadCount > 0 && (
                        <div style={{
                          background: COLORS.brightGreen,
                          color: COLORS.white,
                          fontSize: "12px",
                          fontWeight: "700",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          minWidth: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          right: "20px",
                          top: "18px",
                          boxShadow: "0 2px 4px rgba(0, 217, 163, 0.3)"
                        }}>
                          {u.unreadCount}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Bottom Info Bar */}
            <div style={{ 
              padding: "16px 20px", 
              borderTop: `1px solid ${COLORS.lightGray}`,
              background: COLORS.bgGray,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ fontSize: "13px", color: COLORS.darkGray }}>
                <span style={{ fontWeight: "600", color: COLORS.deepPurple }}>
                  {users.filter(u => u.isOnline).length}
                </span> online
              </div>
              <div style={{ 
                fontSize: "13px", 
                color: COLORS.darkGray,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <FaInfoCircle size={12} />
                Total: {users.length} contacts
              </div>
            </div>
          </div>

          {/* Chat Area - Main content area similar to Courses */}
          <div style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            background: COLORS.white,
            height: "100%",
            width: isMobile && showChatList ? "0" : "100%",
            overflow: "hidden",
            position: "relative"
          }}>
            {selectedUser ? (
              <>
                {/* Chat Header - Matching Courses table header */}
                <div style={{ 
                  background: "linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)", 
                  padding: isMobile ? "18px 20px" : "20px 24px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between", 
                  borderBottom: `1px solid ${COLORS.lightGray}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  position: "relative",
                  zIndex: 10
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {isMobile && (
                      <button
                        onClick={() => setShowChatList(true)}
                        style={{
                          background: COLORS.deepPurple,
                          color: COLORS.white,
                          border: "none",
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontSize: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                          boxShadow: "0 2px 8px rgba(61, 26, 91, 0.2)"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = COLORS.headerPurple}
                        onMouseLeave={(e) => e.currentTarget.style.background = COLORS.deepPurple}
                      >
                        <FaArrowLeft />
                      </button>
                    )}
                    
                    {/* User Info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ position: "relative" }}>
                        <div style={{ 
                          width: "52px", 
                          height: "52px", 
                          borderRadius: "12px", 
                          background: `linear-gradient(135deg, ${COLORS.deepPurple} 0%, ${COLORS.headerPurple} 100%)`, 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          color: COLORS.white, 
                          fontWeight: "600",
                          fontSize: "20px",
                          boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)"
                        }}>
                          {selectedUserName?.charAt(0) || "U"}
                        </div>
                        <div style={{
                          position: "absolute",
                          bottom: "-2px",
                          right: "-2px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: selectedUserObj?.isOnline ? COLORS.onlineGreen : COLORS.offlineGray,
                          border: `3px solid ${COLORS.white}`,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                        }}></div>
                      </div>
                      
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <h3 style={{ 
                            fontWeight: "700", 
                            color: COLORS.deepPurple, 
                            margin: 0, 
                            fontSize: isMobile ? "18px" : "20px",
                            letterSpacing: "-0.3px"
                          }}>
                            {selectedUserName}
                          </h3>
                          <span style={{
                            background: selectedUserObj?.isOnline ? COLORS.greenLight : COLORS.lightGray,
                            color: selectedUserObj?.isOnline ? "#065f46" : COLORS.darkGray,
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}>
                            <div style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: selectedUserObj?.isOnline ? COLORS.onlineGreen : COLORS.offlineGray
                            }}></div>
                            {selectedUserObj?.isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                        
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "12px",
                          fontSize: "13px", 
                          color: COLORS.darkGray,
                          flexWrap: "wrap"
                        }}>
                          <span style={{
                            background: COLORS.roleBg,
                            color: COLORS.deepPurple,
                            padding: "4px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}>
                            {selectedUserObj?.role || "User"}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <FaUserCircle size={12} /> {selectedUserObj?.email || "No email"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Matching Courses action buttons */}
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {selectedMessages.length > 0 && (
                      <button 
                        onClick={deleteSelectedMessages}
                        style={{ 
                          background: COLORS.danger,
                          color: COLORS.white,
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 6px rgba(239, 68, 68, 0.2)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#DC2626";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = COLORS.danger;
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <FaTrash /> Delete
                      </button>
                    )}
                    
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={clearChat}
                        style={{
                          background: "transparent",
                          border: `1px solid ${COLORS.lightGray}`,
                          width: "44px",
                          height: "44px",
                          borderRadius: "10px",
                          color: COLORS.deepPurple,
                          cursor: "pointer",
                          fontSize: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = COLORS.lightGray;
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        title="Clear Chat"
                      >
                        <FaTimes />
                      </button>
                      
                      <button
                        style={{
                          background: "transparent",
                          border: `1px solid ${COLORS.lightGray}`,
                          width: "44px",
                          height: "44px",
                          borderRadius: "10px",
                          color: COLORS.deepPurple,
                          cursor: "pointer",
                          fontSize: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = COLORS.lightGray;
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                        title="More Options"
                      >
                        <FaEllipsisV />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div style={{ 
                  flex: 1, 
                  overflowY: "auto", 
                  padding: isMobile ? "16px" : "24px",
                  background: `linear-gradient(135deg, ${COLORS.bgGray} 0%, #FFFFFF 100%)`,
                  position: "relative"
                }}>
                  {Object.entries(messageGroups).map(([date, dateMessages]) => (
                    <React.Fragment key={date}>
                      <div style={{
                        textAlign: "center",
                        margin: "24px 0",
                        position: "relative"
                      }}>
                        <div style={{
                          display: "inline-block",
                          background: COLORS.white,
                          color: COLORS.deepPurple,
                          padding: "8px 20px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "600",
                          border: `1px solid ${COLORS.lightGray}`,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                          backdropFilter: "blur(10px)"
                        }}>
                          {formatDate(date)}
                        </div>
                      </div>
                      {dateMessages.map((m) => {
                        const isMe = (m.sender?._id || m.sender) === currentUserId;
                        const isSelected = selectedMessages.includes(m._id);

                        return (
                          <div
                            key={m._id}
                            onClick={() => toggleSelectMessage(m._id)}
                            style={{
                              display: "flex",
                              justifyContent: isMe ? "flex-end" : "flex-start",
                              marginBottom: "16px",
                              padding: "4px",
                              borderRadius: "12px",
                              background: isSelected ? `${COLORS.blueLight}80` : "transparent",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              position: "relative",
                              maxWidth: "100%"
                            }}
                          >
                            <div style={{ 
                              maxWidth: isMobile ? "90%" : "75%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: isMe ? "flex-end" : "flex-start",
                              position: "relative"
                            }}>
                              {/* Sender name for others' messages */}
                              {!isMe && (
                                <div style={{ 
                                  display: "flex", 
                                  alignItems: "center", 
                                  gap: "8px", 
                                  marginBottom: "6px",
                                  marginLeft: "8px"
                                }}>
                                  <div style={{ 
                                    width: "28px", 
                                    height: "28px", 
                                    borderRadius: "8px", 
                                    background: `linear-gradient(135deg, ${COLORS.deepPurple} 0%, ${COLORS.headerPurple} 100%)`, 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    color: COLORS.white, 
                                    fontWeight: "600",
                                    fontSize: "12px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                  }}>
                                    {m.sender?.fullName?.charAt(0) || "U"}
                                  </div>
                                  <span style={{ 
                                    fontSize: "13px", 
                                    color: COLORS.deepPurple, 
                                    fontWeight: "600"
                                  }}>
                                    {m.sender?.fullName || "User"}
                                  </span>
                                </div>
                              )}
                              
                              {/* Message Bubble */}
                              <div style={{ 
                                background: isMe ? COLORS.myMessageBg : COLORS.theirMessageBg, 
                                color: isMe ? COLORS.white : COLORS.deepPurple, 
                                borderRadius: isMe ? "20px 20px 6px 20px" : "20px 20px 20px 6px", 
                                padding: "14px 18px",
                                position: "relative",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                maxWidth: "100%",
                                wordBreak: "break-word",
                                border: isMe ? "none" : `1px solid ${COLORS.lightGray}`,
                                backdropFilter: "blur(10px)"
                              }}>
                                <p style={{ 
                                  margin: 0, 
                                  fontSize: "15px",
                                  lineHeight: 1.5,
                                  letterSpacing: "0.2px"
                                }}>
                                  {m.text}
                                </p>
                                <div style={{ 
                                  fontSize: "11px", 
                                  color: isMe ? "rgba(255,255,255,0.7)" : COLORS.darkGray, 
                                  textAlign: "right", 
                                  marginTop: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                  gap: "6px"
                                }}>
                                  <span style={{ 
                                    fontSize: "12px", 
                                    fontWeight: "500"
                                  }}>
                                    {formatTime(m.createdAt)}
                                  </span>
                                  {isMe && (
                                    <FaCheckDouble style={{ 
                                      fontSize: "12px",
                                      color: isMe ? "rgba(255,255,255,0.8)" : COLORS.brightGreen
                                    }} />
                                  )}
                                </div>
                              </div>
                              
                              {/* Selection indicator */}
                              {isSelected && (
                                <div style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: isMe ? "auto" : "-30px",
                                  right: isMe ? "-30px" : "auto",
                                  transform: "translateY(-50%)",
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  background: COLORS.info,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: COLORS.white,
                                  fontSize: "12px",
                                  fontWeight: "bold"
                                }}>
                                  ✓
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                  
                  {/* Typing indicator */}
                  {typingStatus[selectedUser] && (
                    <div style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginBottom: "16px",
                      animation: "fadeIn 0.3s ease"
                    }}>
                      <div style={{ 
                        maxWidth: isMobile ? "90%" : "75%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start"
                      }}>
                        <div style={{ 
                          background: COLORS.theirMessageBg, 
                          color: COLORS.deepPurple, 
                          borderRadius: "20px 20px 20px 6px", 
                          padding: "14px 18px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          border: `1px solid ${COLORS.lightGray}`
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: COLORS.typingBlue,
                              animation: "bounce 1.4s infinite"
                            }}></div>
                            <div style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: COLORS.typingBlue,
                              animation: "bounce 1.4s infinite 0.2s"
                            }}></div>
                            <div style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: COLORS.typingBlue,
                              animation: "bounce 1.4s infinite 0.4s"
                            }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} style={{ height: "20px" }} />
                </div>

                {/* Input Area */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "16px", 
                  padding: isMobile ? "20px 16px" : "24px", 
                  borderTop: `1px solid ${COLORS.lightGray}`,
                  background: "linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)",
                  position: "relative",
                  zIndex: 10
                }}>
                  <div style={{ 
                    flex: 1, 
                    position: "relative",
                    background: COLORS.white,
                    borderRadius: "24px",
                    border: `2px solid ${COLORS.lightGray}`,
                    padding: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                  }}>
                    <input
                      ref={inputRef}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyUp}
                      placeholder="Type your message here..."
                      style={{ 
                        width: "100%", 
                        padding: "14px 20px", 
                        borderRadius: "20px", 
                        border: "none", 
                        outline: "none", 
                        fontSize: "15px",
                        background: "transparent",
                        boxSizing: "border-box"
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "12px",
                      color: COLORS.darkGray,
                      pointerEvents: "none"
                    }}>
                      Press Enter to send
                    </div>
                  </div>
                  <button 
                    onClick={handleSend} 
                    disabled={!text.trim()}
                    style={{ 
                      width: isMobile ? "52px" : "56px",
                      height: isMobile ? "52px" : "56px",
                      borderRadius: "16px", 
                      border: "none", 
                      background: text.trim() ? `linear-gradient(135deg, ${COLORS.deepPurple} 0%, ${COLORS.headerPurple} 100%)` : COLORS.lightGray, 
                      color: COLORS.white, 
                      cursor: text.trim() ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      fontSize: "20px",
                      boxShadow: text.trim() ? "0 4px 12px rgba(61, 26, 91, 0.3)" : "none"
                    }}
                    onMouseEnter={(e) => {
                      if (text.trim()) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(61, 26, 91, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (text.trim()) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(61, 26, 91, 0.3)";
                      }
                    }}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </>
            ) : (
              /* Empty State - Enhanced like Courses */
              <div style={{ 
                flex: 1, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                flexDirection: "column", 
                gap: "28px",
                padding: "40px",
                textAlign: "center",
                background: `linear-gradient(135deg, ${COLORS.bgGray} 0%, #FFFFFF 100%)`
              }}>
                <div style={{ 
                  width: "140px",
                  height: "140px",
                  borderRadius: "24px",
                  background: `linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(75, 45, 122, 0.08) 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "60px",
                  color: COLORS.deepPurple,
                  boxShadow: "0 8px 32px rgba(61, 26, 91, 0.1)",
                  border: `1px solid rgba(61, 26, 91, 0.1)`
                }}>
                  <FaCommentDots />
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: isMobile ? "24px" : "28px", 
                    color: COLORS.deepPurple,
                    fontWeight: "700",
                    margin: "0 0 12px 0",
                    letterSpacing: "-0.5px"
                  }}>
                    Welcome to Messages
                  </h3>
                  <p style={{ 
                    color: COLORS.textGray, 
                    fontSize: isMobile ? "15px" : "16px",
                    maxWidth: "500px",
                    lineHeight: 1.6,
                    margin: "0 auto 24px auto"
                  }}>
                    Select a conversation from the sidebar to start messaging.
                    You can send messages, manage conversations, and stay connected with users.
                  </p>
                </div>
                {isMobile && (
                  <button
                    onClick={() => setShowChatList(true)}
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.deepPurple} 0%, ${COLORS.headerPurple} 100%)`,
                      color: COLORS.white,
                      border: "none",
                      padding: "16px 36px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.3s ease",
                      boxShadow: "0 8px 24px rgba(61, 26, 91, 0.3)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 28px rgba(61, 26, 91, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(61, 26, 91, 0.3)";
                    }}
                  >
                    <FaUsers size={18} /> View All Contacts
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminMessages;