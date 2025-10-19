// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import './JoinScreen.css';
// import { useNavigate, useLocation } from 'react-router-dom';
// import {
//   doc,
//   setDoc,
//   getDoc,
//   updateDoc,
//   collection,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   getDocs,
// } from "firebase/firestore";
// import { db, auth } from '../config/firebase';
// import { FaPhone, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaCamera, FaUser } from 'react-icons/fa';
// import { IoMdCameraReverse } from 'react-icons/io';
// import { supabase } from "../config/supabaseClient";

// const JoinScreen = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { 
//     setScreen, 
//     screens, 
//     roomId, 
//     peerEmail,  
//     remoteAccessToken, 
//     remoteFCMToken, 
//     avatar 
//   } = location.state || {};

//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [cachedLocalPC, setCachedLocalPC] = useState(null);
//   const [isFrontCamera, setFrontCamera] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [callInProgress, setCallInProgress] = useState(false);
//   const [hasPermissions, setPermissions] = useState(false);
//   const [callStatus, setCallStatus] = useState('Joining...');
//   const [callDuration, setCallDuration] = useState(0);
//   const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
//   const [isVideoOn, setIsVideoOn] = useState(null);
//   const [isVideoCall, setIsVideoCall] = useState(null);
//   const [videoQuality, setVideoQuality] = useState('FULL_HD');

//   const callTimerRef = useRef(null);
//   const unsubRef = useRef([]);
//   const ringtoneRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
  
//   const [isRingtonePlaying, setIsRingtonePlaying] = useState(false);
//   const [isCallhangup, setIsCallhangup] = useState(null);

//   const VIDEO_QUALITY = {
//     HD: {
//       width: 1280,
//       height: 720,
//       frameRate: 30,
//       bitrate: 2500000
//     },
//     FULL_HD: {
//       width: 1920,
//       height: 1080,
//       frameRate: 30,
//       bitrate: 4000000
//     },
//     UHD_4K: {
//       width: 3840,
//       height: 2160,
//       frameRate: 30,
//       bitrate: 8000000
//     }
//   };

//   const configuration = {
//     iceServers: [
//       { urls: "stun:stun.relay.metered.ca:80" },
//       {
//         urls: "turn:159.223.175.154:3478",
//         username: "user",
//         credential: "password",
//       },
//       {
//         urls: "turn:95.217.13.89:3478",
//         username: "user",
//         credential: "password",
//       },
//     ],
//     iceCandidatePoolSize: 10,
//   };

//   const playRingtone = async () => {
//     try {
//       stopRingtone();
      
//       // Web audio implementation for ringtone
//       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//       // Add your ringtone logic here
//       console.log('Playing ringtone');
//       setIsRingtonePlaying(true);
//     } catch (error) {
//       console.log('Error playing ringtone:', error);
//     }
//   };

//   const stopRingtone = () => {
//     // Stop any playing sounds
//     console.log('Stopping ringtone');
//     setIsRingtonePlaying(false);
//   };

//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (callInProgress) {
//         e.preventDefault();
//         e.returnValue = 'Are you sure you want to leave the call?';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
    
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [callInProgress]);

//   useEffect(() => {
//     const checkNavigationSource = () => {
//       if (location.state?.fromNotification) {
//         console.log("📱 Joined from notification");
//       }
//     };

//     checkNavigationSource();
//   }, [location.state]);

//   const cleanupConnections = async () => {
//     try {
//       console.log("Cleaning up connections...");

//       stopRingtone();

//       if (ringtoneRef.current) {
//         ringtoneRef.current = null;
//       }
      
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//       }
      
//       if (unsubRef.current && unsubRef.current.length > 0) {
//         unsubRef.current.forEach(unsubscribe => {
//           if (typeof unsubscribe === 'function') {
//             unsubscribe();
//           }
//         });
//         unsubRef.current = [];
//       }
      
//       if (localStream) {
//         localStream.getTracks().forEach(track => {
//           track.stop();
//           track.enabled = false;
//         });
//       }
      
//       if (cachedLocalPC) {
//         cachedLocalPC.close();
//         setCachedLocalPC(null);
//       }
      
//       setRemoteStream(null);
//       setCallInProgress(false);
//       setCallDuration(0);
//       setCallStatus('Call Ended');
      
//       console.log('Connections cleaned up successfully');
//     } catch (error) {
//       console.error('Error during cleanup:', error);
//     }
//   };

//   useEffect(() => {
//     console.log("▶️ Subscribing to Supabase Realtime...");

//     const videoOnSub = supabase
//       .channel("peer-video-status")
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "users", filter: `email=eq.${peerEmail}` },
//         (payload) => {
//           const status = payload.new?.isvideoon;
//           console.log("📹 isVideoOn updated:", status);
//           setIsVideoOn(!!status);
//         }
//       )
//       .subscribe();

//     const videoCallSub = supabase
//       .channel("current-user-videoCall")
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "users", filter: `email=eq.${auth.currentUser.email}` },
//         (payload) => {
//           const status = payload.new?.isvideocall;
//           console.log("📞 isVideoCall updated:", status);
//           setIsVideoCall(!!status);
//         }
//       )
//       .subscribe();

//     const hangupSub = supabase
//       .channel("peer-hangup")
//       .on(
//         "postgres_changes",
//         { event: "UPDATE", schema: "public", table: "users", filter: `email=eq.${peerEmail}` },
//         (payload) => {
//           const status = payload.new?.iscallerhangup;
//           console.log("📴 isCallerHangup updated:", status);
//           if (status === true) {
//             onBackPress();
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       console.log("🛑 Unsubscribing Supabase Realtime...");
//       supabase.removeChannel(videoOnSub);
//       supabase.removeChannel(videoCallSub);
//       supabase.removeChannel(hangupSub);
//     };
//   }, [peerEmail]);

//   useEffect(() => {
//     if (remoteStream) {
//       // For web, audio routing is handled by the browser
//       console.log('Remote stream connected');
//     }
//   }, [remoteStream]);

//   useEffect(() => {
//     if (callInProgress && remoteStream) {
//       callTimerRef.current = setInterval(() => {
//         setCallDuration(prev => prev + 1);
//       }, 1000);
//     } else {
//       clearInterval(callTimerRef.current);
//     }
    
//     return () => clearInterval(callTimerRef.current);
//   }, [callInProgress, remoteStream]);

//   const formatCallTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   useEffect(() => {
//     handlePermissions();
    
//     return () => {
//       cleanupConnections();
//     };
//   }, []);

//   useEffect(() => {
//     if (localStream && !callInProgress) {
//       joinCall();
//     }
//   }, [localStream]);

//   const handlePermissions = async () => {
//     try {
//       const hasPermission = await requestCamAudioPermissions();
//       setPermissions(hasPermission);
//       if (hasPermission) {
//         startLocalStream();
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const requestCamAudioPermissions = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: true, 
//         audio: true 
//       });
      
//       stream.getTracks().forEach(track => track.stop());
      
//       return true;
//     } catch (error) {
//       console.log('Permission error:', error);
//       return false;
//     }
//   };

