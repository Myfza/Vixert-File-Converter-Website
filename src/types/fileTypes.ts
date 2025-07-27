export interface ConversionOption {
  id: string;
  label: string;
  from: string;
  to: string;
  icon: string;
  description: string;
  quality: 'high' | 'medium' | 'low';
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  format?: string;
}

export interface ConversionResult {
  id: string;
  originalFile: UploadedFile;
  status: 'pending' | 'converting' | 'success' | 'error';
  progress: number;
  downloadUrl?: string;
  errorMessage?: string;
  convertedFileName?: string;
  conversionTime?: number;
  pages?: number;
  qualityInfo?: string;
}

// Enhanced conversion options with quality indicators
export const CONVERSION_OPTIONS: ConversionOption[] = [
  { 
    id: 'pdf-jpg', 
    label: 'PDF to JPG', 
    from: 'PDF', 
    to: 'JPG', 
    icon: '📄→🖼️',
    description: 'Convert PDF pages to high-quality JPEG images',
    quality: 'high'
  },
  { 
    id: 'pdf-png', 
    label: 'PDF to PNG', 
    from: 'PDF', 
    to: 'PNG', 
    icon: '📄→🖼️',
    description: 'Convert PDF pages to PNG images with transparency support',
    quality: 'high'
  },
  { 
    id: 'pdf-docx', 
    label: 'PDF to DOCX', 
    from: 'PDF', 
    to: 'DOCX', 
    icon: '📄→📝',
    description: 'Extract text and convert PDF to editable Word document',
    quality: 'high'
  },
  { 
    id: 'docx-pdf', 
    label: 'DOCX to PDF', 
    from: 'DOCX', 
    to: 'PDF', 
    icon: '📝→📄',
    description: 'Convert Word document to PDF format',
    quality: 'high'
  },
  { 
    id: 'jpg-png', 
    label: 'JPG to PNG', 
    from: 'JPG', 
    to: 'PNG', 
    icon: '🖼️→🖼️',
    description: 'Convert JPEG to PNG with transparency support',
    quality: 'high'
  },
  { 
    id: 'png-jpg', 
    label: 'PNG to JPG', 
    from: 'PNG', 
    to: 'JPG', 
    icon: '🖼️→🖼️',
    description: 'Convert PNG to JPEG with optimized file size',
    quality: 'high'
  },
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for better document support

export const SUPPORTED_FILE_TYPES = {
  'application/pdf': ['pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'image/png': ['png'],
  'image/jpeg': ['jpg', 'jpeg'],
  'text/rtf': ['rtf'],
  'text/plain': ['txt'],
};

// Quality settings for different conversion types
export const QUALITY_SETTINGS = {
  image: {
    high: 0.95,
    medium: 0.85,
    low: 0.70
  },
  pdf: {
    dpi: 150,
    compression: 'medium'
  },
  document: {
    preserveFormatting: true,
    includeImages: true
  }
};

// File size limits for different types
export const FILE_SIZE_LIMITS = {
  'application/pdf': 50 * 1024 * 1024, // 50MB
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 25 * 1024 * 1024, // 25MB
  'image/jpeg': 20 * 1024 * 1024, // 20MB
  'image/png': 20 * 1024 * 1024, // 20MB
  default: 20 * 1024 * 1024 // 20MB
};

// Supported conversion matrix
export const CONVERSION_MATRIX = {
  'PDF': ['JPG', 'PNG', 'DOCX'],
  'DOCX': ['PDF'],
  'JPG': ['PNG'],
  'PNG': ['JPG']
};