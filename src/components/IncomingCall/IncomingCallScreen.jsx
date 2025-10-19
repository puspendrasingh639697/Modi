// import React, { useEffect, useRef, useState } from 'react';
// import './IncomingCallScreen.css';

// // Icons
// import { 
//   IoCall,
//   IoVideocam,
//   IoClose,
//   IoArrowUp
// } from 'react-icons/io5';
// import { MdCallEnd } from 'react-icons/md';

// const IncomingCallScreen = ({ 
//   callerName, 
//   callerImage, 
//   onAccept, 
//   onReject,
//   isVideoCall = false,
//   ringtone,
//   stopRingtone
// }) => {
//   const [scale, setScale] = useState(1);
//   const [pulse, setPulse] = useState(0);
//   const [buttonScale1, setButtonScale1] = useState(1);
//   const [buttonScale2, setButtonScale2] = useState(1);
//   const [slide, setSlide] = useState(100);
//   const [fade, setFade] = useState(0);
//   const [ring, setRing] = useState(0);
  
//   const animationRef = useRef(null);
//   const vibrationInterval = useRef(null);
//   const ringtonePlaying = useRef(false);

//   useEffect(() => {
//     // Start all animations
//     startPulseAnimation();
//     startEntranceAnimation();
//     startRingAnimation();

//     // Play ringtone if provided
//     if (ringtone) {
//       ringtonePlaying.current = true;
//       ringtone.play().then(() => {
//         console.log('Ringtone played successfully');
//       }).catch((error) => {
//         console.log('Ringtone playback failed:', error);
//         ringtonePlaying.current = false;
//       });
//     }

//     // Vibrate pattern (browser vibration API)
//     if (navigator.vibrate) {
//       vibrationInterval.current = setInterval(() => {
//         navigator.vibrate(1000);
//       }, 2000);
//     }

//     // Cleanup on unmount
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//       clearInterval(vibrationInterval.current);
//       if (navigator.vibrate) {
//         navigator.vibrate(0); // Stop vibration
//       }
//       stopRingtoneIfPlaying();
//     };
//   }, []);

//   const stopRingtoneIfPlaying = () => {
//     if (ringtone && ringtonePlaying.current) {
//       ringtone.pause();
//       ringtone.currentTime = 0;
//       console.log('Ringtone stopped');
//       ringtonePlaying.current = false;
//     }
//   };

//   const handleButtonPress = (callback) => {
//     // Stop vibration
//     clearInterval(vibrationInterval.current);
//     if (navigator.vibrate) {
//       navigator.vibrate(0);
//     }
    
//     // Stop ringtone
//     stopRingtoneIfPlaying();
    
//     // Call the callback function
//     if (callback) {
//       callback();
//     }
//   };

//   const startPulseAnimation = () => {
//     let startTime = null;
//     let scaleDirection = 1;
//     let pulseDirection = 1;

//     const animate = (timestamp) => {
//       if (!startTime) startTime = timestamp;
//       const progress = timestamp - startTime;

//       // Scale animation (1 to 1.05 and back)
//       if (progress > 1500) {
//         scaleDirection *= -1;
//         startTime = timestamp;
//       }
//       const scaleProgress = progress / 1500;
//       setScale(1 + (scaleDirection > 0 ? scaleProgress * 0.05 : 0.05 - scaleProgress * 0.05));

//       // Pulse animation (0 to 1 and back)
//       if (progress > 2000) {
//         pulseDirection *= -1;
//         startTime = timestamp;
//       }
//       const pulseProgress = progress / 2000;
//       setPulse(pulseDirection > 0 ? pulseProgress : 1 - pulseProgress);

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);
//   };

//   const startEntranceAnimation = () => {
//     const duration = 800;
//     const startTime = Date.now();

//     const animate = () => {
//       const progress = Date.now() - startTime;
//       const normalizedProgress = Math.min(progress / duration, 1);

//       // Easing functions
//       const slideEase = 1 - Math.pow(1 - normalizedProgress, 3); // easeOutBack approximation
//       const fadeEase = normalizedProgress; // linear fade

//       setSlide(100 * (1 - slideEase));
//       setFade(fadeEase);

//       if (normalizedProgress < 1) {
//         requestAnimationFrame(animate);
//       }
//     };

//     requestAnimationFrame(animate);
//   };

//   const startRingAnimation = () => {
//     let ringDirection = 1;
//     let ringStartTime = null;

//     const animateRing = (timestamp) => {
//       if (!ringStartTime) ringStartTime = timestamp;
//       const progress = timestamp - ringStartTime;

//       if (progress > 1000) {
//         ringDirection *= -1;
//         ringStartTime = timestamp;
//       }

