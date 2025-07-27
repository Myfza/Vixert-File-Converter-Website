import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiDownload, HiCheckCircle, HiXCircle } from 'react-icons/hi';

interface ConversionResult {
  id: string;
  originalName: string;
  format: string;
  status: 'success' | 'failed';
  downloadUrl?: string;
  timestamp: Date;
}

interface ResultsProps {
  results: ConversionResult[];
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  if (results.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="bg-black py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Conversion Results
          </h2>
          <p className="text-gray-400 text-lg">
            Your converted files are ready for download
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {results.map((result) => (
              <motion.div
                key={result.id}
                variants={itemVariants}
                exit="exit"
                layout
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-300"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {result.status === 'success' ? (
                      <HiCheckCircle className="text-green-500 text-xl" />
                    ) : (
                      <HiXCircle className="text-red-500 text-xl" />
                    )}
                    <span
                      className={`font-medium text-sm ${
                        result.status === 'success'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {result.status === 'success' ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {result.format.toUpperCase()}
                  </span>
                </div>

                {/* File Info */}
                <div className="mb-4">
                  <h3 className="text-white font-medium truncate mb-1">
                    {result.originalName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Converted {result.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {/* Download Button */}
                {result.status === 'success' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary-red text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition-colors duration-300"
                    onClick={() => {
                      // Simulate download
                      console.log('Downloading:', result.originalName);
                    }}
                  >
                    <HiDownload size={16} />
                    Download
                  </motion.button>
                )}

                {result.status === 'failed' && (
                  <div className="w-full bg-gray-700 text-gray-400 py-2 px-4 rounded-lg font-medium text-center">
                    Conversion Failed
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Clear Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mt-8"
          >
            <button className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
              Clear All Results
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Results;
export type { ConversionResult };