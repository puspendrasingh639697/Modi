// // // import React, { useState, useEffect } from 'react';
// // // import { useNavigate, Link } from 'react-router-dom';
// // // import { signInWithEmailAndPassword } from 'firebase/auth';
// // // import { auth, db } from '../../firebase/config';
// // // import { supabase } from '../../firebase/supabaseClient';
// // // import { doc, updateDoc, getDoc } from 'firebase/firestore';
// // // import '../../components/Login/Login.css';

// // // export default function Login() {
// // //   const [email, setEmail] = useState('');
// // //   const [password, setPassword] = useState('');
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const [fadeIn, setFadeIn] = useState(false);

// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     setFadeIn(true); // Trigger fade-in animation
// // //   }, []);

// // //   const setUserOnline = async (email) => {
// // //     try {
// // //       const userRef = doc(db, "users", email);
// // //       const docSnap = await getDoc(userRef);
// // //       if (docSnap.exists()) {
// // //         await updateDoc(userRef, { isActiveStatus: true });
// // //         console.log("User set online");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error setting user online:", error);
// // //     }
// // //   };

// // //   const onHandleLogin = async (e) => {
// // //     e.preventDefault();
// // //     if (email && password) {
// // //       try {
// // //         const cred = await signInWithEmailAndPassword(auth, email, password);
// // //         const cleanedEmail = cred.user.email.trim().toLowerCase();
// // //         localStorage.setItem("email", cleanedEmail);

// // //         // Get admin status from Supabase
// // //         const { data, error } = await supabase
// // //           .from("users")
// // //           .select("isTypeAdmin")
// // //           .eq("email", cleanedEmail)
// // //           .single();

// // //         if (error) {
// // //           alert("Supabase error: " + error.message);
// // //           return;
// // //         }

// // //         localStorage.setItem("isTypeAdmin", JSON.stringify(data.isTypeAdmin));

// // //         // Update user active status
// // //         await supabase
// // //           .from("users")
// // //           .update({
// // //             isactivestatus: true,
// // //             iscallingfrom: "",
// // //             isoncallstatus: false,
// // //             password: password
// // //           })
// // //           .eq("email", cleanedEmail);

// // //         await setUserOnline(cleanedEmail);
// // //         navigate("/chats");
// // //       } catch (err) {
// // //         alert("Login error: " + err.message);
// // //       }
// // //     }
// // //   };

// // //   return (
// // //     <div className="gradient-background">
// // //       <div className="safe-area">
// // //         <div className={`login-container ${fadeIn ? 'fade-in' : ''}`}>

// // //           {/* Header */}
// // //           <div className="header">
// // //             <h1 className="title">Login</h1>
// // //             <p className="subtitle">Welcome back! Please sign in to continue</p>
// // //           </div>

// // //           {/* Login Form */}
// // //           <form className="login-form" onSubmit={onHandleLogin}>

// // //             {/* Email */}
// // //             <div className="input-container">
// // //               <input
// // //                 type="email"
// // //                 placeholder="Email"
// // //                 value={email}
// // //                 onChange={(e) => setEmail(e.target.value)}
// // //                 required
// // //                 className="form-input"
// // //               />
// // //             </div>

// // //             {/* Password */}
// // //             <div className="input-container">
// // //               <input
// // //                 type={showPassword ? "text" : "password"}
// // //                 placeholder="Password"
// // //                 value={password}
// // //                 onChange={(e) => setPassword(e.target.value)}
// // //                 required
// // //                 className="form-input"
// // //               />
// // //               <button
// // //                 type="button"
// // //                 className="eye-button"
// // //                 onClick={() => setShowPassword(!showPassword)}
// // //               >
// // //                 {showPassword ? '🙈' : '👁️'}
// // //               </button>
// // //             </div>

// // //             {/* Forgot Password */}
// // //             <div className="forgot-password-container">
// // //               <Link to="/forgot-password" className="forgot-password">
// // //                 Forgot password?
// // //               </Link>
// // //             </div>

// // //             {/* Submit */}
// // //             <button type="submit" className="login-button">
// // //               Login
// // //             </button>

// // //             {/* Signup Link */}
// // //             <div className="signup-container">
// // //               <span>Don't have an account? </span>
// // //               <Link to="/signup" className="signup-link">Sign Up</Link>
// // //             </div>

