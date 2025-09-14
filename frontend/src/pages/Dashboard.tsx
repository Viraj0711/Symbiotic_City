import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

// StickFigure component for default avatar
const StickFigure: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="20" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="50" y1="28" x2="50" y2="70" stroke="currentColor" strokeWidth="2" />
    <line x1="35" y1="45" x2="65" y2="45" stroke="currentColor" strokeWidth="2" />
    <line x1="50" y1="70" x2="35" y2="90" stroke="currentColor" strokeWidth="2" />
    <line x1="50" y1="70" x2="65" y2="90" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const Dashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'events' | 'marketplace' | 'profile'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock user data - replace with actual API calls
  const userStats = {
    projectsJoined: 5,
    eventsAttended: 12,
    itemsListed: 3,
    co2Saved: 24.5,
    impactScore: 8.7
  };

  const userProjects = [
    {
      id: '1',
      title: 'Community Solar Garden',
      status: 'ACTIVE',
      progress: 75,
      role: 'Coordinator'
    },
    {
      id: '2',
      title: 'Green Transportation Initiative',
      status: 'COMPLETED',
      progress: 100,
      role: 'Volunteer'
    }
  ];

  const userEvents = [
    {
      id: '1',
      title: 'Monthly Sustainability Workshop',
      date: '2024-08-20',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Community Garden Planting',
      date: '2024-08-15',
      status: 'attended'
    }
  ];

  const userListings = [
    {
      id: '1',
      title: 'Solar Panel Installation Kit',
      type: 'sell',
      price: '₹12,450',
      status: 'active'
    },
    {
      id: '2',
      title: 'Composting Bin',
      type: 'trade',
      status: 'pending'
    }
  ];

  // Profile-related state and functions
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#E2EAD6'}}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access your dashboard</h2>
          <p className="text-gray-600">You need to be authenticated to view this page.</p>
        </div>
      </div>
    );
  }

  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio || 'Passionate about creating sustainable communities and environmental impact.',
    location: user.location || 'Location not specified',
    avatar: user.avatar || ''
  });

  // Update editForm when user data changes
  useEffect(() => {
    setEditForm({
      name: user.name,
      email: user.email,
      bio: user.bio || 'Passionate about creating sustainable communities and environmental impact.',
      location: user.location || 'Location not specified',
      avatar: user.avatar || ''
    });
  }, [user]);

  // Upload avatar function
  const uploadAvatar = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve(dataUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification({
        type: 'error',
        title: 'Invalid file type',
        message: 'Please select an image file (JPG, PNG, GIF, etc.).',
        duration: 5000
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification({
        type: 'error',
        title: 'File too large',
        message: 'Please select an image smaller than 5MB.',
        duration: 5000
      });
      return;
    }

    try {
      setUploading(true);
      setAvatarError(false);
      const avatarUrl = await uploadAvatar(file);
      setEditForm(prev => ({ ...prev, avatar: avatarUrl }));
      
      if (!isEditing) {
        await updateProfile({ avatar: avatarUrl });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showNotification({
        type: 'error',
        title: 'Upload failed',
        message: 'Failed to upload image. Please try again.',
        duration: 5000
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: editForm.name,
        bio: editForm.bio,
        location: editForm.location,
        avatar: editForm.avatar
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification({
        type: 'error',
        title: 'Update failed',
        message: 'Failed to update profile. Please try again.',
        duration: 5000
      });
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      bio: user.bio || 'Passionate about creating sustainable communities and environmental impact.',
      location: user.location || 'Location not specified',
      avatar: user.avatar || ''
    });
    setIsEditing(false);
  };

  // Additional profile data
  const additionalData = {
    joinDate: '2023-03-15',
    interests: ['Urban Gardening', 'Renewable Energy', 'Zero Waste', 'Community Building'],
    skills: ['Project Management', 'Organic Farming', 'Solar Installation', 'Workshop Facilitation'],
    sustainabilityScore: 85,
    projectsJoined: 12,
    eventsAttended: 28,
    itemsShared: 15
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* User Avatar */}
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover border-3 border-green-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white" style={{backgroundColor: '#059669'}}></div>
              </div>
              
              {/* Welcome Message */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Track your sustainability journey and community impact
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userStats.projectsJoined}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userStats.eventsAttended}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userStats.itemsListed}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Listings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{userStats.co2Saved}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Impact</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-100">
            <nav className="-mb-px flex space-x-6 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'projects'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>My Projects</span>
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'events'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m6-6v6M6 15h12" />
                </svg>
                <span>My Events</span>
              </button>
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'marketplace'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>My Listings</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-3 border-b-2 font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile & Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Projects Joined</h3>
                    <p className="text-3xl font-bold text-blue-600">{userStats.projectsJoined}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m6-6v6M6 15h12" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Events Attended</h3>
                    <p className="text-3xl font-bold text-green-600">{userStats.eventsAttended}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Items Listed</h3>
                    <p className="text-3xl font-bold text-purple-600">{userStats.itemsListed}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">CO₂ Saved (tons)</h3>
                    <p className="text-3xl font-bold text-yellow-600">{userStats.co2Saved}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Score */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Impact Score</h3>
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - userStats.impactScore / 10)}`}
                      className="text-green-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{userStats.impactScore}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  You're in the top 15% of community contributors!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            {userProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role: <span className="font-medium">{project.role}</span></span>
                  <button className="text-green-600 hover:text-green-700 font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            {userEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m6-6v6M6 15h12" />
                  </svg>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {userListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listing.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {listing.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      listing.type === 'sell' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {listing.type.toUpperCase()}
                    </span>
                    {listing.price && (
                      <span className="ml-2 text-lg font-bold text-green-600">{listing.price}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <div className="relative">
                  {user.avatar && !avatarError ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-green-500 flex items-center justify-center">
                      <StickFigure className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Avatar Upload Button */}
                  <button
                    onClick={handleAvatarClick}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          name="bio"
                          value={editForm.bio}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={editForm.location}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSave}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                      <p className="text-gray-600 mb-2">{user.email}</p>
                      <p className="text-gray-700 mb-3">{user.bio || 'Passionate about creating sustainable communities and environmental impact.'}</p>
                      <p className="text-gray-600 mb-4">📍 {user.location || 'Location not specified'}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Member since {new Date(additionalData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interests and Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Interests */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {additionalData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {additionalData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
              <div className="space-y-6">
                {/* Email Settings */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Email Notifications</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 mr-3" defaultChecked />
                      <span className="text-gray-700">Project updates</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 mr-3" defaultChecked />
                      <span className="text-gray-700">Event reminders</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 mr-3" />
                      <span className="text-gray-700">Marketplace notifications</span>
                    </label>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Privacy</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 mr-3" defaultChecked />
                      <span className="text-gray-700">Make profile public</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 mr-3" defaultChecked />
                      <span className="text-gray-700">Show activity status</span>
                    </label>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t pt-6">
                  <h4 className="font-medium text-red-600 mb-3">Danger Zone</h4>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
