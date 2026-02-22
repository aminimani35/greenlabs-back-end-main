import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
} from 'class-validator';
import {
  TicketStatus,
  TicketPriority,
  TicketCategory,
} from '../domain/support-ticket.entity';

export class CreateTicketDto {
  @ApiProperty({ example: 'Unable to login' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'I cannot access my account...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiPropertyOptional({ enum: TicketPriority })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiPropertyOptional({ enum: TicketCategory })
  @IsEnum(TicketCategory)
  @IsOptional()
  category?: TicketCategory;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class UpdateTicketDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TicketStatus })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @ApiPropertyOptional({ enum: TicketPriority })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiPropertyOptional({ enum: TicketCategory })
  @IsEnum(TicketCategory)
  @IsOptional()
  category?: TicketCategory;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class AssignTicketDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  assignedTo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  assignedAgentName: string;
}

export class AddCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  isInternal?: boolean;
}

export class CreateNoteDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  tags?: string[];
}