// // //           </form>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // import React, { useState, useRef, useEffect } from 'react';
// // import { useNavigate, Link } from 'react-router-dom';
// // import { signInWithEmailAndPassword } from 'firebase/auth';
// // import { auth, db} from '../../firebase/config';
// // import { supabase} from '../../firebase/supabaseClient';
// // import messaging from '@react-native-firebase/messaging';
// // import { doc, updateDoc, getDoc } from 'firebase/firestore';
// // import { getDatabase, ref, get, child } from 'firebase/database';
// // import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// // import '../../components/Login/Login.css'

// // // Mock translations (replace with your i18n setup)
// // const translations = {
// //   en: {
// //     login: 'Login',
// //     email: 'Email',
// //     password: 'Password',
// //     forgotPassword: 'Forgot password?',
// //     dontHave: "Don't have an account?",
// //     signup: 'Sign Up'
// //   },
// //   hi: {
// //     login: 'लॉगिन',
// //     email: 'ईमेल',
// //     password: 'पासवर्ड',
// //     forgotPassword: 'पासवर्ड भूल गए?',
// //     dontHave: 'खाता नहीं है?',
// //     signup: 'साइन अप'
// //   },
// //   pa: {
// //     login: 'ਲਾਗਿਨ',
// //     email: 'ਈਮੇਲ',
// //     password: 'ਪਾਸਵਰਡ',
// //     forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
// //     dontHave: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
// //     signup: 'ਸਾਈਨ ਅੱਪ'
// //   },
// //   ta: {
// //     login: 'உள்நுழைய',
// //     email: 'மின்னஞ்சல்',
// //     password: 'கடவுச்சொல்',
// //     forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
// //     dontHave: 'கணக்கு இல்லையா?',
// //     signup: 'பதிவு செய்ய'
// //   }
// // };

// // export default function Login() {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [selectLanguage, setSelectLanguage] = useState('English');
// //   const [showModal, setShowModal] = useState(false);
// //   const [currentLanguage, setCurrentLanguage] = useState('en');
  
// //   const navigate = useNavigate();
// //   const fadeAnim = useRef(null);
// //   const slideAnim = useRef(null);

// //   const t = (key) => translations[currentLanguage]?.[key] || key;

// //   useEffect(() => {
// //     checkLng();
// //     // Add animation classes on mount
// //     document.querySelector('.login-container').classList.add('fade-in');
// //     document.querySelector('.login-form').classList.add('slide-up');
// //   }, []);

// //   const checkLng = async () => {
// //     const savedLang = localStorage.getItem('LANG') || 'en';
// //     setCurrentLanguage(savedLang);
// //     const langMap = {
// //       'en': 'English',
// //       'hi': 'हिंदी',
// //       'pa': 'ਪੰਜਾਬੀ',
// //       'ta': 'தமிழ்'
// //     };
// //     setSelectLanguage(langMap[savedLang] || 'English');
// //   };

// //   const setUserOnline = async (email) => {
// //     try {
// //       const userRef = doc(db, "users", email);
// //       const docSnap = await getDoc(userRef);

// //       if (docSnap.exists()) {
// //         await updateDoc(userRef, { isActiveStatus: true });
// //         console.log("User is set online");
// //       } else {
// //         console.log("User document does not exist");
// //       }
// //     } catch (error) {
// //       console.error("Error setting user online:", error);
// //     }
// //   };

// //   const requestNotificationPermission = async () => {
// //     try {
// //       const permission = await Notification.requestPermission();
// //       return permission === 'granted';
// //     } catch (error) {
// //       console.log('Error requesting notification permission:', error);
// //       return false;
// //     }
// //   };

// //   const setupFCMToken = async () => {
// //     try {
// //       await requestNotificationPermission();
// //       const token = await messaging().getToken();
// //       console.log('FCM Token logged:', token);
      
// //       if (auth.currentUser?.email && token) {
// //         await saveFCMTokenToSupabase(auth.currentUser.email, token);
// //       }
      
// //       messaging().onTokenRefresh(async (newToken) => {
// //         console.log('FCM token refreshed logged:', newToken);
// //         if (auth.currentUser?.email) {
// //           await saveFCMTokenToSupabase(auth.currentUser.email, newToken);
// //         }
// //       });
// //     } catch (error) {
// //       console.log('Error setting up FCM token logged:', error);
// //     }
// //   };


// //   const saveFCMTokenToSupabase = async (userId, token) => {
// //     try {
// //       const { error } = await supabase
// //         .from('users')
// //         .update({
// //           fcmToken: token,
// //           tokenUpdatedAt: new Date().toISOString(),
// //         })
// //         .eq('email', userId);
  