//   const startLocalStream = async () => {
//     try {
//       const isFront = true;
      
//       const quality = VIDEO_QUALITY[videoQuality];
      
//       const constraints = {
//         audio: {
//           channelCount: 1,
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 48000,
//           sampleSize: 16,
//           autoGainControl: true,
//         },
//         video: {
//           width: { ideal: quality.width },
//           height: { ideal: quality.height },
//           frameRate: { ideal: quality.frameRate },
//           facingMode: isFront ? 'user' : 'environment',
//         },
//       };

//       const newStream = await navigator.mediaDevices.getUserMedia(constraints);
//       setLocalStream(newStream);
      
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = newStream;
//       }
//     } catch (error) {
//       console.log("Error starting local stream:", error);
//       if (videoQuality === 'UHD_4K' || videoQuality === 'FULL_HD') {
//         console.log("Trying HD quality as fallback...");
//         setVideoQuality('HD');
//         setTimeout(() => startLocalStream(), 500);
//       }
//     }
//   };

//   const changeVideoQuality = async (newQuality) => {
//     if (videoQuality === newQuality) return;
    
//     setVideoQuality(newQuality);
    
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());
//       setLocalStream(null);
//     }
    
//     await startLocalStream();
//   };

//   const joinCall = async () => {
//     if (!localStream) {
//       console.log("Local stream not ready yet!");
//       return;
//     }
//     setCallInProgress(true);
//     setCallStatus('Connecting...');
    
//     try {
//       const localPC = new RTCPeerConnection(configuration);
//       localStream.getTracks().forEach((track) =>
//         localPC.addTrack(track, localStream)
//       );

//       const roomRef = doc(db, "room", roomId);
//       const roomSnapshot = await getDoc(roomRef);
//       if (!roomSnapshot.exists()) {
//         console.log("No room found with id:", roomId);
//         setCallStatus('Room Not Found');
//         stopRingtone();
//         return;
//       }
//       const offer = roomSnapshot.data().offer;

//       const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

//       localPC.onicecandidate = (event) => {
//         if (event.candidate) {
//           addDoc(calleeCandidatesCollection, {
//             candidate: event.candidate.candidate,
//             sdpMid: event.candidate.sdpMid,
//             sdpMLineIndex: event.candidate.sdpMLineIndex,
//           });
//         }
//       };

//       localPC.ontrack = (event) => {
//         if (event.streams && event.streams[0]) {
//           event.streams[0].getAudioTracks().forEach(track => {
//             track.enabled = true;
//           });

//           setRemoteStream(event.streams[0]);
//           setCallStatus('Connected');

//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = event.streams[0];
//           }

//           stopRingtone();
//         }
//       };

//       localPC.onconnectionstatechange = () => {
//         console.log('PC state:', localPC.connectionState);
//         if (['failed', 'disconnected', 'closed'].includes(localPC.connectionState)) {
//           setCallStatus('Disconnected');
//           setIsCallhangup(true);
//           onBackPress();
//           stopRingtone();
//         }
//       };

//       await localPC.setRemoteDescription(
//         new RTCSessionDescription({
//           type: offer.type,
//           sdp: offer.sdp,
//         })
//       );

//       const answer = await localPC.createAnswer();
      
//       if (answer.sdp) {
//         const bandwidth = VIDEO_QUALITY[videoQuality].bitrate;
//         answer.sdp = answer.sdp.replace(
//           /a=mid:video\r\n/g,
//           `a=mid:video\r\nb=AS:${bandwidth}\r\n`
//         );
//       }
      
//       await localPC.setLocalDescription(answer);

//       await updateDoc(roomRef, {
//         answer: { type: answer.type, sdp: answer.sdp },
//       });

//       const callerCandidatesCollection = collection(roomRef, "callerCandidates");
//       const unsubCaller = onSnapshot(callerCandidatesCollection, (snapshot) => {
//         snapshot.docChanges().forEach(async (change) => {
//           if (change.type === "added") {
//             const data = change.doc.data();
//             await localPC.addIceCandidate(
//               new RTCIceCandidate({
//                 candidate: data.candidate,
//                 sdpMid: data.sdpMid,
//                 sdpMLineIndex: data.sdpMLineIndex,
//               })
//             );
//           }
//         });
//       });

//       unsubRef.current.push(unsubCaller);
//       setCachedLocalPC(localPC);

//       try {
//         const { error: peerErr } = await supabase
//           .from("users")
//           .update({ isoncallstatus: true })
//           .eq("email", peerEmail);

//         if (peerErr) throw peerErr;

//         const { error: currentErr } = await supabase
//           .from("users")
//           .update({
//             isvideoon: true,
//             isoncallstatus: true,
//           })
//           .eq("email", auth?.currentUser?.email);

//         if (currentErr) throw currentErr;

//         console.log("✅ Call status updated successfully");
//       } catch (e) {
//         console.log("❌ user flag update err:", e);
//       }

//     } catch (err) {
//       console.log("joinCall error:", err);
//       setCallStatus('Connection Failed');
//       stopRingtone();
//       cleanupConnections();
//     }
//   };

//   const sendFcmNotification = async (targetToken, title, body, authToken, extraData = {}) => {
//     const url = "https://fcm.googleapis.com/v1/projects/hiddo-3887f/messages:send";

//     const payload = {
//       message: {
//         token: targetToken,
//         data: {
//           title,
//           body,
//           ...extraData,
//         },
//       },
//     };

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": authToken,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       console.log("Result:", data);
//     } catch (error) {
//       console.error("FCM Error:", error);
//     }
//   };

//   const onBackPress = async () => {
//     console.log("Ending call for:", peerEmail);

//     try {
//       const { error: selfErr } = await supabase
//         .from("users")
//         .update({
//           iscallingfrom: "",
//           isoncallstatus: false,
//         })
//         .eq("email", auth.currentUser?.email);

//       if (selfErr) throw selfErr;

//       const { error: peerErr } = await supabase
//         .from("users")
//         .update({
//           isoncallstatus: false,
//         })
//         .eq("email", peerEmail);

//       if (peerErr) throw peerErr;

//       await deleteRoomByEmail(peerEmail);

//       await cleanupConnections();

//       console.log("print the boths the token data----->>", remoteFCMToken, remoteAccessToken);

//       sendFcmNotification(
//         remoteFCMToken,
//         "Start Call",
//         auth?.currentUser?.email,
//         remoteAccessToken,
//         { Peeremail: auth?.currentUser?.email, type: "Reject_Call" }
//       );

//       if (navigate.length > 1) {
//         navigate(-1);

//         const { error: hangupErr } = await supabase
//           .from("users")
//           .update({
//             iscallerhangup: false,
//           })
//           .eq("email", peerEmail);

//         if (hangupErr) throw hangupErr;
//       } else {
//         // Handle screen navigation if needed
//         console.log('Would navigate to room screen');
//       }

//       console.log("✅ Call ended successfully");
//     } catch (e) {
//       console.log("❌ Error ending call:", e);
//     }
//   };

