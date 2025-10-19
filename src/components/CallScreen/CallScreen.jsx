// // import React, { useEffect, useRef, useState, useCallback } from 'react';
// // import './CallScreen.css';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import { doc, setDoc, updateDoc, getDoc, collection, onSnapshot, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
// // import { auth } from '../config/firebase';
// // import { db } from '../config/firebase';
// // import { FaPhone, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash, FaCamera, FaVolumeUp, FaWifi, FaSync } from 'react-icons/fa';
// // import { IoMdCameraReverse } from 'react-icons/io';
// // import { supabase } from "../config/supabaseClient";

// // const CallScreen = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { 
// //     setScreen, 
// //     screens, 
// //     roomId, 
// //     isVideoCall, 
// //     onCallScreenDismiss,
// //     peerEmail, 
// //     fcmToken, 
// //     accessToken, 
// //     selfFcmToken, 
// //     selfAccessToken, 
// //     avatar, 
// //     avatars 
// //   } = location.state || {};

// //   const [localStream, setLocalStream] = useState(null);
// //   const [remoteStreamState, setRemoteStreamState] = useState(null);
// //   const [isFrontCamera, setFrontCamera] = useState(true);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [hasPermissions, setPermissions] = useState(false);
// //   const [callInProgress, setCallInProgress] = useState(false);
// //   const [callStatus, setCallStatus] = useState('Connecting...');
// //   const [callDuration, setCallDuration] = useState(0);
// //   const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
// //   const [isTapHangup, setIsTapHangup] = useState(null);
// //   const [isVideoOn, setIsVideoOn] = useState(null);
// //   const [isCallhangup, setIsCallhangup] = useState(null);
// //   const [videoQuality, setVideoQuality] = useState('full-hd');
// //   const [isValidCallEntry, setIsValidCallEntry] = useState(false);
// //   const [isNetworkConnected, setIsNetworkConnected] = useState(true);
// //   const [networkRetryCount, setNetworkRetryCount] = useState(0);
// //   const [isReconnecting, setIsReconnecting] = useState(false);

// //   const pcRef = useRef(null);
// //   const callStartedRef = useRef(false);
// //   const unsubRef = useRef([]);
// //   const remoteStreamRef = useRef(null);
// //   const callTimerRef = useRef(null);
// //   const cachedLocalPC = useRef(null);
// //   const soundRef = useRef(null);
// //   const localVideoRef = useRef(null);
// //   const remoteVideoRef = useRef(null);

// //   const maxRetryAttempts = 3;

// //   const videoQualitySettings = {
// //     '4k': {
// //       width: 3840,
// //       height: 2160,
// //       frameRate: 30,
// //       bitrate: 8000000
// //     },
// //     'full-hd': {
// //       width: 1920,
// //       height: 1080,
// //       frameRate: 30,
// //       bitrate: 4000000
// //     },
// //     'hd': {
// //       width: 1280,
// //       height: 720,
// //       frameRate: 30,
// //       bitrate: 2500000
// //     }
// //   };

// //   // WebRTC configuration
// //   const configuration = {
// //     iceServers: [
// //       { urls: "stun:stun.relay.metered.ca:80" },
// //       {
// //         urls: "turn:159.223.175.154:3478",
// //         username: "user",
// //         credential: "password",
// //       },
// //       {
// //         urls: "turn:95.217.13.89:3478",
// //         username: "user",
// //         credential: "password",
// //       },
// //     ],
// //     iceCandidatePoolSize: 10,
// //   };

// //   useEffect(() => {
// //     const handleBeforeUnload = (e) => {
// //       if (!callStartedRef.current && !callInProgress) {
// //         e.preventDefault();
// //         e.returnValue = 'Are you sure you want to cancel this call?';
        
// //         if (window.confirm('Are you sure you want to cancel this call?')) {
// //           cleanupBeforeCallStart();
// //         }
// //       }
// //     };

// //     window.addEventListener('beforeunload', handleBeforeUnload);
    
// //     return () => {
// //       window.removeEventListener('beforeunload', handleBeforeUnload);
// //     };
// //   }, [callInProgress]);

// //   const cleanupBeforeCallStart = async () => {
// //     try {
// //       console.log('🧹 Cleaning up before call start for:', auth?.currentUser?.email);
      
// //       const { error } = await supabase
// //         .from("users")
// //         .update({
// //           iscallingfrom: "",
// //           isoncallstatus: false,
// //           iscallerhangup: false,
// //           lastcallroom: null,
// //           isvideocall: false,
// //           isvideoon: false,
// //           updatedat: new Date().toISOString()
// //         })
// //         .eq("email", auth?.currentUser?.email);

// //       if (error) {
// //         console.error('Error cleaning up before call start:', error);
// //       } else {
// //         console.log('✅ Cleaned up before call start successfully');
// //       }

// //       if (onCallScreenDismiss) {
// //         onCallScreenDismiss();
// //       }

// //       await deleteRoomByEmail(auth.currentUser?.email);
// //       stopCallSound();
      
// //     } catch (error) {
// //       console.error('Exception during pre-call cleanup:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     const handleOnline = () => {
// //       setIsNetworkConnected(true);
// //       if (isReconnecting && callInProgress) {
// //         setCallStatus('Reconnecting...');
// //         startReconnectionAttempt();
// //       }
// //     };

// //     const handleOffline = () => {
// //       setIsNetworkConnected(false);
// //       if (callInProgress) {
// //         setCallStatus('Reconnecting...');
// //         setIsReconnecting(true);
// //         startReconnectionAttempt();
// //       }
// //     };

// //     window.addEventListener('online', handleOnline);
// //     window.addEventListener('offline', handleOffline);

// //     return () => {
// //       window.removeEventListener('online', handleOnline);
// //       window.removeEventListener('offline', handleOffline);
// //     };
// //   }, [isNetworkConnected, isReconnecting, callInProgress]);

// //   const handleNetworkLost = () => {
// //     if (callInProgress) {
// //       setCallStatus('Reconnecting...');
// //       setIsReconnecting(true);
// //       startReconnectionAttempt();
// //     }
// //   };

// //   const handleNetworkRestored = () => {
// //     if (isReconnecting && callInProgress) {
// //       setCallStatus('Reconnecting...');
// //       startReconnectionAttempt();
// //     }
// //   };

// //   const startReconnectionAttempt = () => {
// //     if (networkRetryCount >= maxRetryAttempts) {
// //       handleCallFailure('Unable to reconnect. Please try calling again.');
// //       return;
// //     }

// //     setNetworkRetryCount(prev => prev + 1);
// //     console.log(`🔄 Reconnection attempt ${networkRetryCount + 1}/${maxRetryAttempts}`);
    
// //     attemptReconnection();
// //   };

// //   const attemptReconnection = async () => {
// //     try {
// //       if (pcRef.current) {
// //         const offer = await pcRef.current.createOffer({ iceRestart: true });
// //         await pcRef.current.setLocalDescription(offer);
        
// //         const roomRef = doc(collection(db, 'room'), roomId);
// //         await setDoc(roomRef, { 
// //           offer: { type: offer.type, sdp: offer.sdp }, 
// //           updatedAt: Date.now(),
// //           isReconnecting: true
// //         }, { merge: true });
// //       }
// //     } catch (error) {
// //       console.log('Reconnection error:', error);
      
// //       if (networkRetryCount < maxRetryAttempts) {
// //         setTimeout(startReconnectionAttempt, 2000);
// //       } else {
// //         handleCallFailure('Call disconnected due to network issues.');
// //       }
// //     }
// //   };

// //   const handleCallFailure = (message) => {
// //     setCallStatus('Call Failed');
// //     setIsReconnecting(false);
    
// //     alert(
// //       "Call Disconnected",
// //       message
// //     );

// //     forceCleanupAndExit();
// //   };

// //   useEffect(() => {
// //     console.log("🔍 Validating call screen entry for:", peerEmail);
    
// //     const validateCallEntry = async () => {
// //       try {
// //         console.log('🔍 Validating call screen entry...');
        
// //         const { data: currentUser, error } = await supabase
// //           .from("users")
// //           .select("isoncallstatus, iscallingfrom, updatedat")
// //           .eq("email", auth?.currentUser?.email)
// //           .single();

