import React from 'react';
import { AnimatedSection, StaggeredContainer, ParallaxSection } from './AnimatedSection';
import { FloatingElement, PulseElement } from './FloatingElement';
import { ScrollProgress } from './ScrollProgress';

const AnimationDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />
      
      {/* Hero Section with Parallax */}
      <ParallaxSection className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        {/* Floating Background Elements */}
        <FloatingElement delay={0} duration={4} className="absolute top-20 left-10">
          <div className="w-16 h-16 bg-blue-500/30 rounded-full blur-sm"></div>
        </FloatingElement>
        
        <FloatingElement delay={2} duration={5} className="absolute bottom-20 right-10">
          <div className="w-20 h-20 bg-purple-500/30 rounded-full blur-sm"></div>
        </FloatingElement>
        
        <AnimatedSection animation="fadeUp" className="text-center z-10">
          <h1 className="text-6xl font-bold text-white mb-6">
            Scroll Animation Demo
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience smooth scroll-triggered animations with Framer Motion
          </p>
        </AnimatedSection>
      </ParallaxSection>
      
      {/* Staggered Cards Section */}
      <section className="py-20 px-8">
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Animation Features</h2>
          <p className="text-gray-300">Scroll down to see different animation effects</p>
        </AnimatedSection>
        
        <StaggeredContainer className="max-w-6xl mx-auto">
          {[
            { title: "Fade Up", description: "Elements fade in from bottom", icon: "↑" },
            { title: "Slide Left", description: "Smooth sliding animations", icon: "←" },
            { title: "Zoom In", description: "Scale-based entrance effects", icon: "⚡" },
            { title: "Staggered", description: "Sequential animation timing", icon: "✨" },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </StaggeredContainer>
      </section>
      
      {/* Different Animation Variants */}
      <section className="py-20 px-8 space-y-20">
        <AnimatedSection animation="slideLeft">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-4">Slide Left Animation</h3>
            <p className="text-blue-100">This section slides in from the right side of the screen.</p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="zoom" className="text-center">
          <div className="max-w-4xl mx-auto">
            <PulseElement scale={1.02} duration={3}>
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-8 rounded-xl">
                <h3 className="text-2xl font-bold text-white mb-4">Zoom Animation with Pulse</h3>
                <p className="text-green-100">This section zooms in and has a subtle pulsing effect.</p>
              </div>
            </PulseElement>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="fadeUp" delay={0.2}>
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-4">Delayed Fade Up</h3>
            <p className="text-orange-100">This section has a slight delay before animating in.</p>
          </div>
        </AnimatedSection>
      </section>
      
      {/* Floating Elements Demo */}
      <section className="py-20 px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection animation="fadeUp">
            <h2 className="text-4xl font-bold text-white mb-8">Floating Elements</h2>
            <p className="text-gray-300 mb-12">
              Continuous floating animations that don't depend on scroll position
            </p>
          </AnimatedSection>
          
          {/* Floating decorative elements */}
          <FloatingElement delay={0} duration={4} className="absolute top-10 left-10">
            <div className="w-8 h-8 bg-blue-400 rounded-full opacity-60"></div>
          </FloatingElement>
          
          <FloatingElement delay={1} duration={5} className="absolute top-20 right-20">
            <div className="w-6 h-6 bg-purple-400 rounded-full opacity-60"></div>
          </FloatingElement>
          
          <FloatingElement delay={2} duration={3} className="absolute bottom-10 left-20">
            <div className="w-10 h-10 bg-green-400 rounded-full opacity-60"></div>
          </FloatingElement>
          
          <FloatingElement delay={3} duration={6} className="absolute bottom-20 right-10">
            <div className="w-4 h-4 bg-yellow-400 rounded-full opacity-60"></div>
          </FloatingElement>
        </div>
      </section>
      
      {/* Final Section */}
      <section className="py-20 px-8">
        <AnimatedSection animation="fadeUp" className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Scroll!</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Your scroll animation system is now fully implemented and ready to enhance 
            user experience throughout your application.
          </p>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default AnimationDemo;