//   const deleteRoomByEmail = async (email) => {
//     try {
//       if (!email) return;
      
//       const roomRef = doc(db, "room", email);
//       const roomSnapshot = await getDoc(roomRef);
      
//       if (roomSnapshot.exists()) {
//         const subcollections = ["calleeCandidates", "callerCandidates"];
        
//         for (const sub of subcollections) {
//           const subColRef = collection(db, "room", email, sub);
//           const subDocs = await getDocs(subColRef);
          
//           const deletePromises = subDocs.docs.map(subDoc => deleteDoc(doc(subColRef, subDoc.id)));
//           await Promise.all(deletePromises);
//         }
        
//         await deleteDoc(roomRef);
//         console.log(`${email} room and its subcollections deleted successfully`);
//       }
//     } catch (error) {
//       console.error("Error deleting room:", error);
//     }
//   };

//   const switchCamera = async () => {
//     if (localStream) {
//       try {
//         const newFacingMode = isFrontCamera ? 'environment' : 'user';
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: newFacingMode },
//           audio: true
//         });
        
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }
        
//         localStream.getTracks().forEach(track => track.stop());
//         setLocalStream(stream);
//         setFrontCamera(!isFrontCamera);
//       } catch (error) {
//         console.log('Error switching camera:', error);
//       }
//     }
//   };

//   const toggleMute = () => {
//     if (localStream) {
//       localStream.getAudioTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//         setIsMuted(!track.enabled);
//       });
//     }
//   };

//   const toggleVideo = async () => {
//     try {
//       if (localStream) {
//         localStream.getVideoTracks().forEach(async (track) => {
//           track.enabled = !track.enabled;
//           setIsLocalVideoEnabled(track.enabled);

//           const { error } = await supabase
//             .from("users")
//             .update({
//               isvideoon: track.enabled,
//             })
//             .eq("email", auth?.currentUser?.email);

//           if (error) {
//             console.error("Error updating video status:", error);
//           } else {
//             console.log("Video status updated:", track.enabled);
//           }
//         });
//       }
//     } catch (err) {
//       console.error("toggleVideo error:", err);
//     }
//   };

//   const renderVideoStreams = () => {
//     if (isVideoCall) {
//       return (
//         <div className="video-container">
//           {remoteStream && isVideoOn ? (
//             <video 
//               ref={remoteVideoRef}
//               className="remote-video" 
//               autoPlay
//               playsInline
//             />
//           ) : (
//             <div className="remote-video-placeholder">
//               <FaVideoSlash size={80} color="#64748B" />
//               <div className="placeholder-text">Camera Off</div>
//             </div>
//           )}
          
//           {localStream && isLocalVideoEnabled && (
//             <div className="local-video-container">
//               <video 
//                 ref={localVideoRef}
//                 className="local-video" 
//                 autoPlay
//                 playsInline
//                 muted
//               />
//             </div>
//           )}
//         </div>
//       );
//     } else {
//       return (
//         <div className="audio-call-container">
//           <div className="avatar-container">
//             <div className="avatar">
//               <img
//                 src={avatar}
//                 className="avatar-image"
//                 alt="User avatar"
//               />
//             </div>
//             <div className="peer-name-audio">{peerEmail || 'Unknown User'}</div>
//             <div className="call-status-audio">{callStatus}</div>
//             {callInProgress && remoteStream && (
//               <div className="call-timer-audio">{formatCallTime(callDuration)}</div>
//             )}
//           </div>
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="container">
//       {/* Header */}
//       <div className="header">
//         <div className="peer-name">{peerEmail || 'Unknown User'}</div>
//         <div className="call-status">{callStatus}</div>
//         {callInProgress && remoteStream && (
//           <div className="call-timer">{formatCallTime(callDuration)}</div>
//         )}
//       </div>

//       {/* Conditional Video/Audio UI */}
//       {renderVideoStreams()}

//       {/* Call Controls */}
//       <div className="controls-container">
//         {callInProgress && (
//           <div className="call-controls">
//             <button 
//               className={`control-button ${isMuted ? 'control-button-active' : ''}`}
//               onClick={toggleMute}
//             >
//               {isMuted ? <FaMicrophoneSlash size={24} color="#FFF" /> : <FaMicrophone size={24} color="#FFF" />}
//               <div className="control-button-text">{isMuted ? 'Unmute' : 'Mute'}</div>
//             </button>

//             {isVideoCall && (
//               <button 
//                 className={`control-button ${!isLocalVideoEnabled ? 'control-button-active' : ''}`}
//                 onClick={toggleVideo}
//               >
//                 {isLocalVideoEnabled ? <FaVideo size={24} color="#FFF" /> : <FaVideoSlash size={24} color="#FFF" />}
//                 <div className="control-button-text">{isLocalVideoEnabled ? 'Video' : 'Enable'}</div>
//               </button>
//             )}

//             <button 
//               className="end-call-button"
//               onClick={onBackPress}
//             >
//               <FaPhoneSlash size={28} color="#FFF" />
//             </button>

//             {isVideoCall && (
//               <button 
//                 className="control-button"
//                 onClick={switchCamera}
//               >
//                 <IoMdCameraReverse size={24} color="#FFF" />
//                 <div className="control-button-text">Flip</div>
//               </button>
//             )}
//           </div>
//         )}

//         {!localStream && (
//           <button className="permission-button" onClick={handlePermissions}>
//             <FaCamera size={24} color="#FFF" />
//             <div className="button-text">Grant Permissions</div>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JoinScreen;







// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './JoinScreen.css';

// // WebRTC imports for React.js
// const {
//   RTCPeerConnection,
//   RTCSessionDescription,
//   RTCIceCandidate,
//   mediaDevices
// } = window;

// // Icons
// import { 
//   IoCall,
//   IoVideocam,
//   IoVideocamOff,
//   IoMic,
//   IoMicOff,
//   IoCameraReverse,
//   IoPerson,
//   IoClose
// } from 'react-icons/io5';
// import { MdCallEnd, MdHighQuality } from 'react-icons/md';

// // Firebase/Supabase imports
// import { auth, db } from '../../firebase/config';
// import { supabase } from '../../firebase/supabaseClient';


// // Video quality presets
// const VIDEO_QUALITY = {
//   HD: {
//     width: 1280,
//     height: 720,
//     frameRate: 30,
//     bitrate: 2500000
//   },
//   FULL_HD: {
//     width: 1920,
//     height: 1080,
//     frameRate: 30,
//     bitrate: 4000000
//   },
//   UHD_4K: {
//     width: 3840,
//     height: 2160,
//     frameRate: 30,
//     bitrate: 8000000
//   }
// };

// // WebRTC configuration
// const configuration = {
//   iceServers: [
//     { urls: "stun:stun.relay.metered.ca:80" },
//     {
//       urls: "turn:159.223.175.154:3478",
//       username: "user",
//       credential: "password",
//     },
//     {
//       urls: "turn:95.217.13.89:3478",
//       username: "user",
//       credential: "password",
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };

// export default function JoinScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = location.state || {};
  