// //         if (error) {
// //           console.error('Error validating user:', error);
// //           setIsValidCallEntry(true);
// //           return;
// //         }

// //         if (currentUser?.isoncallstatus) {
// //           const isStale = await checkIfStaleCall(currentUser);
// //           if (isStale) {
// //             console.log('🕒 Stale call detected, cleaning up immediately...');
// //             await cleanupStaleCallImmediate(auth?.currentUser?.email);
// //             setIsValidCallEntry(true);
// //             return;
// //           }
// //         }

// //         if (!currentUser?.isoncallstatus) {
// //           console.log('❌ Invalid call screen entry - user not in call, navigating back');
// //           alert('Call Ended', 'The call has already ended');
// //           navigate(-1);
// //           return;
// //         }

// //         console.log('✅ Valid call screen entry');
// //         setIsValidCallEntry(true);
        
// //       } catch (error) {
// //         console.error('Validation error:', error);
// //         setIsValidCallEntry(true);
// //       }
// //     };

// //     validateCallEntry();
// //   }, []);

// //   const checkIfStaleCall = async (user) => {
// //     if (!user?.updatedat) return true;
    
// //     const lastUpdate = new Date(user.updatedat);
// //     const now = new Date();
// //     const diffMinutes = (now - lastUpdate) / (1000 * 60);
    
// //     console.log(`Call status age: ${diffMinutes.toFixed(2)} minutes`);
// //     return diffMinutes > 2;
// //   };

// //   const cleanupStaleCallImmediate = async (email) => {
// //     try {
// //       console.log('🧹 IMMEDIATE Cleaning up stale call for:', email);
      
// //       const { error } = await supabase
// //         .from("users")
// //         .update({
// //           iscallingfrom: "",
// //           isoncallstatus: false,
// //           iscallerhangup: false,
// //           lastcallroom: null,
// //           isvideocall: false,
// //           isvideoon: false,
// //           updatedat: new Date().toISOString()
// //         })
// //         .eq("email", email);

// //       if (error) {
// //         console.error('Error in immediate stale call cleanup:', error);
// //       } else {
// //         console.log('✅ Immediate stale call cleanup successful');
// //       }
// //     } catch (error) {
// //       console.error('Exception during immediate stale call cleanup:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     const handleVisibilityChange = () => {
// //       if (document.hidden) {
// //         console.log('📱 App going to background, keeping call active');
// //         keepCallActiveInBackground();
// //       } else {
// //         if (localStream) {
// //           localStream.getTracks().forEach(track => {
// //             track.enabled = true;
// //           });
// //         }
// //       }
// //     };

// //     document.addEventListener('visibilitychange', handleVisibilityChange);

// //     return () => {
// //       document.removeEventListener('visibilitychange', handleVisibilityChange);
// //     };
// //   }, [callInProgress, localStream]);

// //   const keepCallActiveInBackground = () => {
// //     // For web, we don't need special background handling
// //     console.log('Keeping call active in background');
// //   };

// //   const playCallSound = async () => {
// //     try {
// //       stopCallSound();
// //       // Web audio implementation
// //       const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// //       // Add your ringtone logic here
// //       console.log('Playing call sound');
// //     } catch (error) {
// //       console.log('Error playing call sound:', error);
// //     }
// //   };

// //   const stopCallSound = () => {
// //     // Stop any playing sounds
// //     console.log('Stopping call sound');
// //   };

// //   useEffect(() => {
// //     if (!isValidCallEntry) return;

// //     console.log("👀 Subscribing to realtime user changes for", peerEmail);

// //     const videoSub = supabase
// //       .channel(`video-status-${peerEmail}`)
// //       .on(
// //         "postgres_changes",
// //         {
// //           event: "UPDATE",
// //           schema: "public",
// //           table: "users",
// //           filter: `email=eq.${peerEmail}`,
// //         },
// //         (payload) => {
// //           const newStatus = payload.new.isvideoon;
// //           console.log("Peer video status:", newStatus);
// //           setIsVideoOn(!!newStatus);
// //         }
// //       )
// //       .subscribe();

// //     const hangupSub = supabase
// //       .channel(`hangup-status-${peerEmail}`)
// //       .on(
// //         "postgres_changes",
// //         {
// //           event: "UPDATE",
// //           schema: "public",
// //           table: "users",
// //           filter: `email=eq.${peerEmail}`,
// //         },
// //         (payload) => {
// //           const hangupStatus = payload.new.iscallerhangup;
// //           console.log("Peer hangup status:", hangupStatus);
          
// //           if (hangupStatus === true) {
// //             console.log("Peer hung up the call");
// //             handlePeerHangup();
// //           }
// //         }
// //       )
// //       .subscribe();

// //     return () => {
// //       console.log("🛑 Unsubscribing realtime listeners");
// //       supabase.removeChannel(videoSub);
// //       supabase.removeChannel(hangupSub);
// //     };
// //   }, [peerEmail, isValidCallEntry]);

// //   const handlePeerHangup = () => {
// //     alert(
// //       "Call Ended",
// //       "Call ended by the other user"
// //     );
// //     onRejectBackPress();
// //   };

// //   useEffect(() => {
// //     if (callInProgress && remoteStreamState) {
// //       callTimerRef.current = setInterval(() => {
// //         setCallDuration(prev => prev + 1);
// //       }, 1000);
// //     } else {
// //       if (callTimerRef.current) {
// //         clearInterval(callTimerRef.current);
// //         callTimerRef.current = null;
// //       }
// //     }
    
// //     return () => {
// //       if (callTimerRef.current) {
// //         clearInterval(callTimerRef.current);
// //         callTimerRef.current = null;
// //       }
// //     };
// //   }, [callInProgress, remoteStreamState]);

// //   const formatCallTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
// //   };

// //   useEffect(() => {
// //     if (!isValidCallEntry) return;

// //     (async () => {
// //       const ok = await handlePermissionsAndStream();
// //       if (!ok) return;
// //     })();

// //     return () => {
// //       cleanupConnections();
// //     };
// //   }, [isValidCallEntry]);

// //   const handlePermissionsAndStream = async () => {
// //     try {
// //       const permissionsGranted = await requestCamAudioPermissions();
      
// //       if (permissionsGranted) {
// //         setPermissions(true);
// //         await startLocalStream();
// //         return true;
// //       } else {
// //         showPermissionGuidance();
// //         return false;
// //       }
// //     } catch (error) {
// //       console.log('Permission and stream error:', error);
// //       alert(
// //         'Permission Error',
// //         'Unable to access camera and microphone. Please check your device settings.'
// //       );
// //       return false;
// //     }
// //   };

// //   const showPermissionGuidance = () => {
// //     alert(
// //       'Permissions Required',
// //       'Please enable Camera and Microphone access in your browser settings to make calls.'
// //     );
// //   };

// //   const requestCamAudioPermissions = async () => {
// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({ 
// //         video: true, 
// //         audio: true 
// //       });
      
// //       // Stop the stream immediately after getting permissions
// //       stream.getTracks().forEach(track => track.stop());
      
// //       return true;
// //     } catch (error) {
// //       console.log('Permission error:', error);
// //       return false;
// //     }
// //   };

// //   const checkDeviceCapabilities = async () => {
// //     try {
// //       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// //       const videoTrack = stream.getVideoTracks()[0];
// //       const capabilities = videoTrack.getCapabilities();
      
// //       console.log('Device capabilities:', {
// //         maxWidth: capabilities.width?.max,
// //         maxHeight: capabilities.height?.max,
// //         maxFrameRate: capabilities.frameRate?.max
// //       });
      
// //       videoTrack.stop();
// //       return capabilities;
// //     } catch (error) {
// //       console.log('Error checking device capabilities:', error);
// //       return null;
// //     }
// //   };

// //   const startLocalStream = async () => {
// //     try {
// //       const capabilities = await checkDeviceCapabilities();
      
// //       let qualityToUse = videoQuality;
// //       if (capabilities) {
// //         if (capabilities.width?.max >= 3840 && capabilities.height?.max >= 2160) {
// //           qualityToUse = '4k';
// //         } else if (capabilities.width?.max >= 1920 && capabilities.height?.max >= 1080) {
// //           qualityToUse = 'full-hd';
// //         } else {
// //           qualityToUse = 'hd';
// //         }
// //         setVideoQuality(qualityToUse);
// //       }
      
