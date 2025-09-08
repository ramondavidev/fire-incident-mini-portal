import { describe, it, expect } from 'vitest';
import {
  validateFile,
  validateFiles,
  validateFileCount,
  getFileExtension,
  formatFileSize,
  getFileInfo,
  DEFAULT_FILE_CONFIG,
} from './fileValidation';

describe('File Validation Utils', () => {
  describe('validateFile', () => {
    it('should validate a valid image file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFile(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject file that exceeds size limit', () => {
      const largeContent = new Array(11 * 1024 * 1024).fill('a').join(''); // 11MB
      const file = new File([largeContent], 'large.jpg', {
        type: 'image/jpeg',
      });
      const result = validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File size must be less than');
    });

    it('should reject unsupported file extension', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const result = validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File type .pdf is not allowed');
    });

    it('should reject file with mismatched MIME type', () => {
      const file = new File(['test'], 'test.jpg', { type: 'application/pdf' });
      const result = validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid file type');
    });

    it('should reject file with extension-MIME type mismatch', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/png' });
      const result = validateFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('does not match MIME type');
    });

    it('should validate PNG files correctly', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const result = validateFile(file);

      expect(result.isValid).toBe(true);
    });

    it('should validate GIF files correctly', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' });
      const result = validateFile(file);

      expect(result.isValid).toBe(true);
    });
  });

  describe('validateFiles', () => {
    it('should validate multiple valid files', () => {
      const files = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.png', { type: 'image/png' }),
      ];
      const results = validateFiles(files);

      expect(results).toHaveLength(2);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(true);
    });

    it('should return validation results for each file', () => {
      const files = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.pdf', { type: 'application/pdf' }),
      ];
      const results = validateFiles(files);

      expect(results).toHaveLength(2);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(false);
    });
  });

  describe('validateFileCount', () => {
    it('should allow files within limit', () => {
      const files = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.png', { type: 'image/png' }),
      ];
      const result = validateFileCount(files, 5);

      expect(result.isValid).toBe(true);
    });

    it('should reject files exceeding limit', () => {
      const files = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.png', { type: 'image/png' }),
        new File(['test3'], 'test3.gif', { type: 'image/gif' }),
      ];
      const result = validateFileCount(files, 2);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Too many files selected');
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extension correctly', () => {
      expect(getFileExtension('test.jpg')).toBe('.jpg');
      expect(getFileExtension('test.PNG')).toBe('.png');
      expect(getFileExtension('file.name.with.dots.gif')).toBe('.gif');
      expect(getFileExtension('noextension')).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });
  });

  describe('getFileInfo', () => {
    it('should return comprehensive file information', () => {
      const file = new File(['test content'], 'test.jpg', {
        type: 'image/jpeg',
        lastModified: 1640995200000, // Jan 1, 2022
      });

      const info = getFileInfo(file);

      expect(info.name).toBe('test.jpg');
      expect(info.type).toBe('image/jpeg');
      expect(info.extension).toBe('.jpg');
      expect(info.size).toBe(12); // 'test content' length
      expect(info.sizeFormatted).toBe('12 Bytes');
      expect(info.lastModified).toBeInstanceOf(Date);
    });
  });

  describe('Custom configurations', () => {
    it('should work with custom validation config', () => {
      const customConfig = {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['.jpg'],
        allowedMimeTypes: ['image/jpeg'],
      };

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const result = validateFile(file, customConfig);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File type .png is not allowed');
    });

    it('should respect custom size limits', () => {
      const customConfig = {
        maxSize: 1024, // 1KB
        allowedTypes: ['.jpg'],
        allowedMimeTypes: ['image/jpeg'],
      };

      const largeContent = new Array(2048).fill('a').join(''); // 2KB
      const file = new File([largeContent], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFile(file, customConfig);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('File size must be less than');
    });
  });
});
