import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { RolesGuard } from '../auth/guards/roles-guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Media')
@Controller('media')
@UseGuards(RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-avatar')
  @ApiOperation({ summary: 'Upload user avatar (Automatically cleans up old file and updates DB)' })
  @ApiResponse({ status: 201, description: 'Avatar uploaded and database updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid file format or missing file.' })
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|gif)$/)) {
        return callback(new BadRequestException('Only image files are allowed (jpg, jpeg, png, webp, gif)'), false);
      }
      callback(null, true);
    },
  }))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const url = await this.mediaService.uploadUserAvatar(file, userId);

    return { url };
  }

  @Post('upload-company-logo')
  @ApiOperation({ summary: 'Upload company logo (Only for company owners)' })
  @ApiResponse({ status: 201, description: 'Company logo uploaded successfully.' })
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return callback(new BadRequestException('Only image files are allowed'), false);
      }
      callback(null, true);
    },
  }))
  async uploadCompanyLogo(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userId: string,
  ) {
    if (!file) throw new BadRequestException('File is required');
    const url = await this.mediaService.uploadCompanyLogo(file, userId);
    return { url };
  }
}