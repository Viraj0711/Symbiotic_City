import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'events' | 'marketplace'>('overview');

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
      price: 150,
      status: 'active'
    },
    {
      id: '2',
      title: 'Composting Bin',
      type: 'trade',
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.name || user?.email || 'User'}!
          </h1>
          <p className="text-gray-600">
            Track your sustainability journey and community impact
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Projects
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Events
              </button>
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'marketplace'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Listings
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
                      <span className="ml-2 text-lg font-bold text-green-600">${listing.price}</span>
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
      </div>
    </div>
  );
};

export default Dashboard;
