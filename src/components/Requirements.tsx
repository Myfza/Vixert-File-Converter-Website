import React from 'react';
import { motion } from 'framer-motion';
import { HiCode, HiDesktopComputer, HiCube, HiKey } from 'react-icons/hi';

const Requirements: React.FC = () => {
  const requirements = [
    {
      icon: HiCode,
      title: 'Python 3.6 or higher',
      description: 'Compatible with all modern Python versions',
      status: 'Required',
      color: 'text-blue-400',
    },
    {
      icon: HiDesktopComputer,
      title: 'Windows, macOS, or Linux',
      description: 'Cross-platform compatibility guaranteed',
      status: 'Any OS',
      color: 'text-green-400',
    },
    {
      icon: HiCube,
      title: 'No external dependencies',
      description: 'Uses only Python standard library',
      status: 'Zero deps',
      color: 'text-purple-400',
    },
    {
      icon: HiKey,
      title: 'Read/write permissions',
      description: 'Access to target folder for file operations',
      status: 'Folder access',
      color: 'text-yellow-400',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section id="requirements" className="bg-[#121826] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 font-sans">
            System Requirements
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-sans">
            Minimal requirements mean maximum compatibility. Our converter works on virtually any modern system.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {requirements.map((req, index) => {
            const Icon = req.icon;
            return (
              <motion.div
                key={req.title}
                variants={itemVariants}
                className="bg-[#1a1e29] rounded-xl p-4 sm:p-6 shadow-md border border-gray-700 hover:border-[#c1121f] transition-all duration-300"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <Icon className={`text-3xl ${req.color} mt-1`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-white font-sans">{req.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gray-700 ${req.color} font-sans`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm sm:text-base font-sans">{req.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Compatibility Note */}
      </div>
    </section>
  );
};

export default Requirements;