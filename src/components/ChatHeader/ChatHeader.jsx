


// import React, { useEffect, useState, useRef } from "react";
// import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../firebase/supabaseClient";
// import TypingIndicator from "../components/TypingIndicator";
// import { FaCircle } from "react-icons/fa";
// import "../../components/ChatHeader.css";

// const ChatHeader = ({ chatName, chatId, email, avatar, about }) => {
//   const navigate = useNavigate();
//   const [isOnline, setIsOnline] = useState(false);
//   const [selfEmail, setSelfEmail] = useState("");
//   const channelRef = useRef(null);

//   useEffect(() => {
//     let mounted = true;

//     const setupStatusListener = async () => {
//       const storedEmail = localStorage.getItem("email");
//       if (!storedEmail) return;

//       setSelfEmail(storedEmail);

//       // Fetch initial online status
//       const { data: userData, error } = await supabase
//         .from("users")
//         .select("isactivestatus")
//         .eq("email", email)
//         .single();

//       if (!error && userData) setIsOnline(Boolean(userData.isactivestatus));

//       // Listen for real-time updates
//       channelRef.current = supabase
//         .channel(`user_status_${email}`)
//         .on(
//           "postgres_changes",
//           {
//             event: "UPDATE",
//             schema: "public",
//             table: "users",
//             filter: `email=eq.${email}`,
//           },
//           (payload) => {
//             if (mounted) setIsOnline(Boolean(payload.new?.isactivestatus));
//           }
//         )
//         .subscribe();

//       // Update current user’s online status
//       const handleVisibility = async () => {
//         const visible = document.visibilityState === "visible";
//         await supabase
//           .from("users")
//           .update({ isactivestatus: visible })
//           .eq("email", storedEmail);
//       };

//       document.addEventListener("visibilitychange", handleVisibility);

//       return () => {
//         document.removeEventListener("visibilitychange", handleVisibility);
//       };
//     };

//     const cleanup = setupStatusListener();

//     return () => {
//       mounted = false;
//       if (channelRef.current) {
//         supabase.removeChannel(channelRef.current);
//       }
//       if (typeof cleanup === "function") cleanup();
//     };
//   }, [email]);

//   const handleChatInfo = () => {
//     navigate("/chat-info", {
//       state: { chatId, chatName, avatar, about, isOnline },
//     });
//   };

//   const getInitials = (name = "") =>
//     name
//       .split(" ")
//       .map((s) => s[0]?.toUpperCase() || "")
//       .slice(0, 2)
//       .join("");

//   return (
//     <div className="chat-header" onClick={handleChatInfo}>
//       <div className="chat-header-left">
//         <div className="avatar-circle">
//           {avatar ? (
//             <img src={avatar} alt={chatName} className="avatar-img" />
//           ) : (
//             <div className="avatar-initials">{getInitials(chatName)}</div>
//           )}
//         </div>

//         <div className="chat-meta">
//           <div className="chat-name">{chatName}</div>
//           <div className="chat-status">
//             <FaCircle
//               className="status-icon"
//               style={{ color: isOnline ? "#24C55A" : "#D93E3E" }}
//             />
//             <span className="status-text">{isOnline ? "Online" : "Offline"}</span>
//           </div>

//           {selfEmail && (
//             <TypingIndicator
//               chatId={chatId}
//               currentUserEmail={selfEmail}
//               otherEmail={email}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// ChatHeader.propTypes = {
//   chatName: PropTypes.string.isRequired,
//   chatId: PropTypes.string.isRequired,
//   email: PropTypes.string.isRequired,
//   avatar: PropTypes.string,
//   about: PropTypes.string,
// };

// export default ChatHeader;

import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../firebase/supabaseClient";
import { FaCircle, FaInfoCircle } from "react-icons/fa";
import { IoChevronBack, IoEllipsisVertical } from "react-icons/io5";