// //       const quality = videoQualitySettings[qualityToUse];
      
// //       const constraints = {
// //         audio: {
// //           channelCount: 1,
// //           echoCancellation: true,
// //           noiseSuppression: true,
// //           sampleRate: 48000,
// //           sampleSize: 16,
// //           autoGainControl: true
// //         },
// //         video: isVideoCall ? {
// //           width: { ideal: quality.width },
// //           height: { ideal: quality.height },
// //           frameRate: { ideal: quality.frameRate },
// //           facingMode: isFrontCamera ? 'user' : 'environment',
// //         } : false
// //       };

// //       const stream = await navigator.mediaDevices.getUserMedia(constraints);
// //       setLocalStream(stream);
// //       cachedLocalPC.current = stream;
      
// //       if (localVideoRef.current) {
// //         localVideoRef.current.srcObject = stream;
// //       }

// //       if (!isVideoCall) {
// //         setIsLocalVideoEnabled(false);
// //         stream.getVideoTracks().forEach(track => {
// //           track.enabled = false;
// //         });
// //       }
      
// //       console.log('Video quality set to:', qualityToUse);
// //     } catch (error) {
// //       console.log('Error starting local stream:', error);
// //       if (error.name === 'OverconstrainedError') {
// //         console.log('High quality not supported, trying lower quality...');
// //         if (videoQuality === '4k') {
// //           setVideoQuality('full-hd');
// //           await startLocalStream();
// //         } else if (videoQuality === 'full-hd') {
// //           setVideoQuality('hd');
// //           await startLocalStream();
// //         }
// //       }
// //     }
// //   };

// //   const sendFcmNotification = async (targetToken, title, body, authToken, extraData = {}) => {
// //     const url = "https://fcm.googleapis.com/v1/projects/hiddo-3887f/messages:send";

// //     const payload = {
// //       message: {
// //         token: targetToken,
// //         data: {
// //           title,
// //           body,
// //           ...extraData,
// //         },
// //       },
// //     };

// //     console.log("FCM Payload:", payload);

// //     try {
// //       const response = await fetch(url, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": authToken,
// //         },
// //         body: JSON.stringify(payload),
// //       });

// //       const data = await response.json();
// //       console.log("FCM Response:", data);
// //     } catch (error) {
// //       console.error("FCM Error:", error);
// //     }
// //   };

// //   const startCall = async (id) => {
// //     if (!isValidCallEntry) {
// //       alert('Error', 'Invalid call session');
// //       return;
// //     }

// //     try {
// //       if (!localStream) {
// //         console.log('No local stream available');
// //         return;
// //       }

// //       callStartedRef.current = true;
// //       setCallInProgress(true);
// //       setCallStatus('Calling...');
// //       playCallSound();

// //       // WebRTC implementation for web
// //       const pc = new RTCPeerConnection(configuration);
// //       pcRef.current = pc;

// //       pc.oniceconnectionstatechange = () => {
// //         console.log('ICE Connection State:', pc.iceConnectionState);
        
// //         switch(pc.iceConnectionState) {
// //           case 'connected':
// //           case 'completed':
// //             setCallStatus('Connected');
// //             setIsReconnecting(false);
// //             setNetworkRetryCount(0);
// //             break;
            
// //           case 'disconnected':
// //             if (isNetworkConnected) {
// //               setCallStatus('Reconnecting...');
// //               startReconnectionAttempt();
// //             } else {
// //               setCallStatus('Network Issue');
// //             }
// //             break;
            
// //           case 'failed':
// //             setCallStatus('Connection Failed');
// //             handleCallFailure('Connection failed. Please try again.');
// //             break;
// //         }
// //       };

// //       pc.onconnectionstatechange = () => {
// //         console.log('Connection State:', pc.connectionState);
        
// //         if (['failed', 'disconnected', 'closed'].includes(pc.connectionState)) {
// //           stopCallSound();

// //           if (pc.connectionState === "disconnected") {
// //             if (isNetworkConnected) {
// //               setCallStatus('Reconnecting...');
// //               startReconnectionAttempt();
// //               return;
// //             } else {
// //               setCallStatus('Disconnected');
// //               setIsCallhangup(true);
// //               alert(
// //                 "Network Issue",
// //                 "Call disconnected due to network problem"
// //               );
// //             }
// //           }

// //           if (pc.connectionState === "closed") {
// //             enhancedCleanupUserStatus();
// //           }
// //         }
// //       };

// //       localStream.getTracks().forEach(track => {
// //         pc.addTrack(track, localStream);
// //       });

// //       pc.ontrack = (event) => {
// //         const [remoteStream] = event.streams;
// //         setRemoteStreamState(remoteStream);
        
// //         if (remoteVideoRef.current) {
// //           remoteVideoRef.current.srcObject = remoteStream;
// //         }
        
// //         setCallStatus('Connected');
// //         stopCallSound();
// //         setIsReconnecting(false);
// //         setNetworkRetryCount(0);
// //       };

// //       pc.onicecandidate = (event) => {
// //         if (!event.candidate) return;
        
// //         const sendIceCandidate = async (retryCount = 0) => {
// //           try {
// //             const roomRef = doc(collection(db, 'room'), id);
// //             const callerCandidates = collection(roomRef, 'callerCandidates');
// //             await addDoc(callerCandidates, {
// //               candidate: event.candidate.candidate,
// //               sdpMid: event.candidate.sdpMid,
// //               sdpMLineIndex: event.candidate.sdpMLineIndex,
// //               ts: Date.now(),
// //             });
// //           } catch (err) {
// //             if (retryCount < 2) {
// //               console.log(`Retrying ICE candidate (${retryCount + 1}/3)...`);
// //               setTimeout(() => sendIceCandidate(retryCount + 1), 1000);
// //             } else {
// //               console.log('Failed to send ICE candidate after retries:', err);
// //             }
// //           }
// //         };
        
// //         sendIceCandidate();
// //       };

// //       const offer = await pc.createOffer({
// //         offerToReceiveAudio: true, 
// //         offerToReceiveVideo: isVideoCall,
// //         iceRestart: false
// //       });
      
// //       await pc.setLocalDescription(offer);

// //       const roomRef = doc(collection(db, 'room'), id);
// //       await setDoc(roomRef, { 
// //         offer: { type: offer.type, sdp: offer.sdp }, 
// //         updatedAt: Date.now(),
// //         videoQuality: videoQuality
// //       }, { merge: true });

// //       const unsubAnswer = onSnapshot(roomRef, async (snap) => {
// //         try {
// //           const data = snap.data();
// //           if (!data?.answer) return;
// //           if (!pc.currentRemoteDescription) {
// //             const ans = new RTCSessionDescription({ type: data.answer.type, sdp: data.answer.sdp });
// //             await pc.setRemoteDescription(ans).catch(e => console.log('setRemoteDescription err:', e));
// //           }
// //         } catch (e) {
// //           console.log('answer listener err:', e);
// //         }
// //       });

// //       const calleeCandidates = collection(roomRef, 'calleeCandidates');
// //       const unsubCallee = onSnapshot(calleeCandidates, (snapshot) => {
// //         snapshot.docChanges().forEach(async change => {
// //           if (change.type !== 'added') return;
// //           const c = change.doc.data();
// //           try {
// //             await pc.addIceCandidate(new RTCIceCandidate({
// //               candidate: c.candidate,
// //               sdpMid: c.sdpMid,
// //               sdpMLineIndex: c.sdpMLineIndex,
// //             }));
// //           } catch (e) {
// //             console.log('addIceCandidate err:', e?.message || e);
// //           }
// //         });
// //       });

// //       unsubRef.current.push(unsubAnswer, unsubCallee);

// //       await updateUserCallStatus(id);

// //       console.log('✅ Call started successfully');

// //     } catch (err) {
// //       console.log('startCall error:', err);
// //       setCallInProgress(false);
// //       callStartedRef.current = false;
// //       setCallStatus('Connection Failed');
// //       stopCallSound();
      
// //       await enhancedCleanupUserStatus();
// //       cleanupConnections();
// //     }
// //   };

