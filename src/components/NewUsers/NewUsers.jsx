import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { supabase } from '../../firebase/supabaseClient';
import { 
  IoSearch, 
  IoClose, 
  IoFilter, 
  IoReload, 
  IoPerson, 
  IoGlobe, 
  IoCheckmark,
  IoVideocam,
  IoEllipsisHorizontal,
  IoWarning,
  IoPeople,
  IoFlash,
  IoRadioButtonOn,
  IoRadioButtonOff
} from 'react-icons/io5';

// Mock translations
const translations = {
  en: {
    discoverPeople: 'Discover People',
    noUsersFound: 'No users found',
    tryAdjustingFilters: 'Try adjusting your filters or check back later for new users',
    discoverFilters: 'Discover Filters',
    status: 'Status',
    interestedIn: 'Interested in',
    selectCountry: 'Select Country',
    age: 'Age',
    maritalStatus: 'Marital Status',
    reset: 'Reset',
    applyFilters: 'Apply Filters',
    filtersApplied: 'Filters Applied',
    filtersReset: 'Filters Reset',
    foundUsers: 'users matching your criteria',
    allFiltersReset: 'All filters have been reset to default',
    startChatting: 'Start Chatting',
    onlineNow: 'Online Now',
    newUsers: 'New Users'
  }
};

// Country data
const countries = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
];

const genderOptions = ['Male', 'Female', 'Other'];
const statusOptions = ['online', 'offline'];
const maritalStatusOptions = [
  'single', 'married', 'other', 'in a Relationship', 
  'divorced', 'widowed', 'separated', 'single Mom', 'single Dad'
];

