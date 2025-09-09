import { ArrowRight, Users, Building2, TreePine, Leaf } from 'lucide-react';
import { AnimatedSection, StaggeredContainer, ParallaxSection } from './AnimatedSection';
import { useAuth } from '../contexts/AuthContext';

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" style={{backgroundColor: '#E2EAD6'}}>
      {/* Parallax Background Elements */}
      <ParallaxSection speed={0.3} className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500 rounded-full blur-xl"></div>
      </ParallaxSection>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* User Welcome Section */}
        {user && (
          <AnimatedSection animation="fadeUp" className="mb-8">
            <div className="bg-green-900/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                {user.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover border-3 border-green-500"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold" style={{color: '#059669'}}>Welcome back, {user.name}!</h2>
                  <p className="text-green-600">Ready to make a difference in your community today?</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight" style={{color: '#059669'}}>
                Co-create a
                <span className="text-emerald-600"> Sustainable</span> Future
              </h1>
            </AnimatedSection>
            
            <AnimatedSection animation="fadeUp" delay={0.4}>
              <p className="text-xl leading-relaxed" style={{color: 'black'}}>
                Connect with residents, businesses, and local authorities to build stronger, 
                smarter communities. Discover eco-friendly initiatives, share resources, 
                and collaborate on projects that make a real impact.
              </p>
            </AnimatedSection>
            
            {/* Stats */}
            <StaggeredContainer staggerDelay={0.1} className="flex flex-wrap gap-8">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium" style={{color: 'black'}}>10k+ Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium" style={{color: 'black'}}>500+ Businesses</span>
              </div>
              <div className="flex items-center space-x-2">
                <TreePine className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium" style={{color: 'black'}}>200+ Projects</span>
              </div>
            </StaggeredContainer>

            {/* CTA Buttons */}
            <AnimatedSection animation="fadeUp" delay={0.8}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                  <span>Join Community</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="border border-emerald-600 text-emerald-400 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-900 transition-all duration-200">
                  Explore Projects
                </button>
              </div>
            </AnimatedSection>
          </div>

          {/* Visual */}
          <AnimatedSection animation="slideRight" delay={0.6}>
            <div className="relative">
              <div className="border border-gray-300 rounded-2xl shadow-xl p-8" style={{backgroundColor: '#B3C893'}}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Green Initiative</h3>
                      <p className="text-sm text-gray-600">Community garden project</p>
                    </div>
                  </div>
                  <div className="bg-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-emerald-600">75%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
                    <div className="w-8 h-8 bg-green-100 rounded-full"></div>
                    <div className="w-8 h-8 bg-yellow-100 rounded-full"></div>
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-400 rounded-full text-xs text-white">
                      +12
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Hero;