


// // // import React, { useState } from "react";
// // // import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// // // import { auth } from "../../firebase/config";
// // // import { supabase } from "../../firebase/supabaseClient";
// // // import { useNavigate, Link } from "react-router-dom";
// // // import './SignUp.css'; // New CSS file

// // // export default function SignUp() {
// // //   const navigate = useNavigate();
// // //   const [email, setEmail] = useState("");
// // //   const [username, setUsername] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [dob, setDob] = useState("");
// // //   const [genderValue, setGenderValue] = useState("");
// // //   const [maritalValue, setMaritalValue] = useState("");
// // //   const [country, setCountry] = useState("");
// // //   const [profileImage, setProfileImage] = useState(null);
// // //   const [uploadedImageUrl, setUploadedImageUrl] = useState("");

// // //   const genderItems = [
// // //     { label: "Male", value: "male" },
// // //     { label: "Female", value: "female" },
// // //     { label: "Other", value: "other" },
// // //   ];

// // //   const maritalItems = [
// // //     { label: "Single", value: "single" },
// // //     { label: "Married", value: "married" },
// // //     { label: "Divorced", value: "divorced" },
// // //   ];

// // //   const pickImage = async (e) => {
// // //     const file = e.target.files[0];
// // //     if (!file) return;
// // //     setProfileImage(URL.createObjectURL(file));

// // //     try {
// // //       const filePath = `${Date.now()}_${file.name}`;
// // //       const { error } = await supabase.storage
// // //         .from("signUp_Images")
// // //         .upload(filePath, file, { upsert: true });
// // //       if (error) throw error;
// // //       const { data } = supabase.storage.from("signUp_Images").getPublicUrl(filePath);
// // //       setUploadedImageUrl(data.publicUrl);
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert("Image upload failed");
// // //     }
// // //   };

// // //   const calculateAge = (birthDate) => {
// // //     const today = new Date();
// // //     const birth = new Date(birthDate);
// // //     let age = today.getFullYear() - birth.getFullYear();
// // //     const m = today.getMonth() - birth.getMonth();
// // //     if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
// // //     return age;
// // //   };

// // //   const onHandleSignup = async () => {
// // //     if (!email || !password || !username || !dob || !genderValue || !maritalValue || !country || !uploadedImageUrl) {
// // //       alert("Please fill all fields");
// // //       return;
// // //     }

// // //     if (calculateAge(dob) < 18) {
// // //       alert("You must be at least 18 years old.");
// // //       return;
// // //     }

// // //     try {
// // //       const cred = await createUserWithEmailAndPassword(auth, email, password);
// // //       await updateProfile(cred.user, { displayName: username });

// // //       const { error } = await supabase.from("users").upsert([{
// // //         id: cred.user.uid,
// // //         email: cred.user.email,
// // //         password,
// // //         avatar: uploadedImageUrl,
// // //         name: username,
// // //         country,
// // //         gender: genderValue,
// // //         maritalstatus: maritalValue,
// // //         dateofbirth: dob,
// // //         age: calculateAge(dob),
// // //         about: "Available",
// // //         isverifiedprofile: true,
// // //       }]);
// // //       if (error) throw error;

// // //       alert("Signup successful!");
// // //       navigate("/");
// // //     } catch (err) {
// // //       alert("Signup failed: " + err.message);
// // //     }
// // //   };

// // //   return (
// // //     <div className="signup-page">
// // //       <div className="safe-area">
// // //         <div className="signup-container">
// // //           <h1 className="title">Sign Up</h1>
// // //           <p className="subtitle">Create your account and start your journey</p>

// // //           <div className="profile-upload">
// // //             <label htmlFor="profile-upload">
// // //               {profileImage ? (
// // //                 <img src={profileImage} alt="profile" className="profile-preview" />
// // //               ) : (
// // //                 <div className="placeholder">👤</div>
// // //               )}
// // //             </label>
// // //             <input
// // //               id="profile-upload"
// // //               type="file"
// // //               accept="image/*"
// // //               onChange={pickImage}
// // //               style={{ display: "none" }}
// // //             />
// // //           </div>

// // //           <div className="form-fields">
// // //             <input type="text" placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)} />
// // //             <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
// // //             <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
// // //             <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
// // //             <select value={genderValue} onChange={(e) => setGenderValue(e.target.value)}>
// // //               <option value="">Select Gender</option>
// // //               {genderItems.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
// // //             </select>
// // //             <select value={maritalValue} onChange={(e) => setMaritalValue(e.target.value)}>
// // //               <option value="">Select Marital Status</option>
// // //               {maritalItems.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
// // //             </select>
// // //             <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
// // //           </div>

