import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { logger } from 'util/logger';

/**
 * Interface for environment configuration
 */
interface EnvConfig {
  AWS_S3_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET_NAME: string;
}

export default class UploadService {
  private s3Client: S3Client;
  private config: EnvConfig;

  constructor() {
    // Get environment variables directly from process.env
    this.config = {
      AWS_S3_REGION: process.env.AWS_S3_REGION || '',
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
      AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || '',
    };

    this.validateConfig();

    this.s3Client = new S3Client({
      region: this.config.AWS_S3_REGION,
      credentials: {
        accessKeyId: this.config.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.config.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Validate S3 configuration
   */
  private validateConfig(): void {
    const { AWS_S3_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME } = this.config;
    
    if (!AWS_S3_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET_NAME) {
      throw new Error(
        'S3 configuration is incomplete. Please provide AWS_S3_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME'
      );
    }
  }

  /**
   * Upload a file to S3
   * @param fileName - Original file name
   * @param file - File buffer
   * @returns File URL
   */
  async upload(fileName: string, file: Buffer): Promise<string> {
    try {
      // Generate unique filename with timestamp
      const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, '-').toLowerCase()}`;
      const bucketName = this.config.AWS_S3_BUCKET_NAME;
      const region = this.config.AWS_S3_REGION;

      logger.info(`Uploading file: ${uniqueFileName} to bucket: ${bucketName}`);

      // Upload to S3
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: uniqueFileName,
          Body: file,
          ContentType: this.getContentType(fileName),
        })
      );

      // Construct file URL
      const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueFileName}`;
      logger.info(`File uploaded successfully: ${fileUrl}`);
      
      return fileUrl;
    } catch (error) {
      console.error(`Error uploading file: ${fileName}`, error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Get content type based on file extension
   * @param fileName - File name
   * @returns Content type
   */
  private getContentType(fileName: string): string {
    const ext = fileName.toLowerCase().split('.').pop();
    const contentTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * Delete a file from S3
   * @param fileUrl - S3 file URL
   * @returns Success status
   */
  async delete(fileUrl: string): Promise<void> {
    try {
      // Extract key from URL (filename)
      const key = fileUrl.split('/').pop();
      
      if (!key) {
        throw new Error('Invalid file URL');
      }

      const bucketName = this.config.AWS_S3_BUCKET_NAME;

      logger.info(`Deleting file: ${key} from bucket: ${bucketName}`);

      // Delete from S3
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key,
        })
      );

      logger.info(`File deleted successfully: ${key}`);
    } catch (error) {
      console.error(`Error deleting file: ${fileUrl}`, error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}