// //   const updateUserCallStatus = async (roomId, retryCount = 0) => {
// //     try {
// //       const { error: peerError } = await supabase
// //         .from("users")
// //         .update({
// //           iscallingfrom: auth?.currentUser?.email || null,
// //           isoncallstatus: true,
// //           lastcallroom: roomId,
// //           isvideocall: isVideoCall,
// //           updatedat: new Date().toISOString()
// //         })
// //         .eq("email", peerEmail);

// //       if (peerError) throw peerError;

// //       const { error: currentError } = await supabase
// //         .from("users")
// //         .update({
// //           isvideoon: isVideoCall,
// //           isoncallstatus: true,
// //           updatedat: new Date().toISOString()
// //         })
// //         .eq("email", auth?.currentUser?.email);

// //       if (currentError) throw currentError;

// //       setIsTapHangup(true);

// //       sendFcmNotification(
// //         fcmToken,
// //         "Start Call",
// //         auth?.currentUser?.email,
// //         accessToken,
// //         { 
// //           Peeremail: auth?.currentUser?.email, 
// //           type: "Incoming_Call", 
// //           remoteAccessToken: selfAccessToken, 
// //           remoteFCMToken: selfFcmToken, 
// //           screenName: "JoinScreen", 
// //           avatar: avatars 
// //         }
// //       );

// //       console.log("✅ Call flags updated successfully");
// //     } catch (e) {
// //       if (retryCount < 3) {
// //         console.log(`Retrying user status update (${retryCount + 1}/3)...`);
// //         await new Promise(resolve => setTimeout(resolve, 1000));
// //         return updateUserCallStatus(roomId, retryCount + 1);
// //       }
// //       console.error("❌ User flag update failed after retries:", e);
// //       throw e;
// //     }
// //   };

// //   const enhancedCleanupUserStatus = async () => {
// //     try {
// //       console.log('🧹 ENHANCED Cleaning up user status...');
      
// //       const cleanupPromises = [
// //         supabase
// //           .from("users")
// //           .update({
// //             iscallingfrom: "",
// //             isoncallstatus: false,
// //             iscallerhangup: false,
// //             lastcallroom: null,
// //             isvideocall: false,
// //             isvideoon: false,
// //             updatedat: new Date().toISOString()
// //           })
// //           .eq("email", auth?.currentUser?.email),
          
// //         supabase
// //           .from("users")
// //           .update({
// //             iscallingfrom: "",
// //             isoncallstatus: false,
// //             iscallerhangup: false,
// //             updatedat: new Date().toISOString()
// //           })
// //           .eq("email", peerEmail)
// //       ];

// //       await Promise.all(cleanupPromises);
      
// //       await deleteRoomByEmail(auth.currentUser?.email);
      
// //       console.log('✅ Enhanced user status cleanup successful');
// //     } catch (error) {
// //       console.error("❌ Error in enhanced cleanup:", error);
// //     }
// //   };

// //   const switchCamera = async () => {
// //     if (isVideoCall && localStream) {
// //       try {
// //         const newFacingMode = isFrontCamera ? 'environment' : 'user';
// //         const stream = await navigator.mediaDevices.getUserMedia({
// //           video: { facingMode: newFacingMode },
// //           audio: true
// //         });
        
// //         if (localVideoRef.current) {
// //           localVideoRef.current.srcObject = stream;
// //         }
        
// //         // Replace the old stream tracks
// //         localStream.getTracks().forEach(track => track.stop());
// //         setLocalStream(stream);
// //         setFrontCamera(!isFrontCamera);
// //       } catch (error) {
// //         console.log('Error switching camera:', error);
// //       }
// //     }
// //   };

// //   const toggleMute = () => {
// //     if (localStream) {
// //       localStream.getAudioTracks().forEach(track => {
// //         track.enabled = !track.enabled;
// //         setIsMuted(!track.enabled);
// //       });
// //     }
// //   };

// //   const toggleVideo = async () => {
// //     if (isVideoCall && localStream) {
// //       localStream.getVideoTracks().forEach(async (track) => {
// //         track.enabled = !track.enabled;
// //         setIsLocalVideoEnabled(track.enabled);

// //         try {
// //           const { error } = await supabase
// //             .from("users")
// //             .update({
// //               isvideoon: track.enabled,
// //               updatedat: new Date().toISOString()
// //             })
// //             .eq("email", auth?.currentUser?.email);

// //           if (error) {
// //             console.error("❌ Error updating video status:", error);
// //           } else {
// //             console.log("✅ Video status updated in Supabase:", track.enabled);
// //           }
// //         } catch (err) {
// //           console.error("❌ toggleVideo error:", err);
// //         }
// //       });
// //     }
// //   };

// //   const toggleSpeaker = () => {
// //     // For web, speaker control is handled by the browser/OS
// //     console.log('Speaker toggle - controlled by browser/OS');
// //   };

// //   const forceCleanupAndExit = async () => {
// //     try {
// //       await enhancedCleanupUserStatus();
// //       cleanupConnections();
      
// //       navigate(-1);
// //     } catch (error) {
// //       console.error('Error in force cleanup:', error);
// //       navigate(-1);
// //     }
// //   };

// //   const onBackPress = async () => {
// //     try {
// //       console.log("Ending call for:", peerEmail);
// //       stopCallSound();

// //       await enhancedCleanupUserStatus();

// //       if (callStartedRef.current) {
// //         sendFcmNotification(
// //           fcmToken,
// //           "Call Ended",
// //           auth?.currentUser?.email,
// //           accessToken,
// //           { 
// //             Peeremail: auth?.currentUser?.email, 
// //             type: "Reject_Call", 
// //             remoteAccessToken: selfAccessToken, 
// //             remoteFCMToken: selfFcmToken 
// //           }
// //         );
// //       }

// //       cleanupConnections();
// //       navigate(-1);

// //       console.log("✅ Call ended successfully");
// //     } catch (e) {
// //       console.error("❌ Error ending call:", e);
// //       enhancedCleanupUserStatus().finally(() => {
// //         navigate(-1);
// //       });
// //     }
// //   };

// //   const onRejectBackPress = async () => {
// //     try {
// //       console.log("Rejecting call for:", peerEmail);
// //       stopCallSound();

// //       await enhancedCleanupUserStatus();
// //       cleanupConnections();
// //       navigate(-1);

// //       console.log("✅ Call rejected successfully");
// //     } catch (e) {
// //       console.error("❌ Error rejecting call:", e);
// //       navigate(-1);
// //     }
// //   };

// //   const deleteRoomByEmail = async (email) => {
// //     try {
// //       if (!email) return;
      
// //       const roomRef = doc(db, "room", email);
// //       const roomSnapshot = await getDoc(roomRef);
      
// //       if (roomSnapshot.exists()) {
// //         const subcollections = ["calleeCandidates", "callerCandidates"];
        
// //         for (const sub of subcollections) {
// //           const subColRef = collection(db, "room", email, sub);
// //           const subDocs = await getDocs(subColRef);
          
// //           const deletePromises = subDocs.docs.map(subDoc => deleteDoc(doc(subColRef, subDoc.id)));
// //           await Promise.all(deletePromises);
// //         }
        
// //         await deleteDoc(roomRef);
// //         console.log(`${email} room and its subcollections deleted successfully`);
// //       }
// //     } catch (error) {
// //       console.error("Error deleting room:", error);
// //     }
// //   };

// //   const cleanupConnections = async () => {
// //     try {
// //       console.log("Cleaning up connections...");

// //       stopCallSound();

// //       if (soundRef.current) {
// //         soundRef.current = null;
// //       }

// //       if (callTimerRef.current) {
// //         clearInterval(callTimerRef.current);
// //         callTimerRef.current = null;
// //       }

// //       if (unsubRef.current && unsubRef.current.length > 0) {
// //         unsubRef.current.forEach(unsubscribe => {
// //           if (typeof unsubscribe === "function") {
// //             unsubscribe();
// //           }
// //         });
// //         unsubRef.current = [];
// //       }

// //       if (localStream) {
// //         localStream.getTracks().forEach(track => {
// //           track.stop();
// //           track.enabled = false;
// //         });
// //       }

// //       if (pcRef.current && typeof pcRef.current.close === "function") {
// //         pcRef.current.close();
// //         pcRef.current = null;
// //       }

// //       if (cachedLocalPC.current) {
// //         cachedLocalPC.current = null;
// //       }

// //       if (remoteStreamRef.current) {
// //         remoteStreamRef.current = null;
// //       }

