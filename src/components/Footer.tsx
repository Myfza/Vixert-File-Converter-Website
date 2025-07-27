import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';

const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://www.linkedin.com/in/myfza/',
      hoverColor: 'hover:text-blue-400',
    },
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/Myfza',
      hoverColor: 'hover:text-gray-300',
    },
    {
      name: 'Website',
      icon: FaGlobe,
      url: 'https://vizart.netlify.app/',
      hoverColor: 'hover:text-purple-400',
    },
  ];

  const footerSections = [
    {
      title: 'Script',
      links: ['Features', 'Installation', 'Documentation', 'Examples'],
    },
    {
      title: 'Resources',
      links: ['GitHub', 'Issues', 'Contributions', 'License'],
    },
    {
      title: 'Support',
      links: ['Help Center', 'Community', 'Bug Reports', 'Updates'],
    },
  ];

  return (
    <footer className="bg-[#1a1e29] border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 font-sans">Vixert</h3>
            <p className="text-gray-400 text-sm mb-4 font-sans">
              Convert any file instantly with our powerful, easy-to-use file
              conversion tool.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-gray-400 ${social.hoverColor} transition-colors duration-300 font-sans`}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
              viewport={{ once: true }}
              className="md:col-span-1"
            >
              <h4 className="text-white font-semibold mb-4 font-sans">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: (sectionIndex + 1) * 0.1 + linkIndex * 0.05,
                    }}
                    viewport={{ once: true }}
                  >
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm font-sans"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-400 text-sm text-center sm:text-left font-sans">
            © 2025 Vixert. All rights reserved.
          </p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-500 text-xs text-center font-sans"
          >
            Made by Muhammad Yusuf Aditiya
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;