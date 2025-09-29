import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Stick Figure SVG Component
const StickFigure = ({ className = "w-32 h-32" }: { className?: string }) => (
  <div className={`${className} bg-gray-100 rounded-full flex items-center justify-center border-4 border-green-500`}>
    <svg 
      viewBox="0 0 100 100" 
      className="w-20 h-20 text-gray-400"
      fill="currentColor"
    >
      {/* Head */}
      <circle cx="50" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
      
      {/* Body */}
      <line x1="50" y1="32" x2="50" y2="65" stroke="currentColor" strokeWidth="3" />
      
      {/* Arms */}
      <line x1="50" y1="45" x2="35" y2="55" stroke="currentColor" strokeWidth="3" />
      <line x1="50" y1="45" x2="65" y2="55" stroke="currentColor" strokeWidth="3" />
      
      {/* Legs */}
      <line x1="50" y1="65" x2="35" y2="85" stroke="currentColor" strokeWidth="3" />
      <line x1="50" y1="65" x2="65" y2="85" stroke="currentColor" strokeWidth="3" />
    </svg>
  </div>
);

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'events' | 'marketplace' | 'settings'>('overview');
  const [avatarError, setAvatarError] = useState(false);
  const { user, updateProfile, uploadAvatar } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Don't render anything if user is not logged in
  if (!user) {
    return null;
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

  // Mock additional profile data
  const additionalData = {
    joinDate: '2023-03-15',
    interests: ['Urban Gardening', 'Renewable Energy', 'Zero Waste', 'Community Building'],
    skills: ['Project Management', 'Organic Farming', 'Solar Installation', 'Workshop Facilitation'],
    sustainabilityScore: 85,
    projectsJoined: 12,
    eventsAttended: 28,
    itemsShared: 15
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

    console.log('Selected file:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    try {
      setUploading(true);
      setAvatarError(false); // Reset error state when uploading new image
      console.log('Starting upload...');
      const avatarUrl = await uploadAvatar(file);
      console.log('Upload successful, URL:', avatarUrl.substring(0, 50) + '...');
      setEditForm(prev => ({ ...prev, avatar: avatarUrl }));
      
      // If not in editing mode, update immediately
      if (!isEditing) {
        console.log('Updating profile with new avatar...');
        await updateProfile({ avatar: avatarUrl });
        console.log('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload image. Please try again.');
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
      alert('Failed to update profile. Please try again.');
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

  const mockProjects = [
    {
      id: '1',
      title: 'Community Solar Garden',
      role: 'Project Lead',
      status: 'active',
      progress: 75,
      lastActive: '2 days ago'
    },
    {
      id: '2',
      title: 'Neighborhood Composting',
      role: 'Volunteer',
      status: 'completed',
      progress: 100,
      lastActive: '1 week ago'
    },
    {
      id: '3',
      title: 'Green Transportation Initiative',
      role: 'Coordinator',
      status: 'active',
      progress: 45,
      lastActive: '1 day ago'
    }
  ];

  const mockEvents = [
    {
      id: '1',
      title: 'Urban Farming Workshop',
      date: '2024-01-20',
      status: 'attended',
      type: 'Workshop'
    },
    {
      id: '2',
      title: 'Climate Action Summit',
      date: '2024-01-15',
      status: 'attended',
      type: 'Conference'
    },
    {
      id: '3',
      title: 'Community Clean-up Day',
      date: '2024-01-25',
      status: 'registered',
      type: 'Volunteer'
    }
  ];

  const mockMarketplace = [
    {
      id: '1',
      title: 'Solar Panel Kit',
      type: 'shared',
      date: '2024-01-10',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Organic Seeds Collection',
      type: 'traded',
      date: '2024-01-05',
      status: 'completed'
    },
    {
      id: '3',
      title: 'Compost Bin',
      type: 'sold',
      date: '2024-01-18',
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen" style={{backgroundColor: '#E2EAD6'}}>
      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <StickFigure />
              )}
              
              <button
                onClick={handleAvatarClick}
                disabled={uploading}
                className="absolute -bottom-2 -right-2 text-white p-2 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
                style={{backgroundColor: '#059669'}}
                title="Change profile picture"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="absolute -bottom-2 -left-2 text-white text-xs font-bold px-2 py-1 rounded-full" style={{backgroundColor: '#059669'}}>
                {additionalData.sustainabilityScore}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4 max-w-lg">
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold border-b-2 border-gray-300 focus:border-green-500 outline-none bg-transparent w-full"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    className="text-gray-600 border-b border-gray-300 focus:border-green-500 outline-none bg-transparent w-full"
                  />
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="text-gray-700 border border-gray-300 rounded-lg p-2 focus:border-green-500 outline-none w-full resize-none"
                  />
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
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600 mb-2">{user.location || 'Location not specified'}</p>
                  <p className="text-gray-700 mb-4 max-w-lg">{user.bio || 'Passionate about creating sustainable communities and environmental impact.'}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {additionalData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{additionalData.projectsJoined}</div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{additionalData.eventsAttended}</div>
                <div className="text-sm text-gray-600">Events</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{additionalData.itemsShared}</div>
                <div className="text-sm text-gray-600">Items Shared</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{additionalData.sustainabilityScore}</div>
                <div className="text-sm text-gray-600">Impact Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'projects', label: 'Projects' },
              { id: 'events', label: 'Events' },
              { id: 'marketplace', label: 'Marketplace' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'projects' | 'events' | 'marketplace' | 'settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#059669'}}></div>
                  <span className="text-gray-700">Joined "Community Solar Garden" project</span>
                  <span className="text-gray-500 text-sm">2 days ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Attended "Urban Farming Workshop"</span>
                  <span className="text-gray-500 text-sm">1 week ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Shared "Solar Panel Kit" on marketplace</span>
                  <span className="text-gray-500 text-sm">2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">My Projects</h3>
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{project.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">Role: {project.role}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{project.progress}% complete</span>
                    </div>
                    <span className="text-xs text-gray-500">Last active: {project.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">My Events</h3>
            <div className="space-y-4">
              {mockEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-gray-600 text-sm">{event.type} • {new Date(event.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'attended' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Marketplace Activity</h3>
            <div className="space-y-4">
              {mockMarketplace.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.type === 'shared' ? 'bg-green-100 text-green-800' :
                      item.type === 'traded' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'completed' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
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
        )}
      </div>
    </div>
  );
};

export default Profile;
