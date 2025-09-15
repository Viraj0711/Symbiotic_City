import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  skills: string[];
  projects: number;
  events: number;
  joinedDate: string;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
}

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'groups'>('feed');
  const { t } = useLanguage();

  // Mock data - replace with actual API calls
  const posts: Post[] = [
    {
      id: '1',
      author: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      content: 'Just finished installing solar panels on our community center! The project will reduce our carbon footprint by 40%. Thanks to everyone who helped make this happen! 🌞',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      tags: ['solar-energy', 'sustainability', 'community']
    },
    {
      id: '2',
      author: 'Mike Chen',
      avatar: '/api/placeholder/40/40',
      content: 'Looking for volunteers for this Saturday\'s beach cleanup. We need about 20 people. Snacks and drinks provided! Who\'s in?',
      timestamp: '4 hours ago',
      likes: 15,
      comments: 12,
      tags: ['cleanup', 'volunteer', 'environment']
    }
  ];

  const members: CommunityMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/60/60',
      role: 'Sustainability Coordinator',
      bio: 'Passionate about renewable energy and community organizing.',
      skills: ['Solar Installation', 'Project Management', 'Community Outreach'],
      projects: 8,
      events: 15,
      joinedDate: 'January 2023'
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: '/api/placeholder/60/60',
      role: 'Environmental Advocate',
      bio: 'Working to reduce waste and promote circular economy principles.',
      skills: ['Waste Management', 'Education', 'Event Planning'],
      projects: 5,
      events: 22,
      joinedDate: 'March 2023'
    }
  ];

  return (
    <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('communityPage.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('communityPage.description')}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('feed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'feed'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('communityPage.tabs.feed')}
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'members'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('communityPage.tabs.members')}
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'groups'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('communityPage.tabs.groups')}
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex space-x-3">
                  <img
                    src="/api/placeholder/40/40"
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      placeholder={t('communityPage.feed.createPostPlaceholder')}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-gray-700">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8m-9 4h8" />
                          </svg>
                        </button>
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        {t('communityPage.feed.postButton')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts */}
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex space-x-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{post.author}</h3>
                        <span className="text-gray-500 text-sm">{post.timestamp}</span>
                      </div>
                      <p className="mt-2 text-gray-700">{post.content}</p>
                      
                      {/* Tags */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Actions */}
                      <div className="mt-4 flex space-x-6">
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          <span>{t('communityPage.feed.share')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('communityPage.stats.title')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('communityPage.stats.totalMembers')}</span>
                    <span className="font-medium">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('communityPage.stats.activeProjects')}</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('communityPage.stats.monthlyEvents')}</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('communityPage.stats.co2Saved')}</span>
                    <span className="font-medium text-green-600">156.2</span>
                  </div>
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('communityPage.trending.title')}</h3>
                <div className="space-y-2">
                  {[
                    { key: 'solarEnergy', posts: 45 },
                    { key: 'communityGarden', posts: 32 },
                    { key: 'zeroWaste', posts: 28 },
                    { key: 'bikeSharing', posts: 23 },
                    { key: 'renewable', posts: 19 }
                  ].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-blue-600 hover:underline cursor-pointer">#{t(`communityPage.trending.${topic.key}`)}</span>
                      <span className="text-gray-500 text-sm">{topic.posts} {t('communityPage.trending.posts')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-green-600">{member.role}</p>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{t('communityPage.members.skills')}</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{member.projects}</div>
                    <div>{t('communityPage.members.projects')}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{member.events}</div>
                    <div>{t('communityPage.members.events')}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">{member.joinedDate}</div>
                    <div>{t('communityPage.members.joined')}</div>
                  </div>
                </div>
                
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  {t('communityPage.members.connect')}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('communityPage.groups.title')}</h3>
            <p className="text-gray-600">{t('communityPage.groups.description')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