//       const ringProgress = progress / 1000;
//       setRing(ringDirection > 0 ? ringProgress : 1 - ringProgress);

//       requestAnimationFrame(animateRing);
//     };

//     requestAnimationFrame(animateRing);
//   };

//   const handlePressIn = (setButtonScale) => {
//     setButtonScale(0.9);
//   };

//   const handlePressOut = (setButtonScale, callback) => {
//     setButtonScale(1);
//     setTimeout(() => {
//       if (callback) {
//         handleButtonPress(callback);
//       }
//     }, 150);
//   };

//   // Calculate dynamic styles
//   const backgroundStyle = {
//     backgroundColor: `rgba(0, 0, 0, ${0.7 - pulse * 0.3})`
//   };

//   const ringScale = 1 + ring * 0.2;
//   const ringOpacity = 0.7 - ring * 0.7;

//   return (
//     <div className="incoming-call-overlay">
//       <div 
//         className="incoming-call-background" 
//         style={backgroundStyle}
//       />
      
//       <div className="incoming-call-container">
//         <div 
//           className="incoming-call-content"
//           style={{ 
//             opacity: fade,
//             transform: `translateY(${slide}px)`
//           }}
//         >
//           {/* Animated Rings */}
//           <div className="ring-container">
//             {[0, 1, 2].map((index) => (
//               <div
//                 key={index}
//                 className="ring"
//                 style={{
//                   transform: `scale(${ringScale})`,
//                   opacity: ringOpacity,
//                   borderWidth: index === 0 ? 2 : index === 1 ? 3 : 4,
//                   animationDelay: `${index * 0.2}s`
//                 }}
//               />
//             ))}
//           </div>

//           <div className="call-header">
//             <p className="incoming-call-text">Incoming Call</p>
//           </div>
          
//           <div className="profile-wrapper">
//             <div 
//               className="profile-container" 
//               style={{ transform: `scale(${scale})` }}
//             >
//               <img 
//                 src={callerImage || 'https://i.pravatar.cc/300'} 
//                 alt={callerName || 'Caller'}
//                 className="profile-image"
//               />
//               <div className="profile-gradient" />
//             </div>
//           </div>
          
//           <div className="caller-info">
//             <h1 className="caller-name">{callerName || 'Unknown Caller'}</h1>
//             <p className="call-type">
//               {isVideoCall ? 'Video Call' : 'Voice Call'}
//             </p>
//           </div>
          
//           <div className="button-container">
//             <div 
//               className="button-wrapper"
//               style={{ transform: `scale(${buttonScale1})` }}
//             >
//               <button 
//                 className="call-button reject-button"
//                 onMouseDown={() => handlePressIn(setButtonScale1)}
//                 onMouseUp={() => handlePressOut(setButtonScale1, onReject)}
//                 onMouseLeave={() => setButtonScale1(1)}
//                 onTouchStart={() => handlePressIn(setButtonScale1)}
//                 onTouchEnd={() => handlePressOut(setButtonScale1, onReject)}
//               >
//                 <div className="button-gradient reject-gradient">
//                   <MdCallEnd className="button-icon" />
//                   <span className="button-text">Decline</span>
//                 </div>
//               </button>
//             </div>
            
//             <div 
//               className="button-wrapper"
//               style={{ transform: `scale(${buttonScale2})` }}
//             >
//               <button 
//                 className="call-button accept-button"
//                 onMouseDown={() => handlePressIn(setButtonScale2)}
//                 onMouseUp={() => handlePressOut(setButtonScale2, onAccept)}
//                 onMouseLeave={() => setButtonScale2(1)}
//                 onTouchStart={() => handlePressIn(setButtonScale2)}
//                 onTouchEnd={() => handlePressOut(setButtonScale2, onAccept)}
//               >
//                 <div className="button-gradient accept-gradient">
//                   {isVideoCall ? (
//                     <IoVideocam className="button-icon" />
//                   ) : (
//                     <IoCall className="button-icon" />
//                   )}
//                   <span className="button-text">
//                     {isVideoCall ? 'Video' : 'Audio'}
//                   </span>
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Swipe to answer hint for video calls */}
//           {isVideoCall && (
//             <div 
//               className="swipe-hint"
//               style={{ opacity: fade }}
//             >
//               <IoArrowUp className="swipe-icon" />
//               <span className="swipe-text">Click to answer with video</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IncomingCallScreen;

import React, { useEffect, useRef, useState } from 'react';
import { 
  IoCall,
  IoVideocam,
  IoClose,
  IoArrowUp,
  IoPerson
} from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';