//   const { 
//     roomId, 
//     peerEmail, 
//     remoteAccessToken, 
//     remoteFCMToken, 
//     avatar,
//     isVideoCall = true // Default to video call
//   } = params;

//   // State declarations
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [cachedLocalPC, setCachedLocalPC] = useState(null);
//   const [isFrontCamera, setIsFrontCamera] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [callInProgress, setCallInProgress] = useState(false);
//   const [hasPermissions, setHasPermissions] = useState(false);
//   const [callStatus, setCallStatus] = useState('Joining...');
//   const [callDuration, setCallDuration] = useState(0);
//   const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
//   const [isVideoOn, setIsVideoOn] = useState(null);
//   const [videoCallType, setVideoCallType] = useState(isVideoCall);
//   const [videoQuality, setVideoQuality] = useState('FULL_HD');

//   // Refs
//   const callTimerRef = useRef(null);
//   const unsubRef = useRef([]);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const ringtoneRef = useRef(null);

//   // FCM Notification function
//   const sendFcmNotification = async (targetToken, title, body, authToken, extraData = {}) => {
//     const url = "https://fcm.googleapis.com/v1/projects/hiddo-3887f/messages:send";

//     const payload = {
//       message: {
//         token: targetToken,
//         data: {
//           title,
//           body,
//           ...extraData,
//         },
//       },
//     };

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": authToken,
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       console.log("FCM Response:", data);
//     } catch (error) {
//       console.error("FCM Error:", error);
//     }
//   };

//   // Cleanup function
//   const cleanupConnections = async () => {
//     try {
//       console.log("Cleaning up connections...");

//       stopRingtone();

//       if (ringtoneRef.current) {
//         ringtoneRef.current.pause();
//         ringtoneRef.current = null;
//       }
      
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//       }
      
//       if (unsubRef.current && unsubRef.current.length > 0) {
//         unsubRef.current.forEach(unsubscribe => {
//           if (typeof unsubscribe === 'function') {
//             unsubscribe();
//           }
//         });
//         unsubRef.current = [];
//       }
      
//       if (localStream) {
//         localStream.getTracks().forEach(track => {
//           track.stop();
//           track.enabled = false;
//         });
//       }
      
//       if (cachedLocalPC) {
//         cachedLocalPC.close();
//         setCachedLocalPC(null);
//       }
      
//       setRemoteStream(null);
//       setCallInProgress(false);
//       setCallDuration(0);
//       setCallStatus('Call Ended');

//       console.log('Connections cleaned up successfully');
//     } catch (error) {
//       console.error('Error during cleanup:', error);
//     }
//   };

//   // Ringtone functions
//   const playRingtone = async () => {
//     try {
//       stopRingtone();
      
//       // For web, use HTML5 Audio
//       const audio = new Audio('/sounds/ringtone.mp3'); // Make sure this file exists in public/sounds
//       ringtoneRef.current = audio;
      
//       audio.loop = true;
//       audio.play().then(() => {
//         console.log('Ringtone started playing');
//       }).catch(error => {
//         console.log('Ringtone playback failed:', error);
//       });
//     } catch (error) {
//       console.log('Error playing ringtone:', error);
//     }
//   };

//   const stopRingtone = () => {
//     if (ringtoneRef.current) {
//       ringtoneRef.current.pause();
//       ringtoneRef.current.currentTime = 0;
//       console.log('Ringtone stopped');
//     }
//   };

//   // Real-time subscriptions
//   useEffect(() => {
//     if (!peerEmail) return;

//     console.log("▶️ Subscribing to Supabase Realtime...");

//     // 1️⃣ Peer user video status listener
//     const videoOnSub = supabase
//       .channel("peer-video-status")
//       .on(
//         "postgres_changes",
//         { 
//           event: "UPDATE", 
//           schema: "public", 
//           table: "users", 
//           filter: `email=eq.${peerEmail}` 
//         },
//         (payload) => {
//           const status = payload.new?.isvideoon;
//           console.log("📹 Peer video status updated:", status);
//           setIsVideoOn(!!status);
//         }
//       )
//       .subscribe();

//     // 2️⃣ Current user videoCall type listener
//     const videoCallSub = supabase
//       .channel("current-user-videoCall")
//       .on(
//         "postgres_changes",
//         { 
//           event: "UPDATE", 
//           schema: "public", 
//           table: "users", 
//           filter: `email=eq.${auth?.currentUser?.email}` 
//         },
//         (payload) => {
//           const status = payload.new?.isvideocall;
//           console.log("📞 Video call type updated:", status);
//           setVideoCallType(!!status);
//         }
//       )
//       .subscribe();

//     // 3️⃣ Peer hangup listener
//     const hangupSub = supabase
//       .channel("peer-hangup")
//       .on(
//         "postgres_changes",
//         { 
//           event: "UPDATE", 
//           schema: "public", 
//           table: "users", 
//           filter: `email=eq.${peerEmail}` 
//         },
//         (payload) => {
//           const status = payload.new?.iscallerhangup;
//           console.log("📴 Peer hangup status:", status);
//           if (status === true) {
//             handlePeerHangup();
//           }
//         }
//       )
//       .subscribe();

//     // Cleanup
//     return () => {
//       console.log("🛑 Unsubscribing Supabase Realtime...");
//       supabase.removeChannel(videoOnSub);
//       supabase.removeChannel(videoCallSub);
//       supabase.removeChannel(hangupSub);
//     };
//   }, [peerEmail]);

//   const handlePeerHangup = () => {
//     Alert.alert(
//       "Call Ended",
//       "Call hangup by User",
//       [
//         {
//           text: "OK",
//           onPress: async () => {
//             try {
//               await cleanupConnections();
//               navigate(-1); // Go back

//               // Reset hangup status
//               const { error: hangupErr } = await supabase
//                 .from("users")
//                 .update({ iscallerhangup: false })
//                 .eq("email", peerEmail);

//               if (hangupErr) {
//                 console.error("❌ Error updating hangup status:", hangupErr);
//               }
//             } catch (err) {
//               console.error("❌ Exception in hangup update:", err);
//             }
//           },
//         },
//       ],
//       { cancelable: false }
//     );
//   };

//   // Call timer
//   useEffect(() => {
//     if (callInProgress && remoteStream) {
//       callTimerRef.current = setInterval(() => {
//         setCallDuration(prev => prev + 1);
//       }, 1000);
//     } else {
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//       }
//     }
    
//     return () => {
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//       }
//     };
//   }, [callInProgress, remoteStream]);

//   // Auto-join when localStream is ready
//   useEffect(() => {
//     if (localStream && !callInProgress) {
//       joinCall();
//     }
//   }, [localStream]);

//   // Initial setup
//   useEffect(() => {
//     handlePermissions();
    
//     return () => {
//       cleanupConnections();
//     };
//   }, []);

//   // Format call duration
//   const formatCallTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handlePermissions = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         audio: true, 
//         video: videoCallType 
//       });
//       setHasPermissions(true);
//       return true;
//     } catch (error) {
//       console.log('Permission error:', error);
//       setHasPermissions(false);
//       return false;
//     }
//   };

