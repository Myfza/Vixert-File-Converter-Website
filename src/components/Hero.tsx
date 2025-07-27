import React from 'react';
import { motion } from 'framer-motion';
import { HiDownload, HiCode } from 'react-icons/hi';
import { useState } from 'react';
import { handleDownloadWithLoading } from '../utils/downloadUtils';

const Hero: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const handleDownload = () => {
    handleDownloadWithLoading(setIsDownloading);
  };
const download = () => {
    const link = document.createElement('a');
link.href = '/file-convert.py-main.zip';
link.download = 'file-convert.py-main.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
<section className="min-h-screen bg-[#121826] flex items-center justify-center px-4 sm:px-6 lg:px-8">
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="max-w-4xl mx-auto text-center"
  >
    {/* Main Heading */}
    <motion.h1
      variants={itemVariants}
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-sans text-center"
    >
      Convert Any File{' '}
      <span className="text-[#c1121f]">Instantly</span>
    </motion.h1>

    {/* Subheading */}
    <motion.p
      variants={itemVariants}
      className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-sans text-center"
    >
      Drag, choose format, and convert — it's that easy. Transform any file type with our powerful conversion tool.
    </motion.p>

    {/* CTA Buttons */}
    <motion.div
      variants={itemVariants}
      className="flex flex-col sm:flex-row gap-4 justify-center items-center"
    >
      {/* Primary Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={download}
        disabled={isDownloading}
        className={`text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto font-sans ${
          isDownloading 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-[#c1121f] hover:bg-red-800'
        }`}
      >
        {isDownloading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
            />
            Downloading...
          </>
        ) : (
          <>
            <HiDownload size={20} />
            Download v1.0.0
          </>
        )}
      </motion.button>

      {/* Secondary Button */}
      <motion.a
        href="https://github.com/Myfza/File-Converter-Website"
        target="_blank"
        rel="noopener noreferrer"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="border-2 border-gray-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-2 hover:border-[#c1121f] transition-colors duration-300 w-full sm:w-auto font-sans"
      >
        <HiCode size={20} />
        View Source
      </motion.a>
    </motion.div>
  </motion.div>
</section>

  );
};

export default Hero;