// //       if (error) {
// //         console.log('Error saving FCM token to Supabase:', error);
// //         return false;
// //       }
// //       console.log('FCM token saved to Supabase for user:', userId);
// //       return true;
// //     } catch (error) {
// //       console.log('Error saving FCM token:', error);
// //       return false;
// //     }
// //   };

// //   const onHandleLogin = async (e) => {
// //     e.preventDefault();
// //     if (email !== "" && password !== "") {
// //       try {
// //         const cred = await signInWithEmailAndPassword(auth, email, password);
// //         const cleanedEmail = cred.user.email.trim().toLowerCase();
// //         localStorage.setItem("email", cleanedEmail);

// //         // Get admin status from Supabase
// //         const { data, error } = await supabase
// //           .from("users")
// //           .select("isTypeAdmin")
// //           .eq("email", cleanedEmail)
// //           .single();

// //         if (error) {
// //           alert("Supabase error: " + error.message);
// //           return;
// //         }

// //         // Save admin status
// //         localStorage.setItem("isTypeAdmin", JSON.stringify(data.isTypeAdmin));

// //         // Update user active status
// //         await supabase
// //           .from("users")
// //           .update({
// //             isactivestatus: true,
// //             iscallingfrom: "",
// //             isoncallstatus: false,
// //             password: password
// //           })
// //           .eq("email", cleanedEmail);

// //         await setupFCMToken();
// //         navigate("/home");
// //       } catch (err) {
// //         alert("Login error: " + err.message);
// //       }
// //     }
// //   };

// //   const handleLanguageSelect = async (lang) => {
// //     const langMap = {
// //       'English': 'en',
// //       'हिंदी': 'hi',
// //       'ਪੰਜਾਬੀ': 'pa',
// //       'தமிழ்': 'ta'
// //     };
    
// //     const lng = langMap[lang];
// //     localStorage.setItem('LANG', lng);
// //     setCurrentLanguage(lng);
// //     setSelectLanguage(lang);
// //     setShowModal(false);
// //   };

// //   return (
// //     <div className="gradient-background">
// //       <div className="safe-area">
// //         <div className="login-container">
          
         
// //           <div className="header">
// //             <div className="logo-container pulse-animation">
// //               <h1 className="title">Login</h1>
// //             </div>
// //             <p className="subtitle">Welcome back! Please sign in to continue</p>
// //           </div>

// //           {/* Language Selector */}
// //           <div className="lang-selector">
// //             <button 
// //               className="lang-button"
// //               onClick={() => setShowModal(true)}
// //             >
// //               <span className="lang-icon">🌐</span>
// //               <span className="lang-text">{selectLanguage}</span>
// //               <span className="lang-arrow">▼</span>
// //             </button>
// //           </div>

// //           {/* Form Section */}
// //           <form className="login-form" onSubmit={onHandleLogin}>
// //             {/* Email Input */}
// //             <div className="input-wrapper">
// //               <div className="input-container">
// //                 <span className="input-icon">✉️</span>
// //                 <input
// //                   type="email"
// //                   className="form-input"
// //                   placeholder={t('email')}
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   required
// //                 />
// //               </div>
// //             </div>

// //             {/* Password Input */}
// //             <div className="input-wrapper">
// //               <div className="input-container">
// //                 <span className="input-icon">🔒</span>
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   className="form-input"
// //                   placeholder={t('password')}
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   required
// //                 />
// //                 <button 
// //                   type="button"
// //                   className="eye-button"
// //                   onClick={() => setShowPassword(!showPassword)}
// //                 >
// //                   {showPassword ? '👁️' : '👁️‍🗨️'}
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Forgot Password */}
// //             <div className="forgot-password-container">
// //               <Link to="/forgot-password" className="forgot-password">
// //                 {t('forgotPassword')}
// //               </Link>
// //             </div>

// //             {/* Login Button */}
// //             <div className="button-wrapper pulse-animation">
// //               <button type="submit" className="login-button">
// //                 <span className="button-text">{t('login')}</span>
// //                 <span className="button-icon">→</span>
// //               </button>
// //             </div>

// //             {/* Sign Up Link */}
// //             <div className="signup-container">
// //               <span className="signup-text">{t('dontHave')}</span>
// //               <Link to="/signup" className="signup-link">
// //                 {t('signup')}
// //               </Link>
// //             </div>
// //           </form>
// //         </div>