//   const startLocalStream = async () => {
//     try {
//       const quality = VIDEO_QUALITY[videoQuality];
      
//       const constraints = {
//         audio: {
//           channelCount: 1,
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 48000,
//           sampleSize: 16,
//           autoGainControl: true,
//         },
//         video: videoCallType ? {
//           width: { ideal: quality.width },
//           height: { ideal: quality.height },
//           frameRate: { ideal: quality.frameRate },
//           facingMode: isFrontCamera ? 'user' : 'environment'
//         } : false
//       };

//       const newStream = await navigator.mediaDevices.getUserMedia(constraints);
//       setLocalStream(newStream);
      
//       // Attach to video element
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = newStream;
//       }

//     } catch (error) {
//       console.log("Error starting local stream:", error);
//       // Fallback to lower quality
//       if (videoQuality === 'UHD_4K' || videoQuality === 'FULL_HD') {
//         console.log("Trying HD quality as fallback...");
//         setVideoQuality('HD');
//         setTimeout(() => startLocalStream(), 500);
//       }
//     }
//   };

//   const changeVideoQuality = async (newQuality) => {
//     if (videoQuality === newQuality) return;
    
//     setVideoQuality(newQuality);
    
//     // Restart stream with new quality
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());
//       setLocalStream(null);
//     }
    
//     await startLocalStream();
//   };

//   const joinCall = async () => {
//     if (!localStream) {
//       console.log("Local stream not ready yet!");
//       return;
//     }

//     setCallInProgress(true);
//     setCallStatus('Connecting...');
    
//     try {
//       const localPC = new RTCPeerConnection(configuration);
      
//       // Add local tracks
//       localStream.getTracks().forEach((track) => {
//         localPC.addTrack(track, localStream);
//       });

//       // Handle remote stream
//       localPC.ontrack = (event) => {
//         if (event.streams && event.streams[0]) {
//           const remoteStream = event.streams[0];
//           setRemoteStream(remoteStream);
          
//           // Attach remote stream to video element
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = remoteStream;
//           }
          
//           setCallStatus('Connected');
//           stopRingtone();
//         }
//       };

//       // ICE candidates
//       localPC.onicecandidate = (event) => {
//         if (!event.candidate) return;
//         console.log('ICE candidate generated');
//         // Handle ICE candidate sending to signaling server
//       };

//       localPC.onconnectionstatechange = () => {
//         console.log('PC state:', localPC.connectionState);
//         if (['failed', 'disconnected', 'closed'].includes(localPC.connectionState)) {
//           setCallStatus('Disconnected');
//           handleCallDisconnected();
//         }
//       };

//       // For web, you'll need to implement your own signaling server
//       // This is a simplified version - you'll need to adapt it to your signaling mechanism
      
//       setCachedLocalPC(localPC);

//       // Update user status in Supabase
//       try {
//         // Peer user update
//         const { error: peerErr } = await supabase
//           .from("users")
//           .update({ isoncallstatus: true })
//           .eq("email", peerEmail);

//         if (peerErr) throw peerErr;

//         // Current user update
//         const { error: currentErr } = await supabase
//           .from("users")
//           .update({
//             isvideoon: true,
//             isoncallstatus: true,
//           })
//           .eq("email", auth?.currentUser?.email);

//         if (currentErr) throw currentErr;

//         console.log("✅ Call status updated successfully");
//       } catch (error) {
//         console.log("❌ User flag update error:", error);
//       }

//     } catch (error) {
//       console.log("joinCall error:", error);
//       setCallStatus('Connection Failed');
//       stopRingtone();
//       cleanupConnections();
//     }
//   };

//   const handleCallDisconnected = () => {
//     Alert.alert(
//       "Call Disconnected",
//       "The call has ended",
//       [
//         {
//           text: "OK",
//           onPress: () => onBackPress()
//         }
//       ]
//     );
//   };

//   const onBackPress = async () => {
//     console.log("Ending call for:", peerEmail);

//     try {
//       // Current user reset
//       const { error: selfErr } = await supabase
//         .from("users")
//         .update({
//           iscallingfrom: "",
//           isoncallstatus: false,
//         })
//         .eq("email", auth.currentUser?.email);

//       if (selfErr) throw selfErr;

//       // Peer user reset
//       const { error: peerErr } = await supabase
//         .from("users")
//         .update({
//           isoncallstatus: false,
//         })
//         .eq("email", peerEmail);

//       if (peerErr) throw peerErr;

//       // Send rejection notification
//       sendFcmNotification(
//         remoteFCMToken,
//         "Call Ended",
//         auth?.currentUser?.email,
//         remoteAccessToken,
//         { 
//           Peeremail: auth?.currentUser?.email, 
//           type: "Reject_Call" 
//         }
//       );

//       // Cleanup connections
//       await cleanupConnections();

//       // Navigate back
//       navigate(-1);

//       console.log("✅ Call ended successfully");
//     } catch (error) {
//       console.log("❌ Error ending call:", error);
//     }
//   };

//   // UI Actions
//   const switchCamera = async () => {
//     if (!videoCallType || !localStream) return;

//     try {
//       const currentVideoTrack = localStream.getVideoTracks()[0];
//       const constraints = {
//         video: {
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           facingMode: isFrontCamera ? 'environment' : 'user'
//         }
//       };

//       const newStream = await navigator.mediaDevices.getUserMedia(constraints);
//       const newVideoTrack = newStream.getVideoTracks()[0];

//       // Replace the video track
//       const sender = cachedLocalPC?.getSenders().find(s => 
//         s.track && s.track.kind === 'video'
//       );
      
//       if (sender) {
//         await sender.replaceTrack(newVideoTrack);
//       }

//       // Update local stream
//       currentVideoTrack.stop();
//       localStream.removeTrack(currentVideoTrack);
//       localStream.addTrack(newVideoTrack);

//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = localStream;
//       }

//       setIsFrontCamera(!isFrontCamera);
//       newStream.getTracks().forEach(track => {
//         if (track.kind === 'audio') track.stop();
//       });
//     } catch (error) {
//       console.log('Error switching camera:', error);
//     }
//   };

//   const toggleMute = () => {
//     if (!localStream) return;
    
//     localStream.getAudioTracks().forEach(track => {
//       track.enabled = !track.enabled;
//     });
//     setIsMuted(!isMuted);
//   };

//   const toggleVideo = async () => {
//     if (!videoCallType || !localStream) return;

//     try {
//       localStream.getVideoTracks().forEach(async (track) => {
//         track.enabled = !track.enabled;
//         setIsLocalVideoEnabled(track.enabled);

//         // Update Supabase
//         const { error } = await supabase
//           .from("users")
//           .update({
//             isvideoon: track.enabled,
//           })
//           .eq("email", auth?.currentUser?.email);

//         if (error) {
//           console.error("Error updating video status:", error);
//         }
//       });
//     } catch (error) {
//       console.error("toggleVideo error:", error);
//     }
//   };

