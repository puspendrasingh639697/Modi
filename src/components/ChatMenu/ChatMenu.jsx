







// import React, { useEffect, useState, useRef } from "react";
// import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../firebase/supabaseClient";
// import { auth } from "../config/firebase";
// import {
//   FiPhone,
//   FiVideo,
//   FiMoreVertical,
//   FiTrash2,
//   FiBan,
// } from "react-icons/fi";
// import "../../components/ChatMenu.css";

// const ChatMenu = ({ chatName, chatId, email }) => {
//   const navigate = useNavigate();
//   const currentEmail = auth?.currentUser?.email || localStorage.getItem("email");
//   const [isBlocked, setIsBlocked] = useState(false);
//   const [isChatDisabled, setIsChatDisabled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const channelRef = useRef(null);

//   useEffect(() => {
//     if (!email || !currentEmail) return;

//     const checkBlockedStatus = async () => {
//       const { data } = await supabase
//         .from("blockusers")
//         .select("TotalBlockUser")
//         .eq("email", currentEmail)
//         .single();

//       const blocked = data?.TotalBlockUser?.some((u) => u.email === email);
//       setIsBlocked(blocked);
//       setIsChatDisabled(blocked);
//     };

//     checkBlockedStatus();
//   }, [email, currentEmail]);

//   const handleBlockToggle = async () => {
//     const { data } = await supabase
//       .from("blockusers")
//       .select("TotalBlockUser")
//       .eq("email", currentEmail)
//       .single();

//     let list = Array.isArray(data?.TotalBlockUser)
//       ? data.TotalBlockUser
//       : [];

//     if (isBlocked) {
//       list = list.filter((u) => u.email !== email);
//     } else {
//       list.push({ email, isblock: true });
//     }

//     const { error } = await supabase
//       .from("blockusers")
//       .upsert({ email: currentEmail, TotalBlockUser: list });

//     if (error) {
//       alert("Failed to update block status");
//     } else {
//       setIsBlocked(!isBlocked);
//       setIsChatDisabled(!isBlocked);
//       alert(`${isBlocked ? "Unblocked" : "Blocked"} ${email}`);
//     }
//   };

//   const handleDeleteChat = async () => {
//     const confirmDelete = window.confirm(
//       "Delete chat for you only? This will remove it from your view."
//     );
//     if (!confirmDelete) return;

//     const { error } = await supabase.from("deletedchats").upsert({
//       user_email: currentEmail,
//       chat_id: chatId,
//       deleted_at: new Date().toISOString(),
//     });

//     if (error) alert("Failed to delete chat");
//     else alert("Chat deleted from your view");
//   };

//   const initiateCall = (isVideo) => {
//     if (isChatDisabled) {
//       alert("Blocked — cannot call this user.");
//       return;
//     }

//     navigate("/call", {
//       state: { roomId: currentEmail, peerEmail: email, isVideoCall: isVideo },
//     });
//   };

//   return (
//     <div className="chat-menu-row">
//       <button className="icon-btn" onClick={() => initiateCall(false)} title="Audio Call">
//         <FiPhone />
//       </button>

//       <button className="icon-btn" onClick={() => initiateCall(true)} title="Video Call">
//         <FiVideo />
//       </button>

//       <div className="menu-root">
//         <button
//           className="icon-btn"
//           onClick={() => setMenuOpen(!menuOpen)}
//           title="Menu"
//         >
//           <FiMoreVertical />
//         </button>

//         {menuOpen && (
//           <div className="menu-dropdown" onMouseLeave={() => setMenuOpen(false)}>
//             <button className="menu-item" onClick={handleDeleteChat}>
//               <FiTrash2 /> Delete Chat
//             </button>

//             <button className="menu-item" onClick={handleBlockToggle}>
//               <FiBan /> {isBlocked ? "Unblock User" : "Block User"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// ChatMenu.propTypes = {
//   chatName: PropTypes.string.isRequired,
//   chatId: PropTypes.string.isRequired,
//   email: PropTypes.string.isRequired,
// };

// export default ChatMenu;


import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../firebase/supabaseClient";
import { auth } from "../config/firebase";
import { 
  IoCall, 
  IoVideocam, 
  IoEllipsisVertical,
  IoTrashBin,
  IoBan,
  IoCheckmarkCircle
} from "react-icons/io5";

