import React, { useState } from 'react';
import { Users, Clock, TrendingUp, X } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedSection, StaggeredContainer } from './AnimatedSection';

interface ProjectsProps {
  limit?: number;
}

const Projects: React.FC<ProjectsProps> = ({ limit }) => {
  const { projects, loading, error } = useProjects();
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [joinStatus, setJoinStatus] = useState<{ [key: string]: 'joining' | 'joined' | 'error' }>({});

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
      
      // Show success message
      alert(`Successfully joined "${project.title}"! Check your email for next steps and project details.`);
      
    } catch (error) {
      console.error('Join project failed:', error);
      setJoinStatus(prev => ({ ...prev, [project.id]: 'error' }));
      alert('Failed to join project. Please try again.');
    }
  };

  // Handle learn more about project
  const handleLearnMore = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  // Handle view all projects
  const handleViewAllProjects = () => {
    window.location.href = '/projects';
  };

  // Handle start new project
  const handleStartNewProject = () => {
    if (!user) {
      // Store the intended action and redirect to login
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      localStorage.setItem('pendingAction', JSON.stringify({ type: 'startNewProject' }));
      window.location.href = '/login';
      return;
    }
    setShowNewProjectModal(true);
  };

  // Handle modal closures
  const handleProjectDetailsClose = () => {
    setShowProjectDetails(false);
    setSelectedProject(null);
  };

  const handleNewProjectModalClose = () => {
    setShowNewProjectModal(false);
  };

  if (loading) {
    return (
      <section id="projects" className="py-16 lg:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-16 lg:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400">Error loading projects: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-16 lg:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeUp" className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Active Community Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join ongoing projects that are making a real difference in our community. 
            Collaborate with neighbors, businesses, and local authorities.
          </p>
        </AnimatedSection>

        {projects.length === 0 ? (
          <AnimatedSection animation="fadeUp" delay={0.2} className="text-center py-12">
            <p className="text-gray-400 text-lg">No active projects yet.</p>
            <p className="text-gray-500 mt-2">Start a new project to make a difference in your community!</p>
          </AnimatedSection>
        ) : (
          <StaggeredContainer className="grid lg:grid-cols-3 gap-8 mb-12">
          {(limit ? projects.slice(0, limit) : projects).map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-gray-800 bg-opacity-90 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">Progress</span>
                    <span className="text-sm text-emerald-600 font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-lg font-semibold text-white">{project.participants}</div>
                    <div className="text-xs text-gray-400">Participants</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-lg font-semibold text-white">{project.timeLeft}</div>
                    <div className="text-xs text-gray-400">Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-lg font-semibold text-white">{project.impact}</div>
                    <div className="text-xs text-gray-400">Impact</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleJoinProject(project)}
                    disabled={joinStatus[project.id] === 'joining'}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      joinStatus[project.id] === 'joined'
                        ? 'bg-green-600 text-white cursor-default'
                        : joinStatus[project.id] === 'joining'
                        ? 'bg-emerald-400 text-white cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {joinStatus[project.id] === 'joined' 
                      ? 'Joined ✓' 
                      : joinStatus[project.id] === 'joining'
                      ? 'Joining...'
                      : 'Join Project'
                    }
                  </button>
                  <button 
                    onClick={() => handleLearnMore(project)}
                    className="px-4 border border-gray-600 text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
          </StaggeredContainer>
        )}

        <AnimatedSection animation="fadeUp" delay={0.4} className="text-center">
          <button 
            onClick={handleViewAllProjects}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 mr-4"
          >
            View All Projects
          </button>
          <button 
            onClick={handleStartNewProject}
            className="border border-emerald-600 text-emerald-400 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-900 transition-colors duration-200"
          >
            Start New Project
          </button>
        </AnimatedSection>

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
                  <div className="text-lg font-semibold text-gray-900">{selectedProject.participants}</div>
                  <div className="text-sm text-gray-500">Participants</div>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{selectedProject.timeLeft}</div>
                  <div className="text-sm text-gray-500">Remaining</div>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{selectedProject.impact}</div>
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
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => {
                    handleProjectDetailsClose();
                    handleJoinProject(selectedProject);
                  }}
                  disabled={joinStatus[selectedProject.id] === 'joining'}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    joinStatus[selectedProject.id] === 'joined'
                      ? 'bg-green-600 text-white cursor-default'
                      : joinStatus[selectedProject.id] === 'joining'
                      ? 'bg-emerald-400 text-white cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {joinStatus[selectedProject.id] === 'joined' 
                    ? 'Joined ✓' 
                    : joinStatus[selectedProject.id] === 'joining'
                    ? 'Joining...'
                    : 'Join Project'
                  }
                </button>
                <button
                  onClick={handleProjectDetailsClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Start New Project</h2>
              <button
                onClick={handleNewProjectModalClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your project title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option>Environment</option>
                    <option>Community</option>
                    <option>Education</option>
                    <option>Health</option>
                    <option>Technology</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Describe your project goals and impact"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                      <option>1 month</option>
                      <option>3 months</option>
                      <option>6 months</option>
                      <option>1 year</option>
                      <option>Ongoing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Participants</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="50"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      alert('Project proposal submitted! Our team will review and get back to you within 48 hours.');
                      handleNewProjectModalClose();
                    }}
                    className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Submit Proposal
                  </button>
                  <button
                    type="button"
                    onClick={handleNewProjectModalClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
};

export default Projects;