//   // Render video streams for video call
//   const renderVideoStreams = () => {
//     if (videoCallType) {
//       return (
//         <div className="video-container">
//           {/* Remote Video */}
//           <div className="remote-video-container">
//             {remoteStream && isVideoOn ? (
//               <video
//                 ref={remoteVideoRef}
//                 className="remote-video"
//                 autoPlay
//                 playsInline
//               />
//             ) : (
//               <div className="remote-video-placeholder">
//                 <IoVideocamOff className="placeholder-icon" />
//                 <p>Camera Off</p>
//               </div>
//             )}
//           </div>
          
//           {/* Local Video */}
//           {localStream && isLocalVideoEnabled && (
//             <div className="local-video-container">
//               <video
//                 ref={localVideoRef}
//                 className="local-video"
//                 autoPlay
//                 playsInline
//                 muted
//                 style={{ 
//                   transform: isFrontCamera ? 'scaleX(1)' : 'scaleX(-1)'
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       );
//     } else {
//       // Audio call UI
//       return (
//         <div className="audio-call-container">
//           <div className="avatar-container">
//             <div className="avatar">
//               <img 
//                 src={avatar} 
//                 alt="Caller Avatar" 
//                 className="avatar-image"
//               />
//             </div>
//             <p className="peer-name-audio">{peerEmail || 'Unknown User'}</p>
//             <p className="call-status-audio">{callStatus}</p>
//             {callInProgress && remoteStream && (
//               <p className="call-timer-audio">{formatCallTime(callDuration)}</p>
//             )}
//           </div>
//         </div>
//       );
//     }
//   };

//   return (
//     <div className="join-screen">
//       {/* Header */}
//       <div className="call-header">
//         <div className="caller-info">
//           <h2 className="peer-name">{peerEmail || 'Unknown User'}</h2>
//           <p className="call-status">{callStatus}</p>
//           {callInProgress && remoteStream && (
//             <p className="call-timer">{formatCallTime(callDuration)}</p>
//           )}
//         </div>
//       </div>

//       {/* Video/Audio Streams */}
//       <div className="media-container">
//         {renderVideoStreams()}
//       </div>

//       {/* Controls */}
//       <div className="controls-container">
//         {callInProgress && (
//           <div className="call-controls">
//             {/* Mute/Unmute */}
//             <button 
//               className={`control-btn ${isMuted ? 'active' : ''}`}
//               onClick={toggleMute}
//             >
//               {isMuted ? <IoMicOff /> : <IoMic />}
//               <span>{isMuted ? 'Unmute' : 'Mute'}</span>
//             </button>

//             {/* Video Toggle */}
//             {videoCallType && (
//               <button 
//                 className={`control-btn ${!isLocalVideoEnabled ? 'active' : ''}`}
//                 onClick={toggleVideo}
//               >
//                 {isLocalVideoEnabled ? <IoVideocam /> : <IoVideocamOff />}
//                 <span>{isLocalVideoEnabled ? 'Video' : 'Enable'}</span>
//               </button>
//             )}

//             {/* End Call */}
//             <button 
//               className="end-call-btn"
//               onClick={onBackPress}
//             >
//               <MdCallEnd />
//             </button>

//             {/* Camera Flip */}
//             {videoCallType && (
//               <button 
//                 className="control-btn"
//                 onClick={switchCamera}
//               >
//                 <IoCameraReverse />
//                 <span>Flip</span>
//               </button>
//             )}

//             {/* Quality Selector */}
//             {videoCallType && (
//               <button 
//                 className="control-btn"
//                 onClick={() => {
//                   const qualities = ['HD', 'FULL_HD', 'UHD_4K'];
//                   const currentIndex = qualities.indexOf(videoQuality);
//                   const nextIndex = (currentIndex + 1) % qualities.length;
//                   changeVideoQuality(qualities[nextIndex]);
//                 }}
//               >
//                 <MdHighQuality />
//                 <span>{videoQuality}</span>
//               </button>
//             )}
//           </div>
//         )}

//         {!localStream && (
//           <button 
//             className="permission-btn"
//             onClick={handlePermissions}
//           >
//             <IoVideocam />
//             Grant Permissions
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// WebRTC imports for React.js
const {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices
} = window;

// Icons
import { 
  IoCall,
  IoVideocam,
  IoVideocamOff,
  IoMic,
  IoMicOff,
  IoCameraReverse,
  IoPerson,
  IoClose,
  IoVolumeHigh,
  IoWifi
} from 'react-icons/io5';
import { 
  MdCallEnd, 
  MdHighQuality,
  MdSignalCellularAlt
} from 'react-icons/md';
import { 
  FaUserCircle,
  FaRegCircle,
  FaCircle
} from 'react-icons/fa';

// Firebase/Supabase imports
import { auth, db } from '../../firebase/config';
import { supabase } from '../../firebase/supabaseClient';

// Video quality presets
const VIDEO_QUALITY = {
  HD: {
    width: 1280,
    height: 720,
    frameRate: 30,
    bitrate: 2500000
  },
  FULL_HD: {
    width: 1920,
    height: 1080,
    frameRate: 30,
    bitrate: 4000000
  },
  UHD_4K: {
    width: 3840,
    height: 2160,
    frameRate: 30,
    bitrate: 8000000
  }
};