export default function NewUsers() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [existingChats, setExistingChats] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [gender, setGender] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [country, setCountry] = useState(null);
  const [countryCode, setCountryCode] = useState('IN');
  const [age, setAge] = useState(28);
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [callerInfo, setCallerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const t = (key) => translations.en[key] || key;

  // Real-time subscriptions
  useEffect(() => {
    const email = auth.currentUser?.email;
    if (!email) {
      setLoading(false);
      return;
    }

    let usersChannel, chatsChannel;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all users except current
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, email, name, age, avatar, isverifiedprofile, country, isactivestatus, about, gender, maritalstatus")
          .neq("email", email)
          .order("name", { ascending: true });

        if (usersError) throw usersError;
        
        // Add new flag for demo purposes
        const usersWithNewFlag = (usersData || []).map((user, index) => ({
          ...user,
          isNew: index < 3 // First 3 users marked as new
        }));
        
        setUsers(usersWithNewFlag);
        setAllUsers(usersWithNewFlag);

        // Fetch existing chats
        const { data: chatsData, error: chatsError } = await supabase
          .from("chats")
          .select("id, users, participants, group_name")
          .contains("participants", [email])
          .eq("group_name", "");

        if (chatsError) throw chatsError;

        setExistingChats(
          (chatsData || []).map((chat) => ({
            chatId: chat.id,
            userEmails: chat.users,
          }))
        );

        // Real-time subscription for users
        usersChannel = supabase
          .channel("users-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "users" },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setUsers(prev => [...prev, payload.new]);
                setAllUsers(prev => [...prev, payload.new]);
              } else if (payload.eventType === "UPDATE") {
                setUsers(prev =>
                  prev.map(u => u.id === payload.new.id ? payload.new : u)
                );
                setAllUsers(prev =>
                  prev.map(u => u.id === payload.new.id ? payload.new : u)
                );
              } else if (payload.eventType === "DELETE") {
                setUsers(prev => prev.filter(u => u.id !== payload.old.id));
                setAllUsers(prev => prev.filter(u => u.id !== payload.old.id));
              }
            }
          )
          .subscribe();

        // Real-time subscription for chats
        chatsChannel = supabase
          .channel("chats-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "chats" },
            (payload) => {
              if (payload.eventType === "INSERT" && payload.new.participants.includes(email)) {
                setExistingChats(prev => [
                  ...prev,
                  {
                    chatId: payload.new.id,
                    userEmails: payload.new.users,
                  },
                ]);
              } else if (payload.eventType === "UPDATE") {
                setExistingChats(prev =>
                  prev.map(chat =>
                    chat.chatId === payload.new.id
                      ? { chatId: payload.new.id, userEmails: payload.new.users }
                      : chat
                  )
                );
              } else if (payload.eventType === "DELETE") {
                setExistingChats(prev =>
                  prev.filter(chat => chat.chatId !== payload.old.id)
                );
              }
            }
          )
          .subscribe();

      } catch (err) {
        console.error("Error fetching chats/users:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (usersChannel) supabase.removeChannel(usersChannel);
      if (chatsChannel) supabase.removeChannel(chatsChannel);
    };
  }, []);

  // Filter functions
  const applyFilters = useCallback(() => {
    let filteredUsers = [...allUsers];

    if (gender) {
      filteredUsers = filteredUsers.filter(
        user => user.gender?.toLowerCase() === gender.toLowerCase()
      );
    }

    if (age) {
      filteredUsers = filteredUsers.filter(
        user => user.age >= 18 && user.age <= age
      );
    }

    if (country?.name) {
      filteredUsers = filteredUsers.filter(
        user => user.country?.toLowerCase() === country.name.toLowerCase()
      );
    }

    if (maritalStatus) {
      filteredUsers = filteredUsers.filter(
        user => user.maritalstatus?.toLowerCase() === maritalStatus.toLowerCase()
      );
    }

    if (activeStatus) {
      if (activeStatus.toLowerCase() === "online") {
        filteredUsers = filteredUsers.filter(user => user.isactivestatus === true);
      } else if (activeStatus.toLowerCase() === "offline") {
        filteredUsers = filteredUsers.filter(user => user.isactivestatus === false);
      }
    }

    if (searchQuery) {
      filteredUsers = filteredUsers.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.about?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setUsers(filteredUsers);
    setIsFilterVisible(false);

    alert(`${t('filtersApplied')}: Found ${filteredUsers.length} ${t('foundUsers')}`);
  }, [allUsers, gender, age, country, maritalStatus, activeStatus, searchQuery, t]);

  const resetFilters = useCallback(() => {
    setGender(null);
    setAge(28);
    setCountry(null);
    setCountryCode('IN');
    setMaritalStatus(null);
    setActiveStatus(null);
    setSearchQuery('');
    setUsers(allUsers);
    alert(t('allFiltersReset'));
  }, [allUsers, t]);

  // Navigation and chat functions
  const handleNavigate = useCallback(async (user) => {
    if (!auth.currentUser?.email) {
      alert("Please log in to start chatting");
      return;
    }

    try {
      const email = user.email;
      const currentUserEmail = auth.currentUser.email;

      // Check if chat already exists
      const { data: existingChat, error } = await supabase
        .from("chats")
        .select("*")
        .contains("participants", [currentUserEmail, email])
        .maybeSingle();

      if (error) {
        console.log("Error fetching chat:", error);
        alert("Error checking existing chat");
        return;
      }

      let chatId;

      if (existingChat) {
        chatId = existingChat.id;
      } else {
        // Create new chat
        const { data: newChat, error: insertError } = await supabase
          .from("chats")
          .insert([
            {
              participants: [currentUserEmail, email],
              users: [
                {
                  email: currentUserEmail,
                  name: auth.currentUser.displayName || currentUserEmail,
                  deletedFromChat: false,
                },
                { 
                  email: email, 
                  name: user.name || email, 
                  deletedFromChat: false 
                },
              ],
              last_updated: new Date().toISOString(),
              last_access: [
                { email: currentUserEmail, date: new Date().toISOString() },
                { email: email, date: "" },
              ],
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.log("Error creating chat:", insertError);
          alert("Error creating new chat");
          return;
        }

        chatId = newChat.id;
      }

      navigate('/Chat', {
        state: { 
          id: chatId,
          chatName: handleName(user),
          email: email,
          isactivestatus: user.isactivestatus,
          avatar: user.avatar,
          about: user.about,
          name: user.name,
          image: user.avatar,
          country: user.country,
          age: user.age,
          gender: user.gender,
          maritalstatus: user.maritalstatus
        }
      });

    } catch (err) {
      console.error("Error in handleNavigate:", err);
      alert("Error starting chat");
    }
  }, [navigate]);

  const handleName = useCallback((user) => {
    const { name, email } = user;
    const currentUserEmail = auth.currentUser?.email;
    
    if (name && name.trim()) {
      return email === currentUserEmail ? `${name}*(You)` : name;
    }
    return email || '~ No Name or Email ~';
  }, []);

  // Stats calculation
  const onlineUsersCount = users.filter(user => user.isactivestatus).length;
  const newUsersCount = users.filter(user => user.isNew).length;

  // Render user card
  const UserCard = React.memo(({ user, index }) => {
    return (
      <div 
        className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-orange-300 animate-fade-in"
        style={{ animationDelay: `${index * 100}ms` }}
        onClick={() => handleNavigate(user)}
      >
        <div className="relative h-72 overflow-hidden">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={user.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          
          {/* Status Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            {user.isNew && (
              <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl px-3 py-1 shadow-lg">
                <span className="text-white text-xs font-bold tracking-wider">NEW</span>
              </div>
            )}
            
            {user.isactivestatus && (
              <div className="bg-green-500 rounded-xl px-3 py-1 shadow-lg">
                <span className="text-white text-xs font-bold tracking-wider">LIVE</span>
              </div>
            )}
            
            {user.isverifiedprofile && (
              <div className="bg-white/90 rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                <IoCheckmark className="text-orange-500 text-sm font-bold" />
              </div>
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 text-white">
            <div className="space-y-2">
              <div>
                <h3 className="text-xl font-bold">
                  {user.name}, {user.age}
                </h3>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg backdrop-blur-sm ${
                  user.isactivestatus 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-gray-500/20 text-gray-300'
                }`}>
                  {user.isactivestatus ? '● Online' : '○ Offline'}
                </span>
                <span className="text-sm opacity-90 font-medium">
                  {user.country}
                </span>
              </div>

              {user.about && (
                <div className="text-sm opacity-90 leading-relaxed">
                  {user.about.length > 60 
                    ? `${user.about.substring(0, 60)}...` 
                    : user.about
                  }
                </div>
              )}

              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/30 hover:translate-x-1 w-fit">
                <span className="text-sm font-semibold">{t('startChatting')}</span>
                <span className="text-lg">💬</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="p-4 border-t border-orange-100">
          <div className="flex flex-wrap gap-2">
            {user.gender && (
              <span className="bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {user.gender}
              </span>
            )}
            {user.maritalstatus && (
              <span className="bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {user.maritalstatus}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  });

  // Loading State
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-12 h-12 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 text-lg font-medium">Discovering amazing people...</p>
    </div>
  );

  // Error State
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <IoWarning className="text-6xl text-orange-500 mb-4 opacity-70" />
      <h3 className="text-2xl font-bold text-gray-800 mb-3">Connection Error</h3>
      <p className="text-gray-600 mb-6 max-w-md">{error}</p>
      <button 
        className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-6 animate-bounce">
        <div className="text-8xl bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
          👥
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('noUsersFound')}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{t('tryAdjustingFilters')}</p>
      <button 
        className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
        onClick={resetFilters}
      >
        Reset All Filters
      </button>
    </div>
  );

  // Filter modal component
  const FilterModal = () => {
    if (!isFilterVisible) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
        onClick={() => setIsFilterVisible(false)}
      >
        <div 
          className="bg-white w-full max-w-2xl rounded-t-3xl max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{t('discoverFilters')}</h3>
                <p className="text-white/90 text-sm">Refine your search</p>
              </div>
              <button 
                className="bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90"
                onClick={() => setIsFilterVisible(false)}
              >
                <IoClose className="text-xl" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Search Filter */}
            <div className="mb-7">
              <label className="block text-gray-800 font-bold mb-4">Search</label>
              <div className="relative flex items-center bg-gray-100 rounded-2xl px-4 transition-all duration-300 focus-within:bg-gray-200">
                <IoSearch className="text-gray-500 text-lg mr-3" />
                <input
                  type="text"
                  placeholder="Search by name, location, or bio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-4 text-gray-800 outline-none"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-7">
              <label className="block text-gray-800 font-bold mb-4">{t('status')}</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((item) => (
                  <button
                    key={item}
                    className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                      activeStatus === item 
                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveStatus(activeStatus === item ? null : item)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="mb-7">
              <label className="block text-gray-800 font-bold mb-4">{t('interestedIn')}</label>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map((item) => (
                  <button
                    key={item}
                    className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                      gender === item 
                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setGender(gender === item ? null : item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Country Filter */}
            <div className="mb-7">
              <label className="block text-gray-800 font-bold mb-4">{t('selectCountry')}</label>
              <div className="relative">
                <select
                  value={country?.code || ''}
                  onChange={(e) => {
                    const selectedCountry = countries.find(c => c.code === e.target.value);
                    setCountry(selectedCountry);
                    setCountryCode(selectedCountry?.code || 'IN');
                  }}
                  className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-2xl text-gray-800 font-medium transition-all duration-300 focus:border-orange-500 focus:bg-white appearance-none"
                >
                  <option value="" className="text-gray-500">All Countries</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <IoEllipsisHorizontal className="text-gray-500 text-xl rotate-90" />
                </div>
              </div>
            </div>

            {/* Age Filter */}
            <div className="mb-7">
              <label className="block text-gray-800 font-bold mb-4">
                {t('age')}: <span className="text-orange-500 font-black">{age}</span>
              </label>
              <input
                type="range"
                min="18"
                max="120"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-500 [&::-webkit-slider-thumb]:to-pink-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
              />
              <div className="flex justify-between text-sm text-gray-600 font-semibold mt-2">
                <span>18</span>
                <span>120</span>
              </div>
            </div>

            {/* Marital Status Filter */}
            <div className="mb-7">
              <label className="block text-gray-800 font-bold mb-4">{t('maritalStatus')}</label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {maritalStatusOptions.map((item) => (
                  <button
                    key={item}
                    className={`px-4 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                      maritalStatus === item 
                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setMaritalStatus(maritalStatus === item ? null : item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button 
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl py-4 font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                onClick={resetFilters}
              >
                <IoReload className="text-lg" />
                {t('reset')}
              </button>
              <button 
                className="flex-2 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white rounded-2xl py-4 font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                onClick={applyFilters}
              >
                <IoCheckmark className="text-lg" />
                {t('applyFilters')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-orange-500 via-pink-600 to-orange-500 bg-[length:400%_400%] animate-gradient-shift"
      style={{
        background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 50%, #FF512F 100%)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 -right-16 w-32 h-32 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-16 left-1/4 w-36 h-36 bg-white/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{t('discoverPeople')}</h1>
            <p className="text-white/90 text-lg">Connect with amazing people around you</p>
          </div>
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex gap-8">
            <div className="text-center">
              <span className="block text-2xl font-black text-white mb-1">{users.length}</span>
              <span className="text-white/80 text-sm font-semibold uppercase tracking-wide">Total</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-white mb-1">{onlineUsersCount}</span>
              <span className="text-white/80 text-sm font-semibold uppercase tracking-wide">{t('onlineNow')}</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-black text-white mb-1">{newUsersCount}</span>
              <span className="text-white/80 text-sm font-semibold uppercase tracking-wide">{t('newUsers')}</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <div className="relative flex items-center bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl px-4 transition-all duration-300 focus-within:bg-white/25 focus-within:border-white/30">
              <IoSearch className="text-white/70 text-xl mr-3" />
              <input
                type="text"
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-4 text-white placeholder-white/70 outline-none"
              />
              {searchQuery && (
                <button 
                  className="text-white/70 hover:text-white p-1 rounded-lg transition-colors duration-300"
                  onClick={() => setSearchQuery('')}
                >
                  <IoClose className="text-lg" />
                </button>
              )}
            </div>
          </div>
          <button 
            className="bg-white/15 backdrop-blur-xl hover:bg-white/25 border border-white/20 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 whitespace-nowrap"
            onClick={() => setIsFilterVisible(true)}
          >
            <IoFilter className="text-lg" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-t-3xl mt-8 min-h-[calc(100vh-200px)] relative z-10 shadow-2xl pb-32">
        <div className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState />
          ) : users.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map((user, index) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Ad placeholder */}
          {users.length > 0 && users.length % 4 === 0 && (
            <div className="flex justify-center mt-12">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-8 rounded-3xl text-center border-2 border-dashed border-orange-200 w-full max-w-md">
                <div className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent font-bold text-lg">
                  ✨ Premium Features Available
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          animation: gradient-shift 8s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
}