const IncomingCallScreen = ({ 
  callerName, 
  callerImage, 
  onAccept, 
  onReject,
  isVideoCall = false,
  ringtone,
  stopRingtone
}) => {
  const [scale, setScale] = useState(1);
  const [pulse, setPulse] = useState(0);
  const [buttonScale1, setButtonScale1] = useState(1);
  const [buttonScale2, setButtonScale2] = useState(1);
  const [slide, setSlide] = useState(100);
  const [fade, setFade] = useState(0);
  const [ring, setRing] = useState(0);
  
  const animationRef = useRef(null);
  const vibrationInterval = useRef(null);
  const ringtonePlaying = useRef(false);

  useEffect(() => {
    // Start all animations
    startPulseAnimation();
    startEntranceAnimation();
    startRingAnimation();

    // Play ringtone if provided
    if (ringtone) {
      ringtonePlaying.current = true;
      ringtone.play().then(() => {
        console.log('Ringtone played successfully');
      }).catch((error) => {
        console.log('Ringtone playback failed:', error);
        ringtonePlaying.current = false;
      });
    }

    // Vibrate pattern (browser vibration API)
    if (navigator.vibrate) {
      vibrationInterval.current = setInterval(() => {
        navigator.vibrate(1000);
      }, 2000);
    }

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(vibrationInterval.current);
      if (navigator.vibrate) {
        navigator.vibrate(0); // Stop vibration
      }
      stopRingtoneIfPlaying();
    };
  }, []);

  const stopRingtoneIfPlaying = () => {
    if (ringtone && ringtonePlaying.current) {
      ringtone.pause();
      ringtone.currentTime = 0;
      console.log('Ringtone stopped');
      ringtonePlaying.current = false;
    }
  };

  const handleButtonPress = (callback) => {
    // Stop vibration
    clearInterval(vibrationInterval.current);
    if (navigator.vibrate) {
      navigator.vibrate(0);
    }
    
    // Stop ringtone
    stopRingtoneIfPlaying();
    
    // Call the callback function
    if (callback) {
      callback();
    }
  };

  const startPulseAnimation = () => {
    let startTime = null;
    let scaleDirection = 1;
    let pulseDirection = 1;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      // Scale animation (1 to 1.05 and back)
      if (progress > 1500) {
        scaleDirection *= -1;
        startTime = timestamp;
      }
      const scaleProgress = progress / 1500;
      setScale(1 + (scaleDirection > 0 ? scaleProgress * 0.05 : 0.05 - scaleProgress * 0.05));

      // Pulse animation (0 to 1 and back)
      if (progress > 2000) {
        pulseDirection *= -1;
        startTime = timestamp;
      }
      const pulseProgress = progress / 2000;
      setPulse(pulseDirection > 0 ? pulseProgress : 1 - pulseProgress);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const startEntranceAnimation = () => {
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const progress = Date.now() - startTime;
      const normalizedProgress = Math.min(progress / duration, 1);

      // Easing functions
      const slideEase = 1 - Math.pow(1 - normalizedProgress, 3); // easeOutBack approximation
      const fadeEase = normalizedProgress; // linear fade

      setSlide(100 * (1 - slideEase));
      setFade(fadeEase);

      if (normalizedProgress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const startRingAnimation = () => {
    let ringDirection = 1;
    let ringStartTime = null;

    const animateRing = (timestamp) => {
      if (!ringStartTime) ringStartTime = timestamp;
      const progress = timestamp - ringStartTime;

      if (progress > 1000) {
        ringDirection *= -1;
        ringStartTime = timestamp;
      }

      const ringProgress = progress / 1000;
      setRing(ringDirection > 0 ? ringProgress : 1 - ringProgress);

      requestAnimationFrame(animateRing);
    };

    requestAnimationFrame(animateRing);
  };

  const handlePressIn = (setButtonScale) => {
    setButtonScale(0.9);
  };

  const handlePressOut = (setButtonScale, callback) => {
    setButtonScale(1);
    setTimeout(() => {
      if (callback) {
        handleButtonPress(callback);
      }
    }, 150);
  };

  // Calculate dynamic styles
  const backgroundStyle = {
    backgroundColor: `rgba(0, 0, 0, ${0.7 - pulse * 0.3})`
  };

  const ringScale = 1 + ring * 0.2;
  const ringOpacity = 0.7 - ring * 0.7;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 incoming-call-overlay">
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 transition-colors duration-100"
        style={backgroundStyle}
      />
      
      {/* Main Container */}
      <div className="relative w-full max-w-md flex items-center justify-center">
        <div 
          className="w-full flex flex-col items-center text-center relative z-10 transition-all duration-300 ease-out"
          style={{ 
            opacity: fade,
            transform: `translateY(${slide}px)`
          }}
        >
          {/* Animated Rings */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`absolute border-2 border-white/20 rounded-full animate-ping ${
                  index === 0 ? 'w-44 h-44' : 
                  index === 1 ? 'w-52 h-52' : 
                  'w-60 h-60'
                }`}
                style={{
                  transform: `scale(${ringScale})`,
                  opacity: ringOpacity,
                  borderWidth: index === 0 ? '2px' : index === 1 ? '3px' : '4px',
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>

          {/* Call Header */}
          <div className="mb-8">
            <p className="text-lg text-white/80 font-light tracking-wider uppercase mb-8">
              Incoming Call
            </p>
          </div>
          
          {/* Profile Image */}
          <div className="mb-6 relative">
            <div 
              className="w-32 h-32 bg-white rounded-full shadow-2xl overflow-hidden relative transition-transform duration-200"
              style={{ transform: `scale(${scale})` }}
            >
              {callerImage ? (
                <img 
                  src={callerImage} 
                  alt={callerName || 'Caller'}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <IoPerson className="w-12 h-12 text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-full" />
            </div>
          </div>
          
          {/* Caller Info */}
          <div className="mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 text-shadow-lg">
              {callerName || 'Unknown Caller'}
            </h1>
            <p className="text-base text-white/70 font-normal">
              {isVideoCall ? 'Video Call' : 'Voice Call'}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center space-x-10 lg:space-x-12 w-full max-w-xs">
            {/* Reject Button */}
            <div 
              className="transition-transform duration-200"
              style={{ transform: `scale(${buttonScale1})` }}
            >
              <button 
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-none cursor-pointer p-0 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                onMouseDown={() => handlePressIn(setButtonScale1)}
                onMouseUp={() => handlePressOut(setButtonScale1, onReject)}
                onMouseLeave={() => setButtonScale1(1)}
                onTouchStart={() => handlePressIn(setButtonScale1)}
                onTouchEnd={() => handlePressOut(setButtonScale1, onReject)}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-600 flex flex-col items-center justify-center text-white">
                  <MdCallEnd className="w-8 h-8 lg:w-10 lg:h-10 mb-1" />
                  <span className="text-xs font-semibold mt-1">Decline</span>
                </div>
              </button>
            </div>
            
            {/* Accept Button */}
            <div 
              className="transition-transform duration-200"
              style={{ transform: `scale(${buttonScale2})` }}
            >
              <button 
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-none cursor-pointer p-0 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                onMouseDown={() => handlePressIn(setButtonScale2)}
                onMouseUp={() => handlePressOut(setButtonScale2, onAccept)}
                onMouseLeave={() => setButtonScale2(1)}
                onTouchStart={() => handlePressIn(setButtonScale2)}
                onTouchEnd={() => handlePressOut(setButtonScale2, onAccept)}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-green-600 flex flex-col items-center justify-center text-white">
                  {isVideoCall ? (
                    <IoVideocam className="w-8 h-8 lg:w-10 lg:h-10 mb-1" />
                  ) : (
                    <IoCall className="w-8 h-8 lg:w-10 lg:h-10 mb-1" />
                  )}
                  <span className="text-xs font-semibold mt-1">
                    {isVideoCall ? 'Video' : 'Audio'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Swipe to Answer Hint */}
          {isVideoCall && (
            <div 
              className="mt-8 flex items-center px-4 py-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 transition-opacity duration-300"
              style={{ opacity: fade }}
            >
              <IoArrowUp className="w-5 h-5 text-white/70 mr-2 animate-bounce" />
              <span className="text-white/70 text-sm font-medium">
                Click to answer with video
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        .text-shadow-lg {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .shadow-3xl {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4), 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        @keyframes ping {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
          60% {
            transform: translateY(-3px);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-ping,
          .animate-bounce,
          .transition-all {
            animation: none;
            transition: none;
          }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .incoming-call-overlay {
            background: linear-gradient(135deg, #2D3748 0%, #4A5568 100%);
          }
        }
        
        /* High contrast support */
        @media (prefers-contrast: high) {
          .text-white\\/80,
          .text-white\\/70 {
            color: white;
          }
        }
        
        /* Mobile responsiveness */
        @media (max-width: 480px) {
          .w-32.h-32 {
            width: 6rem;
            height: 6rem;
          }
          
          .text-3xl {
            font-size: 1.75rem;
          }
          
          .space-x-10 {
            gap: 2.5rem;
          }
          
          .w-20.h-20 {
            width: 5rem;
            height: 5rem;
          }
        }
        
        @media (max-width: 320px) {
          .text-3xl {
            font-size: 1.5rem;
          }
          
          .space-x-10 {
            gap: 2rem;
          }
          
          .w-20.h-20 {
            width: 4rem;
            height: 4rem;
          }
        }
      `}</style>
    </div>
  );
};

export default IncomingCallScreen;