// // //           <button onClick={onHandleSignup}>Sign Up</button>

// // //           <p className="login-link">
// // //             Already have an account? <Link to="/">Login</Link>
// // //           </p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }






// // import React, { useState } from "react";
// // import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// // import { auth } from "../../firebase/config";
// // import { supabase } from "../../firebase/supabaseClient";
// // import { useNavigate, Link } from "react-router-dom";
// // import { 
// //   IoCamera, 
// //   IoPerson, 
// //   IoMail, 
// //   IoLockClosed, 
// //   IoCalendar, 
// //   IoMaleFemale, 
// //   IoHeart, 
// //   IoGlobe,
// //   IoArrowBack 
// // } from "react-icons/io5";
// // import './SignUp.css';

// // export default function SignUp() {
// //   const navigate = useNavigate();
// //   const [email, setEmail] = useState("");
// //   const [username, setUsername] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [dob, setDob] = useState("");
// //   const [genderValue, setGenderValue] = useState("");
// //   const [maritalValue, setMaritalValue] = useState("");
// //   const [country, setCountry] = useState("");
// //   const [profileImage, setProfileImage] = useState(null);
// //   const [uploadedImageUrl, setUploadedImageUrl] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [currentStep, setCurrentStep] = useState(1);

// //   const genderItems = [
// //     { label: "Male", value: "male", icon: "👨" },
// //     { label: "Female", value: "female", icon: "👩" },
// //     { label: "Other", value: "other", icon: "😊" },
// //   ];

// //   const maritalItems = [
// //     { label: "Single", value: "single", icon: "💫" },
// //     { label: "Married", value: "married", icon: "💑" },
// //     { label: "Divorced", value: "divorced", icon: "💔" },
// //     { label: "In a Relationship", value: "relationship", icon: "💕" },
// //   ];

// //   const countries = [
// //     "India", "United States", "Canada", "United Kingdom", "Australia", 
// //     "Germany", "France", "Japan", "Brazil", "South Africa"
// //   ];

// //   const pickImage = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;
    
// //     // Validate file type
// //     if (!file.type.startsWith('image/')) {
// //       alert("Please select an image file");
// //       return;
// //     }
    
// //     // Validate file size (max 5MB)
// //     if (file.size > 5 * 1024 * 1024) {
// //       alert("Image size should be less than 5MB");
// //       return;
// //     }
    
// //     setProfileImage(URL.createObjectURL(file));

// //     try {
// //       const filePath = `${Date.now()}_${file.name}`;
// //       const { error } = await supabase.storage
// //         .from("signUp_Images")
// //         .upload(filePath, file, { upsert: true });
// //       if (error) throw error;
// //       const { data } = supabase.storage.from("signUp_Images").getPublicUrl(filePath);
// //       setUploadedImageUrl(data.publicUrl);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Image upload failed");
// //     }
// //   };

// //   const calculateAge = (birthDate) => {
// //     const today = new Date();
// //     const birth = new Date(birthDate);
// //     let age = today.getFullYear() - birth.getFullYear();
// //     const m = today.getMonth() - birth.getMonth();
// //     if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
// //     return age;
// //   };

// //   const validateStep1 = () => {
// //     return username && email && password && profileImage;
// //   };

// //   const validateStep2 = () => {
// //     return dob && genderValue && maritalValue && country;
// //   };

// //   const nextStep = () => {
// //     if (currentStep === 1 && validateStep1()) {
// //       setCurrentStep(2);
// //     }
// //   };

// //   const prevStep = () => {
// //     setCurrentStep(1);
// //   };

// //   const onHandleSignup = async () => {
// //     if (!validateStep1() || !validateStep2()) {
// //       alert("Please fill all required fields");
// //       return;
// //     }

// //     if (calculateAge(dob) < 18) {
// //       alert("You must be at least 18 years old to register.");
// //       return;
// //     }

// //     if (password.length < 6) {
// //       alert("Password must be at least 6 characters long");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const cred = await createUserWithEmailAndPassword(auth, email, password);
// //       await updateProfile(cred.user, { 
// //         displayName: username,
// //         photoURL: uploadedImageUrl 
// //       });