const ChatMenu = ({ chatName, chatId, email }) => {
  const navigate = useNavigate();
  const currentEmail = auth?.currentUser?.email || localStorage.getItem("email");
  const [isBlocked, setIsBlocked] = useState(false);
  const [isChatDisabled, setIsChatDisabled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const channelRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!email || !currentEmail) return;

    const checkBlockedStatus = async () => {
      const { data } = await supabase
        .from("blockusers")
        .select("TotalBlockUser")
        .eq("email", currentEmail)
        .single();

      const blocked = data?.TotalBlockUser?.some((u) => u.email === email);
      setIsBlocked(blocked);
      setIsChatDisabled(blocked);
    };

    checkBlockedStatus();
  }, [email, currentEmail]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBlockToggle = async () => {
    const { data } = await supabase
      .from("blockusers")
      .select("TotalBlockUser")
      .eq("email", currentEmail)
      .single();

    let list = Array.isArray(data?.TotalBlockUser)
      ? data.TotalBlockUser
      : [];

    if (isBlocked) {
      list = list.filter((u) => u.email !== email);
    } else {
      list.push({ email, isblock: true });
    }

    const { error } = await supabase
      .from("blockusers")
      .upsert({ email: currentEmail, TotalBlockUser: list });

    if (error) {
      alert("Failed to update block status");
    } else {
      setIsBlocked(!isBlocked);
      setIsChatDisabled(!isBlocked);
      setMenuOpen(false);
      alert(`${isBlocked ? "Unblocked" : "Blocked"} ${email}`);
    }
  };

  const handleDeleteChat = async () => {
    const confirmDelete = window.confirm(
      `Delete chat with ${chatName}? This will remove it from your view.`
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("deletedchats").upsert({
      user_email: currentEmail,
      chat_id: chatId,
      deleted_at: new Date().toISOString(),
    });

    if (error) {
      alert("Failed to delete chat");
    } else {
      alert("Chat deleted from your view");
      setMenuOpen(false);
    }
  };

  const initiateCall = (isVideo) => {
    if (isChatDisabled) {
      alert(`You cannot call ${chatName} because they are blocked.`);
      return;
    }

    navigate("/call", {
      state: { 
        roomId: currentEmail, 
        peerEmail: email, 
        isVideoCall: isVideo,
        chatName: chatName
      },
    });
  };

  return (
    <>
      <div className="flex items-center space-x-1 lg:space-x-2 chat-menu-container">
        {/* Audio Call Button */}
        <button 
          className={`p-2 rounded-full transition-all duration-200 hover:scale-110 call-btn-audio ${
            isChatDisabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-lg'
          }`}
          onClick={() => initiateCall(false)}
          disabled={isChatDisabled}
          title={isChatDisabled ? "User is blocked" : "Audio Call"}
        >
          <IoCall className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        {/* Video Call Button */}
        <button 
          className={`p-2 rounded-full transition-all duration-200 hover:scale-110 call-btn-video ${
            isChatDisabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-green-50 text-green-600 hover:bg-green-100 hover:shadow-lg'
          }`}
          onClick={() => initiateCall(true)}
          disabled={isChatDisabled}
          title={isChatDisabled ? "User is blocked" : "Video Call"}
        >
          <IoVideocam className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        {/* Menu Button */}
        <div className="relative menu-container" ref={menuRef}>
          <button
            className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-110 menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            title="More options"
          >
            <IoEllipsisVertical className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-3 z-50 menu-dropdown">
              {/* Delete Chat Option */}
              <button 
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-red-50 transition-all duration-200 flex items-center space-x-3 group rounded-lg mx-2 menu-item-delete"
                onClick={handleDeleteChat}
              >
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <IoTrashBin className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Delete Chat</div>
                  <div className="text-xs text-gray-500 mt-0.5">Remove from your chat list</div>
                </div>
              </button>

              {/* Block/Unblock Option */}
              <button 
                className={`w-full px-4 py-3 text-left text-sm transition-all duration-200 flex items-center space-x-3 group rounded-lg mx-2 menu-item-block ${
                  isBlocked 
                    ? 'text-green-700 hover:bg-green-50' 
                    : 'text-orange-700 hover:bg-orange-50'
                }`}
                onClick={handleBlockToggle}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  isBlocked 
                    ? 'bg-green-100 group-hover:bg-green-200' 
                    : 'bg-orange-100 group-hover:bg-orange-200'
                }`}>
                  {isBlocked ? (
                    <IoCheckmarkCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <IoBan className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {isBlocked ? 'Unblock User' : 'Block User'}
                  </div>
                  <div className="text-xs opacity-75 mt-0.5">
                    {isBlocked ? 'Restore communication' : 'Block messages and calls'}
                  </div>
                </div>
              </button>

              {/* Status Indicator */}
              <div className="px-4 py-2 border-t border-gray-100 mt-2 pt-3 menu-status">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full status-dot ${isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className={`status-text ${isBlocked ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}`}>
                      {isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                  <span className="text-gray-500 status-desc">
                    {isBlocked ? 'No communication' : 'Available'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Blocked Badge - Desktop Only */}
        {isBlocked && (
          <div className="hidden lg:flex items-center space-x-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full blocked-badge">
            <IoBan className="w-3 h-3 text-red-600" />
            <span className="text-xs text-red-600 font-medium">Blocked</span>
          </div>
        )}
      </div>

      {/* Custom CSS Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .menu-dropdown {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        /* Smooth transitions for all interactive elements */
        .chat-menu-container * {
          transition-property: color, background-color, border-color, transform, box-shadow;
          transition-duration: 200ms;
          transition-timing-function: ease-in-out;
        }
        
        /* Custom hover effects */
        .menu-item-delete:hover {
          background-color: rgb(254, 226, 226) !important;
        }
        
        .menu-item-block:hover {
          background-color: ${isBlocked ? 'rgb(220, 252, 231)' : 'rgb(255, 237, 213)'} !important;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .chat-menu-container {
            gap: 0.25rem;
          }
        }
        
        @media (min-width: 1024px) {
          .chat-menu-container {
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

ChatMenu.propTypes = {
  chatName: PropTypes.string.isRequired,
  chatId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export default ChatMenu;