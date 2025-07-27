import React from 'react';
import { motion } from 'framer-motion';
import { HiDownload, HiPlay, HiCog } from 'react-icons/hi';
import { useState } from 'react';
import { handleDownloadWithLoading } from '../utils/downloadUtils';

const Installation: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const steps = [
    {
      number: '1',
      icon: HiDownload,
      title: 'Download the script',
      description: 'Get the file-convert.py script from our repository',
      code: 'git clone https://github.com/myfza/file-organizer.git',
      alternative: 'Or download file-convert.py directly',
      color: 'text-blue-400',
    },
    {
      number: '2',
      icon: HiPlay,
      title: 'Run the script',
      description: 'Navigate to the directory and execute the Python script',
      code: 'cd file-organizer\python file-convert.py',
      alternative: 'Works with Python 3.6+',
      color: 'text-green-400',
    },
    {
      number: '3',
      icon: HiCog,
      title: 'Customize and enjoy',
      description: 'Edit the folder_path variable to target your desired directory',
      code: 'folder_path = "/path/to/your/messy/folder"',
      alternative: 'Customize organization rules as needed',
      color: 'text-purple-400',
    },
  ];

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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const handleDownload = () => {
    handleDownloadWithLoading(setIsDownloading);
  };

  return (
    <section id="installation" className="bg-[#121826] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 font-sans">
            Get started in under{' '}
            <span className="text-[#c1121f]">60 seconds</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-sans">
            Three simple steps to start converting your files instantly
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6 bg-[#1a1e29] rounded-xl p-4 sm:p-6 shadow-md border border-gray-700"
              >
                {/* Step Number and Icon */}
                <div className="flex items-center gap-3 sm:gap-4 lg:min-w-[200px] w-full lg:w-auto">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#1a1e29] rounded-full text-white font-bold text-base sm:text-lg font-sans">
                    {step.number}
                  </div>
                  <Icon className={`text-2xl ${step.color}`} />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white font-sans">{step.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm font-sans">{step.description}</p>
                  </div>
                </div>

                {/* Code Block */}
                <div className="flex-1 w-full min-w-0">
                  <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                    <pre className="text-green-400 font-mono text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-all sm:break-normal">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                  <p className="text-gray-500 text-xs mt-2 font-sans">{step.alternative}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Start CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            disabled={isDownloading}
            className={`text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all duration-300 font-sans ${
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
                Download Now - It's Free!
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Installation;