// //       setRemoteStreamState(null);
// //       setCallInProgress(false);
// //       setCallDuration(0);
// //       setCallStatus("Call Ended");
// //       setIsReconnecting(false);
// //       setNetworkRetryCount(0);

// //       console.log("Connections cleaned up successfully");
// //     } catch (error) {
// //       console.error("Error during cleanup:", error);
// //     }
// //   };

// //   if (!isValidCallEntry) {
// //     return (
// //       <div className="gradient-container">
// //         <div className="container">
// //           <div className="loading-container">
// //             <div className="loading-text">Validating call...</div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="gradient-container">
// //       <div className="container">
// //         {/* Network Status Indicator */}
// //         {(!isNetworkConnected || isReconnecting) && (
// //           <div className="network-status-container">
// //             <div className={`network-status ${!isNetworkConnected ? 'network-error' : 'reconnecting'}`}>
// //               {!isNetworkConnected ? <FaWifi /> : <FaSync />}
// //               <div className="network-status-text">
// //                 {!isNetworkConnected 
// //                   ? "No Network Connection" 
// //                   : `Reconnecting... (${networkRetryCount}/${maxRetryAttempts})`
// //                 }
// //               </div>
// //             </div>
// //           </div>
// //         )}
        
// //         <div className="content">
          
// //           {/* Header */}
// //           <div className="header">
// //             <div className="peer-name">{peerEmail || 'Unknown User'}</div>
// //             <div className="call-status">{callStatus}</div>
// //             {callInProgress && remoteStreamState && (
// //               <div className="call-timer">{formatCallTime(callDuration)}</div>
// //             )}
// //           </div>

// //           {/* Video/Audio Streams */}
// //           <div className="media-container">
// //             {isVideoCall ? (
// //               <>
// //                 {remoteStreamState && isVideoOn ? (
// //                   <video 
// //                     ref={remoteVideoRef}
// //                     className="remote-video" 
// //                     autoPlay
// //                     playsInline
// //                   />
// //                 ) : (
// //                   <div className="remote-video-placeholder">
// //                     <FaVideoSlash size={80} color="rgba(255,255,255,0.5)" />
// //                     <div className="placeholder-text">Camera Off</div>
// //                   </div>
// //                 )}
                
// //                 {localStream && isLocalVideoEnabled && (
// //                   <div className="local-video-container">
// //                     <video 
// //                       ref={localVideoRef}
// //                       className="local-video" 
// //                       autoPlay
// //                       playsInline
// //                       muted
// //                     />
// //                   </div>
// //                 )}
// //               </>
// //             ) : (
// //               <div className="audio-call-container">
// //                 <div className="avatar-container">
// //                   <div className="avatar-wrapper">
// //                     <img
// //                       src={avatar}
// //                       className="avatar-image"
// //                       alt="User avatar"
// //                     />
// //                   </div>
// //                 </div>
// //                 <div className="audio-call-text">Audio Call in Progress</div>
// //               </div>
// //             )}
// //           </div>

// //           {/* Enhanced Call Controls */}
// //           <div className="controls-container">
// //             {!localStream && (
// //               <button 
// //                 className="permission-button"
// //                 onClick={handlePermissionsAndStream}
// //               >
// //                 <div className="permission-gradient">
// //                   <FaCamera size={24} color="#FFF" />
// //                   <div className="button-text">Grant Permissions</div>
// //                 </div>
// //               </button>
// //             )}

// //             {localStream && !callInProgress && (
// //               <button
// //                 className="start-call-button"
// //                 onClick={() => startCall(roomId)}
// //               >
// //                 <div className="start-call-gradient">
// //                   <FaPhone size={24} color="#FFF" />
// //                   <div className="button-text">Start Call</div>
// //                 </div>
// //               </button>
// //             )}

// //             {callInProgress && (
// //               <div className="call-controls">
// //                 {/* Mute/Unmute Button */}
// //                 <button 
// //                   className={`control-button ${isMuted ? 'control-button-active' : ''}`}
// //                   onClick={toggleMute}
// //                   disabled={!localStream}
// //                 >
// //                   <div className="control-button-gradient">
// //                     {isMuted ? <FaMicrophoneSlash size={24} color="#FFF" /> : <FaMicrophone size={24} color="#FFF" />}
// //                     <div className="control-button-text">
// //                       {isMuted ? 'Unmute' : 'Mute'}
// //                     </div>
// //                   </div>
// //                 </button>

// //                 {/* Video Toggle Button - Only for video calls */}
// //                 {isVideoCall && (
// //                   <button 
// //                     className={`control-button ${!isLocalVideoEnabled ? 'control-button-active' : ''}`}
// //                     onClick={toggleVideo}
// //                     disabled={!localStream}
// //                   >
// //                     <div className="control-button-gradient">
// //                       {isLocalVideoEnabled ? <FaVideo size={24} color="#FFF" /> : <FaVideoSlash size={24} color="#FFF" />}
// //                       <div className="control-button-text">
// //                         {isLocalVideoEnabled ? 'Video On' : 'Video Off'}
// //                       </div>
// //                     </div>
// //                   </button>
// //                 )}

// //                 {/* End Call Button - Always centered */}
// //                 <button 
// //                   className="end-call-button"
// //                   onClick={onBackPress}
// //                 >
// //                   <div className="end-call-gradient">
// //                     <FaPhoneSlash size={28} color="#FFF" />
// //                   </div>
// //                 </button>

// //                 {/* Camera Flip Button - Only for video calls */}
// //                 {isVideoCall && (
// //                   <button 
// //                     className="control-button"
// //                     onClick={switchCamera}
// //                     disabled={!localStream || !isLocalVideoEnabled}
// //                   >
// //                     <div className="control-button-gradient">
// //                       <IoMdCameraReverse size={24} color="#FFF" />
// //                       <div className="control-button-text">Flip</div>
// //                     </div>
// //                   </button>
// //                 )}

// //                 {/* Speaker Toggle Button */}
// //                 <button 
// //                   className="control-button"
// //                   onClick={toggleSpeaker}
// //                 >
// //                   <div className="control-button-gradient">
// //                     <FaVolumeUp size={24} color="#FFF" />
// //                     <div className="control-button-text">Speaker</div>
// //                   </div>
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CallScreen;











// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// // import './CallScreen.css';

// import "./CallScreen.css";

// // WebRTC imports for React.js
// const {
//   RTCPeerConnection,
//   RTCSessionDescription,
//   RTCIceCandidate,
//   mediaDevices
// } = window;

// // Icons (using react-icons)
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

// export default function CallScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = location.state || {};
  
//   const { 
//     roomId, 
//     isVideoCall, 
//     peerEmail, 
//     fcmToken, 
//     accessToken, 
//     selfFcmToken, 
//     selfAccessToken, 
//     avatar, 
//     avatars 
//   } = params;

//   // State declarations
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [isFrontCamera, setIsFrontCamera] = useState(true);
//   const [isMuted, setIsMuted] = useState(false);
//   const [hasPermissions, setHasPermissions] = useState(false);
//   const [callInProgress, setCallInProgress] = useState(false);
//   const [callStatus, setCallStatus] = useState('Connecting...');
//   const [callDuration, setCallDuration] = useState(0);
//   const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
//   const [isTapHangup, setIsTapHangup] = useState(false);
//   const [isVideoOn, setIsVideoOn] = useState(null);
//   const [isCallhangup, setIsCallhangup] = useState(null);
//   const [videoQuality, setVideoQuality] = useState('full-hd');

//   // Refs
//   const pcRef = useRef(null);
//   const callStartedRef = useRef(false);
//   const unsubRef = useRef([]);
//   const remoteStreamRef = useRef(null);
//   const callTimerRef = useRef(null);
//   const cachedLocalPC = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const soundRef = useRef(null);

//   // WebRTC configuration
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

//   // Video quality settings
//   const videoQualitySettings = {
//     '4k': {
//       width: 3840,
//       height: 2160,
//       frameRate: 30,
//       bitrate: 8000000
//     },
//     'full-hd': {
//       width: 1920,
//       height: 1080,
//       frameRate: 30,
//       bitrate: 4000000
//     },
//     'hd': {
//       width: 1280,
//       height: 720,
//       frameRate: 30,
//       bitrate: 2500000
//     }
//   };

