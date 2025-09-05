import { Users, Clock, TrendingUp } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { AnimatedSection, StaggeredContainer } from './AnimatedSection';

interface ProjectsProps {
  limit?: number;
}

const Projects: React.FC<ProjectsProps> = ({ limit }) => {
  const { projects, loading, error } = useProjects();

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
                  <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200">
                    Join Project
                  </button>
                  <button className="px-4 border border-gray-600 text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </StaggeredContainer>
        )}

        <AnimatedSection animation="fadeUp" delay={0.4} className="text-center">
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 mr-4">
            View All Projects
          </button>
          <button className="border border-emerald-600 text-emerald-400 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-900 transition-colors duration-200">
            Start New Project
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Projects;