// //       const { error } = await supabase.from("users").upsert([{
// //         id: cred.user.uid,
// //         email: cred.user.email,
// //         password,
// //         avatar: uploadedImageUrl,
// //         name: username,
// //         country,
// //         gender: genderValue,
// //         maritalstatus: maritalValue,
// //         dateofbirth: dob,
// //         age: calculateAge(dob),
// //         about: "Hey there! I'm new here! 👋",
// //         isverifiedprofile: true,
// //         isactivestatus: true,
// //         totalgold: 100, // Starting bonus
// //         totaldiamond: 10,
// //         created_at: new Date().toISOString(),
// //       }]);
      
// //       if (error) throw error;

// //       alert("🎉 Welcome aboard! Your account has been created successfully!");
// //       navigate("/");
// //     } catch (err) {
// //       console.error("Signup error:", err);
// //       if (err.code === 'auth/email-already-in-use') {
// //         alert("This email is already registered. Please try logging in.");
// //       } else if (err.code === 'auth/weak-password') {
// //         alert("Password is too weak. Please choose a stronger password.");
// //       } else if (err.code === 'auth/invalid-email') {
// //         alert("Please enter a valid email address.");
// //       } else {
// //         alert("Signup failed: " + err.message);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const ProgressBar = () => (
// //     <div className="progress-container">
// //       <div className="progress-bar">
// //         <div 
// //           className="progress-fill" 
// //           style={{ width: currentStep === 1 ? '50%' : '100%' }}
// //         ></div>
// //       </div>
// //       <div className="progress-steps">
// //         <span className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</span>
// //         <span className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</span>
// //       </div>
// //     </div>
// //   );

// //   const Step1 = () => (
// //     <div className="step-content">
// //       <h2 className="step-title">Create Your Profile</h2>
// //       <p className="step-subtitle">Let's start with the basics</p>

// //       {/* Profile Upload */}
// //       <div className="profile-upload-section">
// //         <label htmlFor="profile-upload" className="profile-upload-label">
// //           <div className="profile-image-container">
// //             {profileImage ? (
// //               <img src={profileImage} alt="profile" className="profile-preview" />
// //             ) : (
// //               <div className="profile-placeholder">
// //                 <IoCamera className="camera-icon" />
// //                 <span>Add Photo</span>
// //               </div>
// //             )}
// //             <div className="profile-overlay">
// //               <IoCamera className="overlay-icon" />
// //             </div>
// //           </div>
// //         </label>
// //         <input
// //           id="profile-upload"
// //           type="file"
// //           accept="image/*"
// //           onChange={pickImage}
// //           style={{ display: "none" }}
// //         />
// //         <p className="upload-hint">Click to upload your profile picture</p>
// //       </div>

// //       {/* Form Fields */}
// //       <div className="form-fields">
// //         <div className="input-group">
// //           <IoPerson className="input-icon" />
// //           <input 
// //             type="text" 
// //             placeholder="Full Name" 
// //             value={username} 
// //             onChange={(e) => setUsername(e.target.value)}
// //             className="modern-input"
// //           />
// //         </div>

// //         <div className="input-group">
// //           <IoMail className="input-icon" />
// //           <input 
// //             type="email" 
// //             placeholder="Email Address" 
// //             value={email} 
// //             onChange={(e) => setEmail(e.target.value)}
// //             className="modern-input"
// //           />
// //         </div>

// //         <div className="input-group">
// //           <IoLockClosed className="input-icon" />
// //           <input 
// //             type={showPassword ? "text" : "password"} 
// //             placeholder="Password" 
// //             value={password} 
// //             onChange={(e) => setPassword(e.target.value)}
// //             className="modern-input"
// //           />
// //           <button 
// //             type="button"
// //             className="password-toggle"
// //             onClick={() => setShowPassword(!showPassword)}
// //           >
// //             {showPassword ? "🙈" : "👁️"}
// //           </button>
// //         </div>
// //       </div>

// //       <button 
// //         className="next-button"
// //         onClick={nextStep}
// //         disabled={!validateStep1()}
// //       >
// //         Continue
// //         <span className="button-arrow">→</span>
// //       </button>
// //     </div>
// //   );

// //   const Step2 = () => (
// //     <div className="step-content">
// //       <h2 className="step-title">Personal Details</h2>
// //       <p className="step-subtitle">Tell us more about yourself</p>

// //       <div className="form-fields">
// //         {/* Date of Birth */}
// //         <div className="input-group">
// //           <IoCalendar className="input-icon" />
// //           <input 
// //             type="date" 
// //             value={dob} 
// //             onChange={(e) => setDob(e.target.value)}
// //             className="modern-input"
// //             max={new Date().toISOString().split('T')[0]}
// //           />
// //           {dob && (
// //             <span className="age-badge">{calculateAge(dob)} years old</span>
// //           )}
// //         </div>