//   // Format call duration
//   const formatCallTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   // Permissions and media setup
//   const handlePermissions = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         audio: true, 
//         video: isVideoCall 
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
//       const quality = videoQualitySettings[videoQuality];
      
//       const constraints = {
//         audio: {
//           channelCount: 1,
//           echoCancellation: true,
//           noiseSuppression: true,
//           sampleRate: 48000,
//           sampleSize: 16,
//           autoGainControl: true
//         },
//         video: isVideoCall ? {
//           width: { ideal: quality.width },
//           height: { ideal: quality.height },
//           frameRate: { ideal: quality.frameRate },
//           facingMode: isFrontCamera ? 'user' : 'environment'
//         } : false
//       };

//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       setLocalStream(stream);
      
//       // Attach stream to video element
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       // For audio calls, disable video by default
//       if (!isVideoCall) {
//         setIsLocalVideoEnabled(false);
//         stream.getVideoTracks().forEach(track => {
//           track.enabled = false;
//         });
//       }

//     } catch (error) {
//       console.log('Error starting local stream:', error);
//     }
//   };

//   // FCM Notification
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

//   // Call management
//   const startCall = async (id) => {
//     try {
//       if (!localStream) return;

//       callStartedRef.current = true;
//       setCallInProgress(true);
//       setCallStatus('Calling...');

//       const pc = new RTCPeerConnection(configuration);
//       pcRef.current = pc;

//       // Add local tracks
//       localStream.getTracks().forEach(track => {
//         pc.addTrack(track, localStream);
//       });

//       // Handle remote stream
//       pc.ontrack = (event) => {
//         const remoteStream = event.streams[0];
//         setRemoteStream(remoteStream);
        
//         if (remoteVideoRef.current) {
//           remoteVideoRef.current.srcObject = remoteStream;
//         }
        
//         setCallStatus('Connected');
//         stopCallSound();
//       };

//       // ICE candidates
//       pc.onicecandidate = (event) => {
//         if (!event.candidate) return;
//         // Handle ICE candidates (Firestore implementation needed)
//         console.log('ICE candidate:', event.candidate);
//       };

//       pc.onconnectionstatechange = () => {
//         console.log('PC state:', pc.connectionState);
//         if (['failed', 'disconnected', 'closed'].includes(pc.connectionState)) {
//           handleCallEnd();
//         }
//       };

//       // Create offer
//       const offer = await pc.createOffer({
//         offerToReceiveAudio: true, 
//         offerToReceiveVideo: isVideoCall
//       });
      
//       await pc.setLocalDescription(offer);

//       // Update user status in Supabase
//       try {
//         // Update peer user
//         const { error: peerError } = await supabase
//           .from("users")
//           .update({
//             iscallingfrom: auth?.currentUser?.email || null,
//             isoncallstatus: true,
//             lastcallroom: id,
//             isvideocall: isVideoCall,
//           })
//           .eq("email", peerEmail);

//         if (peerError) throw peerError;

//         // Update current user
//         const { error: currentError } = await supabase
//           .from("users")
//           .update({
//             isvideoon: isVideoCall,
//             isoncallstatus: true,
//           })
//           .eq("email", auth?.currentUser?.email);

//         if (currentError) throw currentError;

//         setIsTapHangup(true);

//         // Send FCM notification
//         sendFcmNotification(
//           fcmToken,
//           "Start Call",
//           auth?.currentUser?.email,
//           accessToken,
//           { 
//             Peeremail: auth?.currentUser?.email, 
//             type: "Incoming_Call", 
//             remoteAccessToken: selfAccessToken, 
//             remoteFCMToken: selfFcmToken, 
//             screenName: "JoinScreen", 
//             avatar: avatars 
//           }
//         );

//         console.log("✅ Call started successfully");
//       } catch (error) {
//         console.error("❌ Error updating user status:", error);
//       }

//     } catch (error) {
//       console.log('startCall error:', error);
//       setCallInProgress(false);
//       callStartedRef.current = false;
//       setCallStatus('Connection Failed');
//       cleanupConnections();
//     }
//   };

//   const handleCallEnd = async () => {
//     setCallStatus('Disconnected');
//     setIsCallhangup(true);
    
//     // Show call ended message
//     setTimeout(() => {
//       if (window.confirm("Call ended. Return to chat?")) {
//         onBackPress();
//       }
//     }, 1000);
//   };

//   // UI Actions
//   const switchCamera = async () => {
//     if (!isVideoCall || !localStream) return;

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
//       const sender = pcRef.current.getSenders().find(s => 
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
//     if (!isVideoCall || !localStream) return;

//     const videoTrack = localStream.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack.enabled = !videoTrack.enabled;
//       setIsLocalVideoEnabled(videoTrack.enabled);

//       // Update video status in Supabase
//       try {
//         const { error } = await supabase
//           .from("users")
//           .update({
//             isvideoon: videoTrack.enabled,
//           })
//           .eq("email", auth?.currentUser?.email);

//         if (error) {
//           console.error("❌ Error updating video status:", error);
//         }
//       } catch (err) {
//         console.error("❌ toggleVideo error:", err);
//       }
//     }
//   };

//   const switchVideoQuality = async (newQuality) => {
//     try {
//       if (!localStream) return;
      
//       setVideoQuality(newQuality);
//       const quality = videoQualitySettings[newQuality];
//       const videoTrack = localStream.getVideoTracks()[0];
      
//       if (videoTrack) {
//         await videoTrack.applyConstraints({
//           width: { ideal: quality.width },
//           height: { ideal: quality.height },
//           frameRate: { ideal: quality.frameRate }
//         });
//         console.log(`Switched to ${newQuality} quality`);
//       }
//     } catch (error) {
//       console.log(`Error switching to ${newQuality}:`, error);
//     }
//   };

//   // Cleanup functions
//   const cleanupConnections = async () => {
//     try {
//       console.log("Cleaning up connections...");

//       // Clear timer
//       if (callTimerRef.current) {
//         clearInterval(callTimerRef.current);
//         callTimerRef.current = null;
//       }

//       // Stop local stream
//       if (localStream) {
//         localStream.getTracks().forEach(track => track.stop());
//       }

//       // Close peer connection
//       if (pcRef.current) {
//         pcRef.current.close();
//         pcRef.current = null;
//       }

//       // Clear remote stream
//       setRemoteStream(null);
//       setCallInProgress(false);
//       setCallDuration(0);
//       setCallStatus("Call Ended");

//       console.log("Connections cleaned up successfully");
//     } catch (error) {
//       console.error("Error during cleanup:", error);
//     }
//   };

//   const onBackPress = async () => {
//     try {
//       console.log("Ending call for:", peerEmail);

//       // Update user status in Supabase
//       const { error: err1 } = await supabase
//         .from("users")
//         .update({
//           iscallingfrom: "",
//           isoncallstatus: false,
//         })
//         .eq("email", peerEmail);

//       const { error: err2 } = await supabase
//         .from("users")
//         .update({
//           isoncallstatus: false,
//           iscallingfrom: "",
//         })
//         .eq("email", auth?.currentUser?.email);

//       const { error: err3 } = await supabase
//         .from("users")
//         .update({
//           iscallerhangup: false,
//         })
//         .eq("email", peerEmail);

//       // Send rejection notification
//       sendFcmNotification(
//         fcmToken,
//         "Call Ended",
//         auth?.currentUser?.email,
//         accessToken,
//         { 
//           Peeremail: auth?.currentUser?.email, 
//           type: "Reject_Call", 
//           remoteAccessToken: selfAccessToken, 
//           remoteFCMToken: selfFcmToken 
//         }
//       );

//       // Cleanup and navigate back
//       await cleanupConnections();
//       navigate(-1); // Go back to previous screen

//       console.log("✅ Call ended successfully");
//     } catch (error) {
//       console.error("❌ Error ending call:", error);
//     }
//   };

//   const stopCallSound = () => {
//     // Web implementation for stopping sounds
//     if (soundRef.current) {
//       soundRef.current.pause();
//       soundRef.current = null;
//     }
//   };

//   // Effects
//   useEffect(() => {
//     // Initialize call
//     const initializeCall = async () => {
//       const hasPerms = await handlePermissions();
//       if (hasPerms) {
//         await startLocalStream();
//       }
//     };

