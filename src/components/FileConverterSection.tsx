import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiUpload, 
  HiX, 
  HiDownload, 
  HiRefresh, 
  HiExclamationCircle,
  HiCheckCircle,
  HiDocument,
  HiPhotograph
} from 'react-icons/hi';
import { 
  ConversionOption, 
  UploadedFile, 
  ConversionResult, 
  CONVERSION_OPTIONS, 
  MAX_FILE_SIZE,
  SUPPORTED_FILE_TYPES,
  QUALITY_SETTINGS,
  FILE_SIZE_LIMITS,
  CONVERSION_MATRIX
} from '../types/fileTypes';
import { 
  convertFile, 
  downloadConvertedFile, 
  ConversionProgress,
  ConversionResult as UtilConversionResult,
  detectFileFormat,
  getSupportedConversions,
  validateInputFile,
  validateFileIntegrity
} from '../utils/fileConversion';

const FileConverterSection: React.FC = () => {
  const [selectedConversion, setSelectedConversion] = useState<ConversionOption | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState<Record<string, ConversionProgress>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File validation
  const validateFile = async (file: File): Promise<string | null> => {
    // Use enhanced validation from utils
    const basicValidation = validateInputFile(file);
    if (basicValidation) {
      return basicValidation;
    }

    // Check file integrity
    const integrityCheck = await validateFileIntegrity(file);
    if (!integrityCheck.valid) {
      return integrityCheck.error || 'File appears to be corrupted';
    }

    return null;
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    const newFiles: UploadedFile[] = [];
    const errors: string[] = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const error = await validateFile(file);
      if (error) {
        errors.push(error);
        continue;
      }

      // Detect file format
      const detectedFormat = detectFileFormat(file);
      
      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}-${index}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        format: detectedFormat,
      };

      newFiles.push(uploadedFile);
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files).catch(console.error);
    }
  }, [handleFileUpload]);

  // File input change handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files).catch(console.error);
    }
  };

  // Remove file
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setConversionResults(prev => prev.filter(result => result.originalFile.id !== fileId));
  };

  // Real file conversion with proper error handling
  const performConversion = async (file: UploadedFile): Promise<ConversionResult> => {
    if (!selectedConversion) {
      return {
        id: `result-${file.id}`,
        originalFile: file,
        status: 'error',
        progress: 0,
        errorMessage: 'No conversion type selected'
      };
    }

    const result: ConversionResult = {
      id: `result-${file.id}`,
      originalFile: file,
      status: 'pending',
      progress: 0,
    };

    // Update initial result
    setConversionResults(prev => 
      prev.map(r => r.id === result.id ? { ...result, status: 'converting' } : r)
    );

    try {
      // Perform actual conversion
      const conversionResult = await convertFile(
        file.file,
        selectedConversion.from,
        selectedConversion.to,
        (progress: ConversionProgress) => {
          setConversionProgress(prev => ({
            ...prev,
            [file.id]: progress
          }));
          
          // Update progress in results
          setConversionResults(prev => 
            prev.map(r => r.id === result.id ? { 
              ...r, 
              progress: progress.progress,
              status: 'converting'
            } : r)
          );
        }
      );

      // Update final result
      if (conversionResult.success && conversionResult.outputBlob) {
        const downloadUrl = URL.createObjectURL(conversionResult.outputBlob);
        const finalResult: ConversionResult = {
          ...result,
          status: 'success',
          progress: 100,
          downloadUrl,
          convertedFileName: conversionResult.outputFileName
        };
        
        setConversionResults(prev => 
          prev.map(r => r.id === result.id ? finalResult : r)
        );
        
        return finalResult;
      } else {
        const errorResult: ConversionResult = {
          ...result,
          status: 'error',
          progress: 0,
          errorMessage: conversionResult.error || 'Conversion failed'
        };
        
        setConversionResults(prev => 
          prev.map(r => r.id === result.id ? errorResult : r)
        );
        
        return errorResult;
      }
      
    } catch (error) {
      const errorResult: ConversionResult = {
        ...result,
        status: 'error',
        progress: 0,
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      
      setConversionResults(prev => 
        prev.map(r => r.id === result.id ? errorResult : r)
      );
      
      return errorResult;
    }
  };

  // Start conversion process
  const startConversion = async () => {
    if (!selectedConversion || uploadedFiles.length === 0) return;

    setIsConverting(true);
    
    // Initialize conversion results
    const initialResults: ConversionResult[] = uploadedFiles.map(file => ({
      id: `result-${file.id}`,
      originalFile: file,
      status: 'pending',
      progress: 0,
    }));
    
    setConversionResults(initialResults);

    // Process each file
    for (const file of uploadedFiles) {
      await performConversion(file);
    }

    // Clear progress tracking
    setConversionProgress({});
    setIsConverting(false);
  };

  // Reset all
  const resetAll = () => {
    setUploadedFiles([]);
    setConversionResults([]);
    setSelectedConversion(null);
    setIsConverting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download file
  const handleDownload = (result: ConversionResult) => {
    if (result.status === 'success' && result.downloadUrl && result.convertedFileName) {
      try {
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = result.convertedFileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
      }
    }
  };

  // Get file icon
  const getFileIcon = (file: UploadedFile) => {
    if (file.type.startsWith('image/')) {
      return <HiPhotograph className="text-2xl text-blue-400" />;
    }
    return <HiDocument className="text-2xl text-gray-400" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canConvert = selectedConversion && uploadedFiles.length > 0 && !isConverting;

  return (
    <section className="bg-[#121826] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 font-sans">
            Convert Your Files{' '}
            <span className="text-[#c1121f]">Instantly</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-sans">
            Upload your files and convert them to different formats with just a few clicks
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Conversion Type Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-[#1a1e29] rounded-xl p-6 shadow-md border border-gray-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4 font-sans">
              Choose Conversion Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CONVERSION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedConversion(option)}
                  className={`p-3 rounded-lg border transition-all duration-300 text-left font-sans ${
                    selectedConversion?.id === option.id
                      ? 'border-[#c1121f] bg-[#c1121f]/10 text-white'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          option.quality === 'high' ? 'bg-green-600' : 
                          option.quality === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}>
                          {option.quality.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* File Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-[#1a1e29] rounded-xl p-6 shadow-md border border-gray-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4 font-sans">
              Upload Files
            </h3>
            
            {/* Drag and Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                isDragOver
                  ? 'border-[#c1121f] bg-[#c1121f]/5'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.pptx,.csv,.xlsx"
              />
              
              <HiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-white text-lg font-medium mb-2 font-sans">
                Drag and drop your files here
              </p>
              <p className="text-gray-400 text-sm font-sans">
                or click to browse (Max 50MB per file)
              </p>
              <p className="text-gray-500 text-xs mt-2 font-sans">
                Supported: PDF, DOCX, PNG, JPG (High-quality conversions)
              </p>
            </div>

            {/* Uploaded Files List */}
            <AnimatePresence>
              {uploadedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 space-y-3"
                >
                  <h4 className="text-white font-medium font-sans">Uploaded Files:</h4>
                  {uploadedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file)}
                        <div>
                          <p className="text-white font-medium text-sm font-sans">{file.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-400 text-xs font-sans">{formatFileSize(file.size)}</p>
                            {file.format && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                                {file.format}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <HiX size={20} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={startConversion}
              disabled={!canConvert}
              className={`px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 font-sans ${
                canConvert
                  ? 'bg-[#c1121f] text-white hover:bg-red-800 shadow-lg hover:shadow-xl'
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
                  Convert Files
                </>
              )}
            </button>

            <button
              onClick={resetAll}
              className="px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 border-2 border-gray-600 text-white hover:border-[#c1121f] transition-colors duration-300 font-sans"
            >
              <HiRefresh size={20} />
              Reset
            </button>
          </motion.div>

          {/* Conversion Results */}
          <AnimatePresence>
            {conversionResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#1a1e29] rounded-xl p-6 shadow-md border border-gray-700"
              >
                <h3 className="text-lg font-semibold text-white mb-4 font-sans">
                  Conversion Results
                </h3>
                <div className="space-y-4">
                  {conversionResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gray-800 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(result.originalFile)}
                          <div>
                            <p className="text-white font-medium text-sm font-sans">
                              {result.originalFile.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-gray-400 text-xs font-sans">
                                {selectedConversion?.label}
                              </p>
                              {result.conversionTime && (
                                <span className="text-xs text-green-400">
                                  {(result.conversionTime / 1000).toFixed(1)}s
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {result.status === 'success' && (
                          <HiCheckCircle className="text-green-500 text-xl" />
                        )}
                        {result.status === 'error' && (
                          <HiExclamationCircle className="text-red-500 text-xl" />
                        )}
                      </div>

                      {/* Progress Bar */}
                      {(result.status === 'converting' || result.status === 'pending') && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-400 mb-1 font-sans">
                            <span>
                              {conversionProgress[result.originalFile.id]?.message || 'Converting...'}
                            </span>
                            <span>{result.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              className="bg-[#c1121f] h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${result.progress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Success State */}
                      {result.status === 'success' && (
                        <button
                          onClick={() => handleDownload(result)}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition-colors duration-300 font-sans"
                        >
                          <HiDownload size={16} />
                          <div className="text-left">
                            <div>Download {result.convertedFileName}</div>
                            {result.convertedSize && (
                              <div className="text-xs opacity-75">
                                {formatFileSize(result.convertedSize)}
                                {result.pages && ` • ${result.pages} page${result.pages > 1 ? 's' : ''}`}
                              </div>
                            )}
                          </div>
                        </button>
                      )}

                      {/* Error State */}
                      {result.status === 'error' && (
                        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-red-400 text-sm font-sans">
                            <HiExclamationCircle size={16} />
                            <span>{result.errorMessage || 'Conversion failed'}</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FileConverterSection;