const ChatHeader = ({ chatName, chatId, email, avatar, about }) => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [selfEmail, setSelfEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const channelRef = useRef(null);
  const menuRef = useRef(null);
  const typingChannelRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const setupStatusListener = async () => {
      const storedEmail = localStorage.getItem("email");
      if (!storedEmail) return;

      setSelfEmail(storedEmail);

      // Fetch initial online status
      const { data: userData, error } = await supabase
        .from("users")
        .select("isactivestatus, istyping")
        .eq("email", email)
        .single();

      if (!error && userData) {
        setIsOnline(Boolean(userData.isactivestatus));
        setIsTyping(Boolean(userData.istyping));
      }

      // Listen for real-time status updates
      channelRef.current = supabase
        .channel(`user_status_${email}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "users",
            filter: `email=eq.${email}`,
          },
          (payload) => {
            if (mounted) {
              setIsOnline(Boolean(payload.new?.isactivestatus));
              setIsTyping(Boolean(payload.new?.istyping));
            }
          }
        )
        .subscribe();

      // Update current user's online status based on visibility
      const handleVisibility = async () => {
        const visible = document.visibilityState === "visible";
        await supabase
          .from("users")
          .update({ isactivestatus: visible })
          .eq("email", storedEmail);
      };

      document.addEventListener("visibilitychange", handleVisibility);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibility);
      };
    };

    const cleanup = setupStatusListener();

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      if (typingChannelRef.current) {
        supabase.removeChannel(typingChannelRef.current);
      }
      if (typeof cleanup === "function") cleanup();
    };
  }, [email]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChatInfo = () => {
    navigate("/chat-info", {
      state: { chatId, chatName, avatar, about, isOnline },
    });
    setShowMenu(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMuteNotifications = async () => {
    try {
      // Add your mute logic here
      console.log("Mute notifications for:", email);
      setShowMenu(false);
    } catch (error) {
      console.error("Error muting notifications:", error);
    }
  };

  const handleClearChat = async () => {
    try {
      // Add your clear chat logic here
      if (window.confirm("Are you sure you want to clear this chat?")) {
        console.log("Clear chat with:", email);
      }
      setShowMenu(false);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((s) => s[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("");

  // Typing Indicator Component (built-in)
  const TypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <div className="flex items-center space-x-2 mt-1">
        <span className="text-xs text-blue-600 font-medium">Typing</span>
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
          <div 
            className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" 
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div 
            className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" 
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      {/* Left Section - Back Button & User Info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* Back Button - Mobile */}
        <button
          onClick={handleBack}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
          aria-label="Go back"
        >
          <IoChevronBack className="w-5 h-5 text-gray-600" />
        </button>

        {/* Avatar */}
        <div 
          className="relative flex-shrink-0 cursor-pointer"
          onClick={handleChatInfo}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden border-2 border-white shadow-md">
            {avatar ? (
              <img 
                src={avatar} 
                alt={chatName} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 ${avatar ? 'hidden' : 'flex'}`}>
              <span className="text-white font-bold text-sm">
                {getInitials(chatName)}
              </span>
            </div>
          </div>
          
          {/* Online Status Indicator */}
          <div 
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
            title={isOnline ? 'Online' : 'Offline'}
          >
            {isOnline && (
              <div className="w-full h-full rounded-full bg-green-500 animate-ping opacity-75"></div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={handleChatInfo}
        >
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {chatName}
          </h2>
          
          <div className="flex items-center space-x-2">
            <FaCircle 
              className={`w-2 h-2 ${
                isOnline ? 'text-green-500 animate-pulse' : 'text-gray-400'
              }`} 
            />
            <span className={`text-sm ${
              isOnline ? 'text-green-600' : 'text-gray-500'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Built-in Typing Indicator */}
          <TypingIndicator />
        </div>
      </div>

      {/* Right Section - Menu Button */}
      <div className="flex items-center space-x-2" ref={menuRef}>
        {/* Info Button - Mobile Only */}
        <button
          onClick={handleChatInfo}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 lg:hidden flex-shrink-0"
          aria-label="Chat info"
        >
          <FaInfoCircle className="w-5 h-5 text-gray-600" />
        </button>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0"
            aria-label="More options"
          >
            <IoEllipsisVertical className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              <button
                onClick={handleChatInfo}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3"
              >
                <FaInfoCircle className="w-4 h-4 text-blue-600" />
                <span>View Profile</span>
              </button>
              
              <button
                onClick={handleMuteNotifications}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3"
              >
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-4.5-9.5L19 19" />
                </svg>
                <span>Mute Notifications</span>
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={handleClearChat}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear Chat</span>
              </button>

              {/* Info Button - Desktop (in menu) */}
              <button
                onClick={handleChatInfo}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-3 lg:hidden"
              >
                <FaInfoCircle className="w-4 h-4 text-blue-600" />
                <span>Chat Info</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ChatHeader.propTypes = {
  chatName: PropTypes.string.isRequired,
  chatId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  about: PropTypes.string,
};

export default ChatHeader;