// //         {/* Language Modal */}
// //         {showModal && (
// //           <div className="modal-overlay">
// //             <div className="modal-content">
// //               <div className="modal-header">
// //                 <h3>Select Language</h3>
// //                 <button 
// //                   className="close-button"
// //                   onClick={() => setShowModal(false)}
// //                 >
// //                   ×
// //                 </button>
// //               </div>
// //               <div className="language-options">
// //                 {['English', 'हिंदी', 'ਪੰਜਾਬੀ', 'தமிழ்'].map((lang) => (
// //                   <button
// //                     key={lang}
// //                     className={`language-option ${selectLanguage === lang ? 'selected' : ''}`}
// //                     onClick={() => handleLanguageSelect(lang)}
// //                   >
// //                     {lang}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }



// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '../../firebase/config';
// import { supabase } from '../../firebase/supabaseClient';
// import { doc, updateDoc, getDoc } from 'firebase/firestore';
// import { getDatabase, ref, get, child } from 'firebase/database';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { 
//   IoMail, 
//   IoLockClosed, 
//   IoEye, 
//   IoEyeOff,
//   IoArrowForward,
//   IoChatbubbleEllipses,
//   IoSparkles,
//   IoGlobe,
//   IoClose
// } from 'react-icons/io5';
// import '../../components/'

