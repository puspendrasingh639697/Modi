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
  IoLanguage,
  IoLogoFirebase,
  IoShieldCheckmark
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
    selectLanguage: 'Select Language',
    secureLogin: 'Secure login with Firebase',
    stayConnected: 'Stay connected with your community'
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
    selectLanguage: 'भाषा चुनें',
    secureLogin: 'Firebase के साथ सुरक्षित लॉगिन',
    stayConnected: 'अपने समुदाय से जुड़े रहें'
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
    selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    secureLogin: 'Firebase ਨਾਲ ਸੁਰੱਖਿਅਤ ਲਾਗਇਨ',
    stayConnected: 'ਆਪਣੇ ਕਮਿਊਨਿਟੀ ਨਾਲ ਜੁੜੇ ਰਹੋ'
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
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    secureLogin: 'Firebase உடன் பாதுகாப்பான உள்நுழைவு',
    stayConnected: 'உங்கள் சமூகத்துடன் தொடர்பில் இருங்கள்'
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
  const [shake, setShake] = useState(false);
  
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

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
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
        vapidKey: 'YOUR_VAPID_KEY_HERE'
      });

      if (token) {
        console.log('FCM Token:', token);
        
        if (auth.currentUser?.email) {
          await saveFCMTokenToSupabase(auth.currentUser.email, token);
        }

        // Setup message listener
        onMessage(messaging, (payload) => {
          console.log('Message received:', payload);
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
      console.log('Would save to Realtime DB:', userData);
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
          triggerShake();
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
        triggerShake();
      } finally {
        setIsLoading(false);
      }
    } else {
      triggerShake();
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
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{
        background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 50%, #FF512F 100%)'
      }}
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 -right-16 w-32 h-32 bg-white/10 rounded-full animate-bounce animation-delay-2000"></div>
        <div className="absolute -bottom-16 left-1/4 w-36 h-36 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-white/10 rounded-full animate-ping animation-delay-3000"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-300/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-pink-300/20 rounded-full blur-xl animate-float animation-delay-1500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className={`bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 transition-all duration-700 transform ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${shake ? 'animate-shake' : ''}`}>
          
          {/* Enhanced App Branding */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping animation-duration-2000"></div>
              <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white/30 to-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <IoChatbubbleEllipses className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">ChatApp</h1>
            <p className="text-white/80 text-sm font-medium">{t('stayConnected')}</p>
            
            {/* Security Badge */}
            <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-white/10 rounded-full border border-white/20">
              <IoShieldCheckmark className="w-4 h-4 text-green-300" />
              <span className="text-white/70 text-xs font-medium">{t('secureLogin')}</span>
              <IoLogoFirebase className="w-4 h-4 text-orange-300" />
            </div>
          </div>

          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {t('welcomeBack')}
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">{t('signInContinue')}</p>
          </div>

          {/* Enhanced Language Selector */}
          <div className="flex justify-center mb-6">
            <button 
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-3 rounded-2xl border border-white/25 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
              onClick={() => setShowModal(true)}
            >
              <IoLanguage className="w-4 h-4" />
              <span className="text-sm font-medium">{selectLanguage}</span>
              <IoGlobe className="w-4 h-4" />
            </button>
          </div>

          {/* Enhanced Login Form */}
          <form className="space-y-6" onSubmit={onHandleLogin}>
            
            {/* Enhanced Email Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                <IoMail className="h-5 w-5 text-white/70 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="email"
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm focus:bg-white/15 focus:scale-105"
              />
            </div>

            {/* Enhanced Password Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                <IoLockClosed className="h-5 w-5 text-white/70 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm focus:bg-white/15 focus:scale-105"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center transition-transform duration-300 hover:scale-110"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <IoEyeOff className="h-5 w-5 text-white/70 hover:text-white transition-colors" /> : 
                  <IoEye className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
                }
              </button>
            </div>

            {/* Enhanced Forgot Password */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:underline inline-flex items-center gap-1"
              >
                {t('forgotPassword')}
                <IoArrowForward className="w-3 h-3" />
              </Link>
            </div>

            {/* Enhanced Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-white to-white/90 text-gray-800 rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-white hover:to-white'
              } group`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>{t('login')}</span>
                  <IoArrowForward className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Enhanced Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-transparent text-white/80 font-medium">or continue with</span>
              </div>
            </div>

            {/* Enhanced Signup Link */}
            <div className="text-center">
              <span className="text-white/80 text-sm">{t('dontHave')} </span>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 text-white font-bold text-sm hover:underline transition-all duration-300 group"
              >
                {t('signup')}
                <IoSparkles className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Language Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full transform animate-scaleIn border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">{t('selectLanguage')}</h3>
              <button 
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110"
                onClick={() => setShowModal(false)}
              >
                <IoClose className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {['English', 'हिंदी', 'ਪੰਜਾਬੀ', 'தமிழ்'].map((lang) => (
                <button
                  key={lang}
                  className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    selectLanguage === lang 
                      ? 'bg-gradient-to-r from-[#FF512F] to-[#DD2476] text-white shadow-lg scale-105' 
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                  }`}
                  onClick={() => handleLanguageSelect(lang)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{lang}</span>
                    {selectLanguage === lang && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}