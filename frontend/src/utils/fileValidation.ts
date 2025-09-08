/**
 * File validation utilities for client-side validation
 * Provides early feedback before uploading to server
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileValidationConfig {
  maxSize: number; // in bytes
  allowedTypes: string[];
  allowedMimeTypes: string[];
}

export const DEFAULT_FILE_CONFIG: FileValidationConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['.jpg', '.jpeg', '.png', '.gif'],
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
};

/**
 * Validates a single file against size and type restrictions
 */
export function validateFile(
  file: File,
  config: FileValidationConfig = DEFAULT_FILE_CONFIG
): FileValidationResult {
  // Check file size
  if (file.size > config.maxSize) {
    const maxSizeMB = Math.round(config.maxSize / 1024 / 1024);
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB. Current size: ${formatFileSize(file.size)}`,
    };
  }

  // Check file extension
  const fileExtension = getFileExtension(file.name);
  if (!config.allowedTypes.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File type ${fileExtension} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`,
    };
  }

  // Check MIME type
  if (!config.allowedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Expected: ${config.allowedMimeTypes.join(', ')}, but got: ${file.type}`,
    };
  }

  // Check extension-MIME type matching
  const expectedMimeTypes = getMimeTypesForExtension(fileExtension);
  if (!expectedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File extension ${fileExtension} does not match MIME type ${file.type}`,
    };
  }

  return { isValid: true };
}

/**
 * Validates multiple files and returns results for each
 */
export function validateFiles(
  files: FileList | File[],
  config: FileValidationConfig = DEFAULT_FILE_CONFIG
): FileValidationResult[] {
  const fileArray = Array.from(files);
  return fileArray.map((file) => validateFile(file, config));
}

/**
 * Validates file count limit
 */
export function validateFileCount(
  files: FileList | File[],
  maxFiles: number = 5
): FileValidationResult {
  if (files.length > maxFiles) {
    return {
      isValid: false,
      error: `Too many files selected. Maximum ${maxFiles} files allowed, but ${files.length} were selected.`,
    };
  }
  return { isValid: true };
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return '';
  }
  return filename.toLowerCase().substring(lastDotIndex);
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets expected MIME types for a file extension
 */
function getMimeTypesForExtension(extension: string): string[] {
  const mimeTypeMap: Record<string, string[]> = {
    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.png': ['image/png'],
    '.gif': ['image/gif'],
  };

  return mimeTypeMap[extension] || [];
}

/**
 * Generates a preview URL for image files
 */
export function generateFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Gets detailed file information
 */
export function getFileInfo(file: File) {
  return {
    name: file.name,
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    type: file.type,
    extension: getFileExtension(file.name),
    lastModified: new Date(file.lastModified),
  };
}
