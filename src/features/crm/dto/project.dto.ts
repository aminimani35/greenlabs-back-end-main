import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  IsArray,
  IsObject,
} from 'class-validator';
import { ProjectStatus } from '../domain/project.entity';

export class CreateProjectDto {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Customer ID' })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Project start date' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({ description: 'Project end date' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: 'Total project value' })
  @IsNumber()
  @IsNotEmpty()
  totalValue: number;

  @ApiPropertyOptional({ description: 'Staff member managing the project' })
  @IsUUID()
  @IsOptional()
  managedBy?: string;

  @ApiPropertyOptional({ description: 'Team member IDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  teamMembers?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({ description: 'Project name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Project description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Project status' })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({ description: 'Project end date' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Total project value' })
  @IsNumber()
  @IsOptional()
  totalValue?: number;

  @ApiPropertyOptional({ description: 'Staff member managing the project' })
  @IsUUID()
  @IsOptional()
  managedBy?: string;

  @ApiPropertyOptional({ description: 'Team member IDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  teamMembers?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
