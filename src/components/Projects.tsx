import React from 'react';
import { Target, Users, Clock, TrendingUp } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Zero Waste Initiative',
      description: 'Community-wide program to reduce waste and promote circular economy practices.',
      progress: 65,
      participants: 120,
      category: 'Waste Management',
      timeLeft: '3 months',
      impact: '2.5 tons waste reduced',
      image: 'https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Urban Forest Expansion',
      description: 'Collaborative tree planting and green space development across the city.',
      progress: 80,
      participants: 85,
      category: 'Environment',
      timeLeft: '1 month',
      impact: '500 trees planted',
      image: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Renewable Energy Co-op',
      description: 'Community solar panel installation and energy sharing program.',
      progress: 40,
      participants: 200,
      category: 'Energy',
      timeLeft: '6 months',
      impact: '50% energy savings',
      image: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <section id="projects" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Active Community Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join ongoing projects that are making a real difference in our community. 
            Collaborate with neighbors, businesses, and local authorities.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-emerald-600 font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
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
                    <div className="text-lg font-semibold text-gray-900">{project.participants}</div>
                    <div className="text-xs text-gray-500">Participants</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{project.timeLeft}</div>
                    <div className="text-xs text-gray-500">Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{project.impact}</div>
                    <div className="text-xs text-gray-500">Impact</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200">
                    Join Project
                  </button>
                  <button className="px-4 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 mr-4">
            View All Projects
          </button>
          <button className="border border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors duration-200">
            Start New Project
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;