// //         {/* Gender Selection */}
// //         <div className="selection-group">
// //           <label className="selection-label">
// //             <IoMaleFemale className="label-icon" />
// //             Gender
// //           </label>
// //           <div className="option-grid">
// //             {genderItems.map((item) => (
// //               <button
// //                 key={item.value}
// //                 className={`option-button ${genderValue === item.value ? 'selected' : ''}`}
// //                 onClick={() => setGenderValue(item.value)}
// //                 type="button"
// //               >
// //                 <span className="option-icon">{item.icon}</span>
// //                 <span className="option-label">{item.label}</span>
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Marital Status */}
// //         <div className="selection-group">
// //           <label className="selection-label">
// //             <IoHeart className="label-icon" />
// //             Relationship Status
// //           </label>
// //           <div className="option-grid">
// //             {maritalItems.map((item) => (
// //               <button
// //                 key={item.value}
// //                 className={`option-button ${maritalValue === item.value ? 'selected' : ''}`}
// //                 onClick={() => setMaritalValue(item.value)}
// //                 type="button"
// //               >
// //                 <span className="option-icon">{item.icon}</span>
// //                 <span className="option-label">{item.label}</span>
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Country Selection */}
// //         <div className="input-group">
// //           <IoGlobe className="input-icon" />
// //           <select 
// //             value={country} 
// //             onChange={(e) => setCountry(e.target.value)}
// //             className="modern-input"
// //           >
// //             <option value="">Select Country</option>
// //             {countries.map((countryName) => (
// //               <option key={countryName} value={countryName}>{countryName}</option>
// //             ))}
// //           </select>
// //         </div>
// //       </div>

// //       <div className="step-actions">
// //         <button 
// //           className="back-button"
// //           onClick={prevStep}
// //           type="button"
// //         >
// //           <IoArrowBack className="back-icon" />
// //           Back
// //         </button>
// //         <button 
// //           className="signup-button"
// //           onClick={onHandleSignup}
// //           disabled={!validateStep2() || loading}
// //         >
// //           {loading ? (
// //             <div className="loading-spinner"></div>
// //           ) : (
// //             <>
// //               Complete Sign Up
// //               <span className="button-sparkle">✨</span>
// //             </>
// //           )}
// //         </button>
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <div className="modern-signup-page">
// //       {/* Animated Background */}
// //       <div className="background-gradient">
// //         <div className="floating-shape shape1"></div>
// //         <div className="floating-shape shape2"></div>
// //         <div className="floating-shape shape3"></div>
// //       </div>

// //       <div className="safe-area">
// //         <div className="modern-signup-container">
// //           {/* Header */}
// //           <div className="signup-header">
// //             <button 
// //               className="back-home-button"
// //               onClick={() => navigate("/")}
// //             >
// //               <IoArrowBack />
// //             </button>
// //             <div className="header-content">
// //               <h1 className="main-title">Join Our Community</h1>
// //               <p className="main-subtitle">Start your journey with amazing people</p>
// //             </div>
// //           </div>

// //           {/* Progress Bar */}
// //           <ProgressBar />

// //           {/* Form Steps */}
// //           <div className="form-container">
// //             {currentStep === 1 ? <Step1 /> : <Step2 />}
// //           </div>

// //           {/* Footer */}
// //           <div className="signup-footer">
// //             <p className="footer-text">
// //               Already have an account? 
// //               <Link to="/" className="login-link"> Sign In</Link>
// //             </p>
// //             <p className="terms-text">
// //               By signing up, you agree to our 
// //               <a href="#" className="terms-link"> Terms & Conditions</a>
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState } from "react";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth } from "../../firebase/config";
// import { supabase } from "../../firebase/supabaseClient";
// import { useNavigate, Link } from "react-router-dom";
// import { 
//   IoCamera, 
//   IoPerson, 
//   IoMail, 
//   IoLockClosed, 
//   IoCalendar, 
//   IoMaleFemale, 
//   IoHeart, 
//   IoGlobe,
//   IoArrowBack 
// } from "react-icons/io5";


// export default function SignUp() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [dob, setDob] = useState("");
//   const [genderValue, setGenderValue] = useState("");
//   const [maritalValue, setMaritalValue] = useState("");
//   const [country, setCountry] = useState("");
//   const [profileImage, setProfileImage] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);

//   const genderItems = [
//     { label: "Male", value: "male", icon: "👨" },
//     { label: "Female", value: "female", icon: "👩" },
//     { label: "Other", value: "other", icon: "😊" },
//   ];

