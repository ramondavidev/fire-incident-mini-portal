import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default
const maxFiles = parseInt(process.env.MAX_FILES_PER_REQUEST || '5');

// Allowed file types with their MIME types - Images only
const allowedTypes = {
  // Images
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.gif': ['image/gif'],
};

// Get allowed extensions from env or use defaults
const getAllowedExtensions = (): string[] => {
  const envTypes = process.env.ALLOWED_FILE_TYPES;
  if (envTypes) {
    return envTypes.split(',').map((ext) => ext.trim().toLowerCase());
  }
  return Object.keys(allowedTypes);
};

const allowedExtensions = getAllowedExtensions();

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure random filename
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext);
    const safeName = baseName.replace(/[^a-zA-Z0-9.-]/g, '_');

    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();
  const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';

  // Check if extension is allowed
  if (!allowedExtensions.includes(ext)) {
    logger.warn('File upload rejected - invalid extension', {
      filename: file.originalname,
      extension: ext,
      mimetype: mimeType,
      ip: clientIp,
    });
    cb(
      new Error(
        `File type ${ext} is not allowed. Allowed types: ${allowedExtensions.join(', ')}`
      )
    );
    return;
  }

  // Check if MIME type matches extension
  const allowedMimeTypes = allowedTypes[ext as keyof typeof allowedTypes];
  if (!allowedMimeTypes || !allowedMimeTypes.includes(mimeType)) {
    logger.warn('File upload rejected - MIME type mismatch', {
      filename: file.originalname,
      extension: ext,
      mimetype: mimeType,
      expectedMimeTypes: allowedMimeTypes,
      ip: clientIp,
    });
    cb(
      new Error(
        `Invalid file type. File extension ${ext} does not match MIME type ${mimeType}`
      )
    );
    return;
  }

  logger.info('File upload accepted', {
    filename: file.originalname,
    extension: ext,
    mimetype: mimeType,
    size: file.size,
    ip: clientIp,
  });

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
    files: maxFiles,
    fields: 10, // Limit number of form fields
    fieldNameSize: 100, // Limit field name size
    fieldSize: 1024 * 1024, // 1MB limit for field values
  },
});

// Error handling middleware for multer
export const handleUploadError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof multer.MulterError) {
    const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
    logger.error('File upload error', {
      error: error.message,
      code: error.code,
      field: error.field,
      ip: clientIp,
    });

    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(413).json({
          error: 'File too large',
          message: `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`,
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(413).json({
          error: 'Too many files',
          message: `Maximum ${maxFiles} files allowed per request`,
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          error: 'Unexpected file field',
          message: 'Unexpected file in upload',
        });
      default:
        return res.status(400).json({
          error: 'Upload error',
          message: error.message,
        });
    }
  }

  if (error) {
    const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
    logger.error('General upload error', {
      error: error.message,
      ip: clientIp,
    });
    return res.status(400).json({
      error: 'Upload failed',
      message: error.message,
    });
  }

  next();
};