// // Mock translations
// const translations = {
//   en: {
//     login: 'Login',
//     email: 'Email',
//     password: 'Password',
//     forgotPassword: 'Forgot password?',
//     dontHave: "Don't have an account?",
//     signup: 'Sign Up',
//     welcomeBack: 'Welcome back!',
//     signInContinue: 'Please sign in to continue',
//     selectLanguage: 'Select Language'
//   },
//   hi: {
//     login: 'लॉगिन',
//     email: 'ईमेल',
//     password: 'पासवर्ड',
//     forgotPassword: 'पासवर्ड भूल गए?',
//     dontHave: 'खाता नहीं है?',
//     signup: 'साइन अप',
//     welcomeBack: 'वापसी पर स्वागत है!',
//     signInContinue: 'जारी रखने के लिए साइन इन करें',
//     selectLanguage: 'भाषा चुनें'
//   },
//   pa: {
//     login: 'ਲਾਗਿਨ',
//     email: 'ਈਮੇਲ',
//     password: 'ਪਾਸਵਰਡ',
//     forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
//     dontHave: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
//     signup: 'ਸਾਈਨ ਅੱਪ',
//     welcomeBack: 'ਵਾਪਸੀ ਤੇ ਸਵਾਗਤ ਹੈ!',
//     signInContinue: 'ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ',
//     selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ'
//   },
//   ta: {
//     login: 'உள்நுழைய',
//     email: 'மின்னஞ்சல்',
//     password: 'கடவுச்சொல்',
//     forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
//     dontHave: 'கணக்கு இல்லையா?',
//     signup: 'பதிவு செய்ய',
//     welcomeBack: 'மீண்டும் வரவேற்கிறோம்!',
//     signInContinue: 'தொடர உள்நுழையவும்',
//     selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்'
//   }
// };

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [selectLanguage, setSelectLanguage] = useState('English');
//   const [showModal, setShowModal] = useState(false);
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const [fadeIn, setFadeIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const navigate = useNavigate();

//   const t = (key) => translations[currentLanguage]?.[key] || key;

//   useEffect(() => {
//     setFadeIn(true);
//     checkLng();
//   }, []);

//   const checkLng = async () => {
//     const savedLang = localStorage.getItem('LANG') || 'en';
//     setCurrentLanguage(savedLang);
//     const langMap = {
//       'en': 'English',
//       'hi': 'हिंदी',
//       'pa': 'ਪੰਜਾਬੀ',
//       'ta': 'தமிழ்'
//     };
//     setSelectLanguage(langMap[savedLang] || 'English');
//   };

//   const setUserOnline = async (email) => {
//     try {
//       const userRef = doc(db, "users", email);
//       const docSnap = await getDoc(userRef);

//       if (docSnap.exists()) {
//         await updateDoc(userRef, { isActiveStatus: true });
//         console.log("User is set online");
//       } else {
//         console.log("User document does not exist");
//       }
//     } catch (error) {
//       console.error("Error setting user online:", error);
//     }
//   };

//   // Check user data from Firebase Realtime Database
//   const checkUserInRealtimeDB = async (userId) => {
//     try {
//       const db = getDatabase();
//       const userRef = ref(db, 'users/' + userId);
//       const snapshot = await get(userRef);
      
//       if (snapshot.exists()) {
//         console.log('User data from Realtime DB:', snapshot.val());
//         return snapshot.val();
//       } else {
//         console.log('No user data found in Realtime DB');
//         return null;
//       }
//     } catch (error) {
//       console.error('Error checking Realtime DB:', error);
//       return null;
//     }
//   };

//   const requestNotificationPermission = async () => {
//     try {
//       if (!("Notification" in window)) {
//         console.log("This browser does not support notifications");
//         return false;
//       }
      
//       const permission = await Notification.requestPermission();
//       return permission === 'granted';
//     } catch (error) {
//       console.log('Error requesting notification permission:', error);
//       return false;
//     }
//   };

//   const setupFCMToken = async () => {
//     try {
//       const hasPermission = await requestNotificationPermission();
      
//       if (!hasPermission) {
//         console.log('Notification permission not granted');
//         return;
//       }

//       // Check if Firebase Messaging is supported
//       if (!getMessaging || typeof getMessaging !== 'function') {
//         console.log('Firebase Messaging not available');
//         return;
//       }

//       const messaging = getMessaging();
      
//       // Get FCM token
//       const token = await getToken(messaging, {
//         vapidKey: 'YOUR_VAPID_KEY_HERE' // Replace with your actual VAPID key
//       });

//       if (token) {
//         console.log('FCM Token:', token);
        
//         if (auth.currentUser?.email) {
//           await saveFCMTokenToSupabase(auth.currentUser.email, token);
//         }

//         // Setup message listener
//         onMessage(messaging, (payload) => {
//           console.log('Message received:', payload);
//           // Handle foreground messages here
//         });
//       } else {
//         console.log('No FCM token available');
//       }
//     } catch (error) {
//       console.log('Error setting up FCM token:', error);
//     }
//   };

//   const saveFCMTokenToSupabase = async (userId, token) => {
//     try {
//       const { error } = await supabase
//         .from('users')
//         .update({
//           fcmToken: token,
//           tokenUpdatedAt: new Date().toISOString(),
//         })
//         .eq('email', userId);

//       if (error) {
//         console.log('Error saving FCM token to Supabase:', error);
//         return false;
//       }
//       console.log('FCM token saved to Supabase for user:', userId);
//       return true;
//     } catch (error) {
//       console.log('Error saving FCM token:', error);
//       return false;
//     }
//   };

//   // Save user data to Firebase Realtime Database
//   const saveUserToRealtimeDB = async (userId, userData) => {
//     try {
//       const db = getDatabase();
//       const userRef = ref(db, 'users/' + userId);
      
//       // You can implement set or update here based on your needs
//       console.log('Would save to Realtime DB:', userData);
//       // await set(userRef, userData); // Uncomment if you want to actually save
//     } catch (error) {
//       console.error('Error saving to Realtime DB:', error);
//     }
//   };

//   const onHandleLogin = async (e) => {
//     e.preventDefault();
//     if (email !== "" && password !== "") {
//       setIsLoading(true);
//       try {
//         const cred = await signInWithEmailAndPassword(auth, email, password);
//         const cleanedEmail = cred.user.email.trim().toLowerCase();
//         localStorage.setItem("email", cleanedEmail);

//         // Get admin status from Supabase
//         const { data, error } = await supabase
//           .from("users")
//           .select("isTypeAdmin")
//           .eq("email", cleanedEmail)
//           .single();

//         if (error) {
//           alert("Supabase error: " + error.message);
//           return;
//         }

//         // Save admin status
//         localStorage.setItem("isTypeAdmin", JSON.stringify(data.isTypeAdmin));

//         // Update user active status in Supabase
//         await supabase
//           .from("users")
//           .update({
//             isactivestatus: true,
//             iscallingfrom: "",
//             isoncallstatus: false,
//             password: password
//           })
//           .eq("email", cleanedEmail);

//         // Check user in Realtime Database
//         await checkUserInRealtimeDB(cleanedEmail);

//         // Set user online in Firestore
//         await setUserOnline(cleanedEmail);

//         // Setup FCM for notifications
//         await setupFCMToken();

//         // Save user session data to Realtime DB
//         await saveUserToRealtimeDB(cleanedEmail, {
//           email: cleanedEmail,
//           isOnline: true,
//           lastLogin: new Date().toISOString(),
//           isTypeAdmin: data.isTypeAdmin
//         });

//         navigate("/chats");
//       } catch (err) {
//         alert("Login error: " + err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleLanguageSelect = async (lang) => {
//     const langMap = {
//       'English': 'en',
//       'हिंदी': 'hi',
//       'ਪੰਜਾਬੀ': 'pa',
//       'தமிழ்': 'ta'
//     };
    
//     const lng = langMap[lang];
//     localStorage.setItem('LANG', lng);
//     setCurrentLanguage(lng);
//     setSelectLanguage(lang);
//     setShowModal(false);
//   };

//   return (
//     <div className="modern-gradient-background">
//       <div className="modern-safe-area">
        
//         {/* Animated Background Elements */}
//         <div className="floating-shapes">
//           <div className="shape shape-1"></div>
//           <div className="shape shape-2"></div>
//           <div className="shape shape-3"></div>
//         </div>

//         <div className={`modern-login-container ${fadeIn ? 'modern-fade-in' : ''}`}>
          
//           {/* App Branding */}
//           <div className="app-brand">
//             <div className="logo-icon">
//               <IoChatbubbleEllipses className="logo-svg" />
//               <div className="logo-glow"></div>
//             </div>
//             <h1 className="app-name">ChatApp</h1>
//             <div className="app-tagline">
//               Connect • Chat • Share
//             </div>
//           </div>

//           {/* Header */}
//           <div className="modern-header">
//             <h1 className="modern-title">{t('welcomeBack')}</h1>
//             <p className="modern-subtitle">{t('signInContinue')}</p>
//           </div>

//           {/* Language Selector */}
//           <div className="language-selector-container">
//             <button 
//               className="language-selector-button"
//               onClick={() => setShowModal(true)}
//             >
//               <IoGlobe className="language-icon" />
//               <span className="language-text">{selectLanguage}</span>
//               <span className="language-arrow">▼</span>
//             </button>
//           </div>

//           {/* Login Form */}
//           <form className="modern-login-form" onSubmit={onHandleLogin}>
            
//             {/* Email Input */}
//             <div className="modern-input-group">
//               <div className="input-icon">
//                 <IoMail className="icon" />
//               </div>
//               <input
//                 type="email"
//                 placeholder={t('email')}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="modern-form-input"
//               />
//             </div>

//             {/* Password Input */}
//             <div className="modern-input-group">
//               <div className="input-icon">
//                 <IoLockClosed className="icon" />
//               </div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder={t('password')}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="modern-form-input"
//               />
//               <button
//                 type="button"
//                 className="modern-eye-button"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <IoEyeOff className="eye-icon" /> : <IoEye className="eye-icon" />}
//               </button>
//             </div>

//             {/* Forgot Password */}
//             <div className="modern-forgot-password-container">
//               <Link to="/forgot-password" className="modern-forgot-password">
//                 {t('forgotPassword')}
//               </Link>
//             </div>

//             {/* Submit Button */}
//             <button 
//               type="submit" 
//               className={`modern-login-button ${isLoading ? 'loading' : ''}`}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <div className="button-spinner"></div>
//               ) : (
//                 <>
//                   {t('login')}
//                   <IoArrowForward className="button-arrow" />
//                 </>
//               )}
//             </button>

//             {/* Divider */}
//             <div className="divider">
//               <span className="divider-text">or</span>
//             </div>

//             {/* Signup Link */}
//             <div className="modern-signup-container">
//               <span className="signup-text">{t('dontHave')} </span>
//               <Link to="/signup" className="modern-signup-link">
//                 {t('signup')}
//                 <IoSparkles className="sparkle-icon" />
//               </Link>
//             </div>

//           </form>
//         </div>

//         {/* Language Modal */}
//         {showModal && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h3>{t('selectLanguage')}</h3>
//                 <button 
//                   className="close-button"
//                   onClick={() => setShowModal(false)}
//                 >
//                   <IoClose className="close-icon" />
//                 </button>
//               </div>
//               <div className="language-options">
//                 {['English', 'हिंदी', 'ਪੰਜਾਬੀ', 'தமிழ்'].map((lang) => (
//                   <button
//                     key={lang}
//                     className={`language-option ${selectLanguage === lang ? 'selected' : ''}`}
//                     onClick={() => handleLanguageSelect(lang)}
//                   >
//                     {lang}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { supabase } from '../../firebase/supabaseClient';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getDatabase, ref, get } from 'firebase/database';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { 
  IoMail, 
  IoLockClosed, 
  IoEye, 
  IoEyeOff,
  IoArrowForward,
  IoChatbubbleEllipses,
  IoSparkles,
  IoGlobe,
  IoClose,
  IoLanguage
} from 'react-icons/io5';

