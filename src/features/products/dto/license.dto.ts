import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsInt,
  IsArray,
  IsObject,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateLicenseDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Customer ID' })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiPropertyOptional({ description: 'Project ID' })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({ description: 'License expiration date' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Maximum activations allowed',
    default: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxActivations?: number;

  @ApiPropertyOptional({ description: 'Allowed domains for activation' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedDomains?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class ValidateLicenseDto {
  @ApiProperty({ description: 'License key to validate' })
  @IsString()
  @IsNotEmpty()
  licenseKey: string;

  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ description: 'Device fingerprint' })
  @IsString()
  @IsOptional()
  deviceFingerprint?: string;

  @ApiPropertyOptional({ description: 'Domain requesting validation' })
  @IsString()
  @IsOptional()
  domain?: string;
}

export class ActivateLicenseDto {
  @ApiProperty({ description: 'License key to activate' })
  @IsString()
  @IsNotEmpty()
  licenseKey: string;

  @ApiPropertyOptional({ description: 'Device fingerprint' })
  @IsString()
  @IsOptional()
  deviceFingerprint?: string;

  @ApiPropertyOptional({ description: 'Activation metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class DeactivateLicenseDto {
  @ApiProperty({ description: 'License key to deactivate' })
  @IsString()
  @IsNotEmpty()
  licenseKey: string;

  @ApiPropertyOptional({ description: 'Device fingerprint to remove' })
  @IsString()
  @IsOptional()
  deviceFingerprint?: string;
}
