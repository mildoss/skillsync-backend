import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async deleteFileByUrl(url: string | null | undefined): Promise<void> {
    if (!url) return;
    try {
      const parts = url.split('/');
      const fileName = parts.pop();
      const folder = parts.pop();

      if (fileName && folder) {
        const publicId = `${folder}/${fileName.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error('Failed to delete old file from Cloudinary:', error);
    }
  }

  async uploadUserAvatar(file: Express.Multer.File, userId: string): Promise<string> {
    const folder = 'users-avatars';

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });

    if (user?.avatarUrl) {
      await this.deleteFileByUrl(user.avatarUrl);
    }

    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(new InternalServerErrorException('Cloudinary upload failed'));
          if (!result) return reject(new InternalServerErrorException('No response from Cloudinary'));
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(upload);
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: uploadResult.secure_url },
    });

    return uploadResult.secure_url;
  }
}