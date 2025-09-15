import React, { useState } from 'react';
import { Users, Clock, TrendingUp, X } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useLanguage } from '../contexts/LanguageContext';

const Projects: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [joinStatus, setJoinStatus] = useState<{ [key: string]: 'joining' | 'joined' | 'error' }>({});

  const categories = [
    { key: 'all', label: t('projectsPage.filters.allCategories') },
    { key: 'renewable-energy', label: t('projectsPage.filters.renewableEnergy') },
    { key: 'waste-management', label: t('projectsPage.filters.wasteManagement') },
    { key: 'green-transport', label: t('projectsPage.filters.greenTransport') },
    { key: 'community-garden', label: t('projectsPage.filters.communityGarden') },
    { key: 'education', label: t('projectsPage.filters.education') }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = filter === 'all' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'PLANNED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle project joining
  const handleJoinProject = async (project: any) => {
    if (!user) {
      // Store the intended action and redirect to login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      localStorage.setItem('pendingAction', JSON.stringify({ type: 'joinProject', projectId: project.id, projectTitle: project.title }));
      window.location.href = '/login';
      return;
    }

    try {
      setJoinStatus(prev => ({ ...prev, [project.id]: 'joining' }));
      
      // Simulate API call for project joining
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setJoinStatus(prev => ({ ...prev, [project.id]: 'joined' }));
      
      // Show success notification with website theme
      showNotification({
        type: 'success',
        title: 'Successfully joined project!',
        message: `You've joined "${project.title}". Check your email for next steps and project details.`,
        duration: 6000
      });
      
    } catch (error) {
      console.error('Join project failed:', error);
      setJoinStatus(prev => ({ ...prev, [project.id]: 'error' }));
      
      // Show error notification
      showNotification({
        type: 'error',
        title: 'Failed to join project',
        message: 'Something went wrong. Please try again later.',
        duration: 5000
      });
    }
  };

  // Handle learn more about project
  const handleLearnMore = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  // Handle modal closures
  const handleProjectDetailsClose = () => {
    setShowProjectDetails(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('projectsPage.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('projectsPage.description')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('projectsPage.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Create Project Button */}
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              {t('projectsPage.createProject')}
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('projectsPage.error.title')}</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('projectsPage.empty.title')}</h3>
            <p className="text-gray-600">{t('projectsPage.empty.description')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {t(`projectsPage.status.${project.status}`)}
                    </span>
                    <span className="text-sm text-gray-500">{project.category.replace('-', ' ')}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{t('projectsPage.projectInfo.progress')}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Project Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {project.participants} {t('projectsPage.projectInfo.participants')}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.location}
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{project.tags.length - 3} {t('projectsPage.projectInfo.moreTag')}
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      {t('projectsPage.actions.join')}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      {t('projectsPage.actions.learnMore')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <button
                onClick={handleProjectDetailsClose}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedProject.category}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Progress:</span>
                  <span className="text-emerald-600 font-bold">{selectedProject.progress}%</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedProject.title}</h2>
              <p className="text-gray-700 mb-6">{selectedProject.description}</p>
              
              <div className="grid sm:grid-cols-3 gap-4 mb-6 text-gray-600">
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <Users className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{selectedProject.participants || '12'}</div>
                  <div className="text-sm text-gray-500">Participants</div>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{selectedProject.timeLeft || '30 days'}</div>
                  <div className="text-sm text-gray-500">Remaining</div>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{selectedProject.impact || 'High'}</div>
                  <div className="text-sm text-gray-500">Impact</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Goals</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This project aims to create lasting positive impact in our community through collaborative effort and sustainable practices.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How You Can Help</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Volunteer your time and skills</li>
                  <li>• Share resources and knowledge</li>
                  <li>• Help spread the word in your network</li>
                  <li>• Participate in community events and meetings</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleJoinProject(selectedProject)}
                  disabled={joinStatus[selectedProject.id] === 'joining'}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    joinStatus[selectedProject.id] === 'joined'
                      ? 'bg-green-100 text-green-800 cursor-default'
                      : joinStatus[selectedProject.id] === 'joining'
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {joinStatus[selectedProject.id] === 'joined'
                    ? '✓ Joined'
                    : joinStatus[selectedProject.id] === 'joining'
                    ? 'Joining...'
                    : 'Join Project'
                  }
                </button>
                <button
                  onClick={handleProjectDetailsClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
