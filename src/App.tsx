import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Marketplace from './components/Marketplace';
import Events from './components/Events';
import Projects from './components/Projects';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900">
        <Header />
        <Hero />
        <Features />
        <Marketplace />
        <Events />
        <Projects />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;