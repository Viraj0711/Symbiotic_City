import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Marketplace from './components/Marketplace';
import Events from './components/Events';
import Projects from './components/Projects';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <Marketplace />
      <Events />
      <Projects />
      <Footer />
    </div>
  );
}

export default App;