//     initializeCall();

//     return () => {
//       cleanupConnections();
//     };
//   }, []);

//   useEffect(() => {
//     // Call duration timer
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

//   // Real-time subscription for peer status
//   useEffect(() => {
//     if (!peerEmail) return;

//     const videoSub = supabase
//       .channel(`video-status-${peerEmail}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "users",
//           filter: `email=eq.${peerEmail}`,
//         },
//         (payload) => {
//           const newStatus = payload.new.isvideoon;
//           console.log("Peer video status:", newStatus);
//           setIsVideoOn(!!newStatus);
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(videoSub);
//     };
//   }, [peerEmail]);

//   return (
//     <div className="call-screen">
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
//         {isVideoCall ? (
//           <>
//             {/* Remote Video */}
//             <div className="remote-video-container">
//               {remoteStream && isVideoOn ? (
//                 <video
//                   ref={remoteVideoRef}
//                   className="remote-video"
//                   autoPlay
//                   playsInline
//                 />
//               ) : (
//                 <div className="video-placeholder">
//                   <IoVideocamOff className="placeholder-icon" />
//                   <p>Camera Off</p>
//                 </div>
//               )}
//             </div>

//             {/* Local Video */}
//             {localStream && isLocalVideoEnabled && (
//               <div className="local-video-container">
//                 <video
//                   ref={localVideoRef}
//                   className="local-video"
//                   autoPlay
//                   playsInline
//                   muted
//                   style={{ 
//                     transform: isFrontCamera ? 'scaleX(1)' : 'scaleX(-1)'
//                   }}
//                 />
//               </div>
//             )}
//           </>
//         ) : (
//           /* Audio Call UI */
//           <div className="audio-call-container">
//             <div className="avatar-container">
//               <img 
//                 src={avatar} 
//                 alt="Caller Avatar" 
//                 className="avatar-image"
//               />
//             </div>
//             <p className="audio-call-text">Audio Call in Progress</p>
//           </div>
//         )}
//       </div>

//       {/* Controls */}
//       <div className="controls-container">
//         {!localStream && (
//           <button className="permission-btn" onClick={handlePermissions}>
//             <IoVideocam />
//             Grant Permissions
//           </button>
//         )}

//         {localStream && !callInProgress && (
//           <button 
//             className="start-call-btn"
//             onClick={() => startCall(roomId)}
//           >
//             <IoCall />
//             Start Call
//           </button>
//         )}

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
//             {isVideoCall && (
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
//             {isVideoCall && (
//               <button 
//                 className="control-btn"
//                 onClick={switchCamera}
//               >
//                 <IoCameraReverse />
//                 <span>Flip</span>
//               </button>
//             )}

//             {/* Quality Toggle */}
//             {isVideoCall && callInProgress && (
//               <button 
//                 className="control-btn"
//                 onClick={() => {
//                   if (videoQuality === 'hd') {
//                     switchVideoQuality('full-hd');
//                   } else if (videoQuality === 'full-hd') {
//                     switchVideoQuality('4k');
//                   } else {
//                     switchVideoQuality('hd');
//                   }
//                 }}
//               >
//                 <MdHighQuality />
//                 <span>Quality</span>
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  IoWifi,
  IoExpand,
  IoContract
} from 'react-icons/io5';
import { 
  MdCallEnd, 
  MdHighQuality,
  MdSignalCellularAlt,
  MdSettings
} from 'react-icons/md';
import { 
  FaUserCircle,
  FaRegCircle,
  FaCircle
} from 'react-icons/fa';
import { 
  BiNetworkChart,
  BiFullscreen,
  BiExitFullscreen
} from 'react-icons/bi';

// Firebase/Supabase imports
import { auth, db } from '../../firebase/config';
import { supabase } from '../../firebase/supabaseClient';