// WebRTC configuration
const configuration = {
  iceServers: [
    { urls: "stun:stun.relay.metered.ca:80" },
    {
      urls: "turn:159.223.175.154:3478",
      username: "user",
      credential: "password",
    },
    {
      urls: "turn:95.217.13.89:3478",
      username: "user",
      credential: "password",
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function JoinScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = location.state || {};
  
  const { 
    roomId, 
    peerEmail, 
    remoteAccessToken, 
    remoteFCMToken, 
    avatar,
    isVideoCall = true
  } = params;

  // State declarations
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [cachedLocalPC, setCachedLocalPC] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [callStatus, setCallStatus] = useState('Joining...');
  const [callDuration, setCallDuration] = useState(0);
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(null);
  const [videoCallType, setVideoCallType] = useState(isVideoCall);
  const [videoQuality, setVideoQuality] = useState('FULL_HD');
  const [networkQuality, setNetworkQuality] = useState('good');

  // Refs
  const callTimerRef = useRef(null);
  const unsubRef = useRef([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const ringtoneRef = useRef(null);

  // FCM Notification function
  const sendFcmNotification = async (targetToken, title, body, authToken, extraData = {}) => {
    const url = "https://fcm.googleapis.com/v1/projects/hiddo-3887f/messages:send";

    const payload = {
      message: {
        token: targetToken,
        data: {
          title,
          body,
          ...extraData,
        },
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("FCM Response:", data);
    } catch (error) {
      console.error("FCM Error:", error);
    }
  };

  // Cleanup function
  const cleanupConnections = async () => {
    try {
      console.log("Cleaning up connections...");

      stopRingtone();

      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current = null;
      }
      
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      
      if (unsubRef.current && unsubRef.current.length > 0) {
        unsubRef.current.forEach(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        });
        unsubRef.current = [];
      }
      
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
      
      if (cachedLocalPC) {
        cachedLocalPC.close();
        setCachedLocalPC(null);
      }
      
      setRemoteStream(null);
      setCallInProgress(false);
      setCallDuration(0);
      setCallStatus('Call Ended');

      console.log('Connections cleaned up successfully');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  // Ringtone functions
  const playRingtone = async () => {
    try {
      stopRingtone();
      
      const audio = new Audio('/sounds/ringtone.mp3');
      ringtoneRef.current = audio;
      
      audio.loop = true;
      audio.play().then(() => {
        console.log('Ringtone started playing');
      }).catch(error => {
        console.log('Ringtone playback failed:', error);
      });
    } catch (error) {
      console.log('Error playing ringtone:', error);
    }
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      console.log('Ringtone stopped');
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    if (!peerEmail) return;

    console.log("▶️ Subscribing to Supabase Realtime...");

    const videoOnSub = supabase
      .channel("peer-video-status")
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", 
          schema: "public", 
          table: "users", 
          filter: `email=eq.${peerEmail}` 
        },
        (payload) => {
          const status = payload.new?.isvideoon;
          console.log("📹 Peer video status updated:", status);
          setIsVideoOn(!!status);
        }
      )
      .subscribe();

    const videoCallSub = supabase
      .channel("current-user-videoCall")
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", 
          schema: "public", 
          table: "users", 
          filter: `email=eq.${auth?.currentUser?.email}` 
        },
        (payload) => {
          const status = payload.new?.isvideocall;
          console.log("📞 Video call type updated:", status);
          setVideoCallType(!!status);
        }
      )
      .subscribe();

    const hangupSub = supabase
      .channel("peer-hangup")
      .on(
        "postgres_changes",
        { 
          event: "UPDATE", 
          schema: "public", 
          table: "users", 
          filter: `email=eq.${peerEmail}` 
        },
        (payload) => {
          const status = payload.new?.iscallerhangup;
          console.log("📴 Peer hangup status:", status);
          if (status === true) {
            handlePeerHangup();
          }
        }
      )
      .subscribe();

    return () => {
      console.log("🛑 Unsubscribing Supabase Realtime...");
      supabase.removeChannel(videoOnSub);
      supabase.removeChannel(videoCallSub);
      supabase.removeChannel(hangupSub);
    };
  }, [peerEmail]);

  const handlePeerHangup = () => {
    if (window.confirm("Call Ended - Call hangup by User")) {
      try {
        cleanupConnections();
        navigate(-1);

        // Reset hangup status
        supabase
          .from("users")
          .update({ iscallerhangup: false })
          .eq("email", peerEmail);
      } catch (err) {
        console.error("❌ Exception in hangup update:", err);
      }
    }
  };

  // Call timer
  useEffect(() => {
    if (callInProgress && remoteStream) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }
    
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callInProgress, remoteStream]);

  // Auto-join when localStream is ready
  useEffect(() => {
    if (localStream && !callInProgress) {
      joinCall();
    }
  }, [localStream]);

  // Initial setup
  useEffect(() => {
    handlePermissions();
    
    return () => {
      cleanupConnections();
    };
  }, []);

  // Format call duration
  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: videoCallType 
      });
      setHasPermissions(true);
      setLocalStream(stream);
      return true;
    } catch (error) {
      console.log('Permission error:', error);
      setHasPermissions(false);
      return false;
    }
  };

  const startLocalStream = async () => {
    try {
      const quality = VIDEO_QUALITY[videoQuality];
      
      const constraints = {
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
          sampleSize: 16,
          autoGainControl: true,
        },
        video: videoCallType ? {
          width: { ideal: quality.width },
          height: { ideal: quality.height },
          frameRate: { ideal: quality.frameRate },
          facingMode: isFrontCamera ? 'user' : 'environment'
        } : false
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(newStream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = newStream;
      }

    } catch (error) {
      console.log("Error starting local stream:", error);
      if (videoQuality === 'UHD_4K' || videoQuality === 'FULL_HD') {
        console.log("Trying HD quality as fallback...");
        setVideoQuality('HD');
        setTimeout(() => startLocalStream(), 500);
      }
    }
  };

  const changeVideoQuality = async (newQuality) => {
    if (videoQuality === newQuality) return;
    
    setVideoQuality(newQuality);
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    await startLocalStream();
  };

  const joinCall = async () => {
    if (!localStream) {
      console.log("Local stream not ready yet!");
      return;
    }

    setCallInProgress(true);
    setCallStatus('Connecting...');
    
    try {
      const localPC = new RTCPeerConnection(configuration);
      
      localStream.getTracks().forEach((track) => {
        localPC.addTrack(track, localStream);
      });

      localPC.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          const remoteStream = event.streams[0];
          setRemoteStream(remoteStream);
          
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          
          setCallStatus('Connected');
          stopRingtone();
        }
      };

      localPC.onicecandidate = (event) => {
        if (!event.candidate) return;
        console.log('ICE candidate generated');
      };

      localPC.onconnectionstatechange = () => {
        console.log('PC state:', localPC.connectionState);
        if (['failed', 'disconnected', 'closed'].includes(localPC.connectionState)) {
          setCallStatus('Disconnected');
          handleCallDisconnected();
        }
      };
      
      setCachedLocalPC(localPC);

      // Update user status in Supabase
      try {
        const { error: peerErr } = await supabase
          .from("users")
          .update({ isoncallstatus: true })
          .eq("email", peerEmail);

        if (peerErr) throw peerErr;

        const { error: currentErr } = await supabase
          .from("users")
          .update({
            isvideoon: true,
            isoncallstatus: true,
          })
          .eq("email", auth?.currentUser?.email);

        if (currentErr) throw currentErr;

        console.log("✅ Call status updated successfully");
      } catch (error) {
        console.log("❌ User flag update error:", error);
      }

    } catch (error) {
      console.log("joinCall error:", error);
      setCallStatus('Connection Failed');
      stopRingtone();
      cleanupConnections();
    }
  };

  const handleCallDisconnected = () => {
    if (window.confirm("Call Disconnected - The call has ended")) {
      onBackPress();
    }
  };

  const onBackPress = async () => {
    console.log("Ending call for:", peerEmail);

    try {
      const { error: selfErr } = await supabase
        .from("users")
        .update({
          iscallingfrom: "",
          isoncallstatus: false,
        })
        .eq("email", auth.currentUser?.email);

      if (selfErr) throw selfErr;

      const { error: peerErr } = await supabase
        .from("users")
        .update({
          isoncallstatus: false,
        })
        .eq("email", peerEmail);

      if (peerErr) throw peerErr;

      sendFcmNotification(
        remoteFCMToken,
        "Call Ended",
        auth?.currentUser?.email,
        remoteAccessToken,
        { 
          Peeremail: auth?.currentUser?.email, 
          type: "Reject_Call" 
        }
      );

      await cleanupConnections();
      navigate(-1);

      console.log("✅ Call ended successfully");
    } catch (error) {
      console.log("❌ Error ending call:", error);
    }
  };

  const switchCamera = async () => {
    if (!videoCallType || !localStream) return;

    try {
      const currentVideoTrack = localStream.getVideoTracks()[0];
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isFrontCamera ? 'environment' : 'user'
        }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      const newVideoTrack = newStream.getVideoTracks()[0];

      const sender = cachedLocalPC?.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }

      currentVideoTrack.stop();
      localStream.removeTrack(currentVideoTrack);
      localStream.addTrack(newVideoTrack);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      setIsFrontCamera(!isFrontCamera);
      newStream.getTracks().forEach(track => {
        if (track.kind === 'audio') track.stop();
      });
    } catch (error) {
      console.log('Error switching camera:', error);
    }
  };

  const toggleMute = () => {
    if (!localStream) return;
    
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = async () => {
    if (!videoCallType || !localStream) return;

    try {
      localStream.getVideoTracks().forEach(async (track) => {
        track.enabled = !track.enabled;
        setIsLocalVideoEnabled(track.enabled);

        const { error } = await supabase
          .from("users")
          .update({
            isvideoon: track.enabled,
          })
          .eq("email", auth?.currentUser?.email);

        if (error) {
          console.error("Error updating video status:", error);
        }
      });
    } catch (error) {
      console.error("toggleVideo error:", error);
    }
  };

  // Render video streams for video call
  const renderVideoStreams = () => {
    if (videoCallType) {
      return (
        <div className="relative w-full h-full bg-gray-900">
          {/* Remote Video */}
          <div className="absolute inset-0">
            {remoteStream && isVideoOn ? (
              <video
                ref={remoteVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-400">
                <IoVideocamOff className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Camera Off</p>
              </div>
            )}
          </div>
          
          {/* Local Video */}
          {localStream && isLocalVideoEnabled && (
            <div className="absolute top-4 right-4 w-48 h-64 bg-black rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl z-10">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
                style={{ 
                  transform: isFrontCamera ? 'scaleX(1)' : 'scaleX(-1)'
                }}
              />
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-black/50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-medium">You</span>
              </div>
            </div>
          )}

          {/* Quality Indicator */}
          {callInProgress && (
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium capitalize">
                {videoQuality} • {networkQuality}
              </span>
            </div>
          )}
        </div>
      );
    } else {
      // Audio call UI
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <div className="relative w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Caller" className="w-full h-full object-cover" />
                ) : (
                  <IoPerson className="w-20 h-20 text-white" />
                )}
              </div>
              
              {/* Audio Waves Animation */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {[1, 2, 3, 2, 1].map((height, index) => (
                  <div
                    key={index}
                    className="w-1 bg-green-400 rounded-full animate-pulse"
                    style={{ 
                      height: `${height * 8}px`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              {peerEmail || 'Unknown User'}
            </h2>
            <p className="text-gray-300 text-lg mb-2">{callStatus}</p>
            {callInProgress && remoteStream && (
              <p className="text-white text-xl font-semibold">
                {formatCallTime(callDuration)}
              </p>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="relative z-20 bg-black/30 backdrop-blur-lg border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBackPress}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
            >
              <IoClose className="w-6 h-6 text-white" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`w-3 h-3 rounded-full absolute -top-1 -right-1 z-10 ${
                  callInProgress ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                }`}></div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <FaUserCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {peerEmail || 'Unknown User'}
                </h2>
                <div className="flex items-center space-x-2 text-white/80 text-sm">
                  <span className={`w-2 h-2 rounded-full ${
                    callStatus === 'Connected' ? 'bg-green-500' : 
                    callStatus === 'Connecting...' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span>{callStatus}</span>
                  {callInProgress && remoteStream && (
                    <>
                      <span>•</span>
                      <span className="font-mono">{formatCallTime(callDuration)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Network Quality Indicator */}
            <div className="flex items-center space-x-1 bg-black/30 px-3 py-1 rounded-full">
              <IoWifi className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm">Good</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video/Audio Streams */}
      <div className="flex-1 relative">
        {renderVideoStreams()}
      </div>

      {/* Controls */}
      <div className="relative z-20 bg-black/30 backdrop-blur-lg border-t border-white/20 px-6 py-6">
        {callInProgress ? (
          <div className="flex justify-center items-center space-x-4 lg:space-x-6">
            {/* Mute/Unmute */}
            <button 
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
              }`}
              onClick={toggleMute}
            >
              {isMuted ? 
                <IoMicOff className="w-7 h-7" /> : 
                <IoMic className="w-7 h-7" />
              }
              <span className="text-xs mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            {/* Video Toggle */}
            {videoCallType && (
              <button 
                className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                  !isLocalVideoEnabled 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                }`}
                onClick={toggleVideo}
              >
                {isLocalVideoEnabled ? 
                  <IoVideocam className="w-7 h-7" /> : 
                  <IoVideocamOff className="w-7 h-7" />
                }
                <span className="text-xs mt-1">Video</span>
              </button>
            )}

            {/* End Call */}
            <button 
              className="flex flex-col items-center justify-center w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl"
              onClick={onBackPress}
            >
              <MdCallEnd className="w-8 h-8" />
              <span className="text-xs mt-1">End</span>
            </button>

            {/* Camera Flip */}
            {videoCallType && (
              <button 
                className="flex flex-col items-center justify-center w-16 h-16 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
                onClick={switchCamera}
              >
                <IoCameraReverse className="w-7 h-7" />
                <span className="text-xs mt-1">Flip</span>
              </button>
            )}

            {/* Quality Toggle */}
            {videoCallType && (
              <button 
                className="flex flex-col items-center justify-center w-16 h-16 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
                onClick={() => {
                  const qualities = ['HD', 'FULL_HD', 'UHD_4K'];
                  const currentIndex = qualities.indexOf(videoQuality);
                  const nextIndex = (currentIndex + 1) % qualities.length;
                  changeVideoQuality(qualities[nextIndex]);
                }}
              >
                <MdHighQuality className="w-7 h-7" />
                <span className="text-xs mt-1">{videoQuality}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            {!localStream ? (
              <button 
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                onClick={handlePermissions}
              >
                <IoVideocam className="w-6 h-6" />
                <span>Grant Permissions</span>
              </button>
            ) : (
              <button 
                className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-pulse"
                onClick={joinCall}
              >
                <IoCall className="w-6 h-6" />
                <span>Join Call</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-ping,
          .transition-all,
          .transform {
            animation: none;
            transition: none;
          }
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .w-48.h-64 {
            width: 8rem;
            height: 10rem;
          }
          
          .space-x-4 {
            gap: 1rem;
          }
          
          .w-16.h-16 {
            width: 4rem;
            height: 4rem;
          }
          
          .w-20.h-20 {
            width: 5rem;
            height: 5rem;
          }
        }
        
        @media (max-width: 480px) {
          .w-48.h-64 {
            width: 6rem;
            height: 8rem;
          }
          
          .space-x-4 {
            gap: 0.5rem;
          }
          
          .w-16.h-16 {
            width: 3.5rem;
            height: 3.5rem;
          }
          
          .w-20.h-20 {
            width: 4rem;
            height: 4rem;
          }
        }
      `}</style>
    </div>
  );
}