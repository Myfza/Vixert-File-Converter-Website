import React from 'react';
import { motion } from 'framer-motion';
import { HiClock, HiCog, HiDesktopComputer, HiShieldCheck, HiLightningBolt } from 'react-icons/hi';

const Features: React.FC = () => {
  const features = [
    {
      icon: HiClock,
      title: 'Time-Saving Automation',
      description: 'Organize thousands of files in seconds. No more manual sorting or dragging files one by one.',
      color: 'text-blue-400',
    },
    {
      icon: HiCog,
      title: 'Customizable Organization Rules',
      description: 'Define your own folder structure and file categorization rules to match your workflow.',
      color: 'text-green-400',
    },
    {
      icon: HiDesktopComputer,
      title: 'Cross-Platform Compatibility',
      description: 'Works seamlessly on Windows, macOS, and Linux. One script for all your devices.',
      color: 'text-purple-400',
    },
    {
      icon: HiLightningBolt,
      title: 'Zero External Dependencies',
      description: 'Pure Python script with no additional packages required. Just download and run.',
      color: 'text-yellow-400',
    },
    {
      icon: HiShieldCheck,
      title: 'Safe File Handling',
      description: 'Built-in safety checks prevent file loss. Creates backups and handles duplicates intelligently.',
      color: 'text-red-400',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="features" className="bg-[#121826] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 font-sans">
            Why Choose Vixert?
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto font-sans">
            Discover the key benefits that make our converter the perfect solution for all your file conversion needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-[#1a1e29] rounded-xl p-6 shadow-md border border-gray-700 hover:border-[#c1121f] transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  <Icon className={`text-3xl ${feature.color} mr-3`} />
                  <h3 className="text-lg sm:text-xl font-semibold text-white font-sans">{feature.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed font-sans text-sm sm:text-base">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;