export default function CallScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = location.state || {};
  
  const { 
    roomId, 
    isVideoCall, 
    peerEmail, 
    fcmToken, 
    accessToken, 
    selfFcmToken, 
    selfAccessToken, 
    avatar, 
    avatars 
  } = params;

  // State declarations
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [callInProgress, setCallInProgress] = useState(false);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [callDuration, setCallDuration] = useState(0);
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
  const [isTapHangup, setIsTapHangup] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(null);
  const [isCallhangup, setIsCallhangup] = useState(null);
  const [videoQuality, setVideoQuality] = useState('full-hd');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [networkQuality, setNetworkQuality] = useState('good');
  const [showSettings, setShowSettings] = useState(false);

  // Refs
  const pcRef = useRef(null);
  const callStartedRef = useRef(false);
  const unsubRef = useRef([]);
  const remoteStreamRef = useRef(null);
  const callTimerRef = useRef(null);
  const cachedLocalPC = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const soundRef = useRef(null);
  const containerRef = useRef(null);

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

  // Video quality settings
  const videoQualitySettings = {
    '4k': {
      width: 3840,
      height: 2160,
      frameRate: 30,
      bitrate: 8000000
    },
    'full-hd': {
      width: 1920,
      height: 1080,
      frameRate: 30,
      bitrate: 4000000
    },
    'hd': {
      width: 1280,
      height: 720,
      frameRate: 30,
      bitrate: 2500000
    }
  };

  // Format call duration
  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Permissions and media setup
  const handlePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: isVideoCall 
      });
      setHasPermissions(true);
      return true;
    } catch (error) {
      console.log('Permission error:', error);
      setHasPermissions(false);
      return false;
    }
  };

  const startLocalStream = async () => {
    try {
      const quality = videoQualitySettings[videoQuality];
      
      const constraints = {
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
          sampleSize: 16,
          autoGainControl: true
        },
        video: isVideoCall ? {
          width: { ideal: quality.width },
          height: { ideal: quality.height },
          frameRate: { ideal: quality.frameRate },
          facingMode: isFrontCamera ? 'user' : 'environment'
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      
      // Attach stream to video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // For audio calls, disable video by default
      if (!isVideoCall) {
        setIsLocalVideoEnabled(false);
        stream.getVideoTracks().forEach(track => {
          track.enabled = false;
        });
      }

    } catch (error) {
      console.log('Error starting local stream:', error);
    }
  };

  // FCM Notification
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

  // Call management
  const startCall = async (id) => {
    try {
      if (!localStream) return;

      callStartedRef.current = true;
      setCallInProgress(true);
      setCallStatus('Calling...');

      const pc = new RTCPeerConnection(configuration);
      pcRef.current = pc;

      // Add local tracks
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      // Handle remote stream
      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setRemoteStream(remoteStream);
        
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        
        setCallStatus('Connected');
        stopCallSound();
      };

      // ICE candidates
      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        // Handle ICE candidates (Firestore implementation needed)
        console.log('ICE candidate:', event.candidate);
      };

      pc.onconnectionstatechange = () => {
        console.log('PC state:', pc.connectionState);
        if (['failed', 'disconnected', 'closed'].includes(pc.connectionState)) {
          handleCallEnd();
        }
      };

      // Create offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true, 
        offerToReceiveVideo: isVideoCall
      });
      
      await pc.setLocalDescription(offer);

      // Update user status in Supabase
      try {
        // Update peer user
        const { error: peerError } = await supabase
          .from("users")
          .update({
            iscallingfrom: auth?.currentUser?.email || null,
            isoncallstatus: true,
            lastcallroom: id,
            isvideocall: isVideoCall,
          })
          .eq("email", peerEmail);

        if (peerError) throw peerError;

        // Update current user
        const { error: currentError } = await supabase
          .from("users")
          .update({
            isvideoon: isVideoCall,
            isoncallstatus: true,
          })
          .eq("email", auth?.currentUser?.email);

        if (currentError) throw currentError;

        setIsTapHangup(true);

        // Send FCM notification
        sendFcmNotification(
          fcmToken,
          "Start Call",
          auth?.currentUser?.email,
          accessToken,
          { 
            Peeremail: auth?.currentUser?.email, 
            type: "Incoming_Call", 
            remoteAccessToken: selfAccessToken, 
            remoteFCMToken: selfFcmToken, 
            screenName: "JoinScreen", 
            avatar: avatars 
          }
        );

        console.log("✅ Call started successfully");
      } catch (error) {
        console.error("❌ Error updating user status:", error);
      }

    } catch (error) {
      console.log('startCall error:', error);
      setCallInProgress(false);
      callStartedRef.current = false;
      setCallStatus('Connection Failed');
      cleanupConnections();
    }
  };

  const handleCallEnd = async () => {
    setCallStatus('Disconnected');
    setIsCallhangup(true);
    
    // Show call ended message
    setTimeout(() => {
      if (window.confirm("Call ended. Return to chat?")) {
        onBackPress();
      }
    }, 1000);
  };

  // UI Actions
  const switchCamera = async () => {
    if (!isVideoCall || !localStream) return;

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

      // Replace the video track
      const sender = pcRef.current.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }

      // Update local stream
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
    if (!isVideoCall || !localStream) return;

    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsLocalVideoEnabled(videoTrack.enabled);

      // Update video status in Supabase
      try {
        const { error } = await supabase
          .from("users")
          .update({
            isvideoon: videoTrack.enabled,
          })
          .eq("email", auth?.currentUser?.email);

        if (error) {
          console.error("❌ Error updating video status:", error);
        }
      } catch (err) {
        console.error("❌ toggleVideo error:", err);
      }
    }
  };

  const switchVideoQuality = async (newQuality) => {
    try {
      if (!localStream) return;
      
      setVideoQuality(newQuality);
      const quality = videoQualitySettings[newQuality];
      const videoTrack = localStream.getVideoTracks()[0];
      
      if (videoTrack) {
        await videoTrack.applyConstraints({
          width: { ideal: quality.width },
          height: { ideal: quality.height },
          frameRate: { ideal: quality.frameRate }
        });
        console.log(`Switched to ${newQuality} quality`);
      }
    } catch (error) {
      console.log(`Error switching to ${newQuality}:`, error);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Cleanup functions
  const cleanupConnections = async () => {
    try {
      console.log("Cleaning up connections...");

      // Clear timer
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }

      // Stop local stream
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      // Close peer connection
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      // Clear remote stream
      setRemoteStream(null);
      setCallInProgress(false);
      setCallDuration(0);
      setCallStatus("Call Ended");

      console.log("Connections cleaned up successfully");
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  };

  const onBackPress = async () => {
    try {
      console.log("Ending call for:", peerEmail);

      // Update user status in Supabase
      const { error: err1 } = await supabase
        .from("users")
        .update({
          iscallingfrom: "",
          isoncallstatus: false,
        })
        .eq("email", peerEmail);

      const { error: err2 } = await supabase
        .from("users")
        .update({
          isoncallstatus: false,
          iscallingfrom: "",
        })
        .eq("email", auth?.currentUser?.email);

      const { error: err3 } = await supabase
        .from("users")
        .update({
          iscallerhangup: false,
        })
        .eq("email", peerEmail);

      // Send rejection notification
      sendFcmNotification(
        fcmToken,
        "Call Ended",
        auth?.currentUser?.email,
        accessToken,
        { 
          Peeremail: auth?.currentUser?.email, 
          type: "Reject_Call", 
          remoteAccessToken: selfAccessToken, 
          remoteFCMToken: selfFcmToken 
        }
      );

      // Cleanup and navigate back
      await cleanupConnections();
      navigate(-1); // Go back to previous screen

      console.log("✅ Call ended successfully");
    } catch (error) {
      console.error("❌ Error ending call:", error);
    }
  };

  const stopCallSound = () => {
    // Web implementation for stopping sounds
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current = null;
    }
  };

  // Effects
  useEffect(() => {
    // Initialize call
    const initializeCall = async () => {
      const hasPerms = await handlePermissions();
      if (hasPerms) {
        await startLocalStream();
      }
    };

    initializeCall();

    return () => {
      cleanupConnections();
    };
  }, []);

  useEffect(() => {
    // Call duration timer
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

  // Real-time subscription for peer status
  useEffect(() => {
    if (!peerEmail) return;

    const videoSub = supabase
      .channel(`video-status-${peerEmail}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `email=eq.${peerEmail}`,
        },
        (payload) => {
          const newStatus = payload.new.isvideoon;
          console.log("Peer video status:", newStatus);
          setIsVideoOn(!!newStatus);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(videoSub);
    };
  }, [peerEmail]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-red-700 flex flex-col relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-ping"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/30 backdrop-blur-lg border-b border-white/20 px-6 py-4">
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
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
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
                    callStatus === 'Calling...' ? 'bg-yellow-500' : 'bg-red-500'
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
              <BiNetworkChart className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm">Good</span>
            </div>

            {/* Fullscreen Toggle */}
            <button 
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
            >
              {isFullscreen ? 
                <BiExitFullscreen className="w-5 h-5 text-white" /> : 
                <BiFullscreen className="w-5 h-5 text-white" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Video/Audio Streams */}
      <div className="flex-1 relative">
        {isVideoCall ? (
          <>
            {/* Remote Video */}
            <div className="w-full h-full bg-black relative">
              {remoteStream && isVideoOn ? (
                <video
                  ref={remoteVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                      <IoPerson className="w-16 h-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <IoVideocamOff className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-white/70 text-lg">Camera is off</p>
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

            {/* Local Video */}
            {localStream && isLocalVideoEnabled && (
              <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl transition-all duration-300 hover:scale-105">
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
                
                {/* Local Video Controls */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-white text-xs font-medium">You</div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Audio Call UI */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-red-700">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <div className="relative w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                <IoPerson className="w-24 h-24 text-white" />
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

            <h3 className="text-white text-2xl font-semibold mb-2">
              {peerEmail || 'Unknown User'}
            </h3>
            <p className="text-white/70 text-lg">Audio Call in Progress</p>
            
            {/* Audio Level Indicator */}
            <div className="mt-6 flex space-x-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-green-400 rounded-full animate-pulse"
                  style={{ 
                    height: `${Math.random() * 20 + 8}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-10 bg-black/30 backdrop-blur-lg border-t border-white/20 px-6 py-6">
        {!localStream && (
          <div className="flex justify-center">
            <button 
              className="flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              onClick={handlePermissions}
            >
              <IoVideocam className="w-6 h-6" />
              <span>Grant Permissions</span>
            </button>
          </div>
        )}

        {localStream && !callInProgress && (
          <div className="flex justify-center">
            <button 
              className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-pulse"
              onClick={() => startCall(roomId)}
            >
              <IoCall className="w-6 h-6" />
              <span>Start Call</span>
            </button>
          </div>
        )}

        {callInProgress && (
          <div className="flex justify-center items-center space-x-4">
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
            {isVideoCall && (
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
            {isVideoCall && (
              <button 
                className="flex flex-col items-center justify-center w-16 h-16 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
                onClick={switchCamera}
              >
                <IoCameraReverse className="w-7 h-7" />
                <span className="text-xs mt-1">Flip</span>
              </button>
            )}

            {/* Quality Toggle */}
            {isVideoCall && callInProgress && (
              <button 
                className="flex flex-col items-center justify-center w-16 h-16 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
                onClick={() => {
                  if (videoQuality === 'hd') {
                    switchVideoQuality('full-hd');
                  } else if (videoQuality === 'full-hd') {
                    switchVideoQuality('4k');
                  } else {
                    switchVideoQuality('hd');
                  }
                }}
              >
                <MdHighQuality className="w-7 h-7" />
                <span className="text-xs mt-1">Quality</span>
              </button>
            )}

            {/* Settings */}
            <button 
              className="flex flex-col items-center justify-center w-16 h-16 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
              onClick={() => setShowSettings(!showSettings)}
            >
              <MdSettings className="w-7 h-7" />
              <span className="text-xs mt-1">Settings</span>
            </button>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-lg rounded-2xl p-4 border border-white/20 min-w-48">
            <div className="space-y-3">
              <div className="text-white font-semibold text-center mb-2">Settings</div>
              
              {/* Video Quality Options */}
              <div className="space-y-2">
                <div className="text-white/70 text-sm">Video Quality</div>
                <div className="flex space-x-2">
                  {['hd', 'full-hd', '4k'].map((quality) => (
                    <button
                      key={quality}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        videoQuality === quality
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                      onClick={() => switchVideoQuality(quality)}
                    >
                      {quality.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Network Status */}
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Network</span>
                <div className="flex items-center space-x-1">
                  <BiNetworkChart className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Good</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}