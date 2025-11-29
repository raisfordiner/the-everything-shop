import UploadController from "./upload.controller";
import BaseRouter, { RouteConfig } from "util/router";
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a single image file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file (png, jpeg, jpg, gif, webp)
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://bucket.s3.region.amazonaws.com/filename.jpg"
 *                     filename:
 *                       type: string
 *                       example: "image.jpg"
 *       400:
 *         description: Invalid file format or missing file
 *       500:
 *         description: Internal server error
 *
 * /upload/multiple:
 *   post:
 *     summary: Upload multiple image files
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files (up to 10, png, jpeg, jpg, gif, webp)
 *             required:
 *               - files
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Files uploaded successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                         example: "https://bucket.s3.region.amazonaws.com/filename.jpg"
 *                       filename:
 *                         type: string
 *                         example: "image.jpg"
 *       400:
 *         description: Invalid file format or missing files
 *       500:
 *         description: Internal server error
 *
 * /upload:
 *   delete:
 *     summary: Delete a file from S3
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileUrl:
 *                 type: string
 *                 example: "https://bucket.s3.region.amazonaws.com/filename.jpg"
 *                 description: The S3 URL of the file to delete
 *             required:
 *               - fileUrl
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "File deleted successfully"
 *       400:
 *         description: Missing or invalid file URL
 *       500:
 *         description: Internal server error
 */

class UploadRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        method: "post",
        path: "/",
        middlewares: [upload.single('file')],
        controller: UploadController.uploadFile,
      },
      {
        method: "post",
        path: "/multiple",
        middlewares: [upload.array('files', 10)],
        controller: UploadController.uploadMultipleFiles,
      },
      {
        method: "delete",
        path: "/",
        middlewares: [],
        controller: UploadController.deleteFile,
      },
    ];
  }
}

export default new UploadRouter().router;
