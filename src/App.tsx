import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import FileConverterSection from './components/FileConverterSection';
import Installation from './components/Installation';
import Requirements from './components/Requirements';
import Footer from './components/Footer';

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#121826] text-white font-sans"
    >
      <Navigation />
      <main>
        <Hero />
        <Features />
        <FileConverterSection />
        <Installation />
        <Requirements />
      </main>
      <Footer />
    </motion.div>
  );
}

export default App;