// Mock translations
const translations = {
  en: {
    login: 'Login',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    dontHave: "Don't have an account?",
    signup: 'Sign Up',
    welcomeBack: 'Welcome back!',
    signInContinue: 'Please sign in to continue',
    selectLanguage: 'Select Language'
  },
  hi: {
    login: 'लॉगिन',
    email: 'ईमेल',
    password: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    dontHave: 'खाता नहीं है?',
    signup: 'साइन अप',
    welcomeBack: 'वापसी पर स्वागत है!',
    signInContinue: 'जारी रखने के लिए साइन इन करें',
    selectLanguage: 'भाषा चुनें'
  },
  pa: {
    login: 'ਲਾਗਿਨ',
    email: 'ਈਮੇਲ',
    password: 'ਪਾਸਵਰਡ',
    forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    dontHave: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
    signup: 'ਸਾਈਨ ਅੱਪ',
    welcomeBack: 'ਵਾਪਸੀ ਤੇ ਸਵਾਗਤ ਹੈ!',
    signInContinue: 'ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ',
    selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ'
  },
  ta: {
    login: 'உள்நுழைய',
    email: 'மின்னஞ்சல்',
    password: 'கடவுச்சொல்',
    forgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    dontHave: 'கணக்கு இல்லையா?',
    signup: 'பதிவு செய்ய',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்!',
    signInContinue: 'தொடர உள்நுழையவும்',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்'
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectLanguage, setSelectLanguage] = useState('English');
  const [showModal, setShowModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const t = (key) => translations[currentLanguage]?.[key] || key;

  useEffect(() => {
    setFadeIn(true);
    checkLng();
  }, []);

  const checkLng = async () => {
    const savedLang = localStorage.getItem('LANG') || 'en';
    setCurrentLanguage(savedLang);
    const langMap = {
      'en': 'English',
      'hi': 'हिंदी',
      'pa': 'ਪੰਜਾਬੀ',
      'ta': 'தமிழ்'
    };
    setSelectLanguage(langMap[savedLang] || 'English');
  };

  const setUserOnline = async (email) => {
    try {
      const userRef = doc(db, "users", email);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        await updateDoc(userRef, { isActiveStatus: true });
        console.log("User is set online");
      } else {
        console.log("User document does not exist");
      }
    } catch (error) {
      console.error("Error setting user online:", error);
    }
  };

  // Check user data from Firebase Realtime Database
  const checkUserInRealtimeDB = async (userId) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + userId);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        console.log('User data from Realtime DB:', snapshot.val());
        return snapshot.val();
      } else {
        console.log('No user data found in Realtime DB');
        return null;
      }
    } catch (error) {
      console.error('Error checking Realtime DB:', error);
      return null;
    }
  };

  const requestNotificationPermission = async () => {
    try {
      if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return false;
      }
      
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.log('Error requesting notification permission:', error);
      return false;
    }
  };

  const setupFCMToken = async () => {
    try {
      const hasPermission = await requestNotificationPermission();
      
      if (!hasPermission) {
        console.log('Notification permission not granted');
        return;
      }

      // Check if Firebase Messaging is supported
      if (!getMessaging || typeof getMessaging !== 'function') {
        console.log('Firebase Messaging not available');
        return;
      }

      const messaging = getMessaging();
      
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY_HERE' // Replace with your actual VAPID key
      });

      if (token) {
        console.log('FCM Token:', token);
        
        if (auth.currentUser?.email) {
          await saveFCMTokenToSupabase(auth.currentUser.email, token);
        }

        // Setup message listener
        onMessage(messaging, (payload) => {
          console.log('Message received:', payload);
          // Handle foreground messages here
        });
      } else {
        console.log('No FCM token available');
      }
    } catch (error) {
      console.log('Error setting up FCM token:', error);
    }
  };

  const saveFCMTokenToSupabase = async (userId, token) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          fcmToken: token,
          tokenUpdatedAt: new Date().toISOString(),
        })
        .eq('email', userId);

      if (error) {
        console.log('Error saving FCM token to Supabase:', error);
        return false;
      }
      console.log('FCM token saved to Supabase for user:', userId);
      return true;
    } catch (error) {
      console.log('Error saving FCM token:', error);
      return false;
    }
  };

  // Save user data to Firebase Realtime Database
  const saveUserToRealtimeDB = async (userId, userData) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + userId);
      
      // You can implement set or update here based on your needs
      console.log('Would save to Realtime DB:', userData);
      // await set(userRef, userData); // Uncomment if you want to actually save
    } catch (error) {
      console.error('Error saving to Realtime DB:', error);
    }
  };

  const onHandleLogin = async (e) => {
    e.preventDefault();
    if (email !== "" && password !== "") {
      setIsLoading(true);
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const cleanedEmail = cred.user.email.trim().toLowerCase();
        localStorage.setItem("email", cleanedEmail);

        // Get admin status from Supabase
        const { data, error } = await supabase
          .from("users")
          .select("isTypeAdmin")
          .eq("email", cleanedEmail)
          .single();

        if (error) {
          alert("Supabase error: " + error.message);
          return;
        }

        // Save admin status
        localStorage.setItem("isTypeAdmin", JSON.stringify(data.isTypeAdmin));

        // Update user active status in Supabase
        await supabase
          .from("users")
          .update({
            isactivestatus: true,
            iscallingfrom: "",
            isoncallstatus: false,
            password: password
          })
          .eq("email", cleanedEmail);

        // Check user in Realtime Database
        await checkUserInRealtimeDB(cleanedEmail);

        // Set user online in Firestore
        await setUserOnline(cleanedEmail);

        // Setup FCM for notifications
        await setupFCMToken();

        // Save user session data to Realtime DB
        await saveUserToRealtimeDB(cleanedEmail, {
          email: cleanedEmail,
          isOnline: true,
          lastLogin: new Date().toISOString(),
          isTypeAdmin: data.isTypeAdmin
        });

        navigate("/chats");
      } catch (err) {
        alert("Login error: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLanguageSelect = async (lang) => {
    const langMap = {
      'English': 'en',
      'हिंदी': 'hi',
      'ਪੰਜਾਬੀ': 'pa',
      'தமிழ்': 'ta'
    };
    
    const lng = langMap[lang];
    localStorage.setItem('LANG', lng);
    setCurrentLanguage(lng);
    setSelectLanguage(lang);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute -bottom-20 left-1/3 w-36 h-36 bg-white/10 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className={`bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-700 transform ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* App Branding */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
              <div className="relative bg-white/20 rounded-full p-4">
                <IoChatbubbleEllipses className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">ChatApp</h1>
            <p className="text-white/80 text-sm">Connect • Chat • Share</p>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">{t('welcomeBack')}</h1>
            <p className="text-white/80">{t('signInContinue')}</p>
          </div>

          {/* Language Selector */}
          <div className="flex justify-center mb-6">
            <button 
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full border border-white/30 transition-all duration-300"
              onClick={() => setShowModal(true)}
            >
              <IoLanguage className="w-4 h-4" />
              <span className="text-sm font-medium">{selectLanguage}</span>
              <IoGlobe className="w-4 h-4" />
            </button>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={onHandleLogin}>
            
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoMail className="h-5 w-5 text-white/70" />
              </div>
              <input
                type="email"
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-10 pr-4 py-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoLockClosed className="h-5 w-5 text-white/70" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-10 pr-12 py-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <IoEyeOff className="h-5 w-5 text-white/70 hover:text-white transition-colors" /> : 
                  <IoEye className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
                }
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-300"
              >
                {t('forgotPassword')}
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full bg-white text-purple-600 rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              ) : (
                <>
                  {t('login')}
                  <IoArrowForward className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/80">or</span>
              </div>
            </div>

            {/* Signup Link */}
            <div className="text-center">
              <span className="text-white/80 text-sm">{t('dontHave')} </span>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-1 text-white font-bold text-sm hover:underline transition-all duration-300"
              >
                {t('signup')}
                <IoSparkles className="w-4 h-4" />
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Language Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full transform animate-scaleIn">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{t('selectLanguage')}</h3>
              <button 
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setShowModal(false)}
              >
                <IoClose className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {['English', 'हिंदी', 'ਪੰਜਾਬੀ', 'தமிழ்'].map((lang) => (
                <button
                  key={lang}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${
                    selectLanguage === lang 
                      ? 'bg-purple-600 text-white shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                  }`}
                  onClick={() => handleLanguageSelect(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}