//   const maritalItems = [
//     { label: "Single", value: "single", icon: "💫" },
//     { label: "Married", value: "married", icon: "💑" },
//     { label: "Divorced", value: "divorced", icon: "💔" },
//     { label: "In a Relationship", value: "relationship", icon: "💕" },
//   ];

//   const countries = [
//     "India", "United States", "Canada", "United Kingdom", "Australia", 
//     "Germany", "France", "Japan", "Brazil", "South Africa"
//   ];

//   const pickImage = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       alert("Please select an image file");
//       return;
//     }
    
//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       alert("Image size should be less than 5MB");
//       return;
//     }
    
//     setProfileImage(URL.createObjectURL(file));

//     try {
//       const filePath = `${Date.now()}_${file.name}`;
//       const { error } = await supabase.storage
//         .from("signUp_Images")
//         .upload(filePath, file, { upsert: true });
//       if (error) throw error;
//       const { data } = supabase.storage.from("signUp_Images").getPublicUrl(filePath);
//       setUploadedImageUrl(data.publicUrl);
//     } catch (err) {
//       console.error(err);
//       alert("Image upload failed");
//     }
//   };

//   const calculateAge = (birthDate) => {
//     const today = new Date();
//     const birth = new Date(birthDate);
//     let age = today.getFullYear() - birth.getFullYear();
//     const m = today.getMonth() - birth.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
//     return age;
//   };

//   const validateStep1 = () => {
//     return username && email && password && profileImage;
//   };

//   const validateStep2 = () => {
//     return dob && genderValue && maritalValue && country;
//   };

//   const nextStep = () => {
//     if (currentStep === 1 && validateStep1()) {
//       setCurrentStep(2);
//     }
//   };

//   const prevStep = () => {
//     setCurrentStep(1);
//   };

//   const onHandleSignup = async () => {
//     if (!validateStep1() || !validateStep2()) {
//       alert("Please fill all required fields");
//       return;
//     }

//     if (calculateAge(dob) < 18) {
//       alert("You must be at least 18 years old to register.");
//       return;
//     }

//     if (password.length < 6) {
//       alert("Password must be at least 6 characters long");
//       return;
//     }

//     setLoading(true);

//     try {
//       const cred = await createUserWithEmailAndPassword(auth, email, password);
//       await updateProfile(cred.user, { 
//         displayName: username,
//         photoURL: uploadedImageUrl 
//       });

//       const { error } = await supabase.from("users").upsert([{
//         id: cred.user.uid,
//         email: cred.user.email,
//         password,
//         avatar: uploadedImageUrl,
//         name: username,
//         country,
//         gender: genderValue,
//         maritalstatus: maritalValue,
//         dateofbirth: dob,
//         age: calculateAge(dob),
//         about: "Hey there! I'm new here! 👋",
//         isverifiedprofile: true,
//         isactivestatus: true,
//         totalgold: 100, // Starting bonus
//         totaldiamond: 10,
//         created_at: new Date().toISOString(),
//       }]);
      
//       if (error) throw error;

//       alert("🎉 Welcome aboard! Your account has been created successfully!");
//       navigate("/login"); // ✅ FIXED: Navigate to login instead of "/"
//     } catch (err) {
//       console.error("Signup error:", err);
//       if (err.code === 'auth/email-already-in-use') {
//         alert("This email is already registered. Please try logging in.");
//       } else if (err.code === 'auth/weak-password') {
//         alert("Password is too weak. Please choose a stronger password.");
//       } else if (err.code === 'auth/invalid-email') {
//         alert("Please enter a valid email address.");
//       } else {
//         alert("Signup failed: " + err.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const ProgressBar = () => (
//     <div className="progress-container">
//       <div className="progress-bar">
//         <div 
//           className="progress-fill" 
//           style={{ width: currentStep === 1 ? '50%' : '100%' }}
//         ></div>
//       </div>
//       <div className="progress-steps">
//         <span className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</span>
//         <span className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</span>
//       </div>
//     </div>
//   );

//   const Step1 = () => (
//     <div className="step-content">
//       <h2 className="step-title">Create Your Profile</h2>
//       <p className="step-subtitle">Let's start with the basics</p>

