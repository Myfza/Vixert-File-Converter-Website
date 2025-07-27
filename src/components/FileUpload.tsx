import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiUpload, HiDocument, HiX } from 'react-icons/hi';

interface FileUploadProps {
  onFileUpload: (file: File, format: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formats = ['PDF', 'PNG', 'JPG', 'MP4', 'MP3', 'DOCX'];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleConvert = async () => {
    if (selectedFile) {
      setIsConverting(true);
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      onFileUpload(selectedFile, selectedFormat);
      setIsConverting(false);
      setSelectedFile(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className="bg-gray-900 py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Convert Your Files
          </h2>
          <p className="text-gray-400 text-lg">
            Select your file and choose the output format
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Drag and Drop Zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`relative border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-all duration-300 ${
              dragOver
                ? 'border-primary-red bg-red-900/10'
                : selectedFile
                ? 'border-green-500 bg-green-900/10'
                : 'border-gray-600 bg-gray-800/50 hover:bg-gray-800'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="*/*"
            />

            {selectedFile ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <HiDocument className="text-primary-red text-2xl" />
                  <div className="text-left">
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearFile}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <HiX size={20} />
                </button>
              </motion.div>
            ) : (
              <div>
                <HiUpload className="mx-auto text-4xl sm:text-5xl text-gray-400 mb-4" />
                <p className="text-white text-lg sm:text-xl font-medium mb-2">
                  Drag and drop your file here
                </p>
                <p className="text-gray-400">or click to browse</p>
              </div>
            )}
          </motion.div>

          {/* Format Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 sm:grid-cols-6 gap-3"
          >
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`p-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedFormat === format
                    ? 'bg-primary-red text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {format}
              </button>
            ))}
          </motion.div>

          {/* Convert Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: selectedFile && !isConverting ? 1.02 : 1 }}
              whileTap={{ scale: selectedFile && !isConverting ? 0.98 : 1 }}
              onClick={handleConvert}
              disabled={!selectedFile || isConverting}
              className={`px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2 mx-auto transition-all duration-300 ${
                selectedFile && !isConverting
                  ? 'bg-primary-red text-white hover:bg-red-600 shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isConverting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  />
                  Converting...
                </>
              ) : (
                <>
                  <HiUpload size={20} />
                  Convert to {selectedFormat}
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FileUpload;