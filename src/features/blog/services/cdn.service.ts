import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as FormData from 'form-data';

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format: string;
  size: number;
}

@Injectable()
export class CdnService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly cdnDomain: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = 'https://napi.arvancloud.ir/cdn/4.0';
    this.apiKey = this.configService.get('ARVAN_API_KEY') || '';
    this.cdnDomain = this.configService.get('ARVAN_CDN_DOMAIN') || '';
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'greenlabs/blog',
  ): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      // Upload to ArvanCloud Storage
      const response = await axios.post(
        `${this.apiUrl}/storage/upload`,
        formData,
        {
          headers: {
            Authorization: `Apikey ${this.apiKey}`,
            ...formData.getHeaders(),
          },
          params: {
            directory: folder,
          },
        },
      );

      const { data } = response.data;

      return {
        url: `https://${this.cdnDomain}/${folder}/${data.name}`,
        publicId: data.id || data.name,
        format: file.mimetype.split('/')[1],
        size: file.size,
      };
    } catch (error: any) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  async deleteImage(fileId: string): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/storage/files/${fileId}`, {
        headers: {
          Authorization: `Apikey ${this.apiKey}`,
        },
      });
    } catch (error: any) {
      throw new BadRequestException(`Failed to delete image: ${error.message}`);
    }
  }

  getOptimizedUrl(
    fileName: string,
    width?: number,
    height?: number,
    folder: string = 'greenlabs/blog',
  ): string {
    let url = `https://${this.cdnDomain}/${folder}/${fileName}`;

    // ArvanCloud CDN supports query parameters for image optimization
    const params: string[] = [];
    if (width) params.push(`w=${width}`);
    if (height) params.push(`h=${height}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return url;
  }

  /**
   * Get direct CDN URL for uploaded file
   */
  getCdnUrl(fileName: string, folder: string = 'greenlabs/blog'): string {
    return `https://${this.cdnDomain}/${folder}/${fileName}`;
  }
}