//       {/* Profile Upload */}
//       <div className="profile-upload-section">
//         <label htmlFor="profile-upload" className="profile-upload-label">
//           <div className="profile-image-container">
//             {profileImage ? (
//               <img src={profileImage} alt="profile" className="profile-preview" />
//             ) : (
//               <div className="profile-placeholder">
//                 <IoCamera className="camera-icon" />
//                 <span>Add Photo</span>
//               </div>
//             )}
//             <div className="profile-overlay">
//               <IoCamera className="overlay-icon" />
//             </div>
//           </div>
//         </label>
//         <input
//           id="profile-upload"
//           type="file"
//           accept="image/*"
//           onChange={pickImage}
//           style={{ display: "none" }}
//         />
//         <p className="upload-hint">Click to upload your profile picture</p>
//       </div>

//       {/* Form Fields */}
//       <div className="form-fields">
//         <div className="input-group">
//           <IoPerson className="input-icon" />
//           <input 
//             type="text" 
//             placeholder="Full Name" 
//             value={username} 
//             onChange={(e) => setUsername(e.target.value)}
//             className="modern-input"
//           />
//         </div>

//         <div className="input-group">
//           <IoMail className="input-icon" />
//           <input 
//             type="email" 
//             placeholder="Email Address" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)}
//             className="modern-input"
//           />
//         </div>

//         <div className="input-group">
//           <IoLockClosed className="input-icon" />
//           <input 
//             type={showPassword ? "text" : "password"} 
//             placeholder="Password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)}
//             className="modern-input"
//           />
//           <button 
//             type="button"
//             className="password-toggle"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? "🙈" : "👁️"}
//           </button>
//         </div>
//       </div>

//       <button 
//         className="next-button"
//         onClick={nextStep}
//         disabled={!validateStep1()}
//       >
//         Continue
//         <span className="button-arrow">→</span>
//       </button>
//     </div>
//   );

//   const Step2 = () => (
//     <div className="step-content">
//       <h2 className="step-title">Personal Details</h2>
//       <p className="step-subtitle">Tell us more about yourself</p>

//       <div className="form-fields">
//         {/* Date of Birth */}
//         <div className="input-group">
//           <IoCalendar className="input-icon" />
//           <input 
//             type="date" 
//             value={dob} 
//             onChange={(e) => setDob(e.target.value)}
//             className="modern-input"
//             max={new Date().toISOString().split('T')[0]}
//           />
//           {dob && (
//             <span className="age-badge">{calculateAge(dob)} years old</span>
//           )}
//         </div>

//         {/* Gender Selection */}
//         <div className="selection-group">
//           <label className="selection-label">
//             <IoMaleFemale className="label-icon" />
//             Gender
//           </label>
//           <div className="option-grid">
//             {genderItems.map((item) => (
//               <button
//                 key={item.value}
//                 className={`option-button ${genderValue === item.value ? 'selected' : ''}`}
//                 onClick={() => setGenderValue(item.value)}
//                 type="button"
//               >
//                 <span className="option-icon">{item.icon}</span>
//                 <span className="option-label">{item.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Marital Status */}
//         <div className="selection-group">
//           <label className="selection-label">
//             <IoHeart className="label-icon" />
//             Relationship Status
//           </label>
//           <div className="option-grid">
//             {maritalItems.map((item) => (
//               <button
//                 key={item.value}
//                 className={`option-button ${maritalValue === item.value ? 'selected' : ''}`}
//                 onClick={() => setMaritalValue(item.value)}
//                 type="button"
//               >
//                 <span className="option-icon">{item.icon}</span>
//                 <span className="option-label">{item.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Country Selection */}
//         <div className="input-group">
//           <IoGlobe className="input-icon" />
//           <select 
//             value={country} 
//             onChange={(e) => setCountry(e.target.value)}
//             className="modern-input"
//           >
//             <option value="">Select Country</option>
//             {countries.map((countryName) => (
//               <option key={countryName} value={countryName}>{countryName}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="step-actions">
//         <button 
//           className="back-button"
//           onClick={prevStep}
//           type="button"
//         >
//           <IoArrowBack className="back-icon" />
//           Back
//         </button>
//         <button 
//           className="signup-button"
//           onClick={onHandleSignup}
//           disabled={!validateStep2() || loading}
//         >
//           {loading ? (
//             <div className="loading-spinner"></div>
//           ) : (
//             <>
//               Complete Sign Up
//               <span className="button-sparkle">✨</span>
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="modern-signup-page">
//       {/* Animated Background */}
//       <div className="background-gradient">
//         <div className="floating-shape shape1"></div>
//         <div className="floating-shape shape2"></div>
//         <div className="floating-shape shape3"></div>
//       </div>

//       <div className="safe-area">
//         <div className="modern-signup-container">
//           {/* Header */}
//           <div className="signup-header">
//             <button 
//               className="back-home-button"
//               onClick={() => navigate("/login")} // ✅ FIXED: Navigate to login
//             >
//               <IoArrowBack />
//             </button>
//             <div className="header-content">
//               <h1 className="main-title">Join Our Community</h1>
//               <p className="main-subtitle">Start your journey with amazing people</p>
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <ProgressBar />

//           {/* Form Steps */}
//           <div className="form-container">
//             {currentStep === 1 ? <Step1 /> : <Step2 />}
//           </div>

//           {/* Footer */}
//           <div className="signup-footer">
//             <p className="footer-text">
//               Already have an account? 
//               <Link to="/login" className="login-link"> Sign In</Link> {/* ✅ FIXED */}
//             </p>
//             <p className="terms-text">
//               By signing up, you agree to our 
//               <a href="#" className="terms-link"> Terms & Conditions</a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { supabase } from "../../firebase/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { 
  IoCamera, 
  IoPerson, 
  IoMail, 
  IoLockClosed, 
  IoCalendar, 
  IoMaleFemale, 
  IoHeart, 
  IoGlobe,
  IoArrowBack,
  IoEye,
  IoEyeOff,
  IoCheckmark,
  IoSparkles
} from "react-icons/io5";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [maritalValue, setMaritalValue] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const genderItems = [
    { label: "Male", value: "male", icon: "👨" },
    { label: "Female", value: "female", icon: "👩" },
    { label: "Other", value: "other", icon: "😊" },
  ];

  const maritalItems = [
    { label: "Single", value: "single", icon: "💫" },
    { label: "Married", value: "married", icon: "💑" },
    { label: "Divorced", value: "divorced", icon: "💔" },
    { label: "In a Relationship", value: "relationship", icon: "💕" },
  ];

  const countries = [
    "India", "United States", "Canada", "United Kingdom", "Australia", 
    "Germany", "France", "Japan", "Brazil", "South Africa"
  ];

  const pickImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }
    
    setProfileImage(URL.createObjectURL(file));

    try {
      const filePath = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from("signUp_Images")
        .upload(filePath, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("signUp_Images").getPublicUrl(filePath);
      setUploadedImageUrl(data.publicUrl);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const validateStep1 = () => {
    return username && email && password && profileImage;
  };

  const validateStep2 = () => {
    return dob && genderValue && maritalValue && country;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const onHandleSignup = async () => {
    if (!validateStep1() || !validateStep2()) {
      alert("Please fill all required fields");
      return;
    }

    if (calculateAge(dob) < 18) {
      alert("You must be at least 18 years old to register.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { 
        displayName: username,
        photoURL: uploadedImageUrl 
      });

      const { error } = await supabase.from("users").upsert([{
        id: cred.user.uid,
        email: cred.user.email,
        password,
        avatar: uploadedImageUrl,
        name: username,
        country,
        gender: genderValue,
        maritalstatus: maritalValue,
        dateofbirth: dob,
        age: calculateAge(dob),
        about: "Hey there! I'm new here! 👋",
        isverifiedprofile: true,
        isactivestatus: true,
        totalgold: 100,
        totaldiamond: 10,
        created_at: new Date().toISOString(),
      }]);
      
      if (error) throw error;

      alert("🎉 Welcome aboard! Your account has been created successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Please try logging in.");
      } else if (err.code === 'auth/weak-password') {
        alert("Password is too weak. Please choose a stronger password.");
      } else if (err.code === 'auth/invalid-email') {
        alert("Please enter a valid email address.");
      } else {
        alert("Signup failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
        <div 
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: currentStep === 1 ? '50%' : '100%' }}
        ></div>
      </div>
      <div className="flex justify-between px-4">
        {[1, 2].map((step) => (
          <div
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              currentStep >= step
                ? 'bg-white text-orange-500 shadow-lg'
                : 'bg-white/20 text-white/70'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );

  const Step1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Your Profile</h2>
        <p className="text-white/80 text-sm sm:text-base">Let's start with the basics</p>
      </div>

      {/* Profile Upload */}
      <div className="text-center">
        <label htmlFor="profile-upload" className="cursor-pointer inline-block">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 group">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="profile" 
                className="w-full h-full rounded-full object-cover border-4 border-white/30 transition-all duration-300 group-hover:border-white/50"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white/20 border-3 border-dashed border-white/40 flex flex-col items-center justify-center text-white/80 transition-all duration-300 group-hover:bg-white/30 group-hover:border-white/60">
                <IoCamera className="text-2xl sm:text-3xl mb-1" />
                <span className="text-xs">Add Photo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <IoCamera className="text-white text-xl" />
            </div>
          </div>
        </label>
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          onChange={pickImage}
          className="hidden"
        />
        <p className="text-white/70 text-sm">Click to upload your profile picture</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="relative">
          <IoPerson className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-lg" />
          <input 
            type="text" 
            placeholder="Full Name" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-white/15 border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/60 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          />
        </div>

        <div className="relative">
          <IoMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-lg" />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/15 border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/60 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          />
        </div>

        <div className="relative">
          <IoLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-lg" />
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/15 border-2 border-transparent rounded-2xl pl-12 pr-12 py-4 text-white placeholder-white/60 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          />
          <button 
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-300 p-1 rounded-lg hover:bg-white/10"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoEyeOff className="text-lg" /> : <IoEye className="text-lg" />}
          </button>
        </div>
      </div>

      <button 
        className="w-full bg-white/90 hover:bg-white text-gray-800 rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        onClick={nextStep}
        disabled={!validateStep1()}
      >
        Continue
        <IoArrowBack className="transform rotate-180 text-lg" />
      </button>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Personal Details</h2>
        <p className="text-white/80 text-sm sm:text-base">Tell us more about yourself</p>
      </div>

      <div className="space-y-6">
        {/* Date of Birth */}
        <div className="relative">
          <IoCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-lg" />
          <input 
            type="date" 
            value={dob} 
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-white/15 border-2 border-transparent rounded-2xl pl-12 pr-24 py-4 text-white placeholder-white/60 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            max={new Date().toISOString().split('T')[0]}
          />
          {dob && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold">
              {calculateAge(dob)} years
            </span>
          )}
        </div>

        {/* Gender Selection */}
        <div>
          <label className="flex items-center gap-2 text-white font-semibold mb-3">
            <IoMaleFemale className="text-lg" />
            Gender
          </label>
          <div className="grid grid-cols-3 gap-2">
            {genderItems.map((item) => (
              <button
                key={item.value}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                  genderValue === item.value
                    ? 'bg-white text-orange-500 shadow-lg scale-105'
                    : 'bg-white/10 text-white hover:bg-white/15 hover:scale-105'
                }`}
                onClick={() => setGenderValue(item.value)}
                type="button"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Marital Status */}
        <div>
          <label className="flex items-center gap-2 text-white font-semibold mb-3">
            <IoHeart className="text-lg" />
            Relationship Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {maritalItems.map((item) => (
              <button
                key={item.value}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
                  maritalValue === item.value
                    ? 'bg-white text-orange-500 shadow-lg scale-105'
                    : 'bg-white/10 text-white hover:bg-white/15 hover:scale-105'
                }`}
                onClick={() => setMaritalValue(item.value)}
                type="button"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-semibold text-center leading-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Country Selection */}
        <div className="relative">
          <IoGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-lg" />
          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-white/15 border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm appearance-none"
          >
            <option value="" className="text-gray-800">Select Country</option>
            {countries.map((countryName) => (
              <option key={countryName} value={countryName} className="text-gray-800">{countryName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          className="flex-1 bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
          onClick={prevStep}
          type="button"
        >
          <IoArrowBack className="text-lg" />
          Back
        </button>
        <button 
          className="flex-2 bg-white/90 hover:bg-white text-gray-800 rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          onClick={onHandleSignup}
          disabled={!validateStep2() || loading}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
          ) : (
            <>
              Complete Sign Up
              <IoSparkles className="text-lg" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 50%, #FF512F 100%)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 -right-16 w-32 h-32 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-16 left-1/4 w-36 h-36 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 transition-all duration-700">
          
          {/* Header */}
          <div className="text-center mb-8">
            <button 
              className="absolute left-6 top-6 bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              onClick={() => navigate("/login")}
            >
              <IoArrowBack className="text-lg" />
            </button>
            <div className="px-12">
              <h1 className="text-3xl font-bold text-white mb-2">Join Our Community</h1>
              <p className="text-white/80 text-sm">Start your journey with amazing people</p>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar />

          {/* Form Steps */}
          <div className="mb-6">
            {currentStep === 1 ? <Step1 /> : <Step2 />}
          </div>

          {/* Footer */}
          <div className="text-center border-t border-white/20 pt-6">
            <p className="text-white/80 text-sm mb-2">
              Already have an account? 
              <Link to="/login" className="text-white font-semibold hover:underline ml-1">Sign In</Link>
            </p>
            <p className="text-white/60 text-xs">
              By signing up, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}