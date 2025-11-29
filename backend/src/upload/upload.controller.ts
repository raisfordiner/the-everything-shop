import { Request, Response } from 'express';
import UploadService from './upload.service';
import { logger } from 'util/logger';
import Send from 'util/response';

const uploadService = new UploadService();

export default class UploadController {
  /**
   * Upload a single file
   * POST /upload
   */
  static async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return Send.badRequest(res, null, 'No file provided');
      }

      // Validate file type
      const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedMimes.includes(req.file.mimetype)) {
        return Send.badRequest(res, null, 'Invalid file format. Only png, jpeg, jpg, gif, webp are allowed');
      }

      const result = await uploadService.upload(req.file.originalname, req.file.buffer);
      
      return Send.success(res, {
        url: result,
        filename: req.file.originalname,
      }, 'File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      return Send.error(res, null, error.message || 'Failed to upload file');
    }
  }

  /**
   * Upload multiple files
   * POST /upload/multiple
   */
  static async uploadMultipleFiles(req: Request, res: Response) {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        return Send.badRequest(res, null, 'No files provided');
      }

      const files = req.files as Express.Multer.File[];

      if (files.length === 0) {
        return Send.badRequest(res, null, 'At least one file is required');
      }

      if (files.length > 10) {
        return Send.badRequest(res, null, 'Maximum 10 files allowed');
      }

      // Validate file types
      const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      for (const file of files) {
        if (!allowedMimes.includes(file.mimetype)) {
          return Send.badRequest(res, null, `Invalid file format for ${file.originalname}. Only png, jpeg, jpg, gif, webp are allowed`);
        }
      }

      const results = await Promise.all(
        files.map(async (file) => {
          const url = await uploadService.upload(file.originalname, file.buffer);
          return {
            url,
            filename: file.originalname,
          };
        })
      );

      return Send.success(res, results, 'Files uploaded successfully');
    } catch (error) {
      console.error('Error uploading files:', error);
      return Send.error(res, null, error.message || 'Failed to upload files');
    }
  }

  /**
   * Delete a file
   * DELETE /upload
   */
  static async deleteFile(req: Request, res: Response) {
    try {
      const { fileUrl } = req.body;

      if (!fileUrl) {
        return Send.badRequest(res, null, 'File URL is required');
      }

      await uploadService.delete(fileUrl);

      return Send.success(res, null, 'File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      return Send.error(res, null, error.message || 'Failed to delete file');
    }
  }
}
