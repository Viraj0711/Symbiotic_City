import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Notification from '../components/Notification';

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [joiningProject, setJoiningProject] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info'
  });

  // Mock project data - replace with API call
  const [project] = useState({
    id: id || '1',
    title: 'Community Solar Power Initiative',
    description: 'Join our ambitious project to install solar panels on community buildings and create a shared renewable energy grid. This initiative will reduce carbon emissions, lower energy costs, and create green jobs in our neighborhood.',
    category: 'renewable-energy',
    status: 'ACTIVE',
    progress: 65,
    participants: 28,
    targetParticipants: 50,
    location: 'Downtown District',
    startDate: '2025-01-15',
    estimatedCompletion: '2025-12-31',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    goals: [
      'Install 200kW solar capacity across 10 community buildings',
      'Reduce neighborhood carbon emissions by 40%',
      'Create 15 green jobs in solar installation and maintenance',
      'Establish community energy cooperative'
    ],
    impact: {
      co2Reduced: '150 tons/year',
      energySaved: '280,000 kWh/year',
      costSavings: '$42,000/year',
      treesEquivalent: '3,300 trees planted'
    },
    updates: [
      {
        date: '2025-10-10',
        title: 'Phase 2 Installation Complete',
        description: 'Successfully installed solar panels on 6 buildings. Moving to Phase 3 next week.'
      },
      {
        date: '2025-09-15',
        title: 'Community Meeting Success',
        description: 'Great turnout at our community meeting with 45 residents attending.'
      }
    ],
    teamRoles: [
      { role: 'Installation Volunteers', spots: 10, filled: 8 },
      { role: 'Technical Coordinators', spots: 3, filled: 3 },
      { role: 'Community Outreach', spots: 5, filled: 4 },
      { role: 'Documentation Team', spots: 2, filled: 1 }
    ],
    tags: ['renewable-energy', 'climate-action', 'community-power', 'sustainability']
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 500);
  }, [id]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, message, type });
  };

  const handleJoinProject = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/projects/${id}` } });
      return;
    }

    try {
      setJoiningProject(true);
      
      // TODO: Make API call to join project
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showNotification(
        t('projectsPage.notifications.joinSuccess')?.replace('{projectName}', project.title) || 
        `Successfully joined ${project.title}!`,
        'success'
      );
    } catch (error) {
      showNotification(
        t('projectsPage.notifications.joinError') || 'Failed to join project. Please try again.',
        'error'
      );
    } finally {
      setJoiningProject(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'PLANNED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" style={{backgroundColor: '#E2EAD6'}}>
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Project Image */}
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-96 object-cover rounded-lg shadow-md mb-6"
          />
        )}

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {t(`projectsPage.status.${project.status}`) || project.status}
            </span>
            <span className="text-sm text-gray-500">{project.category.replace('-', ' ')}</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
          
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{t('projectsPage.projectInfo.progress') || 'Progress'}</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {project.participants}/{project.targetParticipants} {t('projectsPage.projectInfo.participants') || 'participants'}
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {project.location}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          <button
            onClick={handleJoinProject}
            disabled={joiningProject}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              joiningProject
                ? 'bg-green-400 text-white cursor-wait'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {joiningProject ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('projectsPage.actions.joining') || 'Joining...'}
              </span>
            ) : (
              t('projectsPage.actions.join') || 'Join Project'
            )}
          </button>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
          <p className="text-gray-600 leading-relaxed">{project.description}</p>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Goals</h2>
          <ul className="space-y-3">
            {project.goals.map((goal, index) => (
              <li key={index} className="flex items-start text-gray-600">
                <svg className="w-5 h-5 mr-3 mt-0.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {goal}
              </li>
            ))}
          </ul>
        </div>

        {/* Impact */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Environmental Impact</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(project.impact).map(([key, value]) => (
              <div key={key} className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{value}</div>
                <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Roles */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Roles Needed</h2>
          <div className="space-y-4">
            {project.teamRoles.map((role, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{role.role}</div>
                  <div className="text-sm text-gray-600">{role.filled}/{role.spots} filled</div>
                </div>
                <div className="w-24">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(role.filled / role.spots) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Updates */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Updates</h2>
          <div className="space-y-6">
            {project.updates.map((update, index) => (
              <div key={index} className="border-l-4 border-green-600 pl-4">
                <div className="text-sm text-gray-500 mb-1">{update.date}</div>
                <div className="font-medium text-gray-900 mb-2">{update.title}</div>
                <p